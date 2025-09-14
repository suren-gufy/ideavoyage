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

export async function registerRoutes(app: Express): Promise<Server> {
  // Startup Idea Analysis Route
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = analyzeIdeaSchema.parse(req.body);
      
      console.log("Analyzing startup idea:", validatedData);
      
      // Step 1: Generate relevant keywords for comprehensive research
      const keywordPrompt = `Analyze this startup idea and generate the best search terms for comprehensive market research:

Startup Idea: "${validatedData.idea}"
Industry: ${validatedData.industry || "Not specified"}
Target Audience: ${validatedData.targetAudience || "Not specified"}

Please provide a JSON response with:
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "subreddits": ["subreddit1", "subreddit2", "subreddit3", "subreddit4", "subreddit5"]
}

Generate 5 highly relevant keywords that capture different aspects of this business idea.
Generate 5 community names that would be relevant for this startup area.`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const keywordCompletion = await openai.chat.completions.create({
        model: "gpt-5",
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
        max_completion_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const keywordResponse = JSON.parse(keywordCompletion.choices[0].message.content || '{"keywords": [], "subreddits": []}');
      const keywords = keywordResponse.keywords || ["startup", "business", "product"];
      const subreddits = keywordResponse.subreddits || ["startups", "entrepreneur", "business"];

      console.log("Generated keywords:", keywords);
      console.log("Target subreddits:", subreddits);

      // Step 2: Use Perplexity for comprehensive internet research
      let researchData = "";
      let totalSearches = 0;
      
      if (perplexityApiKey) {
        console.log("Starting comprehensive market research with Perplexity...");
        
        const searchQueries = [
          `${validatedData.idea} market research pain points user feedback`,
          `startup ideas similar to "${validatedData.idea}" competition analysis`,
          `problems with ${keywords.slice(0, 2).join(' ')} current solutions`,
          `user complaints about ${validatedData.industry || keywords[0]} industry`,
          `${validatedData.targetAudience || 'users'} feedback on ${keywords[0]} solutions`
        ];
        
        for (const query of searchQueries) {
          try {
            console.log(`Researching: "${query}"`);
            
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${perplexityApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                messages: [
                  {
                    role: 'system',
                    content: 'Provide comprehensive market research insights with specific examples, user quotes, and pain points. Focus on real user feedback and market validation data.'
                  },
                  {
                    role: 'user',
                    content: query
                  }
                ],
                max_tokens: 1000,
                temperature: 0.2,
                search_recency_filter: 'month',
                return_citations: true
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              const content = data.choices[0]?.message?.content || '';
              const citations = data.citations || [];
              
              researchData += `\n\nRESEARCH QUERY: ${query}\n`;
              researchData += `FINDINGS: ${content}\n`;
              if (citations.length > 0) {
                researchData += `SOURCES: ${citations.slice(0, 3).join(', ')}\n`;
              }
              totalSearches++;
            }
            
            // Small delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.warn(`Failed to research "${query}":`, error);
          }
        }
        
        console.log(`Completed ${totalSearches} research queries with Perplexity`);
      } else {
        console.log("Perplexity API not available - using AI-generated insights");
      }

      // Step 3: Create analysis prompt based on research data
      const hasResearchData = researchData.length > 0;
      let dataSection = "";
      
      if (hasResearchData) {
        dataSection = `
COMPREHENSIVE INTERNET RESEARCH DATA:
${researchData}

Total Research Queries: ${totalSearches}
Keywords: ${keywords.join(', ')}
Target Communities: ${subreddits.join(', ')}

Based on this comprehensive internet research from multiple sources, analyze the market sentiment, extract actual pain points, identify real competition, and provide genuine market validation insights.`;
      } else {
        dataSection = `
MARKET RESEARCH MODE (Limited data available):
Using AI market knowledge to analyze the startup idea based on generated keywords and target communities.
Keywords: ${keywords.join(', ')}
Target Communities: ${subreddits.join(', ')}
Research Queries: 0 (fallback to AI insights)

Generate realistic market insights based on typical market patterns for this type of product.`;
      }

      const analysisPrompt = `Analyze this startup idea for market research insights:

Startup Idea: "${validatedData.idea}"
Industry: ${validatedData.industry || "Not specified"}
Target Audience: ${validatedData.targetAudience || "Not specified"}
Country: ${validatedData.country || "global"}
Platform: ${validatedData.platform || "web-app"}
Funding Method: ${validatedData.fundingMethod || "self-funded"}

${dataSection}

Please provide a JSON response with the following structure:
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
  "total_posts_analyzed": ${totalSearches},
  "overall_score": 7.5,
  "viability_score": 6.8
}

Instructions:
${hasResearchData ? `
ANALYZE THE COMPREHENSIVE RESEARCH DATA:
1. Extract sentiment from the internet research findings to create accurate sentiment_data percentages
2. Identify real pain points mentioned in the research - use actual insights and quotes as examples
3. Generate app ideas based on problems and solutions discovered in the research
4. Base market_interest_level on actual market evidence found in the research
5. Extract real user language and concerns from the research findings
6. Set total_posts_analyzed to: ${totalSearches}
` : `
GENERATE MARKET INSIGHTS:
1. Create realistic sentiment analysis based on typical market discussions
2. Identify common pain points for this type of product with realistic examples
3. Generate relevant app ideas based on market knowledge
4. Assess market interest based on the generated keywords and target communities
5. Set total_posts_analyzed to: 0
`}
7. Generate overall_score (1-10): Rate how good/bad the startup idea is overall based on ${hasResearchData ? 'comprehensive research evidence' : 'market potential'}
8. Generate viability_score (1-10): Rate how easy/difficult it would be to bring this idea to life

${hasResearchData ? 'Base your analysis on the comprehensive internet research data provided above.' : 'Make sure all data is relevant to the specific startup idea and target communities.'}`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are an expert market researcher specializing in startup validation. Always respond with valid JSON in the exact format requested. Do not include any text outside the JSON structure."
          },
          {
            role: "user",
            content: analysisPrompt
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
            total_posts_analyzed: totalSearches || 0,
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