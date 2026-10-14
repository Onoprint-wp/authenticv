-- ============================================================================
-- Migration: 1er Téléchargement PDF HD Offert (Welcome Credit)
-- Date: 2026-05-31
-- Description: Sets default single_credits to 1 for newly created user_subscriptions
-- ============================================================================

ALTER TABLE public.user_subscriptions
  ALTER COLUMN single_credits SET DEFAULT 1;
