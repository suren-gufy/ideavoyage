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

// Premium Business Intelligence Schemas

// Source reference for data provenance
export const sourceRefSchema = z.object({
  id: z.string(),
  type: z.enum(["reddit", "web", "api", "internal"]),
  url: z.string().optional(),
  title: z.string(),
  excerpt: z.string().optional(),
  confidence: z.number().min(0).max(1),
  retrievedAt: z.string(),
});

// Keyword Intelligence with exact volumes, CPC, difficulty
export const keywordTrendPointSchema = z.object({
  month: z.string(), // YYYY-MM format
  volume: z.number(),
  competitionScore: z.number().min(0).max(100),
});

export const keywordIntelligenceItemSchema = z.object({
  keyword: z.string(),
  searchVolume: z.number(),
  cpc: z.number(), // Cost per click in USD
  difficulty: z.number().min(0).max(100),
  intent: z.enum(["informational", "commercial", "transactional", "navigational"]),
  trend24Months: z.array(keywordTrendPointSchema),
  relatedKeywords: z.array(z.string()),
  sources: z.array(sourceRefSchema),
});

export const keywordIntelligenceSchema = z.object({
  primaryKeywords: z.array(keywordIntelligenceItemSchema),
  longTailKeywords: z.array(keywordIntelligenceItemSchema),
  competitorKeywords: z.array(keywordIntelligenceItemSchema),
  totalSearchVolume: z.number(),
  avgCpc: z.number(),
  avgDifficulty: z.number(),
  generatedAt: z.string(),
  locale: z.string().default("US"),
});

// Financial Modeling - CAC/LTV Simulator
export const cacByChannelSchema = z.object({
  channel: z.string(),
  cac: z.number(),
  conversionRate: z.number().min(0).max(1),
  monthlySpend: z.number(),
});

export const financialInputsSchema = z.object({
  arpu: z.number().min(0), // Average Revenue Per User
  grossMargin: z.number().min(0).max(1), // Percentage as decimal
  monthlyChurn: z.number().min(0).max(1), // Monthly churn rate
  cacChannels: z.array(cacByChannelSchema),
  totalMonthlyBudget: z.number(),
  timeHorizonMonths: z.number().min(12).max(60),
});

export const financialProjectionSchema = z.object({
  month: z.number(),
  newCustomers: z.number(),
  totalCustomers: z.number(),
  mrr: z.number(), // Monthly Recurring Revenue
  ltv: z.number(), // Customer Lifetime Value
  cashflow: z.number(),
  cumulativeCashflow: z.number(),
});

export const financialModelSchema = z.object({
  inputs: financialInputsSchema,
  ltv: z.number(),
  blendedCac: z.number(),
  paybackMonths: z.number(),
  projections: z.array(financialProjectionSchema),
  breakEvenMonth: z.number().optional(),
  romiProjections: z.array(z.object({
    month: z.number(),
    romi: z.number(), // Return on Marketing Investment
  })),
  generatedAt: z.string(),
});

// Enhanced Competitor Matrix
export const competitorPricingTierSchema = z.object({
  tier: z.string(),
  price: z.number(),
  billingCycle: z.enum(["monthly", "yearly", "one-time"]),
  features: z.array(z.string()),
  limitations: z.array(z.string()).optional(),
});

export const competitorIntelligenceSchema = z.object({
  name: z.string(),
  website: z.string().optional(),
  description: z.string(),
  pricing: z.array(competitorPricingTierSchema),
  sentimentScore: z.number().min(-1).max(1), // -1 negative, +1 positive
  marketShare: z.number().min(0).max(100).optional(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  differentiators: z.array(z.string()),
  targetAudience: z.string(),
  distribution: z.array(z.string()), // Distribution channels
  fundingStage: z.string().optional(),
  employeeCount: z.string().optional(),
  yearFounded: z.number().optional(),
  sources: z.array(sourceRefSchema),
});

export const competitorMatrixSchema = z.object({
  competitors: z.array(competitorIntelligenceSchema),
  positioningMap: z.array(z.object({
    competitor: z.string(),
    xAxis: z.number(), // Price positioning
    yAxis: z.number(), // Feature completeness
  })),
  marketGaps: z.array(z.string()),
  competitiveAdvantages: z.array(z.string()),
  threatsAndOpportunities: z.array(z.string()),
  generatedAt: z.string(),
});

// 90-day Go-to-Market Plan
export const gtmTacticSchema = z.object({
  name: z.string(),
  description: z.string(),
  effort: z.enum(["low", "medium", "high"]),
  cost: z.enum(["low", "medium", "high"]),
  impact: z.enum(["low", "medium", "high"]),
  timeline: z.string(),
  dependencies: z.array(z.string()),
});

export const gtmKpiSchema = z.object({
  metric: z.string(),
  target: z.number(),
  unit: z.string(),
  measurement: z.string(),
});

export const gtmPhaseSchema = z.object({
  phase: z.string(),
  weeks: z.string(),
  objectives: z.array(z.string()),
  tactics: z.array(gtmTacticSchema),
  kpis: z.array(gtmKpiSchema),
  budget: z.number(),
  owners: z.array(z.string()).optional(),
});

export const gtmRiskSchema = z.object({
  risk: z.string(),
  probability: z.enum(["low", "medium", "high"]),
  impact: z.enum(["low", "medium", "high"]),
  mitigation: z.string(),
  contingency: z.string().optional(),
});

export const gtmKillCriteriaSchema = z.object({
  metric: z.string(),
  threshold: z.number(),
  timeWindow: z.string(),
  rationale: z.string(),
});

export const gtmPlanSchema = z.object({
  phases: z.array(gtmPhaseSchema),
  totalBudget: z.number(),
  expectedOutcomes: z.array(z.string()),
  successMetrics: z.array(gtmKpiSchema),
  risks: z.array(gtmRiskSchema),
  killCriteria: z.array(gtmKillCriteriaSchema),
  assumptions: z.array(z.string()),
  generatedAt: z.string(),
});

// Market Sizing Analysis
export const marketSizingMethodSchema = z.object({
  method: z.enum(["top-down", "bottom-up", "comparative"]),
  description: z.string(),
  dataPoints: z.array(z.string()),
  assumptions: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export const marketSegmentSchema = z.object({
  segment: z.string(),
  size: z.number(),
  unit: z.string(), // "USD", "customers", etc.
  growthRate: z.number(), // Annual growth rate
  accessibility: z.number().min(0).max(1), // How accessible is this segment
});

export const marketSizingSchema = z.object({
  tam: z.object({
    value: z.number(),
    unit: z.string(),
    method: marketSizingMethodSchema,
    segments: z.array(marketSegmentSchema),
  }),
  sam: z.object({
    value: z.number(),
    unit: z.string(),
    method: marketSizingMethodSchema,
    reasoningFactors: z.array(z.string()),
  }),
  som: z.object({
    value: z.number(),
    unit: z.string(),
    method: marketSizingMethodSchema,
    marketPenetration: z.number().min(0).max(1),
    timeToCapture: z.number(), // Years
  }),
  bottomUpAnalysis: z.object({
    unitEconomics: z.object({
      units: z.number(),
      pricePerUnit: z.number(),
      adoptionRate: z.number().min(0).max(1),
    }),
    scaling: z.array(z.object({
      year: z.number(),
      units: z.number(),
      revenue: z.number(),
    })),
  }).optional(),
  references: z.array(sourceRefSchema),
  generatedAt: z.string(),
});

// Export functionality
export const exportRequestSchema = z.object({
  type: z.enum(["csv", "json", "pdf", "zip"]),
  sections: z.array(z.string()), // Which sections to include
  analysisId: z.string(),
  includeCharts: z.boolean().default(false),
  includeRawData: z.boolean().default(false),
});

export const exportResultSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  downloadUrl: z.string().optional(),
  filename: z.string(),
  fileSize: z.number().optional(),
  createdAt: z.string(),
  expiresAt: z.string(),
  error: z.string().optional(),
});

// Comprehensive Premium Analysis Response
export const premiumAnalysisSchema = z.object({
  analysisId: z.string(),
  keywordIntelligence: keywordIntelligenceSchema,
  financialModel: financialModelSchema,
  competitorMatrix: competitorMatrixSchema,
  gtmPlan: gtmPlanSchema,
  marketSizing: marketSizingSchema,
  sources: z.array(sourceRefSchema),
  generatedAt: z.string(),
  expiresAt: z.string(),
});

// Type exports for all premium schemas
export type SourceRef = z.infer<typeof sourceRefSchema>;
export type KeywordTrendPoint = z.infer<typeof keywordTrendPointSchema>;
export type KeywordIntelligenceItem = z.infer<typeof keywordIntelligenceItemSchema>;
export type KeywordIntelligence = z.infer<typeof keywordIntelligenceSchema>;
export type CacByChannel = z.infer<typeof cacByChannelSchema>;
export type FinancialInputs = z.infer<typeof financialInputsSchema>;
export type FinancialProjection = z.infer<typeof financialProjectionSchema>;
export type FinancialModel = z.infer<typeof financialModelSchema>;
export type CompetitorPricingTier = z.infer<typeof competitorPricingTierSchema>;
export type CompetitorIntelligence = z.infer<typeof competitorIntelligenceSchema>;
export type CompetitorMatrix = z.infer<typeof competitorMatrixSchema>;
export type GtmTactic = z.infer<typeof gtmTacticSchema>;
export type GtmKpi = z.infer<typeof gtmKpiSchema>;
export type GtmPhase = z.infer<typeof gtmPhaseSchema>;
export type GtmRisk = z.infer<typeof gtmRiskSchema>;
export type GtmKillCriteria = z.infer<typeof gtmKillCriteriaSchema>;
export type GtmPlan = z.infer<typeof gtmPlanSchema>;
export type MarketSizingMethod = z.infer<typeof marketSizingMethodSchema>;
export type MarketSegment = z.infer<typeof marketSegmentSchema>;
export type MarketSizing = z.infer<typeof marketSizingSchema>;
export type ExportRequest = z.infer<typeof exportRequestSchema>;
export type ExportResult = z.infer<typeof exportResultSchema>;
export type PremiumAnalysis = z.infer<typeof premiumAnalysisSchema>;
