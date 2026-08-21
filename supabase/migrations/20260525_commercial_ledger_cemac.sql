-- ============================================================================
-- MIGRATION: Commercial Ledger & CEMAC Transactions Engine
-- Date: 2026-05-25
-- Description: Unified transactions table with multi-country CEMAC tracking,
--              telecom operator fee deduction and AI cost estimation.
-- ============================================================================

-- 1. Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reference_id TEXT NOT NULL,
  amount_xaf INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XAF',
  country_code TEXT NOT NULL DEFAULT 'CM' CHECK (country_code IN ('CM', 'GA', 'CG', 'TD', 'CF', 'GQ', 'INTL')),
  operator TEXT NOT NULL DEFAULT 'MTN' CHECK (operator IN ('MTN', 'ORANGE', 'AIRTEL', 'MOOV', 'TELECEL', 'GETESA', 'CARD', 'OTHER')),
  payment_type TEXT NOT NULL DEFAULT 'b2c_single' CHECK (payment_type IN ('b2c_single', 'b2c_monthly', 'b2c_annual', 'b2b_single', 'b2b_pack5', 'b2b_pack15', 'b2b_monthly_pro', 'b2b_corporate')),
  status TEXT NOT NULL DEFAULT 'successful' CHECK (status IN ('successful', 'pending', 'failed', 'refunded')),
  phone_number TEXT,
  customer_email TEXT,
  customer_name TEXT,
  fees_operator INTEGER NOT NULL DEFAULT 0,
  cost_ai_estimated INTEGER NOT NULL DEFAULT 50,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast analytics & ledger queries
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_country ON public.transactions(country_code);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_operator ON public.transactions(operator);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference_id);

-- 3. Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own transactions" ON public.transactions;
CREATE POLICY "Users can read own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);
