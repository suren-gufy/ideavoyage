import dotenv from 'dotenv';
dotenv.config({ override: true });

import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

// Import our API routes
import { registerRoutes } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Register API routes
await registerRoutes(app);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple catch-all for any non-API routes
app.get('*', (req, res) => {
  // If it's requesting the root, serve a simple index
  if (req.path === '/') {
    res.redirect('/simple-test.html');
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>404 - Not Found</title></head>
      <body>
        <h1>404 - Not Found</h1>
        <p>Path: ${req.path}</p>
        <p><a href="/simple-test.html">Go to API Test Page</a></p>
      </body>
      </html>
    `);
  }
});

const port = parseInt(process.env.PORT || '5000', 10);

console.log('🚀 Starting simple server...');
console.log('📁 Public directory:', path.join(__dirname, 'public'));
console.log('🌐 Server will be available at: http://localhost:' + port);

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log('🧪 Test page: http://localhost:' + port + '/simple-test.html');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

export default app;