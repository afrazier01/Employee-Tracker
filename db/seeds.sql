INSERT INTO departments (name)
    VALUES  ("IT"),
            ("Finance"),
            ("Procurement");
INSERT INTO roles (title, salary, department_id)
    VALUES  ("IT Specialist", 50000, 1),
            ("IT Project Manager", 75000, 1),
            ("Investment Advisor", 65000, 2),
            ("Contracting", 100000,3);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES  ("Tae",'Frazier',2,1);