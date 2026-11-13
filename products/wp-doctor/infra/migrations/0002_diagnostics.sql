CREATE TABLE diagnosis_jobs (
  id TEXT PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK(status IN ('queued','running','ready','failed','cancelled')),
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at INTEGER NOT NULL, lease_until INTEGER, lease_token TEXT,
  error_code TEXT, report_encrypted TEXT,
  access_hash TEXT NOT NULL UNIQUE, access_encrypted TEXT NOT NULL,
  expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX diagnosis_due ON diagnosis_jobs(status,available_at);
CREATE TABLE report_deliveries (
  id TEXT PRIMARY KEY, diagnosis_id TEXT NOT NULL REFERENCES diagnosis_jobs(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK(channel IN ('email','whatsapp')),
  status TEXT NOT NULL CHECK(status IN ('queued','sending','accepted','failed','unknown','cancelled')),
  attempts INTEGER NOT NULL DEFAULT 0, available_at INTEGER NOT NULL,
  lease_until INTEGER, lease_token TEXT, first_attempt_at INTEGER,
  provider_id TEXT, error_code TEXT, updated_at INTEGER NOT NULL,
  UNIQUE(diagnosis_id,channel)
);
CREATE INDEX deliveries_due ON report_deliveries(status,available_at);
