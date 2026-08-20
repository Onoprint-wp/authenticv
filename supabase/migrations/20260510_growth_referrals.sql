-- ============================================================================
-- Migration: Growth Engine (Referrals & Campus Partners)
-- Date: 2026-05-10
-- Description: Referral tracking table, Campus partners table, and automated triggers
-- ============================================================================

-- 1. Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'rewarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Campus Partners Table
CREATE TABLE IF NOT EXISTS public.campus_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  university_name TEXT NOT NULL,
  discount_percent INT DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS Policies
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referral referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Everyone can read campus partners"
  ON public.campus_partners FOR SELECT
  USING (true);

-- 4. Trigger Function: Award 30 days Pro to referrer when referred user creates a resume
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

-- 5. Attach Trigger to resumes table
DROP TRIGGER IF EXISTS trigger_reward_referrer ON public.resumes;
CREATE TRIGGER trigger_reward_referrer
  AFTER INSERT ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.reward_referrer_on_resume();
