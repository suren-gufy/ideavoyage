// Test localhost to see the Reddit analysis issue
async function testRedditAnalysisIssue() {
  console.log('🔍 Testing Reddit Discussions Analysis issue...');
  
  const testIdea = 'SEO backlink building tool for agencies';
  
  try {
    // Test deployed version first
    const deployedResponse = await fetch('https://ideavoyage-4ikph4l53-surendhars-projects-15fcb9f7.vercel.app/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: testIdea })
    });
    
    const deployedData = await deployedResponse.json();
    
    console.log('\n📊 DEPLOYED VERSION RESULTS:');
    console.log('🎯 Selected subreddits:', deployedData.subreddits);
    console.log('📱 Evidence subreddits:', deployedData.evidence?.subreddits_used || []);
    console.log('💬 Sample Reddit posts:');
    if (deployedData.evidence?.sample_reddit_posts) {
      deployedData.evidence.sample_reddit_posts.slice(0, 3).forEach((post, i) => {
        console.log(`${i+1}. r/${post.subreddit}: "${post.title}" (${post.score} upvotes)`);
      });
    }
    
    // Test localhost if available
    try {
      const localhostResponse = await fetch('http://localhost:3000/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: testIdea })
      });
      
      const localhostData = await localhostResponse.json();
      
      console.log('\n📊 LOCALHOST RESULTS:');
      console.log('🎯 Selected subreddits:', localhostData.subreddits);
      console.log('📱 Evidence subreddits:', localhostData.evidence?.subreddits_used || []);
      console.log('💬 Sample Reddit posts:');
      if (localhostData.evidence?.sample_reddit_posts) {
        localhostData.evidence.sample_reddit_posts.slice(0, 3).forEach((post, i) => {
          console.log(`${i+1}. r/${post.subreddit}: "${post.title}" (${post.score} upvotes)`);
        });
      }
      
      // Compare results
      console.log('\n🔍 COMPARISON:');
      const deployedSubs = deployedData.subreddits || [];
      const localhostSubs = localhostData.subreddits || [];
      const subsDiffer = JSON.stringify(deployedSubs) !== JSON.stringify(localhostSubs);
      console.log(`📊 Subreddits differ: ${subsDiffer ? 'YES' : 'NO'}`);
      
    } catch (localhostError) {
      console.log('\n📊 LOCALHOST: Not running or not accessible');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRedditAnalysisIssue();