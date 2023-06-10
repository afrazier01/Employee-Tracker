INSERT INTO departments (name)
    VALUES  ("IT"),
            ("Finance"),
            ("Sales"),
            ("Legal"),
            ("Procurement");
INSERT INTO roles (title, salary, department_id)
    VALUES  ("IT Specialist", 50000, 1),
            ("IT Project Manager", 75000, 1),
            ("Investment Advisor", 65000, 2),
            ("Contracting Specialist", 125000,5),
            ("Lawyer", 95000, 4),
            ("Sales Manager", 71000,3),
            ("Software Engineer", 110000,1),
            ("Quality Engineer", 95000,1),
            ("Chief Executive Officer", 350000,2),
            ("Salesman", 60000,3),
            ("Contracting Support", 40000,5),
            ("Public Relations Specialist", 45000,4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES  ("Tae",'Frazier',2,1);