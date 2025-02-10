const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'password',
  database: 'employee_db'
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting to the database:', err.stack);
    return;
  }
  console.log('connected to MySQL database');
});

const app = express();
app.use(bodyParser.json());

// CREATE: Add a new employee
app.post('/employees', (req, res) => {
  const { first_name, last_name, email, department, position } = req.body;

  const query = 'INSERT INTO employees (first_name, last_name, email, department, position) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [first_name, last_name, email, department, position], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Failed to add employee', error: err });
    } else {
      res.status(201).json({ message: 'Employee added successfully', employeeId: result.insertId });
    }
  });
});

// READ: Get all employees
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Failed to retrieve employees', error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// READ: Get a single employee by ID
app.get('/employees/:id', (req, res) => {
  const employeeId = req.params.id;

  const query = 'SELECT * FROM employees WHERE id = ?';
  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Failed to retrieve employee', error: err });
    } else {
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    }
  });
});

// UPDATE: Update an employee's details
app.put('/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const { first_name, last_name, email, department, position } = req.body;

  const query = 'UPDATE employees SET first_name = ?, last_name = ?, email = ?, department = ?, position = ? WHERE id = ?';
  connection.query(query, [first_name, last_name, email, department, position, employeeId], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Failed to update employee', error: err });
    } else {
      res.status(200).json({ message: 'Employee updated successfully' });
    }
  });
});

// DELETE: Delete an employee by ID
app.delete('/employees/:id', (req, res) => {
  const employeeId = req.params.id;

  const query = 'DELETE FROM employees WHERE id = ?';
  connection.query(query, [employeeId], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Failed to delete employee', error: err });
    } else {
      res.status(200).json({ message: 'Employee deleted successfully' });
    }
  });
});

//server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});