-- ============================================================================
-- MIGRATION: Commercial Accounts & RBAC Commissions System (Zone CEMAC)
-- ============================================================================

-- 1. Table commercial_agents
CREATE TABLE IF NOT EXISTS public.commercial_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL, -- WhatsApp contact
  assigned_country TEXT DEFAULT 'CM' CHECK (assigned_country IN ('CM', 'GA', 'CG', 'TD', 'CF', 'GQ', 'ALL')),
  assigned_city TEXT DEFAULT 'Douala',
  commission_rate NUMERIC(5,2) DEFAULT 10.0, -- Default 10%
  monthly_target_xaf INTEGER DEFAULT 500000, -- 500 000 FCFA target
  total_sales_xaf INTEGER DEFAULT 0,
  total_commissions_earned_xaf INTEGER DEFAULT 0,
  total_commissions_paid_xaf INTEGER DEFAULT 0,
  promo_code TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add foreign keys to crm_leads, transactions and promo_codes
ALTER TABLE public.crm_leads
  ADD COLUMN IF NOT EXISTS assigned_agent_id UUID REFERENCES public.commercial_agents(id) ON DELETE SET NULL;

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.commercial_agents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS commission_amount_xaf INTEGER DEFAULT 0;

ALTER TABLE public.promo_codes
  ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.commercial_agents(id) ON DELETE SET NULL;

-- 3. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_commercial_agents_email ON public.commercial_agents(email);
CREATE INDEX IF NOT EXISTS idx_commercial_agents_country ON public.commercial_agents(assigned_country);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_agent ON public.crm_leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_agent ON public.transactions(agent_id);

-- 4. Enable Row Level Security
ALTER TABLE public.commercial_agents ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Service role full access on commercial_agents" ON public.commercial_agents;
CREATE POLICY "Service role full access on commercial_agents"
  ON public.commercial_agents FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Commercial agents can view their own profile" ON public.commercial_agents;
CREATE POLICY "Commercial agents can view their own profile"
  ON public.commercial_agents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.jwt() ->> 'email');

-- 6. Seed initial commercial agents (CEMAC Hubs)
INSERT INTO public.commercial_agents (
  full_name, email, phone, assigned_country, assigned_city, commission_rate, monthly_target_xaf, total_sales_xaf, total_commissions_earned_xaf, promo_code
) VALUES
  ('Christian Bekono', 'commercial.douala@authenticv.app', '+237 699 12 34 56', 'CM', 'Douala / Littoral', 10.0, 500000, 320000, 32000, 'CHRISTIAN10'),
  ('Aline Mba Ondo', 'commercial.libreville@authenticv.app', '+241 77 88 99 00', 'GA', 'Libreville', 10.0, 500000, 185000, 18500, 'ALINE10'),
  ('Serge Ngoma', 'commercial.brazzaville@authenticv.app', '+242 06 12 34 56', 'CG', 'Brazzaville & Pointe-Noire', 10.0, 500000, 95000, 9500, 'SERGE10')
ON CONFLICT (email) DO NOTHING;
