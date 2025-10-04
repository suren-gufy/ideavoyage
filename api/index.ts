// Using type definitions directly to avoid module import issues
interface VercelRequest {
  method?: string;
  url?: string;
  body?: any;
  cookies?: Record<string, string>;
  headers?: Record<string, string>;
  query?: Record<string, string | string[]>;
}

// Safe database integration - won't fail if Supabase isn't available
let DatabaseService: any = null;

// Initialize database service if available
async function initializeDatabase() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && !DatabaseService) {
    try {
      const supabaseModule = await import('../lib/supabase.js');
      DatabaseService = supabaseModule.DatabaseService;
      console.log('✅ Supabase database service initialized');
    } catch (error) {
      console.warn('⚠️ Supabase initialization failed, continuing without database:', (error as Error).message);
      DatabaseService = null;
    }
  }
}

// Simple type for analysis records
interface AnalysisRecord {
  id?: string;
  created_at?: string;
  idea: string;
  industry?: string;
  target_audience?: string;
  country?: string;
  analysis_results: any;
  data_source: string;
  analysis_confidence: string;
  overall_score: number;
  viability_score: number;
  user_session?: string;
}



interface VercelResponse {
  status: (statusCode: number) => VercelResponse;
  json: (jsonBody: any) => VercelResponse;
  send: (body: any) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

// Utility: clamp numbers
const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

interface RawRedditPost {
  title: string;
  selftext?: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  subreddit: string;
  // 'reddit' for real fetched data, 'synthetic' for internally generated filler
  source?: 'reddit' | 'synthetic';
}

// Inline Reddit OAuth functionality to avoid import issues
async function getRedditOAuthToken(clientId: string, clientSecret: string): Promise<string | null> {
  try {
    // Always use Buffer.from for Node.js serverless compatibility
    const credentials = `${clientId}:${clientSecret}`;
    const auth = Buffer.from(credentials, 'utf-8').toString('base64');
    
    console.log('🔑 Attempting Reddit OAuth...');
    console.log('🔑 Client ID length:', clientId.length);
    console.log('🔑 Client Secret length:', clientSecret.length);
    console.log('🔑 Auth header length:', auth.length);
    
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
    const headerObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log('🔑 Response headers:', JSON.stringify(headerObj));
    
    if (response.ok) {
      const tokenData = await response.json() as any;
      console.log('✅ Reddit OAuth SUCCESS! Token type:', tokenData.token_type);
      console.log('✅ Token scope:', tokenData.scope);
      console.log('✅ Token expires in:', tokenData.expires_in, 'seconds');
      return tokenData.access_token;
    } else {
      const errorText = await response.text();
      console.error('❌ Reddit OAuth FAILED:', response.status, response.statusText);
      console.error('❌ Error response:', errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Reddit OAuth EXCEPTION:', (error as Error).message);
    console.error('❌ OAuth Error Stack:', (error as Error).stack);
    return null;
  }
}

async function fetchRedditPosts(subreddit: string, token: string, limit: number = 8): Promise<any[]> {
  try {
    const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/top?limit=${limit}&t=week`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'IdeaVoyage/1.0 (by /u/ideavoyage)'
      }
    });
    
    if (!response.ok) {
      console.warn(`❌ Reddit API error for r/${subreddit}:`, response.status);
      return [];
    }
    
    const data = await response.json() as any;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const url = req.url || '';

    // Handle different GET routes
    if (req.method === 'GET') {
      // Premium status endpoint
      if (url.includes('/premium-status') || url.endsWith('/premium-status')) {
        return res.json({
          isPremium: false,
          plan: 'free',
          features: {
            basicAnalysis: true,
            advancedAnalysis: false,
            unlimitedReports: false,
            prioritySupport: false
          },
          message: 'Free tier - upgrade for advanced features'
        });
      }
      
      // Reddit OAuth endpoints for real data access
      if (url.includes('/reddit/auth')) {
        console.log('🔑 Reddit OAuth auth endpoint accessed:', url);
        // Generate Reddit OAuth URL
        const clientId = process.env.REDDIT_CLIENT_ID || 'demo_client_id';
        const redirectUri = process.env.REDDIT_REDIRECT_URI || 'https://ideavoyage.vercel.app/api/reddit/callback';
        const state = Math.random().toString(36).substring(7);
        
        const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}&duration=temporary&scope=read`;
        
        res.setHeader('Location', authUrl);
        return res.status(302).send('Redirecting to Reddit...');
      }
      
      if (url.includes('/reddit/callback')) {
        console.log('📞 Reddit OAuth callback endpoint accessed:', url);
        const code = req.query?.code as string;
        const error = req.query?.error as string;
        
        if (error) {
          return res.json({ 
            success: false, 
            error: `Reddit declined authorization: ${error}`,
            message: 'Reddit OAuth was cancelled or failed. You can still use demo mode.'
          });
        }
        
        if (code) {
          // In a real implementation, exchange code for token here
          return res.json({
            success: true,
            message: 'Reddit authentication successful! Real market data will be available once OAuth integration is completed.',
            code: code.substring(0, 10) + '...',
            nextSteps: 'Contact support to complete Reddit API integration with your authorization.'
          });
        }
        
        return res.status(400).json({ 
          success: false, 
          error: 'No authorization code received' 
        });
      }

      // Reddit OAuth test endpoint
      if (url.includes('/test-reddit-oauth') || url.includes('test-oauth')) {
        try {
          console.log('🧪 Reddit OAuth test endpoint accessed');
          const clientId = process.env.REDDIT_CLIENT_ID;
          const clientSecret = process.env.REDDIT_CLIENT_SECRET;
          
          if (!clientId || !clientSecret) {
            return res.json({
              success: false,
              error: 'Reddit credentials not found',
              clientId: clientId ? `Present (${clientId.length} chars)` : 'Missing',
              clientSecret: clientSecret ? `Present (${clientSecret.length} chars)` : 'Missing'
            });
          }
          
          console.log('🧪 Testing simple token request...');
          const token = await getRedditOAuthToken(clientId, clientSecret);
          
          return res.json({
            success: !!token,
            message: token ? 'Reddit OAuth working!' : 'Failed to get token',
            tokenLength: token?.length || 0,
            timestamp: new Date().toISOString()
          });
          
        } catch (error) {
          console.error('🧪 Test endpoint error:', error);
          return res.json({
            success: false,
            error: (error as Error).message,
            name: (error as Error).name,
            stack: (error as Error).stack?.substring(0, 500)
          });
        }
      }

      // Health check (default GET)
      const hasPerplexityKey = process.env.PERPLEXITY_API_KEY && process.env.PERPLEXITY_API_KEY.trim().length > 0;
      const hasAIKey = hasPerplexityKey;
      
      // Test Reddit API connectivity
      let redditTest = 'unknown';
      try {
        // Create two abort signals: one for timeout and one for manual abortion if needed
        // Create a timeout signal using type assertion to avoid conflicts
        const timeoutSignal = (AbortSignal as any).timeout(5000);
        const controller = new AbortController();
        
        // Combine signals using AbortSignal.any() with type assertion
        // This avoids TypeScript errors from conflicting DOM/Node type definitions
        const combinedSignal = (AbortSignal as any).any([
          timeoutSignal,
          controller.signal
        ]);
        
        // Try multiple Reddit access methods
        let testResponse;
        try {
          // Method 1: Direct JSON endpoint
          testResponse = await fetch('https://www.reddit.com/r/startups/hot.json?limit=1', {
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache'
            },
            signal: combinedSignal
          });
        } catch (e1) {
          // Method 2: Alternative endpoint
          try {
            testResponse = await fetch('https://old.reddit.com/r/startups/hot.json?limit=1', {
              headers: { 
                'User-Agent': 'Mozilla/5.0 (compatible; Market Research Tool/1.0)',
                'Accept': 'application/json'
              },
              signal: combinedSignal
            });
          } catch (e2) {
            throw e1; // Throw original error
          }
        }
        redditTest = testResponse.ok ? 'working' : `error_${testResponse.status}`;
      } catch (err) {
        redditTest = `failed_${(err as Error).message.substring(0,50)}`;
      }
      
      return res.json({
        message: 'IdeaVoyage API live',
        mode: hasAIKey ? 'enhanced' : 'heuristic',
        ai_available: hasAIKey,
        perplexity_available: hasPerplexityKey,
        reddit_test: redditTest,
        reddit_oauth_available: !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET),
        reddit_client_id_length: process.env.REDDIT_CLIENT_ID?.length || 0,
        reddit_client_secret_length: process.env.REDDIT_CLIENT_SECRET?.length || 0,
        reddit_client_id_preview: process.env.REDDIT_CLIENT_ID?.substring(0, 8) + '...' || 'missing',
        reddit_client_secret_preview: process.env.REDDIT_CLIENT_SECRET?.substring(0, 15) + '...' || 'missing',
        perplexity_key_length: process.env.PERPLEXITY_API_KEY ? process.env.PERPLEXITY_API_KEY.length : 0,
        perplexity_key_start: process.env.PERPLEXITY_API_KEY ? process.env.PERPLEXITY_API_KEY.substring(0, 20) + '...' : 'missing',
        timestamp: new Date().toISOString(),
        version: "2025-30-01-reddit-debug",
        url
      });
    }

    // Only allow POST for analysis
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed', 
        allowed: ['GET', 'POST'],
        received: req.method 
      });
    }

    // Enhanced input validation with better error handling
    let body;
    try {
      body = req.body || {};
    } catch (parseError) {
      return res.status(400).json({ 
        error: 'Invalid JSON in request body',
        detail: 'Please send valid JSON data'
      });
    }

    const { idea, industry, targetAudience, country = 'global', platform = 'web-app', fundingMethod = 'self-funded', timeRange = 'month' } = body;
    
    // Comprehensive input validation
    if (!idea) {
      return res.status(400).json({ 
        error: 'Missing required field: idea',
        required: 'Please provide a startup idea in the "idea" field.'
      });
    }
    
    if (typeof idea !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid idea format',
        detail: 'The "idea" field must be a string.'
      });
    }
    
    const trimmedIdea = idea.trim();
    if (trimmedIdea.length < 10) {
      return res.status(400).json({ 
        error: 'Idea too short',
        detail: 'Please provide a more detailed description (at least 10 characters).'
      });
    }

    if (trimmedIdea.length > 1000) {
      return res.status(400).json({ 
        error: 'Idea too long',
        detail: 'Please keep your idea description under 1000 characters.'
      });
    }

      try {
        // Initialize database service early (non-blocking)
        initializeDatabase().catch(err => console.warn('Database initialization failed:', err));
        
        console.log('🚀 Starting performRealAnalysis...');
        const startTime = Date.now();
        
        const result = await performRealAnalysis({ 
          idea: trimmedIdea, 
          industry, 
          targetAudience, 
          country, 
          platform, 
          fundingMethod, 
          timeRange 
        });
        
        const duration = Date.now() - startTime;
        console.log(`✅ Analysis completed successfully in ${duration}ms`);

        // Save analysis to database (if available)
        if (DatabaseService) {
          try {
            await initializeDatabase();
            if (DatabaseService) {
              const resultAny = result as any;
              const analysisRecord = {
                idea: trimmedIdea,
                industry: industry || undefined,
                target_audience: targetAudience || undefined,
                country: country || 'global',
                analysis_results: result,
                data_source: resultAny.data_source || 'unknown',
                analysis_confidence: resultAny.analysis_confidence || 'unknown',
                overall_score: result.overall_score,
                viability_score: result.viability_score,
                user_session: req.headers?.['x-session-id'] || undefined
              };

              const savedRecord = await DatabaseService.saveAnalysis(analysisRecord);
              if (savedRecord) {
                console.log(`💾 Analysis saved to database with ID: ${savedRecord.id}`);
                (result as any).database_id = savedRecord.id;
              }
            }
          } catch (dbError) {
            console.error('⚠️ Database save failed, continuing with response:', dbError);
          }
        }

        return res.json(result);
      } catch (analysisError) {
        console.error('❌ Analysis error:', analysisError);
        console.error('❌ Error stack:', (analysisError as Error).stack);
        // Generate emergency fallback result based on the idea
        const fallbackResult = generateEmergencyAnalysis(trimmedIdea, industry, targetAudience);
        
        // Save fallback analysis to database (if available)
        if (DatabaseService) {
          try {
            await initializeDatabase();
            if (DatabaseService) {
              const fallbackAny = fallbackResult as any;
              const analysisRecord = {
                idea: trimmedIdea,
                industry: industry || undefined,
                target_audience: targetAudience || undefined,
                country: country || 'global',
                analysis_results: fallbackResult,
                data_source: fallbackAny.data_source || 'fallback',
                analysis_confidence: fallbackAny.analysis_confidence || 'low',
                overall_score: fallbackResult.overall_score,
                viability_score: fallbackResult.viability_score,
                user_session: req.headers?.['x-session-id'] || undefined
              };

              const savedRecord = await DatabaseService.saveAnalysis(analysisRecord);
              if (savedRecord) {
                console.log(`💾 Fallback analysis saved to database with ID: ${savedRecord.id}`);
                (fallbackResult as any).database_id = savedRecord.id;
              }
            }
          } catch (dbError) {
            console.error('⚠️ Database save failed for fallback, continuing with response:', dbError);
          }
        }
        
        return res.json(fallbackResult);
      }

  } catch (err) {
    console.error('Fatal API error', err);
    // Even in case of fatal error, try to return a valid analysis structure
    try {
      const idea = (req.body && typeof req.body === 'object' && req.body.idea) || 'startup idea';
      const industry = (req.body && typeof req.body === 'object' && req.body.industry) || undefined;
      const targetAudience = (req.body && typeof req.body === 'object' && req.body.targetAudience) || undefined;
      const fallbackResult = generateEmergencyAnalysis(idea, industry, targetAudience);
      return res.json(fallbackResult);
    } catch {
      return res.status(500).json({ 
        error: 'Internal server error', 
        detail: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
    }
  }
}

// Generate realistic synthetic posts when Reddit data is insufficient
function generateRealisticSyntheticPosts(idea: string, industry: string, subreddit: string): RawRedditPost[] {
  const keywords = idea.toLowerCase().split(/\s+/).filter(w => w.length > 3).slice(0, 3);
  const isAI = /\b(ai|artificial|intelligence|machine|learning|algorithm|neural|nlp|gpt|llm)\b/i.test(idea);
  const isFitness = /\b(fitness|gym|workout|health|exercise|training|nutrition|athlete)\b/i.test(idea);
  
  const syntheticTemplates = [
    {
      title: `Has anyone tried ${keywords[0] || 'something'} for ${industry || 'business'}?`,
      selftext: `Looking for alternatives to existing solutions in ${industry || 'this space'}. Current options seem limited and expensive.`,
      score: Math.floor(Math.random() * 85) + 15,
      comments: Math.floor(Math.random() * 20) + 3
    },
    {
      title: `Thoughts on ${idea.split(' ').slice(0, 4).join(' ')}?`,
      selftext: `Been researching this for a while. Market seems ready but execution is challenging. Anyone with experience?`,
      score: Math.floor(Math.random() * 65) + 18,
      comments: Math.floor(Math.random() * 28) + 6
    },
    {
      title: `Why isn't there a good solution for ${keywords.join(' ')} yet?`,
      selftext: `Every existing option I've tried has major limitations. There's definitely demand but no one has nailed the execution.`,
      score: Math.floor(Math.random() * 120) + 25,
      comments: Math.floor(Math.random() * 35) + 8
    },
    {
      title: `Just launched our ${industry || 'startup'} MVP - early feedback?`,
      selftext: `After months of development, we're looking for honest feedback. Trying to solve the ${keywords[0] || 'problem'} problem differently.`,
      score: Math.floor(Math.random() * 48) + 12,
      comments: Math.floor(Math.random() * 25) + 4
    },
    {
      title: `Market research: How much would you pay for ${keywords[0] || 'this'} solution?`,
      selftext: `Validating pricing for our upcoming launch. Current alternatives are either too expensive or too basic.`,
      score: Math.floor(Math.random() * 70) + 16,
      comments: Math.floor(Math.random() * 30) + 7
    },
    {
      title: `Struggling with ${keywords[0] || 'current'} tools - any recommendations?`,
      selftext: `Current solutions don't meet our needs. Looking for something more tailored to ${industry || 'our use case'}. Budget is flexible for the right solution.`,
      score: Math.floor(Math.random() * 90) + 20,
      comments: Math.floor(Math.random() * 22) + 5
    },
    {
      title: `${industry || 'Business'} owners: what's your biggest pain point with ${keywords[0] || 'operations'}?`,
      selftext: `Trying to understand the market better. What problems do you face daily that tech could solve?`,
      score: Math.floor(Math.random() * 110) + 30,
      comments: Math.floor(Math.random() * 40) + 12
    },
    {
      title: `Anyone else excited about the potential of ${keywords.slice(0,2).join(' ')}?`,
      selftext: `Seeing a lot of innovation in this space lately. The market timing seems perfect for new solutions.`,
      score: Math.floor(Math.random() * 75) + 22,
      comments: Math.floor(Math.random() * 18) + 9
    }
  ];
  
  // Add industry-specific boost
  const industryBoosts = {
    ai: isAI ? 1.4 : 1.0,
    fitness: isFitness ? 1.2 : 1.0
  };
  const boost = Math.max(...Object.values(industryBoosts));
  
  return syntheticTemplates.slice(0, 4).map((template, i) => ({
    title: template.title,
    selftext: template.selftext,
    score: Math.floor(template.score * boost),
    num_comments: Math.floor(template.comments * boost),
    created_utc: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 3), // Last 3 days
    permalink: `/r/${subreddit}/comments/${Date.now() + i}/synthetic_post/`,
    subreddit: subreddit,
    source: 'synthetic'
  }));
}

// Emergency fallback that always returns a valid analysis structure
function generateEmergencyAnalysis(idea: string, industry?: string, targetAudience?: string) {
  const ideaTokens = idea.split(' ').filter(t => t.length > 2);
  const baseScore = Math.random() * 3 + 5; // Random score between 5-8
  
  return {
    keywords: [
      ...ideaTokens.slice(0, 3),
      industry || 'business',
      'startup',
      'innovation',
      'technology'
    ].filter(Boolean),
    subreddits: ['startups', 'Entrepreneur', 'business', 'SideProject'],
    sentiment_data: [
      { name: 'Enthusiastic', value: 55, color: 'hsl(var(--chart-2))', description: 'Excitement about new solutions' },
      { name: 'Curious/Mixed', value: 30, color: 'hsl(var(--chart-3))', description: 'Questions about implementation' },
      { name: 'Frustrated', value: 15, color: 'hsl(var(--destructive))', description: 'Current market gaps' }
    ],
    pain_points: [
      { title: 'Market Validation', frequency: 85, urgency: 'high', examples: ['Uncertain demand', 'Customer discovery needed'] },
      { title: 'Implementation Challenges', frequency: 65, urgency: 'medium', examples: ['Technical complexity', 'Resource constraints'] }
    ],
    app_ideas: [
      { title: `${ideaTokens[0] || 'Smart'} ${ideaTokens[1] || 'Solution'} Platform`, 
        description: `An innovative approach to ${idea}`, 
        market_validation: 'medium', 
        difficulty: 'medium' }
    ],
    google_trends: [
      { keyword: ideaTokens[0] || 'startup', trend_direction: 'stable', interest_level: Math.round(baseScore * 10), related_queries: ideaTokens.slice(1, 4) }
    ],
    icp: {
      demographics: { age_range: '25-40', gender: 'Mixed', income_level: 'Middle to High', education: 'College Graduate' },
      psychographics: { interests: ideaTokens.slice(0, 3), values: ['Innovation', 'Quality', 'Efficiency'], lifestyle: 'Tech-savvy professional' },
      behavioral: { pain_points: ['Efficiency', 'Cost', 'Complexity'], preferred_channels: ['Online', 'Mobile', 'Social'], buying_behavior: 'Research-driven' }
    },
    problem_statements: [
      { problem: `${targetAudience || 'Users'} need better solutions for ${idea}`,
        impact: 'Significant opportunity for market disruption',
        evidence: ['Customer feedback', 'Market research', 'Competitive analysis'],
        market_size: `Growing ${industry || 'industry'} with increasing demand` }
    ],
    financial_risks: [
      { risk_type: 'Market Adoption', severity: 'medium', description: 'Initial user acquisition challenges', mitigation_strategy: 'MVP testing and iteration' }
    ],
    competitors: [
      { name: 'Established Players', description: 'Current market solutions', strengths: ['Brand recognition', 'User base'], weaknesses: ['Legacy technology', 'Limited innovation'], market_share: 'Dominant but vulnerable', pricing_model: 'Subscription/Freemium' }
    ],
    revenue_models: [
      { model_type: 'Subscription', description: 'Recurring revenue through premium features', pros: ['Predictable income', 'Customer retention'], cons: ['Acquisition costs', 'Churn management'], implementation_difficulty: 'medium', potential_revenue: 'Medium' }
    ],
    market_interest_level: baseScore > 7 ? 'high' : baseScore > 5 ? 'medium' : 'low',
    total_posts_analyzed: Math.floor(Math.random() * 10) + 15, // Random between 15-25
    overall_score: parseFloat(baseScore.toFixed(1)),
    viability_score: parseFloat((baseScore - 0.5).toFixed(1)),
    debug: {
      fallback: 'emergency',
      ms: 120
    }
  };
}

async function performRealAnalysis(input: { idea: string; industry?: string; targetAudience?: string; country: string; platform: string; fundingMethod: string; timeRange: string; }) {
  const started = Date.now();
  console.log('📋 performRealAnalysis started with:', input.idea);
  
  try {
    // 1. Derive seed keywords + candidate subreddits
    console.log('🔤 Processing seed keywords...');
    const seed = input.idea.toLowerCase();
  const tokens = Array.from(new Set(seed.split(/[^a-z0-9+]+/).filter(Boolean)));
  
  // Enhanced context-aware subreddit selection with market intelligence
  let subreddits: string[] = [];
  
  // DYNAMIC SUBREDDIT DETECTION - Analyze ANY idea intelligently
  console.log('🔍 Analyzing idea for relevant communities:', input.idea);
  
  // Extract key concepts from the idea
  const ideaLower = input.idea.toLowerCase();
  const problemDomain = extractProblemDomain(ideaLower, tokens);
  const targetAudience = extractTargetAudience(ideaLower, tokens);
  const solutionType = extractSolutionType(ideaLower, tokens);
  
  console.log('🎯 Problem Domain:', problemDomain);
  console.log('👥 Target Audience:', targetAudience);
  console.log('💡 Solution Type:', solutionType);
  
  // Dynamic analysis functions
  function extractProblemDomain(idea, tokens) {
    const domains = {
      'pets': ['pet','pets','cat','cats','dog','dogs','animal','animals','collar','leash','wildlife','bird','birds','hunting','vet','training'],
      'plants': ['plant','plants','houseplant','houseplants','garden','gardening','disease','fungi','leaf','leaves','soil','water','grow','care'],
      'health': ['health','medical','disease','symptom','diagnosis','treatment','therapy','mental','physical','wellness','medicine','doctor','dementia','alzheimer','medication','seniors','elderly','caregiver'],
      'finance': ['money','finance','financial','bank','banking','payment','invest','investment','budget','tax','crypto','trading','portfolio'],
      'education': ['learn','learning','education','study','student','teacher','course','tutorial','skill','knowledge','training','school'],
      'work': ['work','job','career','productivity','office','remote','meeting','collaboration','task','project','workplace','professional'],
      'food': ['food','restaurant','cooking','recipe','meal','nutrition','diet','chef','kitchen','dining','eat','hunger'],
      'music': ['music','musician','instrument','song','audio','sound','practice','perform','band','studio','recording','concert'],
      'travel': ['travel','trip','vacation','hotel','flight','transportation','tourism','destination','booking','journey'],
      'fitness': ['fitness','exercise','workout','gym','health','muscle','weight','training','sport','activity','movement'],
      'home': ['home','house','apartment','room','furniture','cleaning','maintenance','repair','decoration','organization'],
      'tech': ['technology','software','app','mobile','web','programming','coding','development','ai','automation','digital'],
      'social': ['social','community','friend','relationship','dating','family','communication','network','connection','introvert','extrovert','friendship','meet','people']
    };
    
    for (const [domain, keywords] of Object.entries(domains)) {
      if (keywords.some(keyword => idea.includes(keyword) || tokens.includes(keyword))) return domain;
    }
    return 'general';
  }
  
  function extractTargetAudience(idea, tokens) {
    const audiences = {
      'seniors': ['senior','elderly','old','aging','retirement','grandparent','dementia','alzheimer','caregiver'],
      'parents': ['parent','mom','dad','mother','father','baby','child','children','family','kid','toddler'],
      'students': ['student','college','university','school','graduate','academic','study','exam','homework'],
      'professionals': ['professional','business','corporate','office','manager','executive','consultant','freelancer'],
      'developers': ['developer','programmer','coder','engineer','software','tech','coding','programming'],
      'artists': ['artist','creative','designer','musician','writer','photographer','painter','maker'],
      'entrepreneurs': ['entrepreneur','startup','founder','business','company','venture','investor'],
      'gamers': ['gamer','gaming','game','player','esports','streaming','twitch','xbox','playstation'],
      'fitness': ['athlete','fitness','gym','trainer','runner','cyclist','bodybuilder','weightlifter'],
      'medical': ['doctor','nurse','medical','healthcare','patient','clinic','hospital','therapist']
    };
    
    for (const [audience, keywords] of Object.entries(audiences)) {
      if (keywords.some(keyword => idea.includes(keyword) || tokens.includes(keyword))) return audience;
    }
    return 'general';
  }
  
  function extractSolutionType(idea, tokens) {
    if (tokens.some(t => ['app','mobile','smartphone','ios','android'].includes(t))) return 'mobile_app';
    if (tokens.some(t => ['web','website','platform','saas','dashboard'].includes(t))) return 'web_platform';
    if (tokens.some(t => ['ai','artificial','intelligence','machine','learning','automation'].includes(t))) return 'ai_solution';
    if (tokens.some(t => ['device','hardware','sensor','iot','smart','wearable'].includes(t))) return 'hardware';
    if (tokens.some(t => ['service','consulting','coaching','training','education'].includes(t))) return 'service';
    return 'software';
  }
  
  // INTELLIGENT SUBREDDIT SELECTION based on extracted concepts
  subreddits = selectRelevantSubreddits(problemDomain, targetAudience, solutionType, tokens, ideaLower);
  
  function selectRelevantSubreddits(domain, audience, solution, tokens, idea) {
    let selectedSubreddits = [];
    
    // Domain-specific communities (most specific)
    const domainSubreddits = {
      'pets': tokens.some(t => ['cat','cats'].includes(t)) ? ['cats', 'CatAdvice', 'cattraining'] :
              tokens.some(t => ['dog','dogs'].includes(t)) ? ['dogs', 'DogTraining', 'puppy101'] :
              ['pets', 'animals', 'AskVet', 'petcare'],
      'plants': tokens.some(t => ['houseplant','indoor'].includes(t)) ? ['houseplants', 'IndoorGarden', 'plantclinic'] :
                tokens.some(t => ['garden','outdoor'].includes(t)) ? ['gardening', 'vegetablegardening', 'landscaping'] :
                ['plants', 'plantclinic', 'whatsthisplant'],
      'health': tokens.some(t => ['mental','therapy','depression','anxiety'].includes(t)) ? ['mentalhealth', 'therapy', 'depression', 'anxiety'] :
                tokens.some(t => ['fitness','exercise','workout'].includes(t)) ? ['fitness', 'loseit', 'bodyweightfitness'] :
                ['Health', 'medical', 'AskDocs'],
      'finance': tokens.some(t => ['crypto','bitcoin','ethereum'].includes(t)) ? ['CryptoCurrency', 'Bitcoin', 'ethereum'] :
                 tokens.some(t => ['invest','investment','portfolio'].includes(t)) ? ['investing', 'SecurityAnalysis', 'ValueInvesting'] :
                 ['personalfinance', 'financialindependence', 'budgeting'],
      'education': tokens.some(t => ['programming','coding','developer'].includes(t)) ? ['learnprogramming', 'cscareerquestions', 'webdev'] :
                   tokens.some(t => ['language','languages'].includes(t)) ? ['languagelearning', 'Spanish', 'French'] :
                   ['education', 'studying', 'GetStudying'],
      'work': tokens.some(t => ['remote','coworking','virtual'].includes(t)) ? ['remotework', 'digitalnomad', 'WorkFromHome'] :
              tokens.some(t => ['productivity','task','project'].includes(t)) ? ['productivity', 'GetMotivated', 'getdisciplined'] :
              ['jobs', 'careerguidance', 'careerchange'],
      'food': tokens.some(t => ['restaurant','chef','kitchen'].includes(t)) ? ['KitchenConfidential', 'restaurateur', 'Chefit'] :
              tokens.some(t => ['recipe','cooking','meal'].includes(t)) ? ['recipes', 'cooking', 'MealPrepSunday'] :
              ['food', 'nutrition', 'HealthyFood'],
      'music': tokens.some(t => ['piano'].includes(t)) ? ['piano', 'WeAreTheMusicMakers', 'musictheory'] :
               tokens.some(t => ['guitar'].includes(t)) ? ['Guitar', 'WeAreTheMusicMakers', 'guitarlessons'] :
               ['WeAreTheMusicMakers', 'musicians', 'musicproduction'],
      'travel': ['travel', 'solotravel', 'backpacking', 'digitalnomad'],
      'fitness': ['fitness', 'bodyweightfitness', 'running', 'weightlifting'],
      'home': ['homeimprovement', 'organization', 'InteriorDesign', 'DIY'],
      'tech': ['technology', 'programming', 'MachineLearning', 'webdev'],
      'social': ['socialskills', 'relationship_advice', 'dating_advice', 'MakeNewFriendsHere']
    };
    
    // Audience-specific communities
    const audienceSubreddits = {
      'seniors': ['dementia', 'Alzheimers', 'CaregiverSupport', 'eldercare', 'AgingParents'],
      'parents': ['Parenting', 'Mommit', 'daddit', 'beyondthebump', 'toddlers'],
      'students': ['college', 'university', 'GetStudying', 'StudentLoans', 'GradSchool'],
      'professionals': ['careerguidance', 'jobs', 'ITCareerQuestions', 'careerchange'],
      'developers': ['programming', 'webdev', 'cscareerquestions', 'learnprogramming'],
      'artists': ['Art', 'WeAreTheMusicMakers', 'photography', 'writing'],
      'entrepreneurs': ['Entrepreneur', 'startups', 'smallbusiness', 'business'],
      'gamers': ['gaming', 'pcgaming', 'GameDev', 'truegaming'],
      'fitness': ['fitness', 'bodybuilding', 'running', 'weightlifting'],
      'medical': ['medicine', 'nursing', 'medicalschool', 'healthcare']
    };
    
    // Start with domain-specific subreddits (highest priority)
    if (domainSubreddits[domain]) {
      selectedSubreddits = [...domainSubreddits[domain]];
    }
    
    // Add audience-specific subreddits if relevant
    if (audienceSubreddits[audience] && audience !== 'general') {
      selectedSubreddits = [...selectedSubreddits, ...audienceSubreddits[audience].slice(0, 2)];
    }
    
    // Add solution-type specific subreddits
    const solutionSubreddits = {
      'mobile_app': ['androiddev', 'iOSProgramming', 'reactnative', 'flutter'],
      'web_platform': ['webdev', 'javascript', 'reactjs', 'SaaS'],
      'ai_solution': ['MachineLearning', 'ArtificialIntelligence', 'deeplearning'],
      'hardware': ['arduino', 'raspberry_pi', 'electronics', 'DIY'],
      'service': ['consulting', 'freelance', 'smallbusiness', 'Entrepreneur']
    };
    
    if (solutionSubreddits[solution]) {
      selectedSubreddits = [...selectedSubreddits, ...solutionSubreddits[solution].slice(0, 1)];
    }
    
    // Remove duplicates and limit to 6 most relevant
    selectedSubreddits = [...new Set(selectedSubreddits)].slice(0, 6);
    
    // Always include some general business/startup communities as fallback
    if (selectedSubreddits.length < 4) {
      selectedSubreddits = [...selectedSubreddits, 'Entrepreneur', 'startups', 'business'].slice(0, 6);
    }
    
    return selectedSubreddits;
  }
  
  console.log('🎯 Selected subreddits for analysis:', subreddits);
  

  
  // Limit to 6 subreddits for focused analysis and ensure we have at least some subreddits
  subreddits = subreddits.slice(0, 6);
  if (subreddits.length === 0) {
    console.warn('⚠️ No subreddits selected, using default set');
    subreddits = ['startups', 'Entrepreneur', 'business'];
  }

    // 2. Fetch top posts using Reddit OAuth API first, then fallback to public JSON
    let fetchedPosts: RawRedditPost[] = [];
    let usedOAuth = false;
    
    // Try Reddit OAuth first if credentials are available
    const hasRedditCreds = process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET;
    console.log('🔥 Reddit OAuth check - has creds:', hasRedditCreds, 'client_id length:', process.env.REDDIT_CLIENT_ID?.length || 0, 'secret length:', process.env.REDDIT_CLIENT_SECRET?.length || 0);
    
    if (hasRedditCreds) {
      try {
        console.log('🔑 Attempting Reddit OAuth authentication...');
        const token = await getRedditOAuthToken(
          process.env.REDDIT_CLIENT_ID!,
          process.env.REDDIT_CLIENT_SECRET!
        );
        console.log('🔑 Reddit OAuth token result:', token ? 'SUCCESS' : 'FAILED');
        
        if (token) {
          console.log('✅ Reddit OAuth token obtained, fetching posts...');
          for (const sub of subreddits) {
            if (fetchedPosts.length >= 12) break;
            console.log(`🔍 OAuth: Trying r/${sub}`);
            const posts = await fetchRedditPosts(sub, token, 8);
            posts.forEach((p: any) => {
              if (fetchedPosts.length < 12) fetchedPosts.push({
                title: String(p.title).trim(),
                selftext: String(p.selftext || '').trim(),
                score: Math.max(1, parseInt(p.score) || 1),
                num_comments: Math.max(0, parseInt(p.num_comments) || 0),
                created_utc: p.created_utc || Math.floor(Date.now()/1000),
                permalink: p.permalink || '',
                subreddit: p.subreddit || sub,
                source: 'reddit'
              });
            });
          }
          usedOAuth = true;
          console.log(`✅ OAuth: Fetched ${fetchedPosts.length} posts via Reddit API`);
        }
      } catch (oauthErr) {
        console.warn('❌ Reddit OAuth failed:', (oauthErr as Error).message);
        console.warn('❌ OAuth Error Stack:', (oauthErr as Error).stack);
      }
    } else {
      console.log('⚠️ Reddit OAuth credentials not found, will use public endpoint');
    }
    
    // Fallback to public JSON endpoint if OAuth failed or no credentials
    if (!usedOAuth || fetchedPosts.length === 0) {
      console.log('🌐 Falling back to public Reddit JSON endpoints...');
      for (const sub of subreddits) {
        if (fetchedPosts.length >= 12) break;
        const url = `https://www.reddit.com/r/${sub}/top.json?limit=8&t=week`;
        console.log(`🔍 Public: Trying r/${sub}`);
        try {
          const response = await fetch(url, {
            headers: { 
              'User-Agent': 'Mozilla/5.0 (compatible; IdeaVoyage/1.0; +https://ideavoyage.vercel.app)',
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(8000) as unknown as AbortSignal
          });
          if (response.ok) {
            const data = await response.json() as any;
            const posts = (data?.data?.children || []).map((c: any) => c.data).filter((p: any) => p.title).slice(0, 8);
            posts.forEach((p: any) => {
              if (fetchedPosts.length < 12) {
                const title = String(p.title).trim();
                const selftext = String(p.selftext || '').trim();
                const score = Math.max(1, parseInt(p.score) || 1);
                const num_comments = Math.max(0, parseInt(p.num_comments) || 0);
                
                // Enhanced data extraction for better analysis
                const post: RawRedditPost = {
                  title,
                  selftext,
                  score,
                  num_comments,
                  created_utc: p.created_utc || Math.floor(Date.now()/1000),
                  permalink: p.permalink || '',
                  subreddit: p.subreddit || sub,
                  source: 'reddit'
                };

                // Add metadata for enhanced analysis
                (post as any).engagement_ratio = score > 0 ? num_comments / score : 0;
                (post as any).content_length = selftext.length;
                (post as any).post_age_days = Math.floor((Date.now() / 1000 - (p.created_utc || 0)) / 86400);
                (post as any).signals = {
                  is_problem_focused: /\b(problem|issue|frustrat|difficult|annoying|hate|struggle)\b/i.test(title + ' ' + selftext),
                  is_solution_seeking: /\b(recommend|suggest|help|solution|alternative|tool|app|software)\b/i.test(title + ' ' + selftext),
                  is_pain_point: /\b(pain|headache|nightmare|terrible|awful|worst)\b/i.test(title + ' ' + selftext),
                  mentions_cost: /\b(price|cost|expensive|cheap|budget|money|pay|fee)\b/i.test(title + ' ' + selftext),
                  mentions_competitors: /\b(vs|versus|alternative|instead|better than)\b/i.test(title + ' ' + selftext)
                };

                fetchedPosts.push(post);
              }
            });
            console.log(`✅ Public: Total real posts so far: ${fetchedPosts.length}`);
          } else {
            console.warn(`⚠️ r/${sub} returned ${response.status}`);
          }
        } catch (err) {
          console.warn(`❌ r/${sub} fetch error: ${(err as Error).message}`);
        }
      }
    }
  
  // Log what we actually fetched with detailed information
  console.log(`📊 Reddit fetch results: ${fetchedPosts.length} posts from ${subreddits.length} subreddits`);
  fetchedPosts.forEach((post, i) => {
    console.log(`  Post ${i+1}: "${post.title.substring(0, 50)}..." - Score: ${post.score}, Comments: ${post.num_comments} (r/${post.subreddit})`);
  });
  
  // Always ensure we have enough data for analysis by adding synthetic posts when needed
  console.log(`📊 Real posts fetched: ${fetchedPosts.length}, adding synthetic posts for comprehensive analysis...`);
  const fallbackSub = subreddits[0] || 'startups';
  const syntheticPosts = generateRealisticSyntheticPosts(input.idea, input.industry || '', fallbackSub);
  
  // Add synthetic posts to ensure we have at least 8-12 posts for analysis
  const targetPostCount = Math.max(12, fetchedPosts.length + 6);
  const postsToAdd = Math.min(syntheticPosts.length, targetPostCount - fetchedPosts.length);
  fetchedPosts.push(...syntheticPosts.slice(0, postsToAdd));
  console.log(`✅ Added ${postsToAdd} synthetic posts (now ${fetchedPosts.length} total for analysis)`);
  
  // Mark this as using mixed data for transparency
  const hasMixedData = fetchedPosts.some(p => p.source === 'reddit') && fetchedPosts.some(p => p.source === 'synthetic');
  
  // If we still have very few posts, try a final aggressive approach
  if (fetchedPosts.length < 5) {
    console.log(`⚠️ Still low post count (${fetchedPosts.length}), trying final aggressive fetch...`);
    
    // Try some general subreddits that usually work
    const backupSubs = ['AskReddit', 'technology', 'business', 'SideProject'];
    
    for (const sub of backupSubs) {
      if (fetchedPosts.length > 15) break;
      
      try {
        const url = `https://www.reddit.com/r/${sub}/rising.json?limit=8`;
        const response = await fetch(url, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (compatible; RedditReader/1.0)',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(3000) as unknown as AbortSignal
        });
        
        if (response.ok) {
          const data = await response.json() as any;
          const posts = (data?.data?.children || [])
            .map((c: any) => c.data)
            .filter((p: any) => p && p.title && p.title.length > 15)
            .slice(0, 6);
          
          posts.forEach((p: any) => {
            fetchedPosts.push({
              title: String(p.title).trim(),
              selftext: String(p.selftext || '').trim(),
              score: Math.max(1, parseInt(p.score) || Math.floor(Math.random() * 50) + 10),
              num_comments: Math.max(0, parseInt(p.num_comments) || Math.floor(Math.random() * 20)),
              created_utc: p.created_utc || (Math.floor(Date.now()/1000) - Math.floor(Math.random() * 86400)),
              permalink: p.permalink || `/r/${sub}/comments/${Date.now()}`,
              subreddit: p.subreddit || sub,
              source: 'reddit'
            });
          });
          
          console.log(`✅ Backup fetch got ${posts.length} posts from r/${sub}`);
        }
      } catch (e) {
        console.log(`❌ Backup fetch failed for r/${sub}`);
      }
    }
  }
  
  console.log(`📈 Final post count: ${fetchedPosts.length} posts for analysis`)

  // 3. Advanced keyword extraction focused on real Reddit content
  console.log(`🔍 Analyzing ${fetchedPosts.length} posts for keywords...`);
  
  // Create rich text corpus from real posts
  const titleCorpus = fetchedPosts.map(p => p.title).join(' ').toLowerCase();
  const contentCorpus = fetchedPosts.map(p => p.selftext).join(' ').toLowerCase();
  const fullCorpus = `${titleCorpus} ${contentCorpus} ${input.idea.toLowerCase()}`;
  
  // Enhanced stopwords list
  const stopWords = new Set(['with', 'that', 'have', 'this', 'about', 'from', 'https', 'reddit', 'they', 
    'their', 'will', 'your', 'just', 'what', 'when', 'where', 'which', 'who', 'whom', 'these',
    'those', 'then', 'than', 'some', 'such', 'also', 'here', 'there', 'into', 'over', 'under',
    'should', 'would', 'could', 'been', 'were', 'comment', 'post', 'like', 'want', 'need', 
    'make', 'good', 'best', 'know', 'think', 'time', 'help', 'work', 'find', 'user', 'people']);
  
  // Extract and count meaningful terms
  const termFreq: Record<string, number> = {};
  const words = fullCorpus.split(/[^a-z0-9]+/).filter(word => 
    word.length >= 4 && 
    word.length <= 20 && 
    !stopWords.has(word) &&
    !/^\d+$/.test(word) && // no pure numbers
    /[a-z]/.test(word) // must contain letters
  );
  
  words.forEach(word => {
    termFreq[word] = (termFreq[word] || 0) + 1;
  });
  
  // Get high-value keywords - prefer terms that appear multiple times
  let extractedKeywords = Object.entries(termFreq)
    .filter(([word, count]) => count >= Math.max(1, Math.floor(fetchedPosts.length / 10)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word);
  
  // Add idea-specific terms to ensure relevance
  const ideaTerms = input.idea.toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 4);
  
  // Industry-specific enrichment
  const domainKeywords: string[] = [];
  if (isAI) domainKeywords.push('artificial', 'intelligence', 'machine', 'learning', 'algorithm');
  if (isFitness) domainKeywords.push('fitness', 'health', 'exercise', 'workout', 'nutrition');
  if (isEdu) domainKeywords.push('education', 'learning', 'course', 'teaching', 'student');
  if (isFin) domainKeywords.push('finance', 'investment', 'money', 'financial', 'trading');
  
  // Combine all keyword sources intelligently
  const allKeywordCandidates = [
    ...extractedKeywords,
    ...ideaTerms, 
    ...domainKeywords.slice(0, 3)
  ];
  
  // Deduplicate and prioritize (keep order which prioritizes extracted > idea > domain)
  const finalKeywords = Array.from(new Set(allKeywordCandidates)).slice(0, 10);
  
  console.log(`📝 Extracted keywords: ${finalKeywords.join(', ')}`);
  const frequentTerms = finalKeywords;

  // Heuristic pain point candidates
  const painCandidates: Record<string, {count:number; examples:Set<string>}> = {};
  const painSignals = ['problem','issue','struggle','hard','difficult','confusing','annoying','need','pain','frustrated'];
  fetchedPosts.slice(0,40).forEach(p => {
    const lower = (p.title + ' ' + (p.selftext||'')).toLowerCase();
    if (painSignals.some(sig => lower.includes(sig))) {
      // pick a term present
      const key = painSignals.find(sig => lower.includes(sig)) || 'problem';
      if (!painCandidates[key]) painCandidates[key] = {count:0, examples:new Set()};
      painCandidates[key].count++;
      if (painCandidates[key].examples.size < 3) painCandidates[key].examples.add(p.title.substring(0,120));
    }
  });
  const pain_points_heuristic = Object.entries(painCandidates).map(([k,v]) => ({
    title: k.charAt(0).toUpperCase()+k.slice(1),
    frequency: clamp(v.count*15, 10, 95),
    urgency: v.count > 5 ? 'high' : v.count > 2 ? 'medium' : 'low',
    examples: Array.from(v.examples)
  })).slice(0,6);

  // 4. Perplexity AI enrichment (key required)
  let enriched: Partial<ReturnType<typeof buildBaseResponse>> | null = null;
  const hasPerplexityKey = !!process.env.PERPLEXITY_API_KEY?.trim();
  const hasAIKey = hasPerplexityKey;
  console.log('🤖 AI check - Perplexity:', hasPerplexityKey, 'AI Available:', hasAIKey);
  
  if (hasAIKey) {
    // Use Perplexity AI for analysis
    try {
      console.log('🤖 Starting Perplexity AI analysis...');
      const realPosts = fetchedPosts.filter(p => p.source === 'reddit');
      const samplePosts = realPosts.length > 0 
        ? realPosts.slice(0, 8).map(p => `- "${p.title}" (${p.score} upvotes, ${p.num_comments} comments on r/${p.subreddit})`).join('\n')
        : 'No real Reddit data available - using market analysis approach';
      
      const dataContext = realPosts.length > 0 
        ? `Based on ${realPosts.length} real Reddit discussions:\n${samplePosts}\n\n`
        : 'No real Reddit data available. Provide market-validated insights based on industry knowledge:\n\n';
      
      const system = `You are a senior market research analyst specializing in startup validation with 10+ years of experience analyzing Reddit communities, competitive landscapes, and user behavior patterns. You have deep expertise in identifying market opportunities, user pain points, and competitive positioning. Your analysis should be forensic-level detailed and actionable for founders making strategic decisions.

ANALYSIS FRAMEWORK:
1. DEEP USER PSYCHOLOGY: Understand WHY users have problems and HOW they currently solve them
2. COMPETITIVE INTELLIGENCE: Research actual products, pricing, user reviews, and market positioning  
3. COMMUNITY DYNAMICS: Analyze specific Reddit community cultures, posting patterns, and user demographics
4. MARKET TIMING: Assess current trends, seasonality, and market readiness
5. REVENUE VALIDATION: Evaluate willingness to pay based on similar products and user behavior

Return ONLY valid JSON with detailed, research-backed insights.`;

      const postAnalysis = realPosts.length > 0 
        ? realPosts.map(p => ({
            title: p.title,
            content: p.selftext?.substring(0, 200) || '',
            engagement: `${p.score} upvotes, ${p.num_comments} comments`,
            community: p.subreddit,
            signals: p.title.toLowerCase().includes('problem') || p.title.toLowerCase().includes('issue') ? 'pain_point' :
                    p.title.toLowerCase().includes('solution') || p.title.toLowerCase().includes('app') ? 'solution_seeking' :
                    p.title.toLowerCase().includes('recommendation') || p.title.toLowerCase().includes('help') ? 'advice_seeking' : 'general_discussion'
          }))
        : [];

      const userPrompt = `${dataContext}

STARTUP IDEA ANALYSIS REQUEST:
💡 IDEA: "${input.idea}"
🏭 INDUSTRY: ${input.industry || 'Technology'}  
👥 TARGET AUDIENCE: ${input.targetAudience || 'General users'}
📊 REDDIT COMMUNITIES ANALYZED: ${subreddits.join(', ')}
📈 REDDIT DATA POINTS: ${realPosts.length} real discussions, ${fetchedPosts.length - realPosts.length} synthetic

DETAILED POST ANALYSIS:
${postAnalysis.length > 0 ? postAnalysis.map((p, i) => 
  `POST ${i+1} [${p.community}]: "${p.title}" | ${p.engagement} | Signal: ${p.signals}${p.content ? ` | Content: "${p.content}..."` : ''}`
).join('\n') : 'No real Reddit data - analyze based on market knowledge'}

🚨 CRITICAL PAIN POINT EXTRACTION REQUIREMENTS:
- Extract pain points ONLY from the actual Reddit post titles and content provided above
- Use the EXACT language and phrases that users wrote in their posts
- DO NOT create generic business descriptions - use authentic user voice
- Each pain point must be traceable to specific Reddit posts/discussions
- Include direct quotes from Reddit posts as examples
- Pain point frequency should reflect how many actual posts mention this issue
- Look for emotional language like "frustrated", "can't find", "hate that", "wish there was"
- Use first-person language when users express personal problems

REQUIRED COMPREHENSIVE ANALYSIS (JSON format):

{
  "keywords": [
    "primary_problem_keyword_users_actually_search",
    "specific_solution_term_target_market_uses", 
    "industry_jargon_insiders_use",
    "user_pain_point_exact_phrase",
    "competitor_alternative_they_mention"
  ],
  "subreddits": [
    "highly_specific_niche_community_where_target_users_congregate",
    "adjacent_community_with_crossover_audience", 
    "problem_focused_community_discussing_exact_pain_points",
    "solution_seeking_community_evaluating_alternatives"
  ],
  "pain_points": [
    {
      "title": "EXACT quote from Reddit posts - user's actual frustrated language, not business terms",
      "frequency": "Count of actual Reddit posts mentioning this specific problem",
      "urgency": "critical",
      "examples": ["Direct quotes from the Reddit posts provided above", "Verbatim user complaints from specific posts"],
      "current_solutions": ["How they solve it now", "Workarounds they use"],
      "willingness_to_pay": "high",
      "market_size_indicator": "thousands mention this daily"
    }
  ],
  "app_ideas": [
    {
      "title": "Precise Solution Name",
      "description": "Detailed description addressing exact pain point mechanism",
      "market_validation": "high",
      "difficulty": "medium",
      "unique_value_proposition": "What makes this different from alternatives",
      "user_acquisition_strategy": "Where to find users who need this",
      "mvp_features": ["Essential feature 1", "Core feature 2"]
    }
  ],
  "competitors": [
    {
      "name": "Actual Company Name (if known)",
      "description": "Real product description and positioning",
      "strengths": ["Specific advantage", "Market position"],
      "weaknesses": ["User complaints found", "Specific limitations"],
      "market_share": "Estimated market position",
      "pricing_model": "Actual pricing structure",
      "user_reviews_sentiment": "What users actually say",
      "differentiation_opportunity": "How to beat them"
    }
  ],
  "revenue_models": [
    {
      "model_type": "Most Viable Revenue Model",
      "description": "Detailed implementation for this specific market",
      "pros": ["Market-specific advantage", "User behavior alignment"],
      "cons": ["Realistic challenge", "Market-specific risk"],
      "implementation_difficulty": "realistic_assessment",
      "potential_revenue": "Data-backed estimate",
      "pricing_research": "What similar products charge",
      "user_willingness_to_pay": "Evidence from market research"
    }
  ],
  "market_insights": {
    "market_maturity": "early/growing/mature/declining",
    "seasonal_trends": "When demand peaks",
    "user_demographics": "Specific target user profile",
    "adoption_barriers": ["Real obstacles to adoption"],
    "market_catalysts": ["Trends driving demand"],
    "geographic_opportunities": ["Where demand is highest"]
  },
  "competitive_analysis": {
    "market_gaps": ["Unserved user needs"],
    "pricing_opportunities": ["Under/over-priced segments"],
    "feature_gaps": ["Missing functionality users want"],
    "user_experience_problems": ["UI/UX complaints about competitors"]
  }
}

CRITICAL REQUIREMENTS:
- Use SPECIFIC data from Reddit posts when available
- Research ACTUAL competitor names and products when possible  
- Identify EXACT pain point language users employ
- Provide REALISTIC market size indicators
- Include ACTIONABLE go-to-market insights
- Base pricing on SIMILAR successful products
- Identify SPECIFIC user acquisition channels
- Address REAL adoption barriers and solutions

Focus on depth over breadth - better to have 2 deeply researched competitors than 5 generic ones.`;
      
      console.log('🔥 Using Perplexity AI for analysis...');
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 2000,
          temperature: 0.1
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const raw = result.choices[0].message.content;
        console.log('🔍 Perplexity raw response length:', raw.length, 'first 200 chars:', raw.slice(0, 200));
        
        // Extract JSON from response
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          enriched = JSON.parse(jsonMatch[0]);
          
          // Debug: Log the actual Perplexity response structure
          console.log('🔍 Perplexity response structure:', Object.keys(enriched || {}));
          console.log('🔍 Perplexity keywords:', enriched?.keywords ? `${enriched.keywords.length} items` : 'missing');
          console.log('🔍 Perplexity pain_points:', enriched?.pain_points ? `${enriched.pain_points.length} items` : 'missing');
          console.log('🔍 Perplexity subreddits:', enriched?.subreddits ? `${enriched.subreddits.length} items` : 'missing');
          console.log('🔍 Perplexity competitors:', enriched?.competitors ? `${enriched.competitors.length} items` : 'missing');
          
          // Validate that we got meaningful data
          if (enriched && (enriched.pain_points || enriched.keywords || enriched.subreddits)) {
            console.log('✅ Perplexity enrichment successful - AI-powered analysis active!');
            console.log('🔍 Final enriched data preview:');
            console.log('🔍 Enriched pain_points sample:', enriched.pain_points?.[0]?.title || 'none');
            console.log('🔍 Enriched keywords sample:', enriched.keywords?.slice(0,3) || 'none');
            console.log('🔍 Enriched subreddits sample:', enriched.subreddits?.slice(0,3) || 'none');
            console.log('🔍 Data source combination: Reddit OAuth + Perplexity Analysis = Premium insights');
          } else {
            console.warn('⚠️ Perplexity returned empty/invalid data, falling back to heuristics');
            console.warn('⚠️ Raw Perplexity response (first 500 chars):', raw.slice(0, 500));
            enriched = null;
          }
        } else {
          console.warn('⚠️ Could not extract JSON from Perplexity response');
          enriched = null;
        }
      } else {
        console.error('❌ Perplexity API call failed:', response.status, await response.text());
        enriched = null;
      }
    } catch (enrichErr) {
      console.error('❌ Perplexity enrichment failed with detailed error:', {
        message: (enrichErr as Error).message,
        stack: (enrichErr as Error).stack?.slice(0, 500),
        api_key_length: process.env.PERPLEXITY_API_KEY?.length || 0
      });
      enriched = null;
    }
  } else {
    console.log('No Perplexity API key found - using heuristic analysis only');
  }

  // 5. Build response
  // Separate real vs synthetic posts for transparency & scoring
  const realPostsOnly = fetchedPosts.filter(p => p.source !== 'synthetic');

  // Debug what's being passed to buildBaseResponse
  console.log('🏗️ Building response with:');
  console.log('🏗️ Using enriched keywords:', enriched?.keywords ? 'YES' : 'NO (fallback to heuristic)');
  console.log('🏗️ Using enriched subreddits:', enriched?.subreddits ? 'YES' : 'NO (fallback to detected)');
  console.log('🏗️ Using enriched pain_points:', enriched?.pain_points ? 'YES' : 'NO (fallback to heuristic)');
  console.log('🏗️ Detected subreddits fallback:', subreddits?.slice(0,3));

  const response = buildBaseResponse({
    idea: input.idea,
    industry: input.industry,
    targetAudience: input.targetAudience,
    isAI, isFitness, tokens,
    keywords: enriched?.keywords || frequentTerms.slice(0,7),
    subreddits: enriched?.subreddits || subreddits,
    pain_points: (enriched?.pain_points as any) || (pain_points_heuristic.length ? pain_points_heuristic : [
      { title: 'Validation Gap', frequency: 55, urgency: 'medium', examples: ['Need better evidence for idea viability'] }
    ]),
    app_ideas: (enriched?.app_ideas as any) || [
      { title: `Smart ${tokens[0]||'Market'} Analyzer`, description: 'Tool that synthesizes community signals into actionable validation metrics', market_validation: 'medium', difficulty: isAI ? 'hard' : 'medium' }
    ],
    competitors: (enriched?.competitors as any) || [
      { name: 'Generic Tools', description: 'Existing broad solutions lacking niche focus', strengths: ['Brand'], weaknesses: ['Low specialization'], market_share: 'Fragmented', pricing_model: 'Subscription' }
    ],
    revenue_models: (enriched?.revenue_models as any) || [
      { model_type: 'Subscription', description: 'Monthly access to analysis dashboard', pros: ['Predictable revenue'], cons: ['Churn risk'], implementation_difficulty: 'medium', potential_revenue: 'Medium' }
    ],
    fetchedPosts: realPostsOnly.length ? realPostsOnly : (
      // Use AI-generated posts if available, otherwise fallback to synthetic
      enriched && (enriched as any).realistic_posts 
        ? (enriched as any).realistic_posts.map((p: any, i: number) => ({
            title: p.title || `AI-generated post ${i+1}`,
            selftext: '',
            score: p.score || Math.floor(Math.random() * 50) + 10,
            num_comments: p.num_comments || Math.floor(Math.random() * 20) + 2,
            created_utc: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400),
            permalink: `/r/startups/comments/ai_generated_${i}/`,
            subreddit: 'startups',
            source: 'ai_generated'
          }))
        : fetchedPosts
    )
  });

  const durationMs = Date.now() - started;
  const aiGeneratedPosts = enriched && (enriched as any).realistic_posts ? (enriched as any).realistic_posts : [];
  const finalPostsUsed = realPostsOnly.length ? realPostsOnly : (aiGeneratedPosts.length ? aiGeneratedPosts : fetchedPosts);
  
  (response as any).debug = { 
    postsFetched: fetchedPosts.length,
    realPosts: realPostsOnly.length,
    syntheticPosts: fetchedPosts.filter(p => p.source === 'synthetic').length,
    aiGeneratedPosts: aiGeneratedPosts.length,
    sampleTitles: finalPostsUsed.slice(0,5).map((p: any) => p.title || String(p)),
    enriched: !!enriched, 
    ai_available: hasAIKey,
    perplexity_available: hasPerplexityKey,

    reddit_oauth_used: usedOAuth,
    reddit_creds_available: hasRedditCreds,
    mode: enriched && aiGeneratedPosts.length > 0 ? 'ai_enhanced_with_posts' : enriched ? 'ai_enhanced' : 'heuristic_only',
    ms: durationMs,
    api_version: '2025-09-30-reddit-oauth-v1'
  };
  // Add high-level evidence summary for user transparency
  (response as any).evidence = {
    real_post_count: realPostsOnly.length,
    synthetic_post_count: fetchedPosts.filter(p => p.source === 'synthetic').length,
    subreddits_used: Array.from(new Set(fetchedPosts.map(p => p.subreddit))).slice(0,10),
    sample_reddit_posts: realPostsOnly.slice(0,5).map(p => ({ title: p.title, score: p.score, comments: p.num_comments, subreddit: p.subreddit }))
  };
  // Set transparency indicators based on data sources
  if (realPostsOnly.length === 0) {
    if (enriched && hasAIKey) {
      (response as any).analysis_confidence = 'ai_enhanced';
      (response as any).data_source = 'ai_synthetic';  
      const aiProvider = 'Perplexity AI';
      (response as any).notes = `🤖 AI-ENHANCED ANALYSIS: Using ${aiProvider} for sophisticated market validation. Real Reddit data would enhance accuracy further.`;
      (response as any).upgrade_message = '🔥 Pro Tip: Reddit OAuth + AI = Ultimate market insights! Set up Reddit API for even deeper analysis.';
    } else {
      (response as any).analysis_confidence = 'demo_mode';
      (response as any).data_source = 'synthetic_only';
      (response as any).notes = '⚠️ BASIC MODE: Using heuristic analysis. Enable Perplexity AI + Reddit OAuth for premium insights.';
      (response as any).upgrade_message = '🔑 Unlock AI-powered analysis! Add Perplexity API key and Reddit OAuth for real market intelligence.';
    }
  } else if (realPostsOnly.length > 0 && enriched && hasAIKey) {
    // This is the premium experience: Real Reddit data + AI analysis
    (response as any).analysis_confidence = 'premium_enhanced';
    (response as any).data_source = 'reddit_plus_ai';
    const aiProvider = 'Perplexity AI';
    (response as any).notes = `🔥 PREMIUM ANALYSIS: Combining ${realPostsOnly.length} real Reddit discussions with ${aiProvider} intelligence for maximum accuracy.`;
    (response as any).upgrade_message = '✨ You\'re getting the best possible analysis! Real data + AI insights = Market validation gold standard.';
  } else if (realPostsOnly.length < 4) {
    (response as any).analysis_confidence = 'low';
    (response as any).data_source = 'limited_real';
    (response as any).notes = `Limited real discussion data (${realPostsOnly.length} posts). Supplemented with synthetic data.`;
  } else if (realPostsOnly.length < 10) {
    (response as any).analysis_confidence = 'medium';
    (response as any).data_source = 'mixed_real_synthetic';
    (response as any).notes = `Analysis based on ${realPostsOnly.length} real posts plus synthetic data.`;
  } else {
    (response as any).analysis_confidence = 'high';
    (response as any).data_source = 'real_reddit_data';
    (response as any).notes = `High confidence analysis based on ${realPostsOnly.length} real Reddit discussions.`;
  }

  // Final safeguard: ensure consistency between analysis_confidence and data_source
  if ((response as any).analysis_confidence === 'ai_enhanced' && (response as any).data_source !== 'ai_synthetic') {
    const originalSource = (response as any).data_source;
    (response as any).data_source = 'ai_synthetic';
    (response as any).debug = {
      ...((response as any).debug || {}),
      normalized_data_source: true,
      original_data_source: originalSource,
      normalization_reason: 'analysis_confidence=ai_enhanced requires data_source=ai_synthetic'
    };
    (response as any).notes = ((response as any).notes || '') + ' \n(Backend normalization applied to ensure AI transparency.)';
  }
  return response;
  
  } catch (error) {
    console.error('❌ Error in performRealAnalysis:', error);
    throw error;
  }
}

function buildBaseResponse(params: { idea: string; industry?: string; targetAudience?: string; isAI: boolean; isFitness: boolean; tokens: string[]; keywords: string[]; subreddits: string[]; pain_points: any[]; app_ideas: any[]; competitors: any[]; revenue_models: any[]; fetchedPosts: RawRedditPost[]; }) {
  const { isAI, isFitness, keywords, subreddits, pain_points, app_ideas, competitors, revenue_models, fetchedPosts, tokens } = params;
  const realPosts = fetchedPosts.filter(p => p.source === 'reddit');
  console.log(`📊 Calculating scores from ${realPosts.length} REAL posts (total including synthetic: ${fetchedPosts.length})...`);
  
  // Advanced sentiment analysis based on real Reddit engagement
  const postsForScoring = realPosts.length ? realPosts : fetchedPosts; // fallback if no real
  const totalScore = postsForScoring.reduce((sum, p) => sum + p.score, 0);
  const totalComments = postsForScoring.reduce((sum, p) => sum + p.num_comments, 0);
  const avgScore = postsForScoring.length ? totalScore / postsForScoring.length : 15;
  const avgComments = postsForScoring.length ? totalComments / postsForScoring.length : 3;
  
  // High engagement posts indicate market interest (using postsForScoring set)
  const highEngagementPosts = postsForScoring.filter(p => p.score > avgScore && p.num_comments > avgComments).length;
  const engagementRatio = postsForScoring.length ? highEngagementPosts / postsForScoring.length : 0.3;
  
  // Calculate realistic sentiment based on actual data
  const baseEnthusiasm = Math.min(65, Math.round(avgScore * 1.2 + avgComments * 3));
  const engagementBoost = Math.round(engagementRatio * 25);
  const enthusiasm = clamp(baseEnthusiasm + engagementBoost, 25, 75);
  
  const baseFrustration = Math.round(pain_points.length * 8);
  const lowEngagementPenalty = postsForScoring.length < 5 ? 10 : 0;
  const frustration = clamp(baseFrustration + lowEngagementPenalty, 10, 45);
  
  const mixed = clamp(100 - enthusiasm - frustration, 15, 60);

  const sentiment_data = [
    { name: 'Enthusiastic', value: enthusiasm, color: 'hsl(var(--chart-2))', description: 'Strong market interest and engagement' },
    { name: 'Curious/Mixed', value: mixed, color: 'hsl(var(--chart-3))', description: 'Questions and evaluation discussions' },
    { name: 'Frustrated', value: frustration, color: 'hsl(var(--destructive))', description: 'Pain points and unmet needs identified' }
  ];

  // Advanced multi-factor scoring system with market intelligence
  const avgScoreNormalized = Math.log10(Math.max(1, avgScore)) / Math.log10(100); // Log scale for Reddit scores
  const avgCommentsNormalized = Math.log10(Math.max(1, avgComments)) / Math.log10(50);
  const postVolumeScore = Math.min(1.0, postsForScoring.length / 15); // More REAL posts = better signal
  
  // Enhanced content quality and market signal indicators
  const hasDetailedDiscussions = postsForScoring.length ? postsForScoring.filter(p => (p.selftext?.length || 0) > 100).length / postsForScoring.length : 0;
  const hasHighEngagement = postsForScoring.length ? postsForScoring.filter(p => p.score > avgScore * 1.5 || p.num_comments > avgComments * 2).length / postsForScoring.length : 0;
  
  // Market validation signals from enhanced post metadata
  const problemSignalStrength = postsForScoring.length ? postsForScoring.filter(p => (p as any).signals?.is_problem_focused).length / postsForScoring.length : 0;
  const solutionSeekingSignal = postsForScoring.length ? postsForScoring.filter(p => (p as any).signals?.is_solution_seeking).length / postsForScoring.length : 0;
  const costMentionSignal = postsForScoring.length ? postsForScoring.filter(p => (p as any).signals?.mentions_cost).length / postsForScoring.length : 0;
  const competitorMentionSignal = postsForScoring.length ? postsForScoring.filter(p => (p as any).signals?.mentions_competitors).length / postsForScoring.length : 0;
  
  // Engagement quality metrics
  const avgEngagementRatio = postsForScoring.length ? postsForScoring.reduce((sum, p) => sum + ((p as any).engagement_ratio || 0), 0) / postsForScoring.length : 0;
  const recentPostsRatio = postsForScoring.length ? postsForScoring.filter(p => ((p as any).post_age_days || 365) < 30).length / postsForScoring.length : 0;
  
  // Market opportunity indicators
  const marketOpportunityScore = (problemSignalStrength * 0.3 + solutionSeekingSignal * 0.25 + costMentionSignal * 0.2 + competitorMentionSignal * 0.15 + avgEngagementRatio * 0.1);
  
  console.log(`🔍 Market Signals: Problems=${(problemSignalStrength*100).toFixed(0)}% Solutions=${(solutionSeekingSignal*100).toFixed(0)}% Cost=${(costMentionSignal*100).toFixed(0)}% Competitors=${(competitorMentionSignal*100).toFixed(0)}% Recent=${(recentPostsRatio*100).toFixed(0)}%`);
  
  // Market trend multipliers
  const trendMultipliers = {
    ai: isAI ? 1.6 : 1.0,           // AI is hot right now
    fitness: isFitness ? 1.3 : 1.0,  // Fitness tech growing
    general: 1.0
  };
  const trendBonus = Math.max(...Object.values(trendMultipliers));
  
  // Keyword relevance scoring - more relevant keywords = higher confidence
  const keywordRelevanceScore = Math.min(1.0, keywords.length / 8);
  
  // Pain point opportunities
  const painPointOpportunity = Math.min(1.0, pain_points.length / 3);
  
  // Combine all factors with enhanced market intelligence weighting
  const engagementComponent = (avgScoreNormalized * 0.3 + avgCommentsNormalized * 0.25 + hasHighEngagement * 0.25 + avgEngagementRatio * 0.2);
  const volumeComponent = (postVolumeScore * 0.5 + hasDetailedDiscussions * 0.3 + recentPostsRatio * 0.2);
  const marketComponent = (keywordRelevanceScore * 0.3 + painPointOpportunity * 0.3 + marketOpportunityScore * 0.4) * trendBonus;
  
  // Final scoring with sophisticated market validation weighting
  const baseScore = (marketComponent * 0.45 + engagementComponent * 0.35 + volumeComponent * 0.2) * 10;
  
  // Realistic market-based scoring system
  const ideaHash = params.idea.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const consistentVariation = (ideaHash % 100) / 100; // 0-1 based on idea content for consistency
  
  // Detect additional market categories for scoring
  const isSaaS = tokens.some(t => ['saas','software','platform','dashboard','api','integration','subscription','cloud'].includes(t));
  const isProductivity = tokens.some(t => ['productivity','efficient','organize','manage','task','workflow','remote','collaboration'].includes(t));
  const isDesign = tokens.some(t => ['design','ui','ux','interface','prototype','figma','creative','brand'].includes(t));
  const isMarketing = tokens.some(t => ['marketing','social','media','brand','advertising','seo','content','influencer'].includes(t));
  const isRealEstate = tokens.some(t => ['real','estate','property','rent','lease','apartment','house','landlord'].includes(t));
  const isEdu = tokens.some(t => ['edu','education','learning','course','tutor','school','teach','student','university','study'].includes(t));

  // Market maturity penalties/bonuses based on competition and saturation
  const marketMaturityMultiplier = 
    isAI ? 0.8 : // AI market is saturated, harder to break through
    isFitness ? 0.75 : // Fitness market is crowded
    isSaaS ? 0.85 : // SaaS market is competitive
    isMarketing ? 0.7 : // Marketing tools are oversaturated
    isProductivity ? 0.8 : // Productivity market is crowded
    isRealEstate ? 1.1 : // Real estate tech has opportunities
    isEdu ? 1.0 : // Education market is stable
    isDesign ? 0.9 : // Design tools market is competitive
    1.0; // Other markets
  
  // Data quality scoring - penalize lack of real data heavily
  const realDataQuality = realPosts.length > 0 ? 
    Math.min(1.0, realPosts.length / 8) : // Full points for 8+ real posts
    0.3; // Major penalty for no real data
  
  // Market signal strength calculation with pain point validation
  const painPointQuality = pain_points.length > 0 ? 
    (pain_points.reduce((sum: number, p: any) => sum + (p.frequency || 50), 0) / pain_points.length) / 100 :
    0.2; // Low default if no pain points detected
  
  const marketSignalScore = (
    problemSignalStrength * 0.35 + // Problems are most important
    solutionSeekingSignal * 0.25 + // Active seeking is valuable
    costMentionSignal * 0.2 + // Willingness to pay
    competitorMentionSignal * 0.1 + // Market awareness
    painPointQuality * 0.1 // Pain point strength
  );
  
  // Content depth and engagement quality
  const contentQualityScore = (
    hasDetailedDiscussions * 0.4 + 
    hasHighEngagement * 0.3 +
    avgEngagementRatio * 0.3
  );
  
  // Calculate base market opportunity score (0-10 scale)
  const marketOpportunityBase = (
    marketSignalScore * 0.4 + // Market need signals
    contentQualityScore * 0.25 + // Discussion quality
    realDataQuality * 0.2 + // Data reliability
    (keywordRelevanceScore * painPointOpportunity) * 0.15 // Keyword relevance × pain points
  ) * 10;
  
  // Apply market maturity and trend adjustments
  const trendAdjustedScore = marketOpportunityBase * marketMaturityMultiplier * trendBonus;
  
  // Add idea-specific variation (consistent per idea)
  const ideaSpecificAdjustment = (consistentVariation - 0.5) * 2; // -1 to +1 range
  
  // Final scores with realistic distribution (2-8 typical range, exceptional cases can go higher)
  const overall_score = clamp(trendAdjustedScore + ideaSpecificAdjustment, 2.0, 8.5);
  const viability_score = clamp(overall_score + (consistentVariation - 0.5) * 1.0, 2.0, 8.5);
  
  console.log(`📈 Detailed Scoring Breakdown:`);
  console.log(`   Real Posts: ${realPosts.length}/${fetchedPosts.length} (${(realDataQuality*100).toFixed(0)}% data quality)`);
  console.log(`   Market Signals: ${(marketSignalScore*100).toFixed(0)}% Content Quality: ${(contentQualityScore*100).toFixed(0)}%`);
  console.log(`   Base Market Score: ${marketOpportunityBase.toFixed(1)} Trend Bonus: ${trendBonus.toFixed(2)}x`);
  console.log(`   Market Maturity: ${marketMaturityMultiplier.toFixed(2)}x Final Score: ${overall_score.toFixed(1)}/10`)

  // Realistic market interest calculation based on actual signals
  const marketInterestLevel = Math.round(
    (marketSignalScore * 40) + // Market signals contribute 0-40 points
    (contentQualityScore * 30) + // Content quality contributes 0-30 points  
    (realDataQuality * 20) + // Real data contributes 0-20 points
    (overall_score * 1.2) // Overall score contributes some points
  );

  const google_trends = [
    {
      keyword: keywords[0] || tokens[0] || 'startup',
      trend_direction: overall_score > 6.5 ? 'rising' : overall_score > 4.5 ? 'stable' : 'declining',
      interest_level: clamp(marketInterestLevel, 10, 95),
      related_queries: keywords.slice(1,4)
    }
  ];

  return {
    idea: params.idea,
    keywords,
    subreddits,
    sentiment_data,
    pain_points,
    app_ideas: app_ideas.map(a => ({
      title: a.title,
      description: a.description,
      market_validation: a.market_validation || (overall_score > 6.5 ? 'high' : overall_score > 4.5 ? 'medium' : 'low'),
      difficulty: a.difficulty || (isAI ? 'hard' : isFitness ? 'medium' : 'easy')
    })),
    google_trends,
    icp: {
      demographics: { age_range: isFitness ? '25-45' : isAI ? '28-40':'25-40', gender: 'Mixed', income_level: isAI ? 'High':'Middle to High', education: 'College Graduate' },
      psychographics: { interests: keywords.slice(0,3), values: ['Innovation','Efficiency','Growth'], lifestyle: isAI ? 'Tech-forward professional' : isFitness ? 'Health-conscious achiever':'Modern digital native' },
      behavioral: { pain_points: pain_points.map(p=>p.title), preferred_channels: ['Reddit','Communities','Search'], buying_behavior: 'Research & community influenced' }
    },
    problem_statements: [
      { problem: `${params.targetAudience || 'Users'} face recurring challenges related to ${params.idea.toLowerCase().split(' ').slice(0,6).join(' ')}`,
        impact: 'Leads to inefficiency and lost opportunity',
        evidence: pain_points.slice(0,3).map(p=>p.title),
        market_size: `Growing ${params.industry || 'technology'} interest signaled by community discussions` }
    ],
    financial_risks: [
      { risk_type:'Market Adoption', severity: overall_score<6 ? 'high': overall_score<8 ? 'medium':'low', description:'Need to convert curiosity into sustained usage', mitigation_strategy:'Ship focused MVP, rapid iteration, prove retention metrics' }
    ],
    competitors: competitors.map(c => ({
      name: c.name,
      description: c.description || 'Alternative solution in adjacent space',
      strengths: c.strengths || ['Brand'],
      weaknesses: c.weaknesses || ['Limited specialization'],
      market_share: c.market_share || 'Fragmented',
      pricing_model: c.pricing_model || 'Subscription'
    })),
    revenue_models: revenue_models.map(r => ({
      model_type: r.model_type,
      description: r.description,
      pros: r.pros || ['Scalable'],
      cons: r.cons || ['Churn risk'],
      implementation_difficulty: r.implementation_difficulty || (isAI ? 'hard':'medium'),
      potential_revenue: r.potential_revenue || (overall_score>7 ? 'High': overall_score>5 ? 'Medium':'Moderate')
    })),
    market_interest_level: overall_score > 6.5 ? 'high' : overall_score > 4.5 ? 'medium' : 'low',
    total_posts_analyzed: fetchedPosts.length,
    overall_score,
    viability_score
  };
}
// touch 2025-09-25T19:19:56.3254035+05:30


