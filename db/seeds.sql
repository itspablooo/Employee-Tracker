INSERT INTO departments (name)
VALUES 
('Information Technology'), 
('Health');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Desktop Technician', 38000, 1),
('Application Support Analyst', 46000, 1),
('Client Service Manager', 68000, 1),
('Nurse', 52000, 2),
('Clinical Director', 86000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Valentino', 'Valencia', 3, null),
('Pablo', 'Rivera', 2, 1),
('Kimberly', 'Fichera', 1, 1),
('Stephanie', 'Larkins', 5, null),
('Janita', 'Theis', 4, 4);
