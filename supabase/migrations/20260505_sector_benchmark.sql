-- Sprint 4E : Benchmark sectoriel
ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS sector    text,
  ADD COLUMN IF NOT EXISTS ats_score smallint;

-- Vue agrégée anonyme (pas de données personnelles)
CREATE OR REPLACE VIEW sector_benchmarks AS
SELECT
  sector,
  COUNT(*)                                                        AS total,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ats_score)::int    AS median_score,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ats_score)::int   AS p75_score
FROM resumes
WHERE sector IS NOT NULL
  AND ats_score IS NOT NULL
GROUP BY sector;

-- Accès en lecture seule pour les utilisateurs authentifiés
GRANT SELECT ON sector_benchmarks TO authenticated;
