-- ============================================================================
-- Migration: B2B Recruiter Marketplace & Anonymized Talent View
-- Date: 2026-05-15
-- Description: Companies, Unlocked contacts, and Anonymized Postgres View with RLS
-- ============================================================================

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  credits_balance INT DEFAULT 0,
  plan TEXT DEFAULT 'pay_as_you_go' CHECK (plan IN ('pay_as_you_go', 'monthly_pro', 'corporate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Unlocked Contacts Table (Tracks paid candidate unlocks)
CREATE TABLE IF NOT EXISTS public.unlocked_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(company_id, resume_id)
);

-- 3. RLS Policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own record"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Companies can view their unlocked contacts"
  ON public.unlocked_contacts FOR SELECT
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- 4. Anonymized Talent View (Exposes skills, experience, location WITHOUT revealing personal contact info)
CREATE OR REPLACE VIEW public.anonymized_talents_view AS
SELECT
  r.id AS resume_id,
  r.content->'personalInfo'->>'title' AS job_title,
  r.content->'personalInfo'->>'location' AS location,
  r.content->'summary' AS summary,
  r.content->'skills' AS skills,
  r.content->'experiences' AS experiences,
  r.updated_at
FROM public.resumes r
WHERE r.content->'personalInfo'->>'title' IS NOT NULL;

-- Grant read access on anonymized view
GRANT SELECT ON public.anonymized_talents_view TO authenticated;
