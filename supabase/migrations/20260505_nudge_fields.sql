-- Sprint 4D : Champs pour les nudges email
ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS last_nudge_at timestamptz,
  ADD COLUMN IF NOT EXISTS nudge_enabled  boolean DEFAULT true NOT NULL;
