ALTER TABLE diagnosis_jobs ADD COLUMN progress_hash TEXT;
ALTER TABLE diagnosis_jobs ADD COLUMN progress_encrypted TEXT;
CREATE UNIQUE INDEX diagnosis_progress ON diagnosis_jobs(progress_hash);
ALTER TABLE leads ADD COLUMN diagnosis_email_hash TEXT;
CREATE INDEX leads_diagnosis_email ON leads(diagnosis_email_hash,created_at);
