-- Migration 20260529: Fix Security & RLS Policies
-- Restricts full access on commercial_agents to service_role only (prevents anon public CRUD)

DROP POLICY IF EXISTS "Service role full access on commercial_agents" ON public.commercial_agents;

CREATE POLICY "Service role full access on commercial_agents"
  ON public.commercial_agents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure service_role has explicit full access on user_subscriptions
DROP POLICY IF EXISTS "Service role full access on user_subscriptions" ON public.user_subscriptions;

CREATE POLICY "Service role full access on user_subscriptions"
  ON public.user_subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure service_role has explicit full access on companies and unlocked_contacts
DROP POLICY IF EXISTS "Service role full access on companies" ON public.companies;

CREATE POLICY "Service role full access on companies"
  ON public.companies FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on unlocked_contacts" ON public.unlocked_contacts;

CREATE POLICY "Service role full access on unlocked_contacts"
  ON public.unlocked_contacts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
