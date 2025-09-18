import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeIdeaSchema, analysisResponseSchema, type AnalysisResponse } from "../shared/schema";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Perplexity API
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
if (!perplexityApiKey) {
  console.warn("PERPLEXITY_API_KEY not found - research will be limited");
} else {
  console.log("Perplexity API initialized successfully");
}

// Reddit public JSON API - with multiple fallback strategies
async function fetchRedditData(subreddit: string, limit: number = 25) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'web:startup-validator:1.0.0 (educational research)'
  ];
  
  const urls = [
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
    `https://old.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
    `https://reddit.com/r/${subreddit}.json?limit=${limit}`
  ];
  
  for (const userAgent of userAgents) {
    for (const url of urls) {
      try {
        const headers = {
          'User-Agent': userAgent,
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        };
        
        const response = await fetch(url, { headers });
        if (response.ok) {
          const data = await response.json();
          return data;
        }
        
        if (response.status === 429) {
          console.log(`Rate limited on r/${subreddit}, waiting...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }
        
      } catch (error) {
        continue; // Try next combination
      }
    }
    
    // Wait between user agent attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.warn(`JSON API methods failed for r/${subreddit}, trying HTML fallback...`);
  
  // Fallback: Use Jina.ai reader proxy to get Reddit HTML content
  try {
    const jinaUrl = `https://r.jina.ai/https://www.reddit.com/r/${subreddit}/top/?t=month`;
    const jinaHeaders = {
      'User-Agent': 'Mozilla/5.0 (compatible; StartupValidator/1.0)'
    };
    
    const response = await fetch(jinaUrl, { headers: jinaHeaders });
    if (response.ok) {
      const htmlContent = await response.text();
      return parseRedditHTML(htmlContent, subreddit);
    }
  } catch (error) {
    console.warn(`Jina.ai fallback also failed for r/${subreddit}:`, (error as Error).message);
  }
  
  return null;
}

// Parse Reddit HTML content from Jina.ai reader proxy
function parseRedditHTML(htmlContent: string, subreddit: string) {
  try {
    const posts: any[] = [];
    
    // Extract Reddit post URLs/permalinks from the HTML
    const postUrlMatches = htmlContent.match(/\/r\/\w+\/comments\/[a-z0-9]+\/[^\s"'\/]*/g) || [];
    const uniquePermalinks = Array.from(new Set(postUrlMatches));
    
    // Parse basic post info from listing page
    const lines = htmlContent.split('\n');
    let postIndex = 0;
    
    for (let i = 0; i < lines.length && postIndex < uniquePermalinks.length && postIndex < 10; i++) {
      const line = lines[i].trim();
      
      // Look for post title patterns
      if (line.length > 15 && line.length < 200 && line.match(/[A-Za-z]/) && 
          !line.includes('ago') && !line.includes('comment') && !line.includes('http')) {
        
        let score = 0;
        let comments = 0;
        let createdTime = Date.now() / 1000; // Current timestamp as fallback
        
        // Look ahead for score and comment info
        for (let j = i - 3; j <= i + 3 && j < lines.length; j++) {
          if (j >= 0) {
            const contextLine = lines[j];
            const scoreMatch = contextLine.match(/(\d+)\s+(points?|point)/);
            if (scoreMatch) score = parseInt(scoreMatch[1]);
            
            const commentMatch = contextLine.match(/(\d+)\s+comments?/);
            if (commentMatch) comments = parseInt(commentMatch[1]);
            
            const timeMatch = contextLine.match(/(\d+)\s+(hours?|days?|months?)\s+ago/);
            if (timeMatch) {
              const timeValue = parseInt(timeMatch[1]);
              const timeUnit = timeMatch[2];
              const hoursAgo = timeUnit.includes('hour') ? timeValue : 
                              timeUnit.includes('day') ? timeValue * 24 :
                              timeUnit.includes('month') ? timeValue * 24 * 30 : 1;
              createdTime = Date.now() / 1000 - (hoursAgo * 3600);
            }
          }
        }
        
        if (postIndex < uniquePermalinks.length) {
          const permalink = uniquePermalinks[postIndex];
          posts.push({
            title: line,
            selftext: '', // Will be filled by fetchRedditThread if available
            score: score,
            num_comments: comments,
            created_utc: createdTime,
            permalink: permalink,
            url: `https://reddit.com${permalink}`,
            subreddit: subreddit
          });
          postIndex++;
        }
      }
    }
    
    if (posts.length > 0) {
      console.log(`Successfully parsed ${posts.length} posts from r/${subreddit} via HTML fallback`);
      return {
        data: {
          children: posts.map(post => ({ data: post }))
        }
      };
    }
    
    return null;
  } catch (error) {
    console.warn(`Error parsing HTML for r/${subreddit}:`, (error as Error).message);
    return null;
  }
}

async function fetchRedditComments(permalink: string, limit: number = 10) {
  // Try JSON API first
  const url = `https://reddit.com${permalink}.json?limit=${limit}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; StartupValidator/1.0)',
    'Accept': 'application/json'
  };
  
  try {
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // Fall through to HTML fallback
  }
  
  // Fallback: Use Jina.ai to get thread HTML and parse comments
  try {
    const jinaUrl = `https://r.jina.ai/https://reddit.com${permalink}`;
    const jinaHeaders = {
      'User-Agent': 'Mozilla/5.0 (compatible; StartupValidator/1.0)'
    };
    
    const response = await fetch(jinaUrl, { headers: jinaHeaders });
    if (response.ok) {
      const htmlContent = await response.text();
      return parseRedditThreadHTML(htmlContent, permalink);
    }
  } catch (error) {
    console.warn(`Failed to fetch comments for ${permalink} via HTML:`, (error as Error).message);
  }
  
  return null;
}

// Parse Reddit thread HTML to extract post content and comments
function parseRedditThreadHTML(htmlContent: string, permalink: string) {
  try {
    const lines = htmlContent.split('\n');
    const comments: any[] = [];
    let postText = '';
    
    let inCommentSection = false;
    let currentComment = '';
    let commentScore = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract post content (selftext)
      if (!postText && line.length > 50 && line.length < 1000 && 
          !line.includes('comment') && !line.includes('ago') && 
          !line.includes('reddit') && line.match(/[.!?]$/)) {
        postText = line;
      }
      
      // Look for comment patterns
      if (line.includes('points') || line.includes('point')) {
        const scoreMatch = line.match(/(\d+)\s+(points?|point)/);
        if (scoreMatch) {
          commentScore = parseInt(scoreMatch[1]);
          inCommentSection = true;
        }
      }
      
      // Extract comment text
      if (inCommentSection && line.length > 20 && line.length < 500 && 
          !line.includes('reply') && !line.includes('permalink') && 
          !line.includes('ago') && line.match(/[.!?]$/)) {
        
        if (currentComment && comments.length < 5) {
          comments.push({
            data: {
              body: currentComment,
              score: commentScore,
              created_utc: Date.now() / 1000
            }
          });
        }
        
        currentComment = line;
        commentScore = 0;
        inCommentSection = false;
      }
    }
    
    // Add the last comment
    if (currentComment && comments.length < 5) {
      comments.push({
        data: {
          body: currentComment,
          score: commentScore,
          created_utc: Date.now() / 1000
        }
      });
    }
    
    return [{
      data: {
        children: [{
          data: {
            selftext: postText,
            permalink: permalink
          }
        }]
      }
    }, {
      data: {
        children: comments
      }
    }];
    
  } catch (error) {
    console.warn(`Error parsing thread HTML for ${permalink}:`, (error as Error).message);
    return null;
  }
}

// Premium verification middleware
function checkPremiumAccess(req: any, res: any, next: any) {
  // In development, allow all premium features
  if (process.env.NODE_ENV === 'development') {
    req.isPremium = true;
    return next();
  }
  
  // In production, check for premium status (placeholder for real auth)
  const premiumHeader = req.headers['x-premium-access'];
  req.isPremium = premiumHeader === 'true'; // In real implementation, verify JWT/session
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Premium status endpoint
  app.get('/api/premium-status', checkPremiumAccess, (req: any, res) => {
    res.json({ 
      isPremium: req.isPremium,
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Startup Idea Analysis Route
  app.post("/api/analyze", checkPremiumAccess, async (req, res) => {
    const requestId = Date.now();
    console.log(`[${requestId}] Starting analysis request`);
    
    try {
      const validatedData = analyzeIdeaSchema.parse(req.body);
      
      console.log(`[${requestId}] Analyzing startup idea:`, validatedData);
      
      // Step 1: Use sophisticated web research analyst to create research plan
      const researchAnalystPrompt = `ROLE: You are a web research analyst. Work step-by-step:

1. UNDERSTAND — Problem framing
- Startup idea: ${validatedData.idea}
- Audience: ${validatedData.targetAudience || "General users"}
- Industry: ${validatedData.industry || "Technology"}
- Geography: Global
- Platform: Web/Mobile
- Time window to prioritize: Last 12 months
- Goal: Comprehensive market validation

2. ANALYSE — Scope the evidence we need
- Real user pains & solution requests (esp. Reddit discussions).
- Product review verbatims (G2, Amazon, Trustpilot, etc.).
- Competitor list and differentiators (pricing, positioning).
- Search demand signals (keywords, intent, trends).
- Buyer personas (jobs-to-be-done, triggers, obstacles).

3. REASON — Search plan & queries
Run diverse queries; prefer recent content. Use variations with and without quotes.
- Reddit pain discovery:
  site:reddit.com "{core problem keywords}"  |  site:reddit.com "anyone else" {keywords}
  site:reddit.com/r/* "{product type}" alternatives  |  site:reddit.com "{use case}" "frustrating"
- Reviews & social proof:
  "site:g2.com OR site:trustpilot.com OR site:amazon.com" "{product/competitor}"
- Competitors:
  "{product type} alternatives"  |  "best {product type} tools"  |  "vs" comparisons
- Demand:
  "{use case} how to"  |  "{problem} app"  |  "{category} software"  |  long-tail variants
Adjust keywords to the user's audience/geo/platform.

4. SYNTHESIS — Return a single JSON object (no Markdown) with these top-level keys:
{
  "meta": {
    "idea": "...",
    "industry": "...",
    "geo": "...",
    "platform": "...",
    "time_range": "...",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "subreddits": ["subreddit1", "subreddit2", "subreddit3"]
  },
  "research_queries": [
    "specific search query 1",
    "specific search query 2",
    "specific search query 3",
    "specific search query 4",
    "specific search query 5"
  ],
  "expected_data": {
    "pains": "User pain points and frustrations",
    "competitors": "Existing solutions and alternatives",
    "demand_signals": "Search trends and user interest",
    "personas": "Target user archetypes"
  }
}

REQUIREMENTS
- Generate 5 specific, targeted search queries for Perplexity
- Focus on Reddit, G2, Amazon reviews, Trustpilot, Product Hunt, Hacker News
- Prefer public sources with rich user discourse
- De-duplicate aggressively

5. CONCLUDE — Before returning, validate:
- Every query targets specific pain points or market insights
- Queries cover different aspects: problems, competitors, demand, reviews`;

      console.log(`[${requestId}] Generating sophisticated research plan...`);
      
      // Using gpt-4o-mini for reliable API compatibility
      const researchPlanCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a web research analyst expert at creating comprehensive market research plans. Always respond with valid JSON in the exact format requested."
          },
          {
            role: "user",
            content: researchAnalystPrompt
          }
        ],
        max_completion_tokens: 3000,
        response_format: { type: "json_object" },
      });

      // Robust JSON parsing with fallbacks
      let researchPlan;
      try {
        const rawContent = researchPlanCompletion.choices[0].message.content || '{"research_queries": []}';
        console.log("Raw research plan response:", rawContent.substring(0, 200) + "...");
        researchPlan = JSON.parse(rawContent);
      } catch (parseError) {
        console.warn("Failed to parse research plan JSON:", parseError);
        researchPlan = { research_queries: [] };
      }
      
      const searchQueries = researchPlan.research_queries || [
        `${validatedData.idea} market research pain points user feedback`,
        `startup ideas similar to "${validatedData.idea}" competition analysis`,
        `problems with current solutions user complaints`,
        `user feedback reviews ${validatedData.industry} industry`,
        `${validatedData.targetAudience} needs ${validatedData.idea}`
      ];

      console.log(`[${requestId}] Generated research plan:`, researchPlan.meta);
      console.log(`[${requestId}] Research queries:`, searchQueries);
      
      // Extract keywords for fallback use
      const keywords = researchPlan.meta?.keywords || [validatedData.idea.split(' ')[0], "startup", "business"];
      const subreddits = researchPlan.meta?.subreddits || ["startups", "entrepreneur", "business"];

      // Step 2: Use Perplexity for comprehensive internet research
      let researchData = "";
      let totalSearches = 0;
      
      if (perplexityApiKey) {
        console.log(`[${requestId}] Starting comprehensive market research with Perplexity...`);
        
        try {
          const comprehensiveQuery = `Research the startup idea "${validatedData.idea}" in the ${validatedData.industry || "Technology"} industry for ${validatedData.targetAudience || "General users"}. 

Provide a comprehensive JSON research report with the following structure:
{
  "pain_points": [
    {
      "title": "pain point title",
      "frequency": "how often mentioned",
      "user_quotes": [{"text": "exact user quote", "source": "URL"}],
      "urgency": "high/medium/low"
    }
  ],
  "competitors": [
    {
      "name": "competitor name",
      "what_they_do": "description",
      "pricing": "pricing info",
      "user_sentiment": "positive/negative/mixed",
      "source_url": "URL"
    }
  ],
  "demand_signals": {
    "search_trends": "trend analysis",
    "reddit_discussions": [{"title": "discussion title", "url": "URL", "sentiment": "positive/negative/neutral"}],
    "social_proof": ["evidence of demand"]
  },
  "market_validation": {
    "opportunity_size": "assessment",
    "competition_level": "high/medium/low",
    "user_willingness_to_pay": "assessment",
    "implementation_difficulty": "easy/medium/hard"
  }
}

Focus on Reddit discussions, G2 reviews, Amazon reviews, Trustpilot, Product Hunt, and Hacker News. Prioritize recent content from the last 12 months. Include specific user quotes with source URLs whenever possible.`;

          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${perplexityApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'sonar',
              messages: [
                {
                  role: 'system',
                  content: 'You are a market research expert. Provide comprehensive research in valid JSON format. Always include specific user quotes with source URLs when available. Focus on real user feedback and market validation data from Reddit, G2, Amazon, Trustpilot, Product Hunt, and similar platforms.'
                },
                {
                  role: 'user',
                  content: comprehensiveQuery
                }
              ],
              max_tokens: 3000,
              temperature: 0.2,
              search_recency_filter: 'year',
              return_citations: true
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';
            const citations = data.citations || [];
            
            researchData = content;
            totalSearches = 1;
            
            // Safely handle citations array
            if (Array.isArray(citations) && citations.length > 0) {
              const citationUrls = citations.slice(0, 5).map(citation => 
                typeof citation === 'string' ? citation : citation?.url || 'Unknown source'
              );
              researchData += `\n\nSOURCES: ${citationUrls.join(', ')}\n`;
            }
            
            console.log(`[${requestId}] Comprehensive Perplexity research completed`);
          } else {
            const errorText = await response.text();
            console.warn(`[${requestId}] Perplexity API request failed:`, response.status, errorText);
          }
          
        } catch (error) {
          console.warn(`[${requestId}] Failed to complete Perplexity research:`, error);
        }
      } else {
        console.log(`[${requestId}] Perplexity API not available - using AI-generated insights`);
      }

      // Step 2.5: Scrape real Reddit data for authentic sentiment analysis
      let redditData = "";
      let redditPosts: any[] = [];
      let totalRedditPosts = 0;
      
      if (subreddits.length > 0) {
        console.log(`[${requestId}] Starting Reddit scraping from subreddits:`, subreddits);
        
        try {
          // Search each subreddit for relevant posts using public JSON API
          for (const subredditName of subreddits.slice(0, 3)) { // Limit to 3 subreddits to avoid rate limits
            const cleanSubreddit = subredditName.replace('r/', '');
            try {
              console.log(`[${requestId}] Scraping r/${cleanSubreddit}...`);
              
              // Get hot posts from the subreddit
              const subredditData = await fetchRedditData(cleanSubreddit, 25);
              
              if (subredditData && subredditData.data && subredditData.data.children) {
                const posts = subredditData.data.children;
                
                // Filter posts that are relevant to our keywords
                const relevantPosts = posts.filter((post: any) => {
                  const postData = post.data;
                  const title = (postData.title || '').toLowerCase();
                  const text = (postData.selftext || '').toLowerCase();
                  const combinedText = title + ' ' + text;
                  
                  // Check if post contains any of our keywords
                  return keywords.some((keyword: string) => 
                    combinedText.includes(keyword.toLowerCase())
                  );
                }).slice(0, 10); // Limit to 10 relevant posts per subreddit
                
                for (const post of relevantPosts) {
                  if (totalRedditPosts >= 15) break;
                  
                  const postData = post.data;
                  try {
                    // Get post comments using public JSON API
                    const commentsData = await fetchRedditComments(postData.permalink, 10);
                    
                    let comments: any[] = [];
                    let threadSelftext = '';
                    
                    if (commentsData && Array.isArray(commentsData) && commentsData.length > 1) {
                      // Extract thread selftext from HTML fallback data
                      if (commentsData[0] && commentsData[0].data && commentsData[0].data.children && 
                          commentsData[0].data.children[0] && commentsData[0].data.children[0].data) {
                        threadSelftext = commentsData[0].data.children[0].data.selftext || '';
                      }
                      
                      const commentsSection = commentsData[1];
                      if (commentsSection.data && commentsSection.data.children) {
                        comments = commentsSection.data.children
                          .slice(0, 5) // Top 5 comments
                          .map((comment: any) => ({
                            text: comment.data.body || '',
                            score: comment.data.score || 0,
                            created: new Date((comment.data.created_utc || 0) * 1000).toISOString()
                          }))
                          .filter((comment: any) => 
                            comment.text && 
                            comment.text !== '[deleted]' && 
                            comment.text !== '[removed]' &&
                            comment.text.trim().length > 0
                          );
                      }
                    }
                    
                    const processedPost = {
                      title: postData.title || '',
                      text: threadSelftext || postData.selftext || '',
                      score: postData.score || 0,
                      num_comments: postData.num_comments || 0,
                      created: new Date((postData.created_utc || 0) * 1000).toISOString(),
                      url: `https://reddit.com${postData.permalink}`,
                      subreddit: cleanSubreddit,
                      comments: comments
                    };
                    
                    redditPosts.push(processedPost);
                    totalRedditPosts++;
                    
                    // Rate limiting between posts
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                  } catch (postError) {
                    console.warn(`[${requestId}] Error processing post:`, (postError as Error).message);
                  }
                }
              }
              
              if (totalRedditPosts >= 15) break;
              
              // Rate limiting - wait between subreddit requests
              await new Promise(resolve => setTimeout(resolve, 1500));
              
            } catch (subredditError) {
              console.warn(`[${requestId}] Error scraping r/${cleanSubreddit}:`, (subredditError as Error).message);
            }
          }
          
          if (redditPosts.length > 0) {
            redditData = `REAL REDDIT SENTIMENT DATA (${redditPosts.length} posts analyzed):

${redditPosts.map(post => `
SUBREDDIT: r/${post.subreddit}
TITLE: ${post.title}
TEXT: ${post.text.substring(0, 300)}${post.text.length > 300 ? '...' : ''}
SCORE: ${post.score} | COMMENTS: ${post.num_comments}
URL: ${post.url}
TOP COMMENTS:
${post.comments.map((comment: any) => `- ${comment.text.substring(0, 150)}${comment.text.length > 150 ? '...' : ''} (Score: ${comment.score})`).join('\n')}
`).join('\n---\n')}`;
            
            console.log(`[${requestId}] Reddit scraping completed: ${redditPosts.length} posts from ${subreddits.length} subreddits`);
          } else {
            console.log(`[${requestId}] No relevant Reddit posts found`);
          }
          
        } catch (error) {
          console.warn(`[${requestId}] Reddit scraping failed:`, (error as Error).message);
        }
      } else {
        console.log(`[${requestId}] No subreddits identified - skipping Reddit scraping`);
      }

      // Step 3: Use 'Startup Validation Expert' prompt to synthesize Perplexity + Reddit results
      const hasResearchData = researchData.length > 0;
      const hasRedditData = redditData.length > 0;
      
      // Create structured research JSON for the validation expert
      const researchJson = {
        meta: {
          idea: validatedData.idea,
          industry: validatedData.industry || "Technology",
          target_audience: validatedData.targetAudience || "General users",
          time_range: "Last 12 months",
          total_queries: totalSearches,
          reddit_posts_analyzed: totalRedditPosts,
          data_quality: hasResearchData && hasRedditData ? "comprehensive" : hasResearchData || hasRedditData ? "partial" : "limited"
        },
        research_findings: researchData,
        reddit_sentiment_data: redditData,
        keywords: keywords,
        citations: hasResearchData || hasRedditData ? 
          `Based on ${totalSearches} research queries + ${totalRedditPosts} real Reddit posts` : 
          "AI-generated insights"
      };

      const validationExpertPrompt = `You are a startup validation expert. Using ONLY the evidence and citations from research_json, produce a comprehensive validation report.

research_json: ${JSON.stringify(researchJson, null, 2)}

Produce a JSON response with the following structure for a structured startup validation report:

{
  "title": "Startup Validation Report — ${validatedData.idea}",
  "overview_viability": {
    "summary": "One paragraph: what people are trying to accomplish, the top 1–2 pains, and whether demand looks promising",
    "confidence_band": "Low/Med/High",
    "key_citations": ["citation 1", "citation 2"]
  },
  "problem_clusters": [
    {
      "cluster_name": "theme label",
      "quotes": [{"text": "short quote ≤30 words", "source": "source link"}],
      "implication": "one-line implication for the product"
    }
  ],
  "demand_signals": {
    "trend_summary": "12-month trend shape from research",
    "seasonality": "seasonal patterns if any",
    "keywords": [{"term": "keyword", "intent": "informational|commercial|transactional", "notes": "additional context"}]
  },
  "competitive_landscape": {
    "top_incumbent": "most relevant competitor",
    "what_they_do_well": "their strengths",
    "key_gap": "main opportunity gap",
    "source_link": "reference link"
  },
  "keywords": ${JSON.stringify(keywords)},
  "subreddits": ${JSON.stringify(subreddits)},
  "sentiment_data": [
    {"name": "Enthusiastic", "value": 45, "color": "hsl(var(--chart-2))", "description": "Users excited about solutions"},
    {"name": "Curious/Mixed", "value": 35, "color": "hsl(var(--chart-3))", "description": "Users asking questions or comparing options"},
    {"name": "Frustrated", "value": 20, "color": "hsl(var(--destructive))", "description": "Users complaining about current solutions"}
  ],
  "pain_points": [
    {"title": "pain point title", "frequency": 85, "urgency": "high", "examples": ["user quote 1", "user quote 2"]}
  ],
  "app_ideas": [
    {"title": "app idea", "description": "description based on research", "market_validation": "high", "difficulty": "medium"}
  ],
  "google_trends": [
    {"keyword": "relevant keyword", "trend_direction": "rising|stable|declining", "interest_level": 75, "related_queries": ["related query 1", "related query 2"]}
  ],
  "icp": {
    "demographics": {
      "age_range": "25-45",
      "gender": "Mixed/Male/Female", 
      "income_level": "Middle to High income",
      "education": "College Graduate"
    },
    "psychographics": {
      "interests": ["interest 1", "interest 2", "interest 3"],
      "values": ["value 1", "value 2"],
      "lifestyle": "lifestyle description"
    },
    "behavioral": {
      "pain_points": ["behavioral pain 1", "behavioral pain 2"],
      "preferred_channels": ["channel 1", "channel 2"],
      "buying_behavior": "buying behavior description"
    }
  },
  "problem_statements": [
    {
      "problem": "Clear problem statement based on research",
      "impact": "Impact description with business implications",
      "evidence": ["evidence 1 from research", "evidence 2 from research"],
      "market_size": "Market size assessment"
    }
  ],
  "financial_risks": [
    {
      "risk_type": "Risk category (e.g., Market Risk, Operational Risk)",
      "severity": "high|medium|low",
      "description": "Detailed risk description",
      "mitigation_strategy": "Strategy to mitigate this risk"
    }
  ],
  "competitors": [
    {
      "name": "Competitor name",
      "description": "What they do and their positioning",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "market_share": "Market share assessment",
      "pricing_model": "Their pricing approach"
    }
  ],
  "revenue_models": [
    {
      "model_type": "Revenue model name (e.g., SaaS, Freemium, Marketplace)",
      "description": "How this model works for this business",
      "pros": ["advantage 1", "advantage 2"],
      "cons": ["disadvantage 1", "disadvantage 2"],
      "implementation_difficulty": "easy|medium|hard",
      "potential_revenue": "Revenue potential assessment"
    }
  ],
  "market_interest_level": "high|medium|low",
  "total_posts_analyzed": ${totalSearches},
  "overall_score": 7.5,
  "viability_score": 6.8
}

RULES:
- Every claim must link to evidence from research_json
- Generate REAL analysis for ALL sections including sentiment_data, google_trends, icp, problem_statements, financial_risks, competitors, and revenue_models
- For sentiment_data: ${hasRedditData ? `ANALYZE THE REAL REDDIT DATA in reddit_sentiment_data to calculate genuine sentiment percentages. Count the positive, negative, and neutral sentiments from the ${totalRedditPosts} actual Reddit posts and comments provided` : 'Generate realistic sentiment based on the research data'}
- For pain_points: Extract real user quotes from the Reddit posts and comments in reddit_sentiment_data
- For google_trends: analyze actual search patterns and trending keywords related to the startup idea
- For icp: create detailed customer profiles based on the target market research
- For problem_statements: extract real problems from user feedback and research data
- For financial_risks: identify genuine business and financial risks for this specific startup
- For competitors: analyze real competitors found in research or similar market players
- For revenue_models: suggest appropriate revenue models for this specific business type
- If research_json lacks data for a section, generate realistic insights based on the startup idea and industry knowledge
- Tone: pragmatic, no hype; bullets over paragraphs
- Use real quotes and insights from the research data when available
- ${hasResearchData || hasRedditData ? `Base analysis on the ${hasRedditData ? 'real Reddit data + ' : ''}comprehensive research data provided` : 'Generate realistic insights based on the startup idea and market knowledge'}
- DO NOT use placeholder or demo data - generate authentic analysis for each section based on the real data provided`;

      // Using gpt-4o-mini for reliable API compatibility
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert market researcher specializing in startup validation. Always respond with valid JSON in the exact format requested. Do not include any text outside the JSON structure."
          },
          {
            role: "user",
            content: validationExpertPrompt
          }
        ],
        max_completion_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const rawContent = completion.choices[0].message.content || "{}";
      
      // Comprehensive validation and error handling for OpenAI response
      let analysisResult: AnalysisResponse;
      try {
        // Remove potential code fences if present
        const cleanedContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
        const parsedContent = JSON.parse(cleanedContent);
        
        // For now, we'll structure the response to match our current frontend expectations
        // Later we can update the frontend to handle the new validation report structure
        const legacyStructuredResponse = {
          keywords: parsedContent.keywords || keywords,
          subreddits: parsedContent.subreddits || subreddits,
          sentiment_data: parsedContent.sentiment_data || [
            {"name": "Enthusiastic", "value": 40, "color": "hsl(var(--chart-2))", "description": "Users excited about solutions"},
            {"name": "Curious/Mixed", "value": 35, "color": "hsl(var(--chart-3))", "description": "Users asking questions or comparing options"},
            {"name": "Frustrated", "value": 25, "color": "hsl(var(--destructive))", "description": "Users complaining about current solutions"}
          ],
          pain_points: parsedContent.pain_points || [
            {"title": "Market validation challenges", "frequency": 75, "urgency": "medium", "examples": ["Need better market research", "Uncertain about demand"]}
          ],
          app_ideas: parsedContent.app_ideas || [
            {"title": "Market Research Tool", "description": "AI-powered startup validation platform", "market_validation": "medium", "difficulty": "medium"}
          ],
          google_trends: parsedContent.google_trends || [
            {"keyword": validatedData.idea.split(' ')[0], "trend_direction": "stable", "interest_level": 50, "related_queries": ["market research", "startup validation"]}
          ],
          icp: parsedContent.icp || {
            demographics: {
              age_range: "25-40",
              gender: "Mixed",
              income_level: "Middle to High",
              education: "College Graduate"
            },
            psychographics: {
              interests: ["Technology", "Entrepreneurship", "Innovation"],
              values: ["Efficiency", "Growth", "Quality"],
              lifestyle: "Tech-savvy professionals"
            },
            behavioral: {
              pain_points: ["Market validation challenges", "Limited research time"],
              preferred_channels: ["Online search", "Social media", "Professional networks"],
              buying_behavior: "Research-driven decision making"
            }
          },
          problem_statements: parsedContent.problem_statements || [
            {
              problem: "Entrepreneurs struggle to validate their startup ideas effectively",
              impact: "High failure rates and wasted resources in startup development",
              evidence: ["High startup failure statistics", "Limited access to market research"],
              market_size: "Multi-billion dollar startup ecosystem"
            }
          ],
          financial_risks: parsedContent.financial_risks || [
            {
              risk_type: "Market Risk",
              severity: "medium",
              description: "Uncertainty about market demand and competition",
              mitigation_strategy: "Conduct thorough market research and start with MVP"
            }
          ],
          competitors: parsedContent.competitors || [
            {
              name: "Traditional Market Research",
              description: "Established market research firms and tools",
              strengths: ["Experience", "Established methods"],
              weaknesses: ["Expensive", "Time-consuming"],
              market_share: "Significant",
              pricing_model: "High-cost consulting"
            }
          ],
          revenue_models: parsedContent.revenue_models || [
            {
              model_type: "Freemium",
              description: "Basic features free, premium features paid",
              pros: ["Low barrier to entry", "User acquisition"],
              cons: ["Lower conversion rates", "Higher support costs"],
              implementation_difficulty: "medium",
              potential_revenue: "Moderate with scale"
            }
          ],
          market_interest_level: parsedContent.market_interest_level || "medium",
          total_posts_analyzed: totalSearches || 0,
          overall_score: typeof parsedContent.overall_score === 'number' && parsedContent.overall_score >= 1 && parsedContent.overall_score <= 10 
            ? parsedContent.overall_score 
            : 5.0,
          viability_score: typeof parsedContent.viability_score === 'number' && parsedContent.viability_score >= 1 && parsedContent.viability_score <= 10 
            ? parsedContent.viability_score 
            : 5.0,
          // Store the full validation report for future use
          validation_report: parsedContent
        };
        
        const validationResult = analysisResponseSchema.safeParse(legacyStructuredResponse);
        
        if (!validationResult.success) {
          console.warn("OpenAI response validation failed:", validationResult.error);
          
          // Provide robust fallbacks for critical fields to prevent UI crashes
          analysisResult = {
            keywords: parsedContent.keywords || keywords,
            subreddits: parsedContent.subreddits || subreddits,
            sentiment_data: parsedContent.sentiment_data || [
              {"name": "Enthusiastic", "value": 40, "color": "hsl(var(--chart-2))", "description": "Users excited about solutions"},
              {"name": "Curious/Mixed", "value": 35, "color": "hsl(var(--chart-3))", "description": "Users asking questions or comparing options"},
              {"name": "Frustrated", "value": 25, "color": "hsl(var(--destructive))", "description": "Users complaining about current solutions"}
            ],
            pain_points: parsedContent.pain_points || [
              {"title": "Limited market research data", "frequency": 75, "urgency": "medium", "examples": ["Need more validation", "Uncertain about demand"]}
            ],
            app_ideas: parsedContent.app_ideas || [
              {"title": "Market Research Tool", "description": "A tool to validate startup ideas", "market_validation": "medium", "difficulty": "medium"}
            ],
            google_trends: parsedContent.google_trends || [
              {"keyword": validatedData.idea.split(' ')[0], "trend_direction": "stable", "interest_level": 50, "related_queries": ["market research", "startup validation"]}
            ],
            icp: parsedContent.icp || {
              demographics: {
                age_range: "25-40",
                gender: "Mixed",
                income_level: "Middle to High",
                education: "College Graduate"
              },
              psychographics: {
                interests: ["Technology", "Entrepreneurship", "Innovation"],
                values: ["Efficiency", "Growth", "Quality"],
                lifestyle: "Tech-savvy professionals"
              },
              behavioral: {
                pain_points: ["Market validation challenges", "Limited research time"],
                preferred_channels: ["Online search", "Social media", "Professional networks"],
                buying_behavior: "Research-driven decision making"
              }
            },
            problem_statements: parsedContent.problem_statements || [
              {
                problem: "Entrepreneurs struggle to validate their startup ideas effectively",
                impact: "High failure rates and wasted resources in startup development",
                evidence: ["High startup failure statistics", "Limited access to market research"],
                market_size: "Multi-billion dollar startup ecosystem"
              }
            ],
            financial_risks: parsedContent.financial_risks || [
              {
                risk_type: "Market Risk",
                severity: "medium",
                description: "Uncertainty about market demand and competition",
                mitigation_strategy: "Conduct thorough market research and start with MVP"
              }
            ],
            competitors: parsedContent.competitors || [
              {
                name: "Traditional Market Research",
                description: "Established market research firms and tools",
                strengths: ["Experience", "Established methods"],
                weaknesses: ["Expensive", "Time-consuming"],
                market_share: "Significant",
                pricing_model: "High-cost consulting"
              }
            ],
            revenue_models: parsedContent.revenue_models || [
              {
                model_type: "Freemium",
                description: "Basic features free, premium features paid",
                pros: ["Low barrier to entry", "User acquisition"],
                cons: ["Lower conversion rates", "Higher support costs"],
                implementation_difficulty: "medium",
                potential_revenue: "Moderate with scale"
              }
            ],
            market_interest_level: parsedContent.market_interest_level || "medium",
            total_posts_analyzed: totalSearches || 0,
            // Critical: Ensure scores are always valid numbers to prevent UI crashes
            overall_score: typeof parsedContent.overall_score === 'number' && parsedContent.overall_score >= 1 && parsedContent.overall_score <= 10 
              ? parsedContent.overall_score 
              : 5.0,
            viability_score: typeof parsedContent.viability_score === 'number' && parsedContent.viability_score >= 1 && parsedContent.viability_score <= 10 
              ? parsedContent.viability_score 
              : 5.0,
          };
          // Store the full validation report for future use
          (analysisResult as any).validation_report = parsedContent;
          console.log("Using fallback values for invalid AI response");
        } else {
          // Success path: preserve the full validation report alongside validated data
          analysisResult = validationResult.data;
          // Store the full validation report for future use
          (analysisResult as any).validation_report = parsedContent;
        }
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError);
        throw new Error("Invalid JSON response format from AI service");
      }
      
      console.log(`[${requestId}] Analysis completed successfully`);
      console.log(`[${requestId}] Overall score: ${analysisResult.overall_score}, Viability score: ${analysisResult.viability_score}`);
      
      res.json(analysisResult);
      
    } catch (error) {
      console.error(`[${requestId}] Analysis error:`, error);
      res.status(500).json({ 
        error: "Failed to analyze startup idea",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}