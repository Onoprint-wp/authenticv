-- ============================================================================
-- MIGRATION: Commercial Hierarchy & Country Sales Directors (Zone CEMAC)
-- ============================================================================

-- 1. Add non-destructive columns to commercial_agents
ALTER TABLE public.commercial_agents
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'country_director')),
  ADD COLUMN IF NOT EXISTS director_id UUID REFERENCES public.commercial_agents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS override_commission_rate NUMERIC(5,2) DEFAULT 2.5; -- 2.5% managerial override

-- 2. Indexes for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_commercial_agents_role ON public.commercial_agents(role);
CREATE INDEX IF NOT EXISTS idx_commercial_agents_director ON public.commercial_agents(director_id);

-- 3. RLS Update: Country Directors can view agents and leads within their assigned country
DROP POLICY IF EXISTS "Country directors can view agents in their country" ON public.commercial_agents;
CREATE POLICY "Country directors can view agents in their country"
  ON public.commercial_agents FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR email = auth.jwt() ->> 'email'
    OR (
      EXISTS (
        SELECT 1 FROM public.commercial_agents dir
        WHERE (dir.user_id = auth.uid() OR dir.email = auth.jwt() ->> 'email')
          AND dir.role = 'country_director'
          AND (dir.assigned_country = commercial_agents.assigned_country OR dir.assigned_country = 'ALL')
      )
    )
  );

-- 4. Seed / Update Country Directors & Agents for CEMAC
-- Promote Christian Bekono to Country Director Cameroun (CM)
UPDATE public.commercial_agents
SET role = 'country_director', monthly_target_xaf = 3500000, promo_code = 'DIRCM10'
WHERE email = 'commercial.douala@authenticv.app' OR email = 'christian.bekono@authenticv.app';

-- Insert additional agents under Christian Bekono (Cameroun) and other CEMAC Hubs
INSERT INTO public.commercial_agents (
  full_name, email, phone, assigned_country, assigned_city, role, commission_rate, monthly_target_xaf, total_sales_xaf, total_commissions_earned_xaf, promo_code
) VALUES
  ('Emmanuel Nguema', 'directeur.gabon@authenticv.app', '+241 77 11 22 33', 'GA', 'Libreville / Port-Gentil', 'country_director', 10.0, 2500000, 450000, 45000, 'DIRGA10'),
  ('Arnaud Bopda', 'commercial.yaounde@authenticv.app', '+237 677 88 99 00', 'CM', 'Yaoundé & Centre', 'agent', 10.0, 500000, 150000, 15000, 'ARNAUD10'),
  ('Marcelle Tchuente', 'commercial.bafoussam@authenticv.app', '+237 655 44 33 22', 'CM', 'Bafoussam / Ouest', 'agent', 10.0, 500000, 100000, 10000, 'MARCELLE10')
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  monthly_target_xaf = EXCLUDED.monthly_target_xaf;

-- Link Cameroun agents to Christian Bekono
UPDATE public.commercial_agents
SET director_id = (SELECT id FROM public.commercial_agents WHERE email = 'commercial.douala@authenticv.app' LIMIT 1)
WHERE email IN ('commercial.yaounde@authenticv.app', 'commercial.bafoussam@authenticv.app');
