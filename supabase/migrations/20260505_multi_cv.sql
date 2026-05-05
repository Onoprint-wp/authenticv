-- Sprint 4F : Multi-CV
-- Ajouter is_default pour identifier le CV principal par utilisateur
ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false NOT NULL;

-- Marquer le CV existant de chaque utilisateur comme défaut
UPDATE resumes r
SET is_default = true
WHERE r.updated_at = (
  SELECT MAX(r2.updated_at)
  FROM resumes r2
  WHERE r2.user_id = r.user_id
)
AND NOT EXISTS (
  SELECT 1 FROM resumes r3
  WHERE r3.user_id = r.user_id AND r3.is_default = true
);

-- Index unique partiel : un seul CV is_default par user
CREATE UNIQUE INDEX IF NOT EXISTS resumes_user_default
  ON resumes(user_id) WHERE is_default = true;
