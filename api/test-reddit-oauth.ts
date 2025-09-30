// Test script to verify Reddit OAuth integration
import { RedditOAuthClient } from './reddit-oauth.js';

async function testRedditOAuth() {
  console.log('🧪 Testing Reddit OAuth integration...');
  
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.log('❌ Reddit credentials not found in environment');
    console.log('Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET');
    return;
  }
  
  console.log('✅ Reddit credentials found');
  console.log('Client ID:', clientId.substring(0, 8) + '...');
  
  const redditClient = new RedditOAuthClient({
    clientId,
    clientSecret,
    redirectUri: 'https://ideavoyage.vercel.app/api/reddit/callback',
    userAgent: 'IdeaVoyage/1.0 (by /u/ideavoyage)'
  });
  
  try {
    console.log('🔑 Getting app-only token...');
    const token = await redditClient.getAppOnlyToken();
    
    if (token) {
      console.log('✅ OAuth token obtained successfully!');
      console.log('Token:', token.substring(0, 10) + '...');
      
      console.log('📊 Testing subreddit fetch...');
      const posts = await redditClient.getSubredditPosts('startups', token, 3, 'week');
      console.log(`✅ Fetched ${posts.length} posts from r/startups`);
      
      posts.forEach((post, i) => {
        console.log(`  ${i+1}. "${post.title.substring(0, 50)}..." (Score: ${post.score})`);
      });
      
    } else {
      console.log('❌ Failed to get OAuth token');
    }
  } catch (error) {
    console.error('❌ Reddit OAuth test failed:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testRedditOAuth();
}

export { testRedditOAuth };