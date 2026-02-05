-- Add role column (default to 'employee' for existing users)
-- We can't easily add NOT NULL columns with defaults in SQLite without a default value constraint name logic or recreating, 
-- but we are recreating anyway to make password nullable.

CREATE TABLE users_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    fullname TEXT NOT NULL,
    password TEXT,                    -- Now nullable (TEXT in SQLite can be null unless specified)
    temp_password TEXT,               -- New field
    role TEXT NOT NULL DEFAULT 'employee',  -- New field
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Copy existing data (set role to 'employer' for existing users)
INSERT INTO users_new (id, email, fullname, password, created_at, role, temp_password)
SELECT id, email, fullname, password, created_at, 'employer', NULL
FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

CREATE UNIQUE INDEX idx_users_email ON users(email);
