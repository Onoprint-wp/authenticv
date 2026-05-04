-- Statistiques de consultation des CVs partagés
CREATE TABLE IF NOT EXISTS cv_views (
  id        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now() NOT NULL,
  country   text
);

ALTER TABLE cv_views ENABLE ROW LEVEL SECURITY;

-- Seul le propriétaire du CV peut consulter ses statistiques
CREATE POLICY "cv_views_owner_read"
  ON cv_views FOR SELECT
  TO authenticated
  USING (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );
