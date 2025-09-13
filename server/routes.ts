import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeIdeaSchema, analysisResponseSchema, type AnalysisResponse } from "../shared/schema";
import OpenAI from 'openai';
import Snoowrap from 'snoowrap';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || 'StartupValidator:v1.0',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Startup Idea Analysis Route
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = analyzeIdeaSchema.parse(req.body);
      
      console.log("Analyzing startup idea:", validatedData);
      
      // Step 1: Generate relevant keywords and subreddits using AI
      const keywordPrompt = `Analyze this startup idea and generate the best search terms and communities for market research:

Startup Idea: "${validatedData.idea}"
Industry: ${validatedData.industry || "Not specified"}
Target Audience: ${validatedData.targetAudience || "Not specified"}

Please provide a JSON response with:
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "subreddits": ["subreddit1", "subreddit2", "subreddit3", "subreddit4", "subreddit5"]
}

Generate 5 highly relevant keywords that users would use when discussing this problem/solution.
Generate 5 subreddit names (without r/ prefix) where this startup idea would be discussed.
Make sure all subreddit names are real, active Reddit communities.`;

      const keywordCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at finding relevant keywords and communities for market research. Always respond with valid JSON in the exact format requested."
          },
          {
            role: "user",
            content: keywordPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const keywordResponse = JSON.parse(keywordCompletion.choices[0].message.content || '{"keywords": [], "subreddits": []}');
      const keywords = keywordResponse.keywords || ["startup", "business", "product"];
      const subreddits = keywordResponse.subreddits || ["startups", "entrepreneur", "business"];

      console.log("Generated keywords:", keywords);
      console.log("Target subreddits:", subreddits);

      // Step 2: Scrape real Reddit data
      const allPosts: any[] = [];
      const searchQueries = keywords.slice(0, 3); // Use top 3 keywords
      const targetSubreddits = subreddits.slice(0, 3); // Use top 3 subreddits

      for (const subreddit of targetSubreddits) {
        try {
          console.log(`Scraping r/${subreddit}...`);
          
          // Search recent posts in this subreddit
          const posts = await reddit.getSubreddit(subreddit).getNew({ limit: 20 });
          
          for (const post of posts) {
            // Check if post is relevant to our keywords
            const title = post.title.toLowerCase();
            const selftext = (post.selftext || '').toLowerCase();
            const isRelevant = searchQueries.some((keyword: string) => 
              title.includes(keyword.toLowerCase()) || selftext.includes(keyword.toLowerCase())
            );
            
            if (isRelevant) {
              // Get top comments for additional insights
              const comments = await post.comments.fetchAll({ limit: 5 });
              
              allPosts.push({
                title: post.title,
                content: post.selftext || '',
                score: post.score,
                subreddit: subreddit,
                comments: comments.slice(0, 5).map((comment: any) => ({
                  body: comment.body || '',
                  score: comment.score || 0
                }))
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to scrape r/${subreddit}:`, error);
        }
      }

      // Also search across Reddit for our top keywords
      for (const keyword of searchQueries.slice(0, 2)) {
        try {
          console.log(`Searching Reddit for "${keyword}"...`);
          const searchResults = await reddit.search({
            query: keyword,
            sort: 'relevance',
            time: 'month',
            limit: 10
          });

          for (const post of searchResults) {
            const comments = await post.comments.fetchAll({ limit: 3 });
            
            allPosts.push({
              title: post.title,
              content: post.selftext || '',
              score: post.score,
              subreddit: post.subreddit.display_name,
              comments: comments.slice(0, 3).map((comment: any) => ({
                body: comment.body || '',
                score: comment.score || 0
              }))
            });
          }
        } catch (error) {
          console.warn(`Failed to search for "${keyword}":`, error);
        }
      }

      console.log(`Collected ${allPosts.length} relevant posts from Reddit`);

      // Step 3: Analyze the real Reddit data with AI
      const analysisPrompt = `Analyze this real Reddit data for market research insights:

Startup Idea: "${validatedData.idea}"

Real Reddit Posts and Comments:
${allPosts.slice(0, 15).map((post, i) => `
Post ${i + 1} (r/${post.subreddit}, Score: ${post.score}):
Title: ${post.title}
Content: ${post.content.slice(0, 300)}
Comments: ${post.comments.map((c: any) => c.body.slice(0, 100)).join(' | ')}
`).join('\n')}

Keywords used: ${keywords.join(', ')}
Subreddits analyzed: ${subreddits.join(', ')}
Total posts collected: ${allPosts.length}

Based on this REAL Reddit data, please provide a JSON response with:
{
  "keywords": ${JSON.stringify(keywords)},
  "subreddits": ${JSON.stringify(subreddits)},
  "sentiment_data": [
    {"name": "Enthusiastic", "value": 45, "color": "hsl(var(--chart-2))", "description": "Users excited about solutions and expressing strong interest"},
    {"name": "Curious/Mixed", "value": 35, "color": "hsl(var(--chart-3))", "description": "Users asking questions, comparing options, or expressing moderate interest"},
    {"name": "Frustrated", "value": 20, "color": "hsl(var(--destructive))", "description": "Users complaining about current solutions or expressing dissatisfaction"}
  ],
  "pain_points": [
    {"title": "Pain point 1", "frequency": 85, "urgency": "high", "examples": ["Example quote 1", "Example quote 2"]},
    {"title": "Pain point 2", "frequency": 70, "urgency": "medium", "examples": ["Example quote 3", "Example quote 4"]}
  ],
  "app_ideas": [
    {"title": "App idea 1", "description": "Description of the app", "market_validation": "high", "difficulty": "medium"},
    {"title": "App idea 2", "description": "Description of the app", "market_validation": "medium", "difficulty": "easy"}
  ],
  "market_interest_level": "high",
  "total_posts_analyzed": ${allPosts.length},
  "overall_score": 7.5,
  "viability_score": 6.8
}

Instructions:
1. Analyze the sentiment of the real Reddit comments and posts to create accurate sentiment_data percentages that add up to 100%
2. Extract real pain points mentioned in the posts/comments with actual quotes as examples
3. Generate realistic app ideas based on the problems discussed in the real data
4. Base market_interest_level on the actual engagement (scores, comment counts) from Reddit
5. Set total_posts_analyzed to the actual number: ${allPosts.length}
6. Generate overall_score (1-10) based on real market demand evidence from Reddit
7. Generate viability_score (1-10) considering technical complexity and market barriers mentioned in posts

Make your analysis based on the REAL Reddit data provided, not generic assumptions.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert market researcher analyzing real Reddit data. Always respond with valid JSON in the exact format requested. Base your analysis on the actual Reddit posts and comments provided."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const rawContent = completion.choices[0].message.content || "{}";
      
      // Comprehensive validation and error handling for OpenAI response
      let analysisResult: AnalysisResponse;
      try {
        // Remove potential code fences if present
        const cleanedContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
        const parsedContent = JSON.parse(cleanedContent);
        
        // Use Zod validation to ensure all required fields are present and valid
        const validationResult = analysisResponseSchema.safeParse(parsedContent);
        
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
            market_interest_level: parsedContent.market_interest_level || "medium",
            total_posts_analyzed: allPosts.length,
            // Critical: Ensure scores are always valid numbers to prevent UI crashes
            overall_score: typeof parsedContent.overall_score === 'number' && parsedContent.overall_score >= 1 && parsedContent.overall_score <= 10 
              ? parsedContent.overall_score 
              : 5.0,
            viability_score: typeof parsedContent.viability_score === 'number' && parsedContent.viability_score >= 1 && parsedContent.viability_score <= 10 
              ? parsedContent.viability_score 
              : 5.0,
          };
          console.log("Using fallback values for invalid AI response");
        } else {
          analysisResult = validationResult.data;
        }
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError);
        throw new Error("Invalid JSON response format from AI service");
      }
      
      console.log("Analysis completed:", analysisResult);
      
      res.json(analysisResult);
      
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ 
        error: "Failed to analyze startup idea",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}