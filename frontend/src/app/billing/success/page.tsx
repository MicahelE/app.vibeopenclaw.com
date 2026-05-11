import SuccessClient from './SuccessClient';

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string }>;
}) {
  const params = await searchParams;
  return <SuccessClient checkoutId={params.checkout_id} />;
}
