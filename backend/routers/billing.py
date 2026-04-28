from fastapi import APIRouter, Depends, HTTPException, Request, Header
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import stripe

from dependencies import get_db, get_current_user
from models import User, PlanTier, SubscriptionStatus
from config import get_settings

settings = get_settings()
stripe.api_key = settings.stripe_secret_key

router = APIRouter()

@router.post("/checkout")
async def create_checkout_session(
    plan: PlanTier,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    price_id = settings.stripe_price_pro if plan == PlanTier.PRO else settings.stripe_price_premium
    if not price_id:
        raise HTTPException(status_code=500, detail="Price ID not configured for this plan")
    
    # Create Stripe customer if not exists
    if not current_user.stripe_customer_id:
        customer = stripe.Customer.create(email=current_user.email, name=current_user.name)
        current_user.stripe_customer_id = customer.id
        await db.commit()
    
    session = stripe.checkout.Session.create(
        customer=current_user.stripe_customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=f"{settings.frontend_url}/dashboard?success=true",
        cancel_url=f"{settings.frontend_url}/dashboard?canceled=true",
        metadata={"user_id": str(current_user.id)},
    )
    
    return {"checkout_url": session.url}

@router.post("/portal")
async def customer_portal(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No subscription found")
    
    session = stripe.billing_portal.Session.create(
        customer=current_user.stripe_customer_id,
        return_url=f"{settings.frontend_url}/dashboard",
    )
    
    return {"portal_url": session.url}

@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("metadata", {}).get("user_id")
        if user_id:
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.subscription_id = session.get("subscription")
                user.subscription_status = SubscriptionStatus.ACTIVE
                await db.commit()
    
    elif event["type"] == "invoice.payment_failed":
        subscription = event["data"]["object"]
        # Handle payment failure
        pass
    
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        result = await db.execute(select(User).where(User.subscription_id == subscription["id"]))
        user = result.scalar_one_or_none()
        if user:
            user.subscription_status = SubscriptionStatus.CANCELED
            user.plan_tier = PlanTier.PRO
            await db.commit()
    
    return {"status": "ok"}
