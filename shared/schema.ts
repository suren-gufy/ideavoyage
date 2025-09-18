import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Startup Idea Analysis Schemas
export const analyzeIdeaSchema = z.object({
  idea: z.string().min(10, "Please provide a more detailed description of your idea"),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  country: z.string().default("global"),
  platform: z.enum(["web-app", "mobile-app", "both"]).default("web-app"),
  fundingMethod: z.enum(["self-funded", "bootstrapping", "raising-capital"]).default("self-funded"),
  timeRange: z.enum(["week", "month", "quarter", "year"]).default("month"),
});

export const sentimentDataSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
  description: z.string(),
});

export const painPointSchema = z.object({
  title: z.string(),
  frequency: z.number(),
  urgency: z.enum(["low", "medium", "high"]),
  examples: z.array(z.string()),
});

export const appIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  market_validation: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const googleTrendSchema = z.object({
  keyword: z.string(),
  trend_direction: z.enum(["rising", "stable", "declining"]),
  interest_level: z.number().min(0).max(100),
  related_queries: z.array(z.string()),
});

export const icpSchema = z.object({
  demographics: z.object({
    age_range: z.string(),
    gender: z.string(),
    income_level: z.string(),
    education: z.string(),
  }),
  psychographics: z.object({
    interests: z.array(z.string()),
    values: z.array(z.string()),
    lifestyle: z.string(),
  }),
  behavioral: z.object({
    pain_points: z.array(z.string()),
    preferred_channels: z.array(z.string()),
    buying_behavior: z.string(),
  }),
});

export const problemStatementSchema = z.object({
  problem: z.string(),
  impact: z.string(),
  evidence: z.array(z.string()),
  market_size: z.string(),
});

export const financialRiskSchema = z.object({
  risk_type: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  description: z.string(),
  mitigation_strategy: z.string(),
});

export const competitorSchema = z.object({
  name: z.string(),
  description: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  market_share: z.string(),
  pricing_model: z.string(),
});

export const revenueModelSchema = z.object({
  model_type: z.string(),
  description: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  implementation_difficulty: z.enum(["easy", "medium", "hard"]),
  potential_revenue: z.string(),
});

export const analysisResponseSchema = z.object({
  keywords: z.array(z.string()),
  subreddits: z.array(z.string()),
  sentiment_data: z.array(sentimentDataSchema),
  pain_points: z.array(painPointSchema),
  app_ideas: z.array(appIdeaSchema),
  google_trends: z.array(googleTrendSchema),
  icp: icpSchema,
  problem_statements: z.array(problemStatementSchema),
  financial_risks: z.array(financialRiskSchema),
  competitors: z.array(competitorSchema),
  revenue_models: z.array(revenueModelSchema),
  market_interest_level: z.enum(["low", "medium", "high"]),
  total_posts_analyzed: z.number(),
  overall_score: z.number().min(1).max(10),
  viability_score: z.number().min(1).max(10),
});

export type AnalyzeIdeaRequest = z.infer<typeof analyzeIdeaSchema>;
export type SentimentData = z.infer<typeof sentimentDataSchema>;
export type PainPoint = z.infer<typeof painPointSchema>;
export type AppIdea = z.infer<typeof appIdeaSchema>;
export type GoogleTrend = z.infer<typeof googleTrendSchema>;
export type ICP = z.infer<typeof icpSchema>;
export type ProblemStatement = z.infer<typeof problemStatementSchema>;
export type FinancialRisk = z.infer<typeof financialRiskSchema>;
export type Competitor = z.infer<typeof competitorSchema>;
export type RevenueModel = z.infer<typeof revenueModelSchema>;
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
