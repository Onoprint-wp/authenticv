-- Sprint 4B : Historique du score ATS
CREATE TABLE IF NOT EXISTS ats_score_history (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score       smallint NOT NULL,
  recorded_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE ats_score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ats_history_owner" ON ats_score_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ats_history_insert" ON ats_score_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE INDEX ats_history_user_date
  ON ats_score_history(user_id, recorded_at DESC);
