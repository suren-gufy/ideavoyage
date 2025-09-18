import { 
  type User, 
  type InsertUser,
  type KeywordIntelligence,
  type RedditAnalysis,
  type CustomerIntelligence,
  type FinancialProjections,
  type TechnologyOperations,
  type LegalRegulatory,
  type LaunchRoadmap,
  type CompetitorMatrix,
  type GtmPlan,
  type MarketSizing,
  type ExportResult,
  type PremiumAnalysis,
  type SourceRef,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Cached data with TTL
interface CachedData<T> {
  data: T;
  expiresAt: number; // Timestamp
  createdAt: number;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Premium Analytics - Keyword Intelligence
  getKeywordIntelligence(analysisId: string): Promise<KeywordIntelligence | undefined>;
  setKeywordIntelligence(analysisId: string, data: KeywordIntelligence, ttlHours?: number): Promise<void>;

  // Premium Analytics - Reddit Analysis
  getRedditAnalysis(analysisId: string): Promise<RedditAnalysis | undefined>;
  setRedditAnalysis(analysisId: string, data: RedditAnalysis, ttlHours?: number): Promise<void>;

  // Premium Analytics - Customer Intelligence
  getCustomerIntelligence(analysisId: string): Promise<CustomerIntelligence | undefined>;
  setCustomerIntelligence(analysisId: string, data: CustomerIntelligence, ttlHours?: number): Promise<void>;

  // Premium Analytics - Financial Projections
  getFinancialProjections(analysisId: string): Promise<FinancialProjections | undefined>;
  setFinancialProjections(analysisId: string, data: FinancialProjections, ttlHours?: number): Promise<void>;

  // Premium Analytics - Technology Operations
  getTechnologyOperations(analysisId: string): Promise<TechnologyOperations | undefined>;
  setTechnologyOperations(analysisId: string, data: TechnologyOperations, ttlHours?: number): Promise<void>;

  // Premium Analytics - Legal Regulatory
  getLegalRegulatory(analysisId: string): Promise<LegalRegulatory | undefined>;
  setLegalRegulatory(analysisId: string, data: LegalRegulatory, ttlHours?: number): Promise<void>;

  // Premium Analytics - Launch Roadmap
  getLaunchRoadmap(analysisId: string): Promise<LaunchRoadmap | undefined>;
  setLaunchRoadmap(analysisId: string, data: LaunchRoadmap, ttlHours?: number): Promise<void>;

  // Premium Analytics - Competitor Matrix
  getCompetitorMatrix(analysisId: string): Promise<CompetitorMatrix | undefined>;
  setCompetitorMatrix(analysisId: string, data: CompetitorMatrix, ttlHours?: number): Promise<void>;

  // Premium Analytics - GTM Planning
  getGtmPlan(analysisId: string): Promise<GtmPlan | undefined>;
  setGtmPlan(analysisId: string, data: GtmPlan, ttlHours?: number): Promise<void>;

  // Premium Analytics - Market Sizing
  getMarketSizing(analysisId: string): Promise<MarketSizing | undefined>;
  setMarketSizing(analysisId: string, data: MarketSizing, ttlHours?: number): Promise<void>;

  // Premium Analytics - Complete Analysis
  getPremiumAnalysis(analysisId: string): Promise<PremiumAnalysis | undefined>;
  setPremiumAnalysis(analysisId: string, data: PremiumAnalysis, ttlHours?: number): Promise<void>;

  // Source Management
  getSources(analysisId: string): Promise<SourceRef[]>;
  addSources(analysisId: string, sources: SourceRef[]): Promise<void>;

  // Export Management
  getExportResult(exportId: string): Promise<ExportResult | undefined>;
  setExportResult(exportId: string, result: ExportResult): Promise<void>;
  cleanupExpiredExports(): Promise<void>;

  // Cache Management
  clearExpiredCache(): Promise<void>;
  getCacheStats(): Promise<{ totalItems: number; expiredItems: number; memoryUsage: string }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private keywordIntelligence: Map<string, CachedData<KeywordIntelligence>>;
  private redditAnalyses: Map<string, CachedData<RedditAnalysis>>;
  private customerIntelligence: Map<string, CachedData<CustomerIntelligence>>;
  private financialProjections: Map<string, CachedData<FinancialProjections>>;
  private technologyOperations: Map<string, CachedData<TechnologyOperations>>;
  private legalRegulatory: Map<string, CachedData<LegalRegulatory>>;
  private launchRoadmaps: Map<string, CachedData<LaunchRoadmap>>;
  private competitorMatrices: Map<string, CachedData<CompetitorMatrix>>;
  private gtmPlans: Map<string, CachedData<GtmPlan>>;
  private marketSizing: Map<string, CachedData<MarketSizing>>;
  private premiumAnalyses: Map<string, CachedData<PremiumAnalysis>>;
  private sources: Map<string, SourceRef[]>; // By analysisId
  private exports: Map<string, ExportResult>;

  constructor() {
    this.users = new Map();
    this.keywordIntelligence = new Map();
    this.redditAnalyses = new Map();
    this.customerIntelligence = new Map();
    this.financialProjections = new Map();
    this.technologyOperations = new Map();
    this.legalRegulatory = new Map();
    this.launchRoadmaps = new Map();
    this.competitorMatrices = new Map();
    this.gtmPlans = new Map();
    this.marketSizing = new Map();
    this.premiumAnalyses = new Map();
    this.sources = new Map();
    this.exports = new Map();

    // Auto-cleanup expired cache every hour
    setInterval(() => {
      this.clearExpiredCache();
      this.cleanupExpiredExports();
    }, 60 * 60 * 1000);
  }

  // Helper method to check if cached data is expired
  private isExpired<T>(cached: CachedData<T>): boolean {
    return Date.now() > cached.expiresAt;
  }

  // Helper method to create cached data with TTL
  private createCachedData<T>(data: T, ttlHours: number = 24): CachedData<T> {
    const now = Date.now();
    return {
      data,
      createdAt: now,
      expiresAt: now + (ttlHours * 60 * 60 * 1000),
    };
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Premium Analytics - Keyword Intelligence
  async getKeywordIntelligence(analysisId: string): Promise<KeywordIntelligence | undefined> {
    const cached = this.keywordIntelligence.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.keywordIntelligence.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setKeywordIntelligence(analysisId: string, data: KeywordIntelligence, ttlHours: number = 24): Promise<void> {
    this.keywordIntelligence.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Reddit Analysis
  async getRedditAnalysis(analysisId: string): Promise<RedditAnalysis | undefined> {
    const cached = this.redditAnalyses.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.redditAnalyses.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setRedditAnalysis(analysisId: string, data: RedditAnalysis, ttlHours: number = 24): Promise<void> {
    this.redditAnalyses.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Customer Intelligence
  async getCustomerIntelligence(analysisId: string): Promise<CustomerIntelligence | undefined> {
    const cached = this.customerIntelligence.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.customerIntelligence.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setCustomerIntelligence(analysisId: string, data: CustomerIntelligence, ttlHours: number = 24): Promise<void> {
    this.customerIntelligence.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Financial Projections
  async getFinancialProjections(analysisId: string): Promise<FinancialProjections | undefined> {
    const cached = this.financialProjections.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.financialProjections.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setFinancialProjections(analysisId: string, data: FinancialProjections, ttlHours: number = 24): Promise<void> {
    this.financialProjections.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Technology Operations
  async getTechnologyOperations(analysisId: string): Promise<TechnologyOperations | undefined> {
    const cached = this.technologyOperations.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.technologyOperations.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setTechnologyOperations(analysisId: string, data: TechnologyOperations, ttlHours: number = 24): Promise<void> {
    this.technologyOperations.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Legal Regulatory
  async getLegalRegulatory(analysisId: string): Promise<LegalRegulatory | undefined> {
    const cached = this.legalRegulatory.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.legalRegulatory.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setLegalRegulatory(analysisId: string, data: LegalRegulatory, ttlHours: number = 24): Promise<void> {
    this.legalRegulatory.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Launch Roadmap
  async getLaunchRoadmap(analysisId: string): Promise<LaunchRoadmap | undefined> {
    const cached = this.launchRoadmaps.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.launchRoadmaps.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setLaunchRoadmap(analysisId: string, data: LaunchRoadmap, ttlHours: number = 24): Promise<void> {
    this.launchRoadmaps.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Competitor Matrix
  async getCompetitorMatrix(analysisId: string): Promise<CompetitorMatrix | undefined> {
    const cached = this.competitorMatrices.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.competitorMatrices.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setCompetitorMatrix(analysisId: string, data: CompetitorMatrix, ttlHours: number = 24): Promise<void> {
    this.competitorMatrices.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - GTM Planning
  async getGtmPlan(analysisId: string): Promise<GtmPlan | undefined> {
    const cached = this.gtmPlans.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.gtmPlans.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setGtmPlan(analysisId: string, data: GtmPlan, ttlHours: number = 24): Promise<void> {
    this.gtmPlans.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Market Sizing
  async getMarketSizing(analysisId: string): Promise<MarketSizing | undefined> {
    const cached = this.marketSizing.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.marketSizing.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setMarketSizing(analysisId: string, data: MarketSizing, ttlHours: number = 24): Promise<void> {
    this.marketSizing.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Premium Analytics - Complete Analysis
  async getPremiumAnalysis(analysisId: string): Promise<PremiumAnalysis | undefined> {
    const cached = this.premiumAnalyses.get(analysisId);
    if (!cached || this.isExpired(cached)) {
      this.premiumAnalyses.delete(analysisId);
      return undefined;
    }
    return cached.data;
  }

  async setPremiumAnalysis(analysisId: string, data: PremiumAnalysis, ttlHours: number = 48): Promise<void> {
    this.premiumAnalyses.set(analysisId, this.createCachedData(data, ttlHours));
  }

  // Source Management
  async getSources(analysisId: string): Promise<SourceRef[]> {
    return this.sources.get(analysisId) || [];
  }

  async addSources(analysisId: string, sources: SourceRef[]): Promise<void> {
    const existing = this.sources.get(analysisId) || [];
    this.sources.set(analysisId, [...existing, ...sources]);
  }

  // Export Management
  async getExportResult(exportId: string): Promise<ExportResult | undefined> {
    return this.exports.get(exportId);
  }

  async setExportResult(exportId: string, result: ExportResult): Promise<void> {
    this.exports.set(exportId, result);
  }

  async cleanupExpiredExports(): Promise<void> {
    const now = Date.now();
    const expiredExports: string[] = [];
    this.exports.forEach((result, exportId) => {
      const expiresAt = new Date(result.expiresAt).getTime();
      if (now > expiresAt) {
        expiredExports.push(exportId);
      }
    });
    expiredExports.forEach(exportId => this.exports.delete(exportId));
  }

  // Cache Management
  async clearExpiredCache(): Promise<void> {
    // Helper function to clear expired items from a cache
    const clearExpired = (cache: Map<string, CachedData<any>>) => {
      const expiredKeys: string[] = [];
      cache.forEach((cached, key) => {
        if (this.isExpired(cached)) {
          expiredKeys.push(key);
        }
      });
      expiredKeys.forEach(key => cache.delete(key));
    };

    // Clear expired items from all caches
    clearExpired(this.keywordIntelligence as Map<string, CachedData<any>>);
    clearExpired(this.redditAnalyses as Map<string, CachedData<any>>);
    clearExpired(this.customerIntelligence as Map<string, CachedData<any>>);
    clearExpired(this.financialProjections as Map<string, CachedData<any>>);
    clearExpired(this.technologyOperations as Map<string, CachedData<any>>);
    clearExpired(this.legalRegulatory as Map<string, CachedData<any>>);
    clearExpired(this.launchRoadmaps as Map<string, CachedData<any>>);
    clearExpired(this.competitorMatrices as Map<string, CachedData<any>>);
    clearExpired(this.gtmPlans as Map<string, CachedData<any>>);
    clearExpired(this.marketSizing as Map<string, CachedData<any>>);
    clearExpired(this.premiumAnalyses as Map<string, CachedData<any>>);
  }

  async getCacheStats(): Promise<{ totalItems: number; expiredItems: number; memoryUsage: string }> {
    let totalItems = 0;
    let expiredItems = 0;

    // Count all cache maps
    const allCaches = [
      this.keywordIntelligence,
      this.redditAnalyses,
      this.customerIntelligence,
      this.financialProjections,
      this.technologyOperations,
      this.legalRegulatory,
      this.launchRoadmaps,
      this.competitorMatrices,
      this.gtmPlans,
      this.marketSizing,
      this.premiumAnalyses,
    ];

    allCaches.forEach(cache => {
      totalItems += cache.size;
      (cache as Map<string, CachedData<any>>).forEach(cached => {
        if (this.isExpired(cached)) {
          expiredItems++;
        }
      });
    });

    // Add sources and exports
    totalItems += this.sources.size + this.exports.size;

    // Rough memory usage estimation
    const memoryUsage = `${Math.round(totalItems * 10)} KB (estimated)`;

    return { totalItems, expiredItems, memoryUsage };
  }
}

export const storage = new MemStorage();
