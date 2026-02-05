-- Reverse migration (remove role and temp_password columns)
CREATE TABLE users_old (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    fullname TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO users_old (id, email, fullname, password, created_at)
SELECT id, email, fullname, COALESCE(password, temp_password, 'MIGRATION_ERROR'), created_at
FROM users;

DROP TABLE users;
ALTER TABLE users_old RENAME TO users;

CREATE UNIQUE INDEX idx_users_email ON users(email);
