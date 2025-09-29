// Direct test of Reddit API connectivity

async function testRedditAccess() {
  console.log('🔍 Testing Reddit API access...');
  
  const testUrls = [
    'https://www.reddit.com/r/startups/hot.json?limit=1',
    'https://old.reddit.com/r/startups/hot.json?limit=1',
    'https://api.reddit.com/r/startups/hot?limit=1'
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`\n📡 Testing: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Headers: ${JSON.stringify([...response.headers.entries()].slice(0, 3))}`);
      
      if (response.ok) {
        const data = await response.json();
        const postCount = data?.data?.children?.length || 0;
        console.log(`   ✅ SUCCESS: Got ${postCount} posts`);
        return true;
      } else {
        const text = await response.text();
        console.log(`   ❌ FAILED: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n📊 CONCLUSION: Reddit API is blocked - falling back to synthetic data');
  return false;
}

testRedditAccess();