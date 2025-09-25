import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = req.url || '';
    
    // Basic health check
    if (req.method === 'GET' && url === '/api') {
      return res.json({ 
        message: 'IdeaVoyage API is running on Vercel',
        timestamp: new Date().toISOString()
      });
    }

    // Analysis endpoint
    if (req.method === 'POST' && url.includes('/analyze')) {
      const { idea, industry, targetAudience } = req.body || {};
      
      if (!idea) {
        return res.status(400).json({ error: 'Idea is required' });
      }

      // Return mock analysis data that matches your frontend expectations
      return res.json({
        keywords: ["AI fitness app", "fitness tracking", "personal training", "workout motivation"],
        subreddits: ["r/fitness", "r/loseit", "r/fitnessapp"],
        sentiment_data: [
          { name: "Enthusiastic", value: 45, color: "hsl(var(--chart-2))", description: "Users are excited about personalized AI solutions." },
          { name: "Curious/Mixed", value: 35, color: "hsl(var(--chart-3))", description: "Questions about the effectiveness and functionality of fitness apps." },
          { name: "Frustrated", value: 20, color: "hsl(var(--destructive))", description: "Complaints about the inadequacy of current fitness apps." }
        ],
        pain_points: [
          { title: "Lack of Personalization", frequency: 85, urgency: "high", examples: ["Generic workout plans", "One-size-fits-all approach"] }
        ],
        app_ideas: [
          { title: "AI Personal Trainer", description: "An app that adapts workout plans based on user feedback and progress.", market_validation: "high", difficulty: "medium" }
        ],
        google_trends: [
          { keyword: "AI fitness app", trend_direction: "rising", interest_level: 75, related_queries: ["fitness AI", "workout app", "personal trainer app"] }
        ],
        icp: {
          demographics: { age_range: "25-40", gender: "Mixed", income_level: "$50k-100k", education: "College+" },
          psychographics: { interests: ["fitness", "technology", "health"], values: ["health", "efficiency", "results"], lifestyle: "Active professional" },
          behavioral: { pain_points: ["Lack of motivation", "Time constraints"], preferred_channels: ["mobile apps", "social media"], buying_behavior: "Research-driven" }
        },
        problem_statements: [
          { problem: "Users struggle with finding engaging and personalized fitness solutions.", impact: "This can lead to high churn rates and reduced user satisfaction in fitness apps.", evidence: ["High app abandonment rates", "User feedback"], market_size: "Growing market of digital fitness solutions, estimated at $15 billion." }
        ],
        financial_risks: [
          { risk_type: "Market Risk", severity: "high", description: "The fitness app market is highly competitive with low entry barriers.", mitigation_strategy: "Differentiate with unique AI features and personalized experiences." }
        ],
        competitors: [
          { name: "Noom", description: "Focuses on behavioral change and personal coaching through an app-based platform.", strengths: ["Strong brand", "Proven model"], weaknesses: ["High price", "Limited features"], market_share: "Approximately 10% of the digital weight loss sector.", pricing_model: "Subscription-based with different tiers." }
        ],
        revenue_models: [
          { model_type: "Freemium", description: "Basic features are free with advanced features available through subscription.", pros: ["Low barrier to entry", "Scalable"], cons: ["Low conversion rates"], implementation_difficulty: "medium", potential_revenue: "Potentially high, depending on user retention and upgrade rates." }
        ],
        market_interest_level: "medium",
        total_posts_analyzed: 0,
        overall_score: 7.5,
        viability_score: 6.8
      });
    }

    // Premium endpoints (mock responses for now)
    if (req.method === 'POST' && url.includes('/premium/keywords')) {
      return res.json({
        primaryKeywords: [
          { keyword: "AI fitness", searchVolume: 50000, cpc: 2.5, difficulty: 65, intent: "commercial", trend24Months: [], relatedKeywords: ["fitness AI", "AI workout"] }
        ],
        longTailKeywords: [
          { keyword: "AI fitness app for beginners", searchVolume: 5000, cpc: 1.8, difficulty: 45, intent: "commercial", trend24Months: [], relatedKeywords: [] }
        ],
        competitorKeywords: [],
        totalSearchVolume: 55000,
        avgCpc: 2.15,
        avgDifficulty: 55,
        generatedAt: new Date().toISOString(),
        locale: "US"
      });
    }

    if (req.method === 'POST' && url.includes('/premium/reddit')) {
      return res.json({
        subredditInsights: [
          { subreddit: "fitness", members: 5000000, dailyPosts: 500, engagementRate: 0.65, topTopics: ["workout plans", "nutrition"], sentiment: 0.7, keyInfluencers: ["fitnessguru123"], trending: true }
        ],
        trendingDiscussions: [
          { title: "Best AI fitness apps?", subreddit: "fitness", upvotes: 150, comments: 45, url: "#", summary: "Users discussing AI-powered fitness applications" }
        ],
        overallSentiment: { positive: 60, negative: 15, neutral: 25 },
        keyPainPoints: [
          { painPoint: "Lack of personalization", frequency: 85, subreddits: ["fitness", "loseit"], impact: "high" }
        ],
        marketSignals: ["Growing interest in AI fitness solutions"],
        generatedAt: new Date().toISOString()
      });
    }

    if (req.method === 'POST' && url.includes('/premium/customer-intelligence')) {
      return res.json({
        primaryPersonas: [
          {
            name: "Fitness Enthusiast Sarah",
            demographics: { ageRange: "28-35", location: "Urban", income: "$60k-80k", occupation: "Marketing Professional" },
            behaviors: { onlineActivity: ["fitness forums", "social media"], purchaseDrivers: ["convenience", "results"], preferredChannels: ["mobile apps", "instagram"], spendingPatterns: "Monthly subscriptions preferred" },
            painPoints: ["Time constraints", "Lack of motivation"],
            goals: ["Maintain fitness", "Track progress"],
            redditActivity: { activeSubreddits: ["fitness", "xxfitness"], engagementLevel: "high", topConcerns: ["workout effectiveness", "time management"] }
          }
        ],
        marketSegmentation: { segments: [{ name: "Fitness Beginners", size: 40, characteristics: ["New to fitness", "Need guidance"], revenue_potential: "High" }] },
        customerJourney: [{ stage: "Awareness", touchpoints: ["Social media ads"], painPoints: ["Information overload"], opportunities: ["Clear value proposition"] }],
        behaviorInsights: [{ insight: "Users prefer visual progress tracking", evidence: ["App store reviews", "User surveys"], implication: "Include photo progress features" }],
        generatedAt: new Date().toISOString()
      });
    }

    if (req.method === 'POST' && url.includes('/premium/financial')) {
      return res.json({
        revenueStreams: [
          { name: "Premium Subscriptions", model: "subscription", monthlyProjection: [{ month: 1, revenue: 10000, users: 500 }] }
        ],
        costStructure: [
          { category: "Development", monthlyProjection: [{ month: 1, cost: 8000 }], scalingFactor: "Linear with team size" }
        ],
        profitabilityAnalysis: { breakEvenMonth: 8, grossMarginTarget: 70, burnRate: [{ month: 1, burnRate: 15000 }] },
        fundingRequirements: { totalNeeded: 250000, runway: 18, milestones: [{ milestone: "MVP Launch", month: 3, funding: 50000 }] },
        generatedAt: new Date().toISOString()
      });
    }

    if (req.method === 'POST' && url.includes('/premium/technology')) {
      return res.json({
        recommendedStack: [
          { category: "Frontend", technologies: [{ name: "React Native", purpose: "Cross-platform mobile app", pros: ["Code reuse"], cons: ["Performance limitations"], complexity: "medium", cost: "medium" }] }
        ],
        developmentRoadmap: [
          { phase: "MVP Development", duration: "3 months", deliverables: ["Core app functionality"], resources: ["2 developers", "1 designer"], risks: ["Technical complexity"], estimatedCost: 75000 }
        ],
        operationalRequirements: [
          { area: "Hosting", requirements: [{ requirement: "Cloud infrastructure", priority: "high", timeline: "Month 1", cost: 500 }] }
        ],
        teamStructure: { coreTeam: [{ role: "Lead Developer", skills: ["React Native", "AI/ML"], hiringPriority: "immediate", salaryRange: "$80k-120k" }], advisors: ["Fitness Industry Expert", "Technical Advisor"] },
        generatedAt: new Date().toISOString()
      });
    }

    if (req.method === 'POST' && url.includes('/premium/legal')) {
      return res.json({
        businessStructure: { recommendedType: "LLC", rationale: "Flexibility and liability protection", steps: ["File articles of organization", "Obtain EIN"], cost: "$500-2000" },
        intellectualProperty: { protections: [{ type: "Trademark", description: "App name and logo protection", cost: "$1000-2000", timeline: "6-12 months" }], risks: ["Name conflicts", "Patent issues"] },
        regulatoryRequirements: [{ area: "Data Privacy", requirements: [{ requirement: "GDPR compliance", jurisdiction: "EU", priority: "high", timeline: "Before launch", estimatedCost: "$5000-15000" }] }],
        complianceFrameworks: [{ framework: "GDPR", applicability: "EU users", requirements: ["Privacy policy", "Data consent"], implementationSteps: ["Legal review", "Technical implementation"], cost: "$10000-25000" }],
        generatedAt: new Date().toISOString()
      });
    }

    if (req.method === 'POST' && url.includes('/premium/launch-roadmap')) {
      return res.json({
        quarterlyGoals: [
          { quarter: "Q1", goals: ["Complete MVP", "User testing"], milestones: [{ milestone: "Beta launch", month: 3, description: "Limited user testing", resources: ["Development team"] }], risks: [{ risk: "Development delays", mitigation: "Agile methodology", probability: "medium" }] }
        ],
        generatedAt: new Date().toISOString()
      });
    }

    return res.status(404).json({ 
      error: 'Endpoint not found',
      method: req.method,
      url: url
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}