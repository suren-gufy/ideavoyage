const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env' });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (if you have a built frontend)
app.use(express.static(path.join(__dirname, 'client/dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'IdeaVoyage local server running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock API endpoint for testing the frontend
app.post('/api', async (req, res) => {
  try {
    console.log('🚀 Received API request:', req.body);
    
    const { idea, analysisType = 'reddit_plus_ai' } = req.body;
    
    if (!idea) {
      return res.status(400).json({
        success: false,
        error: 'Missing idea parameter'
      });
    }

    // Mock comprehensive business analysis data
    const mockAnalysisResult = {
      success: true,
      data: {
        idea: idea,
        overall_score: 7.5,
        viability_score: 8.0,
        total_posts_analyzed: 156,
        data_source: analysisType,
        analysis_confidence: 'high',
        
        // Basic required fields
        keywords: ['startup', 'business', 'innovation'],
        subreddits: ['Entrepreneur', 'startups', 'business'],
        
        // Sentiment data
        sentiment_data: [
          { name: 'Positive', value: 65, color: '#10b981', description: 'Strong market interest' },
          { name: 'Neutral', value: 25, color: '#6b7280', description: 'Moderate awareness' },
          { name: 'Negative', value: 10, color: '#ef4444', description: 'Some concerns' }
        ],
        
        // Pain points
        pain_points: [
          { title: 'High costs of existing solutions', frequency: 85, urgency: 'high', examples: ['Expensive alternatives', 'Budget constraints'] },
          { title: 'Time-consuming processes', frequency: 70, urgency: 'medium', examples: ['Manual workflows', 'Inefficient systems'] },
          { title: 'Lack of integration', frequency: 60, urgency: 'medium', examples: ['Disconnected tools', 'Data silos'] }
        ],
        
        // Financial risks
        financial_risks: [
          { description: 'Market competition', risk_type: 'competitive', severity: 'medium', mitigation_strategy: 'Focus on differentiation' },
          { description: 'Technical complexity', risk_type: 'operational', severity: 'low', mitigation_strategy: 'Agile development approach' },
          { description: 'Regulatory changes', risk_type: 'regulatory', severity: 'low', mitigation_strategy: 'Stay informed on regulations' }
        ],
        
        // Revenue models
        revenue_models: [
          { model_type: 'Subscription Model', description: 'Monthly/yearly recurring revenue', pros: ['Predictable income'], cons: ['Customer retention needed'], implementation_difficulty: 'medium', potential_revenue: '$50K-200K annually' },
          { model_type: 'Freemium Model', description: 'Free tier with premium features', pros: ['Lower barrier to entry'], cons: ['Conversion optimization needed'], implementation_difficulty: 'hard', potential_revenue: '$30K-150K annually' }
        ],
        
        // Competitors
        competitors: [
          { name: 'Competitor A', market_share: '25%', strengths: ['Brand recognition'], weaknesses: ['High pricing'], competitive_advantage: 'Better user experience' },
          { name: 'Competitor B', market_share: '15%', strengths: ['Feature rich'], weaknesses: ['Complex interface'], competitive_advantage: 'Simpler workflow' }
        ],
        
        // ICP (Ideal Customer Profile)
        icp: {
          demographics: { age_range: '25-45', income: '$50K-150K', location: 'Urban areas' },
          psychographics: { values: ['Efficiency', 'Innovation'], lifestyle: 'Tech-savvy professionals' },
          business_profile: { company_size: '10-500 employees', industry: 'Technology', role: 'Decision makers' }
        },
        
        // Problem statements
        problem_statements: [
          { problem: 'Current solutions are too expensive', impact: 'high', frequency: 'daily', market_size: 'large' },
          { problem: 'Existing tools lack integration', impact: 'medium', frequency: 'weekly', market_size: 'medium' }
        ],
        
        // App ideas (related)
        app_ideas: [
          { title: 'Mobile companion app', description: 'On-the-go access to core features', feasibility: 'high', market_demand: 'medium' },
          { title: 'Analytics dashboard', description: 'Advanced reporting and insights', feasibility: 'medium', market_demand: 'high' }
        ],
        
        // Reddit analysis
        analysis: `Based on comprehensive market research, "${idea}" shows strong potential in the current market landscape. 
        
Key findings:
• Strong user demand with 156 relevant discussions analyzed
• Positive sentiment (65%) indicates market readiness  
• Clear pain points identified that your solution addresses
• Competitive landscape shows room for innovation
• Revenue potential estimated at $50K-200K annually

Recommendations:
• Focus on MVP development with core features first
• Target early adopters in tech-savvy demographics  
• Consider freemium model for user acquisition
• Monitor competitive developments closely`,
        
        evidence: {
          real_post_count: 156,
          sentiment_breakdown: { positive: 101, neutral: 39, negative: 16 },
          top_keywords: ['innovative', 'needed', 'expensive', 'complex'],
          market_validation: 'strong'
        }
      }
    };

    console.log('✅ Sending mock analysis result');
    res.json(mockAnalysisResult);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Catch-all handler for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🌟 IDEAVORAGE LOCAL SERVER`);
  console.log(`✅ Running on http://localhost:${PORT}`);
  console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Perplexity Key: ${process.env.PERPLEXITY_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Reddit OAuth: ${process.env.REDDIT_CLIENT_ID ? 'Present' : 'Missing'}`);
  console.log(`📊 Open browser to: http://localhost:${PORT}`);
  console.log(`🧪 Test endpoint: POST http://localhost:${PORT}/api`);
});

module.exports = app;