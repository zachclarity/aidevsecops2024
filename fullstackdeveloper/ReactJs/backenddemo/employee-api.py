from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS employees
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         salary REAL NOT NULL,
         title TEXT NOT NULL)
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Create - POST /employees
@app.route('/employees', methods=['POST'])
def create_employee():
    data = request.get_json()
    if not all(key in data for key in ['name', 'salary', 'title']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('INSERT INTO employees (name, salary, title) VALUES (?, ?, ?)',
              (data['name'], data['salary'], data['title']))
    conn.commit()
    employee_id = c.lastrowid
    conn.close()
    
    return jsonify({'id': employee_id, **data}), 201

# Read - GET /employees
@app.route('/employees', methods=['GET'])
def get_employees():
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('SELECT id, name, salary, title FROM employees')
    employees = [{'id': row[0], 'name': row[1], 'salary': row[2], 'title': row[3]} 
                for row in c.fetchall()]
    conn.close()
    return jsonify(employees)

# Read Single - GET /employees/<id>
@app.route('/employees/<int:id>', methods=['GET'])
def get_employee(id):
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('SELECT id, name, salary, title FROM employees WHERE id = ?', (id,))
    employee = c.fetchone()
    conn.close()
    
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    
    return jsonify({'id': employee[0], 'name': employee[1], 
                   'salary': employee[2], 'title': employee[3]})

# Update - PUT /employees/<id>
@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.get_json()
    if not all(key in data for key in ['name', 'salary', 'title']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('''UPDATE employees 
                 SET name = ?, salary = ?, title = ?
                 WHERE id = ?''',
              (data['name'], data['salary'], data['title'], id))
    conn.commit()
    
    if c.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Employee not found'}), 404
    
    conn.close()
    return jsonify({'id': id, **data})

# Delete - DELETE /employees/<id>
@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('DELETE FROM employees WHERE id = ?', (id,))
    conn.commit()
    
    if c.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Employee not found'}), 404
    
    conn.close()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=5000)
