import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: '2026-04-22.dahlia' })
  : ({} as Stripe); // Dummy object for builds without env vars

export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO || '';
export const STRIPE_PRICE_PREMIUM = process.env.STRIPE_PRICE_PREMIUM || '';
