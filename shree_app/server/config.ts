import fs from 'fs';
import path from 'path';

export interface DatabaseConfig {
  jdbc: {
    url: string;
    user?: string;
    password?: string;
    driver?: string;
    ssl?: boolean | string;
    maxPoolSize?: number;
    connectionTimeoutMs?: number;
  };
  jwt: {
    secret: string;
    algorithm?: string;
    expiresIn?: string;
  };
  security: {
    bcryptSaltRounds?: number;
    minPasswordLength?: number;
  };
}

const CONFIG_PATH = path.resolve(process.cwd(), 'config', 'database.json');

export function loadDatabaseConfig(): DatabaseConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      throw new Error(`Configuration file not found at ${CONFIG_PATH}`);
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseConfig;
  } catch (error) {
    console.error('Error loading config/database.json:', error);
    // Return standard default config
    return {
      jdbc: {
        url: 'jdbc:postgresql://localhost:5432/postgres',
        user: 'postgres',
        password: '',
        driver: 'org.postgresql.Driver',
        ssl: false,
        maxPoolSize: 10,
        connectionTimeoutMs: 5000,
      },
      jwt: {
        secret: 'super_secret_jwt_key_change_in_production_min_32_bytes_long',
        algorithm: 'HS256',
        expiresIn: '24h',
      },
      security: {
        bcryptSaltRounds: 12,
        minPasswordLength: 8,
      },
    };
  }
}

export function saveDatabaseConfig(config: DatabaseConfig): void {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export interface ParsedJdbcDetails {
  host: string;
  port: number;
  database: string;
  user: string;
  password?: string;
  ssl: boolean | { rejectUnauthorized: boolean };
}

export function parseJdbcPostgresUrl(
  jdbcUrl: string,
  fallbackUser = 'postgres',
  fallbackPassword = '',
  sslOverride: boolean | string = false
): ParsedJdbcDetails {
  if (!jdbcUrl.startsWith('jdbc:postgresql://')) {
    throw new Error(
      `Invalid JDBC PostgreSQL URL: "${jdbcUrl}". Expected format starting with "jdbc:postgresql://"`
    );
  }

  // Strip 'jdbc:'
  const cleanUrl = jdbcUrl.replace(/^jdbc:/, '');
  const parsed = new URL(cleanUrl);

  const host = parsed.hostname || 'localhost';
  const port = parsed.port ? parseInt(parsed.port, 10) : 5432;
  const database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'postgres';

  const user = parsed.username || fallbackUser || 'postgres';
  const password = parsed.password || fallbackPassword || '';

  const sslParam = parsed.searchParams.get('ssl') || parsed.searchParams.get('sslmode');
  const requireSsl =
    sslOverride === true ||
    sslOverride === 'require' ||
    sslOverride === 'true' ||
    sslParam === 'true' ||
    sslParam === 'require' ||
    sslParam === 'verify-ca' ||
    sslParam === 'verify-full';

  return {
    host,
    port,
    database: database || 'postgres',
    user,
    password,
    ssl: requireSsl ? { rejectUnauthorized: false } : false,
  };
}
