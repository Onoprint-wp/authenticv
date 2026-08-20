-- ============================================================================
-- MASTER MIGRATION: AuthenticV Ecosystem CEMAC
-- Includes:
--   1. Single Credits on user_subscriptions (1 000 FCFA micro-transactions)
--   2. Growth Engine: Referrals & Campus Partners + 30-Day Pro Reward Trigger
--   3. B2B Recruiter Marketplace: Companies, Unlocked Contacts & Anonymized Talents View
-- ============================================================================

-- 1. Ensure single_credits column on user_subscriptions
ALTER TABLE public.user_subscriptions 
  ADD COLUMN IF NOT EXISTS single_credits integer DEFAULT 0;

-- 2. Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'rewarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Campus Partners Table
CREATE TABLE IF NOT EXISTS public.campus_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  university_name TEXT NOT NULL,
  discount_percent INT DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. B2B Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  credits_balance INT DEFAULT 0,
  plan TEXT DEFAULT 'pay_as_you_go' CHECK (plan IN ('pay_as_you_go', 'monthly_pro', 'corporate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. B2B Unlocked Contacts Table (Tracks paid candidate contact unlocks)
CREATE TABLE IF NOT EXISTS public.unlocked_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(company_id, resume_id)
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_contacts ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
DROP POLICY IF EXISTS "Users can view their own referral referrals" ON public.referrals;
CREATE POLICY "Users can view their own referral referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "Everyone can read campus partners" ON public.campus_partners;
CREATE POLICY "Everyone can read campus partners"
  ON public.campus_partners FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Companies can view their own record" ON public.companies;
CREATE POLICY "Companies can view their own record"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Companies can view their unlocked contacts" ON public.unlocked_contacts;
CREATE POLICY "Companies can view their unlocked contacts"
  ON public.unlocked_contacts FOR SELECT
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- 8. Trigger Function: Automatically Award 30 days Pro to Referrer on Referee Resume Creation
CREATE OR REPLACE FUNCTION public.reward_referrer_on_resume()
RETURNS TRIGGER AS $$
DECLARE
  ref_record RECORD;
  one_month_later TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if user was referred
  SELECT * INTO ref_record FROM public.referrals
  WHERE referred_id = NEW.user_id AND status = 'pending';

  IF FOUND THEN
    one_month_later := now() + INTERVAL '30 days';

    -- Award Pro subscription status to referrer
    INSERT INTO public.user_subscriptions (user_id, plan_name, status, current_period_end, updated_at)
    VALUES (ref_record.referrer_id, 'pro_referral', 'active', one_month_later, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
      status = 'active',
      current_period_end = GREATEST(public.user_subscriptions.current_period_end, one_month_later),
      updated_at = now();

    -- Mark referral as rewarded
    UPDATE public.referrals
    SET status = 'rewarded'
    WHERE id = ref_record.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Attach Trigger to resumes table
DROP TRIGGER IF EXISTS trigger_reward_referrer ON public.resumes;
CREATE TRIGGER trigger_reward_referrer
  AFTER INSERT ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.reward_referrer_on_resume();

-- 10. Anonymized Talent View (Exposes skills, experience, location WITHOUT revealing personal contact info)
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

-- 11. Grant Permissions
GRANT SELECT ON public.anonymized_talents_view TO authenticated;
