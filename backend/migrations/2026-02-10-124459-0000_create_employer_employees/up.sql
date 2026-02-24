CREATE TABLE employer_employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employer_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    department TEXT,
    role_title TEXT,
    status TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (employer_id) REFERENCES users(id),
    FOREIGN KEY (employee_id) REFERENCES users(id)
);
