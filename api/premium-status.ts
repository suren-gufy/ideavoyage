import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, return free tier status
    // In the future, this could check user authentication and subscription status
    return res.json({
      isPremium: false,
      plan: 'free',
      features: {
        basicAnalysis: true,
        advancedAnalysis: false,
        unlimitedReports: false,
        prioritySupport: false,
        exportPDF: false,
        customBranding: false
      },
      limits: {
        reportsPerMonth: 10,
        reportsUsed: 0
      },
      message: 'Free tier - upgrade to Premium for advanced features',
      upgradeUrl: '/premium'
    });
  } catch (error) {
    console.error('Premium status error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      isPremium: false,
      plan: 'free'
    });
  }
}