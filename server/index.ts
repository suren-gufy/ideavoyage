import dotenv from 'dotenv';
// Load environment variables first, before anything else
dotenv.config({ override: true });

// Ensure NODE_ENV is set for development
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log('🔍 Server - app.get("env"):', app.get("env"));
  console.log('🔍 Server - process.env.NODE_ENV:', process.env.NODE_ENV);
  console.log('🔍 Server - All env vars:', Object.keys(process.env).filter(k => k.includes('NODE')));
  
  // Setup Vite in development or serve static files in production
  if (app.get("env") === "development") {
    console.log('✅ Setting up Vite development server');
    await setupVite(app, null); // Pass null for server since we're using app.listen
  } else {
    console.log('❌ Serving static files (production mode)');
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  console.log('🔍 About to start server on port:', port);
  
  // Try using app.listen directly instead of server.listen
  const appServer = app.listen(port, () => {
    log(`serving on port ${port}`);
    console.log('✅ App listening callback executed successfully');
    console.log('🔍 App server address:', appServer.address());
  });
  
  appServer.on('error', (error) => {
    console.error('❌ App server error:', error);
  });
  
  console.log('🔍 App.listen() called, waiting for callback...');
})();
