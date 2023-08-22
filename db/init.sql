CREATE TABLE uploaded_files (
    id SERIAL PRIMARY KEY,
    upload_time TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE employee_data (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES uploaded_files(id),
    employee_id INTEGER NOT NULL,
    company VARCHAR(64) NOT NULL,
    industry VARCHAR(64),
    work_hours INTEGER,
    vacation_hours INTEGER,
    overtime_hours INTEGER
);
