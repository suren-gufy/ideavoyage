// Quick debug test for the API
const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('https://ideavoyage.vercel.app/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idea: 'Test idea' })
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Error text:', text);
    } else {
      const data = await response.json();
      console.log('Success:', data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testAPI();