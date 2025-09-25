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
    // For now, return a basic response to test deployment
    if (req.method === 'GET') {
      return res.json({ 
        message: 'IdeaVoyage API is running on Vercel',
        timestamp: new Date().toISOString(),
        endpoint: req.url
      });
    }

    if (req.method === 'POST' && req.url?.includes('/analyze')) {
      // Mock analysis response for testing
      return res.json({
        message: 'Analysis endpoint working',
        idea: req.body?.idea || 'No idea provided',
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