// Test Reddit OAuth credentials
import fetch from 'node-fetch';

const clientId = 'V93rUHm8yKO2o777inmHrQ';
const clientSecret = 'kqdKhZX2wK1YIHCMp4T2-TCIY-wBow';

async function testRedditAuth() {
  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    console.log('🔑 Testing Reddit OAuth...');
    console.log('🔑 Client ID:', clientId);
    console.log('🔑 Client Secret:', clientSecret);
    console.log('🔑 Auth header:', auth);
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'IdeaVoyage/1.0 (by /u/ideavoyage)',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    
    console.log('🔑 Reddit OAuth response status:', response.status);
    
    const headerObj = {};
    response.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log('🔑 Response headers:', JSON.stringify(headerObj, null, 2));
    
    if (response.ok) {
      const tokenData = await response.json();
      console.log('✅ Reddit OAuth SUCCESS!');
      console.log('✅ Token type:', tokenData.token_type);
      console.log('✅ Expires in:', tokenData.expires_in, 'seconds');
    } else {
      const errorText = await response.text();
      console.error('❌ Reddit OAuth failed:', errorText);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRedditAuth();