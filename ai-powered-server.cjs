// Quick test of the API with AI-powered analysis
const express = require('express');
const app = express();
const { analyzeStartupWithAI } = require('./ai-powered-analysis.cjs');

app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { idea } = req.body;
    console.log(`🎯 API analyzing: "${idea}"`);
    
    // Use AI-powered analysis
    const aiResult = await analyzeStartupWithAI(idea);
    
    // Mock response with AI-discovered subreddits
    const response = {
      analysis: {
        industry: aiResult.data.industry,
        target_audience: aiResult.data.target_audience,
        business_model: aiResult.data.business_model,
        ai_powered: aiResult.success
      },
      subreddits: aiResult.subreddits,
      posts: [
        {
          title: `Sample post for ${idea.substring(0, 30)}...`,
          score: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          url: "https://reddit.com/sample",
          subreddit: aiResult.subreddits[0] || 'startups'
        }
      ],
      summary: `AI analysis ${aiResult.success ? 'successfully' : 'with fallback'} found ${aiResult.subreddits.length} relevant communities for market research.`
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 AI-Powered API running on http://localhost:${PORT}`);
  console.log('✅ Ready to analyze ANY startup idea intelligently!');
});

module.exports = app;