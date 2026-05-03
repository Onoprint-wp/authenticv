-- ─── Abonnements Stripe ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id    TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status                TEXT NOT NULL DEFAULT 'free', -- 'free' | 'active' | 'canceled' | 'past_due'
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Le webhook Stripe utilise la service_role key qui bypasse RLS
-- Pas de policy INSERT/UPDATE nécessaire pour les utilisateurs

-- ─── Compteur de messages mensuels (plan Free) ────────────────────────────────

CREATE TABLE IF NOT EXISTS public.message_usage (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month   TEXT NOT NULL, -- format YYYY-MM
  count   INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, month)
);

ALTER TABLE public.message_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_usage"
  ON public.message_usage FOR SELECT
  USING (auth.uid() = user_id);

-- ─── Fonction RPC pour incrémenter atomiquement ───────────────────────────────

CREATE OR REPLACE FUNCTION public.increment_message_usage(
  p_user_id UUID,
  p_month   TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER  -- s'exécute avec les droits du owner (service_role)
AS $$
BEGIN
  INSERT INTO public.message_usage (user_id, month, count)
  VALUES (p_user_id, p_month, 1)
  ON CONFLICT (user_id, month)
  DO UPDATE SET count = message_usage.count + 1;
END;
$$;
