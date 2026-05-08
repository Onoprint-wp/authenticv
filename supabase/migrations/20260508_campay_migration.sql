-- ============================================================================
-- Migration: Stripe → CamPay for user_subscriptions
-- Date: 2026-05-08
-- Description: Adds CamPay-specific columns and removes Stripe columns
-- ============================================================================

-- Step 1: Add CamPay columns
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS campay_reference TEXT,
  ADD COLUMN IF NOT EXISTS campay_operator  TEXT,
  ADD COLUMN IF NOT EXISTS campay_phone     TEXT;

-- Step 2: Drop Stripe columns (no longer needed)
ALTER TABLE user_subscriptions
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS stripe_subscription_id;

-- Step 3: Ensure default values are correct
ALTER TABLE user_subscriptions
  ALTER COLUMN status SET DEFAULT 'free';

-- Step 4: Verify the new structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;
