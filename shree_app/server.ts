import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes.ts';
import { checkDatabaseHealth } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api', apiRouter);

  // Initial database check (non-blocking lazy attempt)
  checkDatabaseHealth()
    .then((status) => {
      if (status.connected) {
        console.log(`[Database] Connected to PostgreSQL at ${status.host}:${status.port}/${status.database}`);
      } else {
        console.log(`[Database] PostgreSQL not connected yet: ${status.error}`);
        console.log(`[Database] Configured JDBC: ${status.jdbcUrl}`);
      }
    })
    .catch((err) => {
      console.warn('[Database] Initial health check deferred:', err.message);
    });

  if (!isProd) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
