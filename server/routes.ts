import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeIdeaSchema, analysisResponseSchema, type AnalysisResponse } from "../shared/schema";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Startup Idea Analysis Route
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = analyzeIdeaSchema.parse(req.body);
      
      console.log("Analyzing startup idea:", validatedData);
      
      // Create the analysis prompt for OpenAI
      const prompt = `Analyze this startup idea for Reddit market research:

Startup Idea: "${validatedData.idea}"
Industry: ${validatedData.industry || "Not specified"}
Target Audience: ${validatedData.targetAudience || "Not specified"}
Country: ${validatedData.country || "global"}
Platform: ${validatedData.platform || "web-app"}
Funding Method: ${validatedData.fundingMethod || "self-funded"}
Time Range: Analyze discussions from the past ${validatedData.timeRange || "month"}

Please provide a JSON response with the following structure:
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "subreddits": ["subreddit1", "subreddit2", "subreddit3", "subreddit4", "subreddit5"],
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
  "total_posts_analyzed": 2847,
  "overall_score": 7.5,
  "viability_score": 6.8
}

Instructions:
1. Generate 5 relevant keywords for searching Reddit discussions
2. Suggest 5 relevant subreddits where this startup idea would be discussed
3. Create realistic sentiment analysis data that adds up to 100%
4. Identify 3-5 key pain points with realistic frequency scores and urgency levels
5. Generate 3-4 app ideas related to this startup concept with market_validation as "high", "medium", or "low"
6. Assess overall market interest level (low/medium/high)
7. Provide a realistic number for posts analyzed (1000-5000 range)
8. Generate overall_score (1-10): Rate how good/bad the startup idea is overall based on market demand, competition, and potential
9. Generate viability_score (1-10): Rate how easy/difficult it would be to bring this idea to life considering technical complexity, resources needed, market barriers, and scale challenges

Make sure all subreddit names are realistic Reddit communities (without r/ prefix) and all data is relevant to the specific startup idea provided.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert market researcher specializing in Reddit community analysis. Always respond with valid JSON in the exact format requested. Do not include any text outside the JSON structure."
          },
          {
            role: "user",
            content: prompt
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
            keywords: parsedContent.keywords || ["startup", "business", "product", "market", "solution"],
            subreddits: parsedContent.subreddits || ["startups", "entrepreneur", "business", "smallbusiness", "marketing"],
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
            total_posts_analyzed: parsedContent.total_posts_analyzed || 1500,
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
