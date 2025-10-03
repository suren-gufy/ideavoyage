import dotenv from 'dotenv';
dotenv.config({ override: true });

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Import the API handler from the api directory
const handler = await import('../api/index.js');

// API endpoint
app.all('/api', async (req, res) => {
  try {
    // Create a mock Vercel request/response object
    const mockReq = {
      method: req.method,
      body: req.body,
      query: req.query,
      headers: req.headers
    };

    const mockRes = {
      status: (code) => {
        res.status(code);
        return mockRes;
      },
      json: (data) => {
        res.json(data);
        return mockRes;
      }
    };

    // Call the Vercel handler
    await handler.default(mockReq, mockRes);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Perplexity Key: ${process.env.PERPLEXITY_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`🔑 Reddit OAuth: ${process.env.REDDIT_CLIENT_ID ? 'Present' : 'Missing'}`);
});