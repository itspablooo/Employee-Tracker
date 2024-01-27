const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_db'
    }
);


function init() {
    console.log('\nEMPLOYEE TRACKER\n')
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'todo',
        choices: [
            'View all employees',
            'Add employee',
            'Update employee role',
            'View all roles',
            'add role',
            'View all departments',
            'add department'
        ]
}).then((answeres) => {
    console.log(answeres.todo);
    if (answeres.todo === 'View all employees') {
        viewAllEmployees();
    } else if (answeres.todo === 'Add employee') {
        addEmployee();
    } else if (answeres.todo === 'Update employee role') {
        updateEmployeeRole();
    } else if (answeres.todo === 'View all roles') {
        viewAllRoles();
    } else if (answeres.todo === 'Add role') {
        addRole();
    } else if (answeres.todo === 'View all departments') {
        viewAllDepartments();
    } else if (answeres.todo === 'Add department') {
        addDepartment();
    }
})
};

function viewAllEmployees() {
    const query = `SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.title AS role,
    departments.name AS department,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
FROM
    employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees AS managers ON employees.manager_id = managers.id;`
    db.query(query, (err, data) => {
        if(err) throw err;
        console.table(data);
        init();
    })
};

function addEmployee() {
        inquirer.prompt([
        {
            type: 'input',
            message: 'Enter employee\'s first name:',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'Enter employee\'s last name:',
            name: 'lastName'
        },
        {
            type: 'input',
            message: 'Enter employee\'s role ID:',
            name: 'roleID'
        },
        {
            type: 'input',
            message: 'Enter employee\'s manager ID (or leave blank if none):',
            name: 'managerID'
        }
    ]).then((data) => {
        const query = `
            INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES ('${data.firstName}', '${data.lastName}', ${data.roleID}, ${data.managerID || null})`;

        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }

            console.log('Employee has been added')
            init();
        });
    });
};

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the ID of the employee you want to update:',
            name: 'employeeId'
        },
        {
            type: 'input',
            message: 'Enter the new role ID for the employee:',
            name: 'newRoleId'
        }
    ]).then((data) => {
        const query = `UPDATE employees SET role_id = ${data.newRoleId} WHERE id = ${data.employeeId}`;
        
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log('Employee role has been updated')
            init();
        });
    });
};

function viewAllRoles() {
    const query = `SELECT
    id,
    title,
    salary,
    (SELECT name FROM departments WHERE id = roles.department_id) AS department FROM roles`
    db.query(query, (err, data) => {
        if(err) throw err;
        console.table(data);
        init();
    })
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the title of the new role:',
            name: 'title'
        },
        {
            type: 'input',
            message: 'Enter the salary for the new role:',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'Enter the department ID for the new role:',
            name: 'departmentID'
        }
    ]).then((data) => {
        const query = `
            INSERT INTO roles (title, salary, department_id)
            VALUES ('${data.title}', ${data.salary}, ${data.departmentID})`;

        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log('New role has been added')
            init();
        });
    });
};

function viewAllDepartments() {
    const query = `SELECT * FROM departments`
    db.query(query, (err, data) => {
        if(err) throw err;
        console.table(data);
        init();
    })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the name of the new department:',
            name: 'departmentName'
        }
    ]).then((data) => {
        const query = `
            INSERT INTO departments (name)
            VALUES ('${data.departmentName}')`;

        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }

            console.log('New department has been added');
            init();
        });
    });
};

init();