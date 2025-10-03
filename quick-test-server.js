const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env' });

// Import the API handler
const { performRealAnalysis } = require('./api/index.ts');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Main API endpoint
app.post('/api', async (req, res) => {
  try {
    console.log('🚀 Received request:', req.body);
    
    const { idea, analysisType = 'reddit_plus_ai' } = req.body;
    
    if (!idea) {
      return res.status(400).json({
        success: false,
        error: 'Missing idea parameter'
      });
    }
    
    // Call the enhanced analysis function
    const result = await performRealAnalysis(idea, analysisType);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌟 Enhanced Universal Analysis Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment loaded: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Perplexity Key: ${process.env.PERPLEXITY_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Reddit OAuth: ${process.env.REDDIT_CLIENT_ID ? 'Present' : 'Missing'}`);
});

module.exports = app;