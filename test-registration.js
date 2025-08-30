const fetch = require('node-fetch');

async function testRegistration() {
  const url = 'http://localhost:3000/api/register';
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    username: 'testuser',
    password: 'Test1234',
    confirmPassword: 'Test1234'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegistration();
