-- =============================================
-- AuthentiCV — Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL DEFAULT 'Mon CV',
  content    JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own resumes
CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- ── Supabase Realtime ──────────────────────────────────────────────────────────
-- Required for live CV preview: allows the frontend to receive DB changes in real time
-- when the AI coach updates the resume via server-side tool execution.

-- Enable full replica identity so UPDATE payloads include the new content field
ALTER TABLE public.resumes REPLICA IDENTITY FULL;

-- Add resumes to the realtime publication
-- (run this once; it's idempotent if the table is already in the publication)
ALTER PUBLICATION supabase_realtime ADD TABLE public.resumes;

