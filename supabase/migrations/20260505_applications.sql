-- Sprint 4C : Suivi de candidatures
DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('saved', 'applied', 'interview', 'offer', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS applications (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company         text NOT NULL,
  position        text NOT NULL,
  status          application_status DEFAULT 'saved' NOT NULL,
  job_url         text,
  notes           text,
  cover_letter_id uuid REFERENCES cover_letters(id) ON DELETE SET NULL,
  applied_at      timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications_owner" ON applications
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX applications_user_status
  ON applications(user_id, status);
