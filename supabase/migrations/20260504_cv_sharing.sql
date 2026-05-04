-- Partage public des CVs
ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS share_slug text UNIQUE;

-- Index pour lookup rapide par slug
CREATE INDEX IF NOT EXISTS idx_resumes_share_slug
  ON resumes(share_slug)
  WHERE share_slug IS NOT NULL;

-- Lecture publique (anon) quand is_public = true
CREATE POLICY "resumes_public_read"
  ON resumes FOR SELECT
  TO anon
  USING (is_public = true);
