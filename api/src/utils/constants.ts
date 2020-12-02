// import { BillingFrequency } from '@prisma/client';
import { verifyEnvironmentVariables } from './verifyEnvironmentVariables';

export const cookieDuration = 1000 * 60 * 60 * 24 * 365; // 1 year

verifyEnvironmentVariables(process.env.COMMON_STRIPE_YEARLY_PLAN_ID, 'COMMON_STRIPE_YEARLY_PLAN_ID');
verifyEnvironmentVariables(process.env.COMMON_STRIPE_MONTHLY_PLAN_ID, 'COMMON_STRIPE_MONTHLY_PLAN_ID');
