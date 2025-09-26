import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
// Import as a dynamic import to avoid TypeScript project reference issues
import type { UserConfig } from "vite";

// Helper type to handle AbortSignal correctly
type AbortSignalWithStatics = AbortSignal & {
  timeout?: (ms: number) => AbortSignal;
  any?: (signals: AbortSignal[]) => AbortSignal;
  abort?: (reason?: any) => AbortSignal;
};

// Use type assertion when needed
const AbortSignalEnhanced = AbortSignal as unknown as AbortSignalWithStatics;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server?: Server | null) {
  // In production we should NOT spin up a Vite dev server – just serve the built assets.
  if (process.env.NODE_ENV === "production") {
    log("Detected production environment – skipping Vite dev middleware and serving static build instead", "vite");
    serveStatic(app);
    return;
  }

  try {
    const serverOptions = {
      middlewareMode: true,
      hmr: server ? { server } : false,
      allowedHosts: true as const,
    };

    // Create a basic Vite config directly without importing
    // This avoids TS reference errors and file resolution issues
    const baseViteConfig: UserConfig = {
      plugins: [],
      build: {
        outDir: 'dist'
      },
      server: {
        port: 3000
      },
      optimizeDeps: {
        esbuildOptions: {
          target: 'es2020'
        }
      }
    }
    
    const vite = await createViteServer({
      // ensure root so relative plugin paths resolve the same as CLI
      root: path.resolve(__dirname, ".."),
      ...baseViteConfig,
      configFile: false,
      customLogger: {
        ...viteLogger,
        error: (msg, options) => {
          viteLogger.error(msg, options);
          // Don't exit on Vite errors - just log them
        },
      },
      server: serverOptions,
      appType: "custom",
    });

    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const clientTemplate = path.resolve(
          __dirname,
          "..",
          "client",
          "index.html",
        );

        // Always reload the index.html file from disk in case it changes during dev
        let template = await fs.promises.readFile(clientTemplate, "utf-8");

        // More robust cache-busting: replace ANY /src/main.(jt|t)sx occurrence
        template = template.replace(
          /src="\/src\/main\.(t|j)sx"/,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );

        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        log(`Error rendering dev index.html: ${(e as Error).message}`, "vite");
        next(e);
      }
    });
  } catch (err) {
    log(`Failed to start Vite dev server: ${(err as Error).message}`, "vite");
    // Fallback to static serving so development isn't completely blocked
    try {
      serveStatic(app);
    } catch (staticErr) {
      log(`Static fallback also failed: ${(staticErr as Error).message}`, "vite");
      throw err; // rethrow original error
    }
  }
}

export function serveStatic(app: Express) {
  // Try multiple possible paths for the static files
  // This handles both local development and Vercel production environments
  const possiblePaths = [
    path.resolve(__dirname, "public"),  // Local dev server path
    path.resolve(process.cwd(), "dist/public"),  // Vercel production path
    path.resolve(process.cwd(), "public"),  // Another common path
    path.resolve(__dirname, "..", "dist/public")  // Relative to server directory
  ];
  
  // Find the first path that exists
  const distPath = possiblePaths.find(p => fs.existsSync(p));
  
  if (!distPath) {
    console.warn(`Could not find static build directory. Tried: ${possiblePaths.join(', ')}`);
    throw new Error(
      `Could not find any build directory, make sure to build the client first`,
    );
  }
  
  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
