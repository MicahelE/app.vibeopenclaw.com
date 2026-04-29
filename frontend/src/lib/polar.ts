import { Polar } from '@polar-sh/sdk';

const accessToken = process.env.POLAR_ACCESS_TOKEN;
const environment = (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

export const polar = accessToken
  ? new Polar({ accessToken, server: environment === 'production' ? 'production' : 'sandbox' })
  : ({} as Polar);

export const POLAR_PRODUCT_PRO = process.env.POLAR_PRODUCT_PRO || '';
export const POLAR_PRODUCT_PREMIUM = process.env.POLAR_PRODUCT_PREMIUM || '';
export const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET || '';
