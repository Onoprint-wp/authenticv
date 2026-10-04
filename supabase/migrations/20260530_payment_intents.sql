-- ============================================================================
-- MIGRATION: Payment Intents & Webhook Reliability Engine
-- Date: 2026-05-30
-- Description: Table for pre-registering payment intents to ensure deterministic
--              fulfillment of purchases (B2C subscriptions & credits, B2B packs)
--              independent of discounted pricing.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  external_reference TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('campay', 'moov', 'stripe', 'cinetpay', 'manual')),
  target_type TEXT NOT NULL CHECK (target_type IN (
    'b2c_single', 'b2c_monthly', 'b2c_annual',
    'b2b_single', 'b2b_pack5', 'b2b_pack15', 'b2b_monthly_pro'
  )),
  amount_xaf INTEGER NOT NULL,
  promo_code TEXT,
  discount_percent INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_intents_ext_ref ON public.payment_intents(external_reference);
CREATE INDEX IF NOT EXISTS idx_payment_intents_user ON public.payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON public.payment_intents(status);

ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on payment_intents" ON public.payment_intents;
CREATE POLICY "Service role full access on payment_intents"
  ON public.payment_intents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
