CREATE TABLE employee_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    work_time_minutes INTEGER,
    manual_time_minutes INTEGER,
    computer_activity_minutes INTEGER,
    productive_minutes INTEGER,
    unproductive_minutes INTEGER,
    neutral_minutes INTEGER,
    break_time_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
