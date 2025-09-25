// Simple Vercel serverless function
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple test endpoint
  if (req.method === 'GET') {
    return res.json({ message: 'API is working', timestamp: new Date().toISOString() });
  }

  // For now, return a simple response for all other methods
  return res.json({ 
    message: 'Vercel deployment successful',
    method: req.method,
    path: req.url
  });
}