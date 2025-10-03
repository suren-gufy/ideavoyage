// Simple local server for testing comprehensive business validation
const http = require('http');
const url = require('url');

const PORT = 3000;

// Import environment variables
require('dotenv').config();

console.log('🔧 Starting simple test server...');
console.log('🔑 Perplexity Key:', process.env.PERPLEXITY_API_KEY ? 'Present' : 'Missing');
console.log('🔑 Reddit Client:', process.env.REDDIT_CLIENT_ID ? 'Present' : 'Missing');

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  
  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    // Simple test interface
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head>
          <title>Comprehensive Business Validation Test</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            textarea, input, button { width: 100%; padding: 10px; margin: 10px 0; }
            button { background: #007bff; color: white; border: none; cursor: pointer; }
            #result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>🚀 Comprehensive Business Validation Test</h1>
          <textarea id="idea" placeholder="Enter startup idea..." rows="3">AI-powered plant care assistant that monitors soil moisture</textarea>
          <input id="industry" placeholder="Industry (optional)" value="Smart Home">
          <input id="audience" placeholder="Target audience (optional)" value="Plant enthusiasts">
          <button onclick="testValidation()">🔍 Generate Business Report</button>
          <div id="result"></div>
          
          <script>
            async function testValidation() {
              const idea = document.getElementById('idea').value;
              const industry = document.getElementById('industry').value;
              const audience = document.getElementById('audience').value;
              const resultDiv = document.getElementById('result');
              
              resultDiv.innerHTML = '<p>🔄 Generating comprehensive business validation...</p>';
              
              try {
                const response = await fetch('/api', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ idea, industry, targetAudience: audience, analysisType: 'reddit_plus_ai' })
                });
                
                const result = await response.json();
                
                if (result.success) {
                  let html = '<h3>✅ Analysis Complete</h3>';
                  
                  if (typeof result.data.analysis === 'object') {
                    html += '<h4>🏢 Comprehensive Business Report Detected!</h4>';
                    html += '<p><strong>Sections Found:</strong></p><ul>';
                    
                    Object.keys(result.data.analysis).forEach(section => {
                      html += '<li>' + section.replace('_', ' ').toUpperCase() + '</li>';
                    });
                    
                    html += '</ul>';
                    
                    if (result.data.analysis.business_overview) {
                      html += '<h4>💰 Business Overview</h4>';
                      html += '<p>' + (result.data.analysis.business_overview.core_value_proposition || 'N/A') + '</p>';
                    }
                    
                  } else {
                    html += '<h4>⚠️ Simple Analysis Format</h4>';
                    html += '<pre>' + JSON.stringify(result.data.analysis, null, 2).substring(0, 500) + '...</pre>';
                  }
                  
                  html += '<p><strong>Subreddits:</strong> ' + (result.data.selectedSubreddits || []).join(', ') + '</p>';
                  html += '<p><strong>Reddit Posts:</strong> ' + (result.data.redditPosts || []).length + '</p>';
                  
                  resultDiv.innerHTML = html;
                } else {
                  resultDiv.innerHTML = '<p>❌ Error: ' + (result.error || 'Unknown') + '</p>';
                }
              } catch (error) {
                resultDiv.innerHTML = '<p>❌ Network Error: ' + error.message + '</p>';
              }
            }
          </script>
        </body>
      </html>
    `);
    return;
  }
  
  if (req.method === 'POST' && parsedUrl.pathname === '/api') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('🚀 Received request:', data);
        
        // Simple response for testing
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          data: {
            analysis: {
              message: "This is a test server. The comprehensive business validation is deployed at the main site.",
              structure_detected: "simple_test_format",
              note: "Please use the web interface at the deployed URL to test the full comprehensive business validation system."
            },
            selectedSubreddits: ["testsubreddit1", "testsubreddit2"],
            redditPosts: [{title: "Test post for validation"}]
          }
        }));
        
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🌟 Simple test server running on http://localhost:${PORT}`);
  console.log(`📊 Open browser to test: http://localhost:${PORT}`);
  console.log(`🔍 This is for testing - full system is deployed at: https://ideavoyage-i2z8xrg1f-surendhars-projects-15fcb9f7.vercel.app`);
});

module.exports = server;