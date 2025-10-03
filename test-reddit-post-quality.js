// Test to verify if Reddit posts are real and being properly displayed
const API_URL = 'https://ideavoyage-ms79ftwfa-surendhars-projects-15fcb9f7.vercel.app/api';

async function testRedditPostQuality() {
  console.log('🔍 Testing Reddit post quality and analysis...\n');
  
  const testIdea = 'user-friendly crypto wallet for beginners';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: testIdea })
    });
    
    const data = await response.json();
    
    console.log('📊 ANALYSIS RESULTS:');
    console.log(`✅ Status: ${response.status}`);
    console.log(`🎯 Subreddits: ${(data.subreddits || []).join(', ')}`);
    console.log(`📊 Data source: ${data.data_source}`);
    console.log(`🔥 Analysis confidence: ${data.analysis_confidence}`);
    console.log(`📈 Total posts analyzed: ${data.total_posts_analyzed}`);
    
    // Check evidence section
    console.log('\n📋 EVIDENCE SECTION:');
    console.log(`🔥 Real post count: ${data.evidence?.real_post_count || 0}`);
    console.log(`📱 Synthetic post count: ${data.evidence?.synthetic_post_count || 0}`);
    console.log(`🎯 Subreddits used: ${(data.evidence?.subreddits_used || []).join(', ')}`);
    
    // Check sample Reddit posts
    console.log('\n💬 SAMPLE REDDIT POSTS:');
    if (data.evidence?.sample_reddit_posts && data.evidence.sample_reddit_posts.length > 0) {
      data.evidence.sample_reddit_posts.forEach((post, i) => {
        console.log(`\n${i+1}. r/${post.subreddit || 'unknown'}: "${post.title || 'No title'}"`);
        console.log(`   📊 ${post.score || 0} upvotes, ${post.num_comments || 0} comments`);
        console.log(`   📝 Content: ${(post.selftext || 'No content').substring(0, 100)}${post.selftext && post.selftext.length > 100 ? '...' : ''}`);
        console.log(`   🔗 Source: ${post.source || 'unknown'}`);
        console.log(`   🆔 Permalink: ${post.permalink || 'none'}`);
      });
    } else {
      console.log('❌ No sample Reddit posts found in evidence section');
    }
    
    // Check pain points for quality
    console.log('\n⚡ PAIN POINTS ANALYSIS:');
    if (data.pain_points && data.pain_points.length > 0) {
      data.pain_points.forEach((pain, i) => {
        console.log(`\n${i+1}. "${pain.title}"`);
        console.log(`   📊 Frequency: ${pain.frequency}%, Urgency: ${pain.urgency}`);
        console.log(`   📝 Examples: ${(pain.examples || []).join(', ')}`);
        console.log(`   🔍 Market evidence: ${pain.market_evidence || 'none'}`);
      });
    }
    
    // Check if posts are actually real or synthetic
    const realPosts = data.evidence?.sample_reddit_posts?.filter(p => p.source === 'reddit') || [];
    const syntheticPosts = data.evidence?.sample_reddit_posts?.filter(p => p.source !== 'reddit') || [];
    
    console.log('\n🧪 POST SOURCE ANALYSIS:');
    console.log(`✅ Real Reddit posts: ${realPosts.length}`);
    console.log(`🤖 Synthetic posts: ${syntheticPosts.length}`);
    
    if (realPosts.length === 0) {
      console.log('❌ ISSUE FOUND: No real Reddit posts are being fetched!');
      console.log('🔍 This explains why Reddit Discussions Analysis shows "No detailed Reddit discussions available"');
    } else {
      console.log('✅ Real Reddit posts are being fetched correctly');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRedditPostQuality();