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
    // Simple test endpoint
    if (req.method === 'GET') {
      return res.json({ 
        message: 'IdeaVoyage API is working!',
        timestamp: new Date().toISOString(),
        version: '2.0',
        endpoint: req.url
      });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      
      // Mock analysis endpoint
      if (req.url?.includes('analyze')) {
        return res.json({
          message: 'Analysis completed successfully',
          idea: body.idea || 'Sample idea',
          score: 8.5,
          status: 'success',
          timestamp: new Date().toISOString()
        });
      }

      return res.json({
        message: 'POST request received',
        data: body,
        status: 'success'
      });
    }

    return res.status(404).json({ 
      error: 'Endpoint not found',
      method: req.method,
      url: req.url
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}