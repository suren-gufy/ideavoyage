const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env' });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import the enhanced API function
const { default: apiHandler } = require('./api/index.ts');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Local server with comprehensive business analysis is running',
    timestamp: new Date().toISOString()
  });
});

// Main API endpoint - directly use the Vercel API handler
app.post('/api', async (req, res) => {
  try {
    console.log('🚀 Received request for comprehensive business analysis:', req.body);
    
    // Create mock Vercel request/response objects
    const mockReq = {
      method: 'POST',
      body: req.body,
      headers: req.headers,
      query: req.query
    };
    
    const mockRes = {
      status: (code) => {
        res.status(code);
        return mockRes;
      },
      json: (data) => {
        res.json(data);
        return mockRes;
      },
      send: (data) => {
        res.send(data);
        return mockRes;
      },
      setHeader: (name, value) => {
        res.setHeader(name, value);
      }
    };
    
    // Call the API handler
    await apiHandler(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      details: 'Check console for full error details'
    });
  }
});

// Serve static files for testing
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>IdeaVoyage - Comprehensive Business Validation</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .form-group { margin: 15px 0; }
          input, textarea, button { width: 100%; padding: 10px; margin: 5px 0; }
          button { background: #007bff; color: white; border: none; cursor: pointer; }
          button:hover { background: #0056b3; }
          .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
          .section { margin: 10px 0; padding: 10px; border-left: 3px solid #007bff; }
        </style>
      </head>
      <body>
        <h1>🚀 IdeaVoyage - Comprehensive Business Validation</h1>
        <p>Generate professional business validation reports with real Reddit market research!</p>
        
        <form id="analysisForm">
          <div class="form-group">
            <label>💡 Startup Idea:</label>
            <textarea id="idea" placeholder="Enter your startup idea..." required></textarea>
          </div>
          <div class="form-group">
            <label>🏢 Industry:</label>
            <input type="text" id="industry" placeholder="e.g., Technology, Health, Finance" />
          </div>
          <div class="form-group">
            <label>👥 Target Audience:</label>
            <input type="text" id="targetAudience" placeholder="e.g., Young professionals, Parents" />
          </div>
          <button type="submit">🔍 Generate Comprehensive Business Report</button>
        </form>
        
        <div id="result" class="result" style="display: none;">
          <h2>📊 Business Validation Report</h2>
          <div id="reportContent"></div>
        </div>
        
        <script>
          document.getElementById('analysisForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const idea = document.getElementById('idea').value;
            const industry = document.getElementById('industry').value;
            const targetAudience = document.getElementById('targetAudience').value;
            
            const resultDiv = document.getElementById('result');
            const contentDiv = document.getElementById('reportContent');
            
            contentDiv.innerHTML = '<p>🔄 Generating comprehensive business validation report...</p>';
            resultDiv.style.display = 'block';
            
            try {
              const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  idea,
                  industry,
                  targetAudience,
                  analysisType: 'reddit_plus_ai'
                })
              });
              
              const result = await response.json();
              
              if (result.success && result.data) {
                const analysis = result.data.analysis;
                let html = '';
                
                if (typeof analysis === 'object') {
                  // Display structured business report
                  if (analysis.business_overview) {
                    html += '<div class="section"><h3>🏢 Business Overview</h3>';
                    html += '<p><strong>Viability:</strong> ' + (analysis.business_overview.business_viability || 'N/A') + '</p>';
                    html += '<p><strong>Value Proposition:</strong> ' + (analysis.business_overview.core_value_proposition || 'N/A') + '</p>';
                    if (analysis.business_overview.monetization_strategies) {
                      html += '<p><strong>Monetization (' + analysis.business_overview.monetization_strategies.length + ' strategies):</strong></p><ul>';
                      analysis.business_overview.monetization_strategies.slice(0, 3).forEach(strategy => {
                        html += '<li>' + (strategy.strategy || strategy) + '</li>';
                      });
                      html += '</ul>';
                    }
                    html += '</div>';
                  }
                  
                  if (analysis.market_research) {
                    html += '<div class="section"><h3>🎯 Market Research</h3>';
                    if (analysis.market_research.market_size) {
                      html += '<p><strong>Market Size:</strong> TAM: ' + (analysis.market_research.market_size.tam || 'N/A') + '</p>';
                    }
                    if (analysis.market_research.competitive_analysis) {
                      html += '<p><strong>Competitors:</strong> ' + analysis.market_research.competitive_analysis.length + ' analyzed</p>';
                    }
                    html += '</div>';
                  }
                  
                  if (analysis.launch_and_scale) {
                    html += '<div class="section"><h3>🚀 Launch & Scale</h3>';
                    if (analysis.launch_and_scale.mvp_roadmap) {
                      html += '<p><strong>MVP Roadmap:</strong> ' + analysis.launch_and_scale.mvp_roadmap.length + ' milestones</p>';
                    }
                    if (analysis.launch_and_scale.guerrilla_marketing) {
                      html += '<p><strong>Marketing Tactics:</strong> ' + analysis.launch_and_scale.guerrilla_marketing.length + ' ideas</p>';
                    }
                    html += '</div>';
                  }
                  
                  if (analysis.capital_raising) {
                    html += '<div class="section"><h3>💰 Capital Raising</h3>';
                    if (analysis.capital_raising.elevator_pitch) {
                      html += '<p><strong>Elevator Pitch:</strong> ' + analysis.capital_raising.elevator_pitch + '</p>';
                    }
                    if (analysis.capital_raising.funding_required) {
                      html += '<p><strong>Funding:</strong> Available</p>';
                    }
                    html += '</div>';
                  }
                } else {
                  html = '<pre>' + analysis + '</pre>';
                }
                
                html += '<div class="section"><h3>📱 Reddit Analysis</h3>';
                html += '<p><strong>Communities:</strong> ' + (result.data.selectedSubreddits || []).join(', ') + '</p>';
                html += '<p><strong>Posts Analyzed:</strong> ' + (result.data.redditPosts || []).length + '</p>';
                html += '</div>';
                
                contentDiv.innerHTML = html;
              } else {
                contentDiv.innerHTML = '<p>❌ Error: ' + (result.error || 'Unknown error') + '</p>';
              }
              
            } catch (error) {
              contentDiv.innerHTML = '<p>❌ Network Error: ' + error.message + '</p>';
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🌟 COMPREHENSIVE BUSINESS VALIDATION SERVER`);
  console.log(`✅ Running on http://localhost:${PORT}`);
  console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Perplexity Key: ${process.env.PERPLEXITY_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Reddit OAuth: ${process.env.REDDIT_CLIENT_ID ? 'Present' : 'Missing'}`);
  console.log(``);
  console.log(`📊 Open browser to: http://localhost:${PORT}`);
  console.log(`🧪 Test endpoint: POST http://localhost:${PORT}/api`);
});

module.exports = app;