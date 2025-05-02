-- V1: Create the initial 'person' table

-- Ensure the script is idempotent if necessary, though Flyway handles execution tracking.
-- CREATE SCHEMA IF NOT EXISTS public; -- Usually not needed if using default schema

CREATE TABLE person (
    id BIGSERIAL PRIMARY KEY,         -- Use BIGSERIAL for auto-incrementing 64-bit integer PK
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,        -- Optional: Add a unique constraint for email
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Track creation time
);

commit;
-- Optional: Add an index for faster lookups if needed, e.g., on last_name
-- CREATE INDEX idx_person_last_name ON person(last_name);
