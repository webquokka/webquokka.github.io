-- Run this once to set up the database
-- psql -U postgres -d webquokka -f db/schema.sql

CREATE TABLE IF NOT EXISTS enquiries (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255)  NOT NULL,
  business     VARCHAR(255),
  email        VARCHAR(255)  NOT NULL,
  phone        VARCHAR(50),
  service      VARCHAR(255)  NOT NULL,
  message      TEXT          NOT NULL,
  ip_address   VARCHAR(45),
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for quick lookups by email or date
CREATE INDEX IF NOT EXISTS idx_enquiries_email      ON enquiries (email);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
