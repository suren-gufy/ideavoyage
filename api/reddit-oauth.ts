// Reddit OAuth Configuration for IdeaVoyage
// This file handles Reddit API authentication to get real market data

export interface RedditConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  userAgent: string;
}

export interface RedditOAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export class RedditOAuthClient {
  private config: RedditConfig;

  constructor(config: RedditConfig) {
    this.config = config;
  }

  // Generate Reddit OAuth authorization URL
  getAuthUrl(state: string = ''): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      state: state || Math.random().toString(36).substring(7),
      redirect_uri: this.config.redirectUri,
      duration: 'temporary',
      scope: 'read'
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<RedditOAuthToken | null> {
    try {
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': this.config.userAgent,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.config.redirectUri
        }).toString()
      });

      if (response.ok) {
        return await response.json() as RedditOAuthToken;
      } else {
        console.error('Reddit OAuth token exchange failed:', response.status, await response.text());
        return null;
      }
    } catch (error) {
      console.error('Reddit OAuth error:', error);
      return null;
    }
  }

  // Get app-only access token (no user authorization required)
  async getAppOnlyToken(): Promise<string | null> {
    try {
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': this.config.userAgent,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });
      
      if (response.ok) {
        const tokenData = await response.json() as RedditOAuthToken;
        console.log('✅ Reddit OAuth app-only token obtained');
        return tokenData.access_token;
      } else {
        console.warn('⚠️ Reddit OAuth app-only failed:', response.status);
        return null;
      }
    } catch (error) {
      console.warn('❌ Reddit OAuth app-only error:', (error as Error).message);
      return null;
    }
  }

  // Fetch data from Reddit OAuth API
  async fetchFromReddit(endpoint: string, token: string): Promise<any> {
    const response = await fetch(`https://oauth.reddit.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': this.config.userAgent
      }
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  // Get subreddit posts using OAuth
  async getSubredditPosts(subreddit: string, token: string, limit: number = 8, timeframe: string = 'week'): Promise<any[]> {
    try {
      const endpoint = `/r/${subreddit}/top?limit=${limit}&t=${timeframe}`;
      const data = await this.fetchFromReddit(endpoint, token);
      
      const posts = (data?.data?.children || [])
        .map((c: any) => c.data)
        .filter((p: any) => p.title)
        .slice(0, limit);
      
      console.log(`✅ OAuth: Got ${posts.length} posts from r/${subreddit}`);
      return posts;
    } catch (error) {
      console.error(`❌ OAuth failed for r/${subreddit}:`, (error as Error).message);
      return [];
    }
  }
}