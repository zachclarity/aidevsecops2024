const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/employees';

// Sample test data
const testEmployees = [
    { name: 'John Doe', salary: 75000, title: 'Software Engineer' },
    { name: 'Jane Smith', salary: 85000, title: 'Senior Developer' },
    { name: 'Bob Wilson', salary: 65000, title: 'Junior Developer' }
];

// Helper function to print responses
const printResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } else {
        console.log('Status:', response.status);
    }
};

// Test all CRUD operations
async function testAPI() {
    try {
        console.log('\n=== Testing Employee API ===\n');

        // CREATE - Test adding multiple employees
        console.log('1. Testing CREATE (POST)...');
        const createdEmployees = [];
        for (const emp of testEmployees) {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emp)
            });
            const data = await response.json();
            createdEmployees.push(data);
            console.log(`Created employee: ${emp.name}`);
            await printResponse(response);
        }

        // READ ALL - Test getting all employees
        console.log('\n2. Testing READ ALL (GET)...');
        const getAllResponse = await fetch(API_URL);
        await printResponse(getAllResponse);

        // READ ONE - Test getting a single employee
        if (createdEmployees.length > 0) {
            const firstEmployeeId = createdEmployees[0].id;
            console.log(`\n3. Testing READ ONE (GET) for ID: ${firstEmployeeId}...`);
            const getOneResponse = await fetch(`${API_URL}/${firstEmployeeId}`);
            await printResponse(getOneResponse);

            // UPDATE - Test updating an employee
            console.log(`\n4. Testing UPDATE (PUT) for ID: ${firstEmployeeId}...`);
            const updateResponse = await fetch(`${API_URL}/${firstEmployeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'John Doe Updated',
                    salary: 80000,
                    title: 'Senior Software Engineer'
                })
            });
            await printResponse(updateResponse);

            // DELETE - Test deleting an employee
            console.log(`\n5. Testing DELETE for ID: ${firstEmployeeId}...`);
            const deleteResponse = await fetch(`${API_URL}/${firstEmployeeId}`, {
                method: 'DELETE'
            });
            console.log('Delete status:', deleteResponse.status);
        }

        // Final GET to see the updated list
        console.log('\n6. Final employee list after operations:');
        const finalResponse = await fetch(API_URL);
        await printResponse(finalResponse);

    } catch (error) {
        console.error('Error during API testing:', error);
    }
}

// Run the tests
console.log('Starting API tests...');
testAPI().then(() => console.log('\nAPI testing completed!'));
