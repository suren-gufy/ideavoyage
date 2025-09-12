import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeIdeaSchema, type AnalysisResponse } from "../shared/schema";
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
Target Market: ${validatedData.targetMarket || "Not specified"}

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
    {"title": "App idea 1", "description": "Description of the app", "market_validation": "Why this would work", "difficulty": "medium"},
    {"title": "App idea 2", "description": "Description of the app", "market_validation": "Why this would work", "difficulty": "easy"}
  ],
  "market_interest_level": "high",
  "total_posts_analyzed": 2847
}

Instructions:
1. Generate 5 relevant keywords for searching Reddit discussions
2. Suggest 5 relevant subreddits where this startup idea would be discussed
3. Create realistic sentiment analysis data that adds up to 100%
4. Identify 3-5 key pain points with realistic frequency scores and urgency levels
5. Generate 3-4 app ideas related to this startup concept
6. Assess overall market interest level (low/medium/high)
7. Provide a realistic number for posts analyzed (1000-5000 range)

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

      const analysisResult = JSON.parse(completion.choices[0].message.content || "{}") as AnalysisResponse;
      
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
