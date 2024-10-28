from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv
import base64

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Initialize encryption key
def init_encryption():
    key = Fernet.generate_key()
    return key

# Initialize Fernet cipher
cipher_suite = Fernet(init_encryption())

# Encryption/decryption helpers
def encrypt_data(data):
    return cipher_suite.encrypt(str(data).encode()).decode()

def decrypt_data(encrypted_data):
    try:
        return float(cipher_suite.decrypt(encrypted_data.encode()).decode())
    except:
        return None

# Database connection helper
def get_db():
    db = getattr(Flask, '_database', None)
    if db is None:
        db = sqlite3.connect(':memory:', check_same_thread=False)
        Flask._database = db
    return db

# Initialize SQLite database with encrypted fields and sample data
def init_db():
    conn = get_db()
    c = conn.cursor()
    
    # Create table
    c.execute('''
        CREATE TABLE IF NOT EXISTS employees
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         salary_encrypted TEXT NOT NULL,
         title TEXT NOT NULL)
    ''')
    
    # Insert sample data
    sample_data = [
        ("John Doe", 75000, "Software Engineer"),
        ("Jane Smith", 85000, "Senior Developer"),
        ("Bob Wilson", 65000, "Junior Developer"),
        ("Alice Brown", 95000, "Technical Lead"),
        ("Charlie Davis", 70000, "DevOps Engineer")
    ]
    
    for name, salary, title in sample_data:
        encrypted_salary = encrypt_data(salary)
        c.execute('''
            INSERT INTO employees (name, salary_encrypted, title)
            VALUES (?, ?, ?)
        ''', (name, encrypted_salary, title))
    
    conn.commit()

# Initialize database on startup
init_db()

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(Flask, '_database', None)
    if db is not None:
        db.close()

# Create - POST /employees
@app.route('/employees', methods=['POST'])
def create_employee():
    try:
        data = request.get_json()
        if not all(key in data for key in ['name', 'salary', 'title']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Encrypt sensitive data
        encrypted_salary = encrypt_data(data['salary'])
        
        conn = get_db()
        c = conn.cursor()
        c.execute('''
            INSERT INTO employees (name, salary_encrypted, title) 
            VALUES (?, ?, ?)
        ''', (data['name'], encrypted_salary, data['title']))
        conn.commit()
        employee_id = c.lastrowid
        
        # Return the data with decrypted salary for immediate use
        return jsonify({
            'id': employee_id,
            'name': data['name'],
            'salary': data['salary'],
            'title': data['title']
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Read - GET /employees
@app.route('/employees', methods=['GET'])
def get_employees():
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT id, name, salary_encrypted, title FROM employees')
        rows = c.fetchall()
        
        employees = []
        for row in rows:
            decrypted_salary = decrypt_data(row[2])
            employees.append({
                'id': row[0],
                'name': row[1],
                'salary': decrypted_salary,
                'title': row[3]
            })
        
        return jsonify(employees)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Read Single - GET /employees/<id>
@app.route('/employees/<int:id>', methods=['GET'])
def get_employee(id):
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT id, name, salary_encrypted, title FROM employees WHERE id = ?', (id,))
        employee = c.fetchone()
        
        if employee is None:
            return jsonify({'error': 'Employee not found'}), 404
        
        decrypted_salary = decrypt_data(employee[2])
        return jsonify({
            'id': employee[0],
            'name': employee[1],
            'salary': decrypted_salary,
            'title': employee[3]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update - PUT /employees/<id>
@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    try:
        data = request.get_json()
        if not all(key in data for key in ['name', 'salary', 'title']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Encrypt updated salary
        encrypted_salary = encrypt_data(data['salary'])
        
        conn = get_db()
        c = conn.cursor()
        c.execute('''
            UPDATE employees 
            SET name = ?, salary_encrypted = ?, title = ?
            WHERE id = ?
        ''', (data['name'], encrypted_salary, data['title'], id))
        conn.commit()
        
        if c.rowcount == 0:
            return jsonify({'error': 'Employee not found'}), 404
        
        return jsonify({
            'id': id,
            'name': data['name'],
            'salary': data['salary'],
            'title': data['title']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete - DELETE /employees/<id>
@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('DELETE FROM employees WHERE id = ?', (id,))
        conn.commit()
        
        if c.rowcount == 0:
            return jsonify({'error': 'Employee not found'}), 404
        
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
