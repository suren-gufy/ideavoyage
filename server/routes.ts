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
              model: 'llama-3.1-sonar-small-128k-online',
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
              max_completion_tokens: 3000,
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
            console.warn(`[${requestId}] Perplexity API request failed:`, response.status);
          }
          
        } catch (error) {
          console.warn(`[${requestId}] Failed to complete Perplexity research:`, error);
        }
      } else {
        console.log(`[${requestId}] Perplexity API not available - using AI-generated insights`);
      }

      // Step 3: Use 'Startup Validation Expert' prompt to synthesize Perplexity results
      const hasResearchData = researchData.length > 0;
      
      // Create structured research JSON for the validation expert
      const researchJson = {
        meta: {
          idea: validatedData.idea,
          industry: validatedData.industry || "Technology",
          target_audience: validatedData.targetAudience || "General users",
          time_range: "Last 12 months",
          total_queries: totalSearches,
          data_quality: hasResearchData ? "comprehensive" : "limited"
        },
        research_findings: researchData,
        keywords: keywords,
        citations: hasResearchData ? `Based on ${totalSearches} Perplexity research queries` : "AI-generated insights"
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
  "market_interest_level": "high|medium|low",
  "total_posts_analyzed": ${totalSearches},
  "overall_score": 7.5,
  "viability_score": 6.8,
  "paid_sections": {
    "exact_demand_numbers": "Table: keyword, volume, CPC, KD (requires paid access)",
    "competitor_matrix": "6–8 competitors with pricing, differentiators, sentiment (requires paid access)",
    "cac_ltv_simulator": "ARPU assumptions, gross margin, CAC band, payback months (requires paid access)",
    "gtm_plan": "90-day GTM plan, channels, messages, experiments, risks, kill criteria (requires paid access)"
  }
}

RULES:
- Every claim must link to evidence from research_json
- If research_json lacks data for a section, say "Insufficient data—collect X by doing Y"
- Tone: pragmatic, no hype; bullets over paragraphs
- Use real quotes and insights from the research data when available
- ${hasResearchData ? 'Base analysis on the comprehensive research data provided' : 'Generate realistic insights based on the startup idea and market knowledge'}`;

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