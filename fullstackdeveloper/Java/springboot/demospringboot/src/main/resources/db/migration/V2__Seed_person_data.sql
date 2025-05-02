-- V2: Insert initial data into the 'person' table

-- Insert sample records into the person table
-- Note: The 'id' column uses BIGSERIAL, so it will auto-increment.
-- The 'created_at' column has a default value of CURRENT_TIMESTAMP.
INSERT INTO person (first_name, last_name, email) VALUES
('Alice', 'Smith', 'alice.smith@example.com'),
('Bob', 'Johnson', 'bob.johnson@example.com'),
('Charlie', 'Williams', 'charlie.williams@example.com'),
('Diana', 'Brown', 'diana.brown@example.com');
commit;
-- You can add more INSERT statements here if needed
-- INSERT INTO person (first_name, last_name, email) VALUES ('Eve', 'Davis', 'eve.davis@example.com');

-- Optional: Log completion (though Flyway logs execution)
-- SELECT 'Finished seeding person table';
