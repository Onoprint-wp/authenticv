-- Sprint 4A : Historique des lettres de motivation
CREATE TABLE IF NOT EXISTS cover_letters (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_offer   text NOT NULL,
  letter_text text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cover_letters_owner" ON cover_letters
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX cover_letters_user_created
  ON cover_letters(user_id, created_at DESC);
