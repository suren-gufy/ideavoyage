import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Register all routes
registerRoutes(app);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // Set environment variables from Vercel
  process.env.NODE_ENV = 'production';

  return new Promise<void>((resolve, reject) => {
    // Create a mock Express request/response from Vercel objects
    const mockReq = Object.assign(req, {
      get: (header: string) => req.headers[header.toLowerCase()],
      header: (header: string) => req.headers[header.toLowerCase()],
    });

    const mockRes = Object.assign(res, {
      json: (data: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      },
      send: (data: any) => {
        res.end(typeof data === 'string' ? data : JSON.stringify(data));
      },
      status: (code: number) => {
        res.statusCode = code;
        return res;
      },
    });

    app(mockReq as any, mockRes as any, (err?: any) => {
      if (err) {
        console.error('App error:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};