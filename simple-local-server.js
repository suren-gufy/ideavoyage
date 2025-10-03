const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client/dist'));

// Forward API requests to the Vercel API endpoint
app.post('/api', async (req, res) => {
  try {
    console.log('🔄 Forwarding request to Perplexity-powered API...');
    
    // Import the API handler that uses Perplexity
    const { default: handler } = await import('./api/index.ts');
    
    // Create mock Vercel request/response objects
    const mockReq = {
      method: 'POST',
      body: req.body,
      headers: req.headers
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => res.status(code).json(data)
      }),
      json: (data) => res.json(data)
    };
    
    await handler(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ API forwarding error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 IdeaVoyage server running on http://localhost:${PORT}`);
  console.log(`✅ Using Perplexity API for analysis (same as deployed version)`);
});