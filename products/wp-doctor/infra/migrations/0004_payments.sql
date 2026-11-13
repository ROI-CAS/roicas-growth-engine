CREATE TABLE payment_orders (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL UNIQUE REFERENCES commercial_offers(id) ON DELETE RESTRICT,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  access_hash TEXT NOT NULL UNIQUE,
  access_encrypted TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  amount_in_cents INTEGER NOT NULL CHECK(amount_in_cents >= 100000),
  environment TEXT NOT NULL CHECK(environment IN ('test','prod')),
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK(status IN ('CREATED','PENDING','APPROVED','DECLINED','VOIDED','ERROR')),
  transaction_id TEXT UNIQUE,
  accepted_at TEXT,
  terms_version TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX payment_lead ON payment_orders(lead_id,created_at);
CREATE TABLE payment_events (
  fingerprint TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL REFERENCES payment_orders(id) ON DELETE RESTRICT,
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL,
  received_at TEXT NOT NULL
);
