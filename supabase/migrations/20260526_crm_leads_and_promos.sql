-- ============================================================================
-- MIGRATION: B2B CRM Leads Pipeline & Dynamic Promo Engine
-- Date: 2026-05-26
-- Description: Pipeline for B2B recruiter prospects & trackable promotional codes.
-- ============================================================================

-- 1. Table CRM Leads (B2B Prospecting)
CREATE TABLE IF NOT EXISTS public.crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  country_code TEXT NOT NULL DEFAULT 'CM' CHECK (country_code IN ('CM', 'GA', 'CG', 'TD', 'CF', 'GQ', 'INTL')),
  city TEXT DEFAULT 'Douala',
  stage TEXT NOT NULL DEFAULT 'prospect' CHECK (stage IN ('prospect', 'demo', 'negociation', 'client_actif', 'perdu')),
  pack_interet TEXT NOT NULL DEFAULT 'pack15' CHECK (pack_interet IN ('single', 'pack5', 'pack15', 'monthly_pro', 'corporate')),
  estimated_value_xaf INTEGER NOT NULL DEFAULT 50000,
  rccm TEXT,
  niu_or_nif TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON public.crm_leads(stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_country ON public.crm_leads(country_code);

-- 2. Table Promo Codes (Marketing & Attribution)
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 20 CHECK (discount_percent > 0 AND discount_percent <= 100),
  fixed_discount_xaf INTEGER DEFAULT 0,
  target_plan TEXT NOT NULL DEFAULT 'all' CHECK (target_plan IN ('all', 'single', 'monthly', 'recruiter')),
  max_uses INTEGER NOT NULL DEFAULT 100,
  current_uses INTEGER NOT NULL DEFAULT 0,
  total_revenue_generated_xaf INTEGER NOT NULL DEFAULT 0,
  campaign_name TEXT,
  affiliated_partner_id UUID REFERENCES public.campus_partners(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON public.promo_codes(is_active);

-- 3. Row Level Security
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read of active promo codes for client-side checkout validation
DROP POLICY IF EXISTS "Public read active promo codes" ON public.promo_codes;
CREATE POLICY "Public read active promo codes"
  ON public.promo_codes FOR SELECT
  USING (is_active = true);
