PRAGMA foreign_keys = ON;
CREATE TABLE users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, role TEXT NOT NULL CHECK(role IN ('owner','commercial','technician')), active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1))
);
CREATE TABLE leads (
  id TEXT PRIMARY KEY, idempotency_hash TEXT NOT NULL UNIQUE, request_hash TEXT NOT NULL,
  website_url TEXT NOT NULL, issue_type TEXT NOT NULL, email_encrypted TEXT NOT NULL,
  phone_encrypted TEXT NOT NULL, name_encrypted TEXT, email_domain_type TEXT NOT NULL,
  commercial_status TEXT NOT NULL DEFAULT 'nuevo' CHECK(commercial_status IN ('nuevo','pendiente_revision','contactado','calificado','propuesta_enviada','ganado','perdido','no_calificado','spam','solicita_no_contacto')),
  next_action TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 0, last_mutation TEXT,
  marketing_opt_in INTEGER NOT NULL CHECK(marketing_opt_in IN (0,1)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX leads_created ON leads(created_at DESC);
CREATE INDEX leads_status ON leads(commercial_status, created_at DESC);
CREATE INDEX leads_website ON leads(website_url);
CREATE TABLE lead_consents (
  lead_id TEXT PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  privacy_version TEXT NOT NULL, authorization_version TEXT NOT NULL, marketing_version TEXT,
  accepted_at TEXT NOT NULL, form_version TEXT NOT NULL
);
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY, lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL, action TEXT NOT NULL, metadata_json TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE INDEX audit_lead ON audit_log(lead_id,created_at);
CREATE TABLE commercial_notes (
  id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL, note_encrypted TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE commercial_offers (
  id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL UNIQUE, request_hash TEXT NOT NULL, service_type TEXT NOT NULL,
  scope_encrypted TEXT NOT NULL, exclusions_encrypted TEXT NOT NULL,
  quoted_price_cop INTEGER NOT NULL CHECK(quoted_price_cop >= 1000),
  starting_price_cop_snapshot INTEGER, reviewed_by TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('borrador','enviada')), created_at TEXT NOT NULL, sent_at TEXT
);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE funnel_events (
  id TEXT PRIMARY KEY, event_name TEXT NOT NULL, issue_type TEXT,
  lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE, occurred_at TEXT NOT NULL
);
CREATE INDEX funnel_date ON funnel_events(occurred_at,event_name);
