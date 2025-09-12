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
  targetMarket: z.string().optional(),
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

export const analysisResponseSchema = z.object({
  keywords: z.array(z.string()),
  subreddits: z.array(z.string()),
  sentiment_data: z.array(sentimentDataSchema),
  pain_points: z.array(painPointSchema),
  app_ideas: z.array(appIdeaSchema),
  market_interest_level: z.enum(["low", "medium", "high"]),
  total_posts_analyzed: z.number(),
});

export type AnalyzeIdeaRequest = z.infer<typeof analyzeIdeaSchema>;
export type SentimentData = z.infer<typeof sentimentDataSchema>;
export type PainPoint = z.infer<typeof painPointSchema>;
export type AppIdea = z.infer<typeof appIdeaSchema>;
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
