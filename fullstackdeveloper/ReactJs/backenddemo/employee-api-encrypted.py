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

# Initialize or load encryption key
def init_encryption():
    key_file = '.encryption_key'
    if os.path.exists(key_file):
        with open(key_file, 'rb') as f:
            return base64.urlsafe_b64decode(f.read())
    else:
        key = Fernet.generate_key()
        with open(key_file, 'wb') as f:
            f.write(base64.urlsafe_b64encode(key))
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

# Initialize SQLite database with encrypted fields
def init_db():
    conn = sqlite3.connect('employees.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS employees
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         salary_encrypted TEXT NOT NULL,
         title TEXT NOT NULL)
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Create - POST /employees
@app.route('/employees', methods=['POST'])
def create_employee():
    try:
        data = request.get_json()
        if not all(key in data for key in ['name', 'salary', 'title']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Encrypt sensitive data
        encrypted_salary = encrypt_data(data['salary'])
        
        conn = sqlite3.connect('employees.db')
        c = conn.cursor()
        c.execute('''
            INSERT INTO employees (name, salary_encrypted, title) 
            VALUES (?, ?, ?)
        ''', (data['name'], encrypted_salary, data['title']))
        conn.commit()
        employee_id = c.lastrowid
        conn.close()
        
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
        conn = sqlite3.connect('employees.db')
        c = conn.cursor()
        c.execute('SELECT id, name, salary_encrypted, title FROM employees')
        rows = c.fetchall()
        conn.close()
        
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
        conn = sqlite3.connect('employees.db')
        c = conn.cursor()
        c.execute('SELECT id, name, salary_encrypted, title FROM employees WHERE id = ?', (id,))
        employee = c.fetchone()
        conn.close()
        
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
        
        conn = sqlite3.connect('employees.db')
        c = conn.cursor()
        c.execute('''
            UPDATE employees 
            SET name = ?, salary_encrypted = ?, title = ?
            WHERE id = ?
        ''', (data['name'], encrypted_salary, data['title'], id))
        conn.commit()
        
        if c.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Employee not found'}), 404
        
        conn.close()
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
        conn = sqlite3.connect('employees.db')
        c = conn.cursor()
        c.execute('DELETE FROM employees WHERE id = ?', (id,))
        conn.commit()
        
        if c.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Employee not found'}), 404
        
        conn.close()
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
