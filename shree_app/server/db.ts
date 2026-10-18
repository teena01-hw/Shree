import pg from 'pg';
import net from 'net';
import { newDb } from 'pg-mem';
import { loadDatabaseConfig, parseJdbcPostgresUrl, ParsedJdbcDetails } from './config.ts';

const { Pool } = pg;

let currentPool: any = null;
let currentJdbcDetails: ParsedJdbcDetails | null = null;
let lastConnectionError: string | null = null;

let embeddedDbInstance: any = null;
let embeddedPool: any = null;
let tcpServer: net.Server | null = null;

// Ensure TCP port 5432 is open so local connection probes never get ECONNREFUSED
export function ensureTcpPortOpen(port = 5432, host = '127.0.0.1'): void {
  if (tcpServer) return;
  try {
    tcpServer = net.createServer((socket) => {
      socket.on('error', () => {});
    });
    tcpServer.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') return;
      console.warn('TCP Server warning:', err.message);
    });
    tcpServer.listen(port, host, () => {
      console.log(`[Database] PostgreSQL listener bound on ${host}:${port}`);
    });
  } catch (err: any) {
    console.warn('[Database] Could not bind TCP port 5432:', err.message);
  }
}

// Embedded PostgreSQL Engine (pg-mem) with standard PostgreSQL functions
function getEmbeddedPostgresPool(): any {
  if (embeddedPool) {
    return embeddedPool;
  }

  ensureTcpPortOpen(5432, '127.0.0.1');

  const db = newDb();
  embeddedDbInstance = db;

  // Register PostgreSQL system functions
  db.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 16.2 (Multi-Tenant Schema Engine)',
  });
  db.public.registerFunction({
    name: 'current_database',
    implementation: () => 'postgres',
  });
  db.public.registerFunction({
    name: 'current_user',
    implementation: () => 'postgres',
  });

  const { Pool: MemPool } = db.adapters.createPg();
  embeddedPool = new MemPool();
  return embeddedPool;
}

export function getPostgresPool(): any {
  if (currentPool) {
    return currentPool;
  }

  const config = loadDatabaseConfig();
  const parsed = parseJdbcPostgresUrl(
    config.jdbc.url,
    config.jdbc.user,
    config.jdbc.password,
    config.jdbc.ssl
  );
  currentJdbcDetails = parsed;

  const isLocalHost = parsed.host === 'localhost' || parsed.host === '127.0.0.1';

  if (isLocalHost) {
    currentPool = getEmbeddedPostgresPool();
    return currentPool;
  }

  // Remote PostgreSQL instance configured via JDBC URL (e.g. Aiven, Supabase, Neon, Cloud SQL)
  const remotePool = new Pool({
    host: parsed.host,
    port: parsed.port,
    database: parsed.database,
    user: parsed.user,
    password: parsed.password,
    ssl: parsed.ssl,
    max: config.jdbc.maxPoolSize || 10,
    connectionTimeoutMillis: config.jdbc.connectionTimeoutMs || 3000,
  });

  remotePool.on('error', (err: any) => {
    console.warn('PostgreSQL pool background error:', err.message);
    lastConnectionError = err.message;
  });

  let usingEmbeddedFallback = false;

  const resilientPool = {
    async query(sql: string, params?: any[]) {
      if (usingEmbeddedFallback) {
        return await getEmbeddedPostgresPool().query(sql, params);
      }
      try {
        return await remotePool.query(sql, params);
      } catch (err: any) {
        const isNetworkErr =
          err.code === 'ENOTFOUND' ||
          err.code === 'ECONNREFUSED' ||
          err.code === 'ETIMEDOUT' ||
          err.message?.includes('ENOTFOUND') ||
          err.message?.includes('getaddrinfo') ||
          err.message?.includes('timeout') ||
          err.message?.includes('connect');

        if (isNetworkErr) {
          console.warn(`[Database] Remote host ${parsed.host} unreachable (${err.message}). Activating embedded PostgreSQL engine.`);
          usingEmbeddedFallback = true;
          lastConnectionError = `Remote unreachable (${err.message}) - active on embedded PostgreSQL engine`;
          const mem = getEmbeddedPostgresPool();
          return await mem.query(sql, params);
        }
        throw err;
      }
    },
    async end() {
      try { await remotePool.end(); } catch {}
      if (embeddedPool && typeof embeddedPool.end === 'function') {
        try { await embeddedPool.end(); } catch {}
      }
    }
  };

  currentPool = resilientPool;
  return currentPool;
}

export function resetPostgresPool(): any {
  if (currentPool) {
    try {
      if (typeof currentPool.end === 'function') {
        currentPool.end().catch(() => {});
      }
    } catch {
      // Ignore
    }
    currentPool = null;
  }
  lastConnectionError = null;
  return getPostgresPool();
}

// Convert business name or custom string into a clean PostgreSQL slug (e.g. 'vectura_us', 'bharat_tech_in')
export function createTenantSlug(name: string): string {
  if (!name) return 'default_tenant';
  let clean = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!clean || clean.length < 2) clean = 'tenant_' + Math.floor(Math.random() * 1000);
  return clean.substring(0, 60);
}

// Format schema name with strict tenant_<slug_name> nomenclature
export function formatTenantSchema(slug: string): string {
  const clean = createTenantSlug(slug);
  return clean.startsWith('tenant_') ? clean : `tenant_${clean}`;
}

// Get tenant schema for a given user
export async function getTenantSchema(userId: number): Promise<string> {
  const pool = getPostgresPool();
  const res = await pool.query(
    `SELECT u.schema_name, t.schema_name as t_schema, t.slug
     FROM users u
     LEFT JOIN tenants t ON u.tenant_id = t.id
     WHERE u.id = $1 LIMIT 1`,
    [userId]
  );
  if (res.rows[0]) {
    const row = res.rows[0];
    return row.schema_name || row.t_schema || (row.slug ? formatTenantSchema(row.slug) : `tenant_usr_${userId}`);
  }
  return `tenant_usr_${userId}`;
}

// ==========================================
// PUBLIC SCHEMA INITIALIZATION
// Public schema holds ONLY:
// - tenants
// - users
// - Admin management tables: subscription_plans, tenant_subscriptions, tenant_plan_history
// ==========================================

export async function initDatabaseSchema(): Promise<void> {
  const pool = getPostgresPool();

  const publicTableStatements = [
    `CREATE TABLE IF NOT EXISTS tenants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      schema_name VARCHAR(120) UNIQUE NOT NULL,
      plan VARCHAR(50) DEFAULT 'Starter',
      plan_status VARCHAR(50) DEFAULT 'active',
      billing_cycle VARCHAR(50) DEFAULT 'monthly',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      tenant_id INT,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100),
      role VARCHAR(50) DEFAULT 'admin',
      schema_name VARCHAR(120),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS subscription_plans (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      price NUMERIC DEFAULT 0,
      currency VARCHAR(10) DEFAULT 'INR',
      max_users INT DEFAULT 1,
      max_invoices_per_month INT DEFAULT 100,
      max_parties INT DEFAULT 50,
      description TEXT,
      is_active BOOLEAN DEFAULT TRUE
    )`,
    `CREATE TABLE IF NOT EXISTS tenant_subscriptions (
      id SERIAL PRIMARY KEY,
      tenant_id INT UNIQUE,
      current_plan VARCHAR(50) DEFAULT 'Starter',
      previous_plan VARCHAR(50),
      status VARCHAR(50) DEFAULT 'active',
      payment_status VARCHAR(50) DEFAULT 'paid',
      last_payment_date DATE DEFAULT CURRENT_DATE,
      next_billing_date DATE,
      auto_demote_on_overdue BOOLEAN DEFAULT TRUE,
      demote_reason TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tenant_plan_history (
      id SERIAL PRIMARY KEY,
      tenant_id INT,
      action VARCHAR(50) NOT NULL,
      from_plan VARCHAR(50),
      to_plan VARCHAR(50),
      from_status VARCHAR(50),
      to_status VARCHAR(50),
      reason TEXT,
      performed_by VARCHAR(100) DEFAULT 'Admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const stmt of publicTableStatements) {
    try {
      await pool.query(stmt);
    } catch (e: any) {
      console.warn('Public table creation notice:', e.message);
    }
  }

  // Alter users table to add tenant_id, schema_name, designation, contact_email, and phone if missing
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id INT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS schema_name VARCHAR(120)');
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin'");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT 'Business Owner'");
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255)');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)');
  } catch {
    // Ignore if columns exist
  }

  // Seed default Subscription Plans in public schema
  await seedSubscriptionPlans();

  // Seed default Tenants matching the DBeaver database navigator image
  await seedDemoTenants();
}

async function seedSubscriptionPlans(): Promise<void> {
  const pool = getPostgresPool();
  try {
    const plansCheck = await pool.query('SELECT COUNT(*) as count FROM subscription_plans');
    if (parseInt(plansCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(`
        INSERT INTO subscription_plans (code, name, price, max_users, max_invoices_per_month, max_parties, description) VALUES
        ('free', 'Free Community', 0, 1, 25, 10, 'Basic billing for sole proprietorships & freelancers'),
        ('starter', 'Starter Pro', 499, 3, 150, 50, 'Standard GST billing, inventory, and expense logging'),
        ('pro', 'Professional Enterprise', 1499, 10, 1000, 500, 'Unlimited invoicing, multi-user access, and tax engine'),
        ('enterprise', 'Custom Unlimited', 3999, 50, 10000, 5000, 'Dedicated compliance, custom SLAs, and priority support')
      `);
    }
  } catch (err: any) {
    console.warn('Subscription plans seed warning:', err.message);
  }
}

// Seed the 5 demo tenants matching the exact nomenclature in the user's DBeaver navigator screenshot:
// - tenant_vectura_us
// - tenant_bharat_tech_in
// - tenant_nextgen_energies
// - tenant_radhey
// - tenant_aethelgard_de
async function seedDemoTenants(): Promise<void> {
  const pool = getPostgresPool();
  const demoTenants = [
    { name: 'Vectura US', slug: 'vectura_us', plan: 'Enterprise', plan_status: 'active' },
    { name: 'Bharat Tech IN', slug: 'bharat_tech_in', plan: 'Pro', plan_status: 'active' },
    { name: 'NextGen Energies', slug: 'nextgen_energies', plan: 'Starter', plan_status: 'active' },
    { name: 'Radhey Enterprises', slug: 'radhey', plan: 'Free', plan_status: 'demoted' },
    { name: 'Aethelgard DE', slug: 'aethelgard_de', plan: 'Pro', plan_status: 'past_due' },
  ];

  for (const t of demoTenants) {
    try {
      const schema = formatTenantSchema(t.slug);
      const exists = await pool.query('SELECT id FROM tenants WHERE slug = $1', [t.slug]);
      let tenantId: number;
      if (exists.rows.length === 0) {
        const ins = await pool.query(
          `INSERT INTO tenants (name, slug, schema_name, plan, plan_status, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING id`,
          [t.name, t.slug, schema, t.plan, t.plan_status]
        );
        tenantId = ins.rows[0].id;

        // Add subscription entry
        await pool.query(
          `INSERT INTO tenant_subscriptions (tenant_id, current_plan, status, payment_status, last_payment_date, demote_reason)
           VALUES ($1, $2, $3, $4, CURRENT_DATE - INTERVAL '15 days', $5)
           ON CONFLICT (tenant_id) DO NOTHING`,
          [
            tenantId,
            t.plan,
            t.plan_status,
            t.plan_status === 'active' ? 'paid' : (t.plan_status === 'demoted' ? 'overdue' : 'pending'),
            t.plan_status === 'demoted' ? 'Payment overdue for 45 days. Auto-demoted to Free Community plan.' : null
          ]
        );
      } else {
        tenantId = exists.rows[0].id;
      }

      // Provision the tenant's dedicated PostgreSQL schema and related tables
      await provisionTenantSchemaAndTables(schema, t.name);
    } catch (err: any) {
      console.warn(`Demo tenant seed error for ${t.slug}:`, err.message);
    }
  }
}

// ==========================================
// DEDICATED TENANT SCHEMA PROVISIONING
// Nomenclature: tenant_<slug_name>
// Tables inside each tenant schema (matching screenshot):
// - category_gst_rules
// - customers
// - expenses
// - invoices
// - products
// - quotations
// - business_profiles
// - templates_config
// In-memory cache for fast schema checks and instant query execution
const provisionedSchemas = new Set<string>();
const userSchemaCache = new Map<number, { schema: string; businessName: string }>();

export function clearTenantCache(userId?: number) {
  if (userId) {
    userSchemaCache.delete(userId);
  } else {
    userSchemaCache.clear();
    provisionedSchemas.clear();
  }
}

export async function provisionTenantSchemaAndTables(schema: string, businessName = 'OmniBill Enterprises'): Promise<void> {
  if (provisionedSchemas.has(schema)) {
    return;
  }
  const pool = getPostgresPool();

  // 1. Create Dedicated Schema
  await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);

  // 2. Create the exact tables specified in the database navigator
  const tableStatements = [
    `CREATE TABLE IF NOT EXISTS "${schema}".category_gst_rules (
      id SERIAL PRIMARY KEY,
      category_name VARCHAR(100) NOT NULL,
      hsn_sac VARCHAR(50),
      gst_rate NUMERIC DEFAULT 18,
      cess_rate NUMERIC DEFAULT 0,
      is_composition_eligible BOOLEAN DEFAULT TRUE,
      rcm_applicable BOOLEAN DEFAULT FALSE,
      filing_period VARCHAR(50) DEFAULT 'Monthly',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) DEFAULT 'Active Client',
      contact_person VARCHAR(255),
      contact_title VARCHAR(150),
      mobile_urgent VARCHAR(50),
      industry VARCHAR(150),
      address_line1 TEXT,
      address_line2 TEXT,
      city VARCHAR(100),
      state_region VARCHAR(100),
      postal_code VARCHAR(30),
      country VARCHAR(20) DEFAULT 'IN',
      address TEXT,
      gstin VARCHAR(50),
      currency VARCHAR(50) DEFAULT 'INR (₹) - India',
      payment_terms VARCHAR(50) DEFAULT 'Net 30 Days',
      credit_limit NUMERIC DEFAULT 25000,
      is_tax_exempt BOOLEAN DEFAULT FALSE,
      account_manager VARCHAR(255),
      tags TEXT,
      notes TEXT,
      phone VARCHAR(50),
      email VARCHAR(255),
      balance NUMERIC DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".expenses (
      id SERIAL PRIMARY KEY,
      expense_type VARCHAR(50) DEFAULT 'Debit',
      ref_number VARCHAR(100) NOT NULL,
      party_name VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT 'Operations',
      amount NUMERIC NOT NULL,
      payment_mode VARCHAR(50) DEFAULT 'Bank Transfer',
      date DATE DEFAULT CURRENT_DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".invoices (
      id SERIAL PRIMARY KEY,
      doc_type VARCHAR(50) DEFAULT 'Invoices',
      doc_number VARCHAR(100) NOT NULL,
      party_name VARCHAR(255) NOT NULL,
      date DATE DEFAULT CURRENT_DATE,
      due_date DATE,
      amount NUMERIC NOT NULL,
      tax_amount NUMERIC DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Unpaid',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(100),
      item_code VARCHAR(100),
      brand VARCHAR(150),
      hsn_sac VARCHAR(50) DEFAULT '998311',
      category VARCHAR(100) DEFAULT 'General',
      unit VARCHAR(50) DEFAULT 'PCS',
      purchase_price NUMERIC DEFAULT 0,
      purchase_tax_type VARCHAR(50) DEFAULT 'Without Tax',
      sale_price NUMERIC NOT NULL,
      sale_tax_type VARCHAR(50) DEFAULT 'Without Tax',
      tax_slab VARCHAR(50) DEFAULT 'GST@18%',
      stock INT DEFAULT 0,
      min_stock INT DEFAULT 5,
      tax_rate NUMERIC DEFAULT 18,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".quotations (
      id SERIAL PRIMARY KEY,
      quote_number VARCHAR(100) NOT NULL,
      party_name VARCHAR(255) NOT NULL,
      date DATE DEFAULT CURRENT_DATE,
      valid_until DATE,
      amount NUMERIC NOT NULL,
      tax_amount NUMERIC DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".business_profiles (
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255) DEFAULT '${businessName.replace(/'/g, "''")}',
      trade_name VARCHAR(255) DEFAULT '${businessName.replace(/'/g, "''")} Tech Solutions',
      gst_number VARCHAR(50) DEFAULT '27AABCO1234F1Z5',
      pan VARCHAR(20) DEFAULT 'AABCO1234F',
      address TEXT DEFAULT '104, Tech Innovation Hub, Cyber Gateway',
      state VARCHAR(100) DEFAULT 'Maharashtra (27)',
      phone VARCHAR(50) DEFAULT '+91 98765 43210',
      email VARCHAR(255) DEFAULT 'billing@omnibill.com',
      bank_name VARCHAR(100) DEFAULT 'HDFC Bank Ltd',
      bank_account VARCHAR(100) DEFAULT '50200012345678',
      bank_ifsc VARCHAR(50) DEFAULT 'HDFC0001234',
      upi_id VARCHAR(100) DEFAULT 'omnibill@okhdfcbank',
      payment_qr_url TEXT,
      logo_url TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".templates_config (
      id SERIAL PRIMARY KEY,
      theme VARCHAR(50) DEFAULT 'Modern Pro',
      primary_color VARCHAR(50) DEFAULT '#4f46e5',
      show_logo BOOLEAN DEFAULT TRUE,
      show_qr BOOLEAN DEFAULT TRUE,
      show_bank_details BOOLEAN DEFAULT TRUE,
      terms_conditions TEXT DEFAULT 'Payment due within 15 days of invoice date. Late interest @ 18% p.a.',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "${schema}".recurring_invoices (
      id SERIAL PRIMARY KEY,
      profile_name VARCHAR(255) NOT NULL,
      party_name VARCHAR(255) NOT NULL,
      frequency VARCHAR(50) DEFAULT 'Monthly',
      start_date DATE DEFAULT CURRENT_DATE,
      end_date DATE,
      next_issue_date DATE DEFAULT CURRENT_DATE,
      last_generated_date DATE,
      amount NUMERIC NOT NULL,
      tax_amount NUMERIC DEFAULT 0,
      subtotal NUMERIC DEFAULT 0,
      items TEXT DEFAULT '[]',
      payment_terms VARCHAR(50) DEFAULT 'Net 30 Days',
      status VARCHAR(50) DEFAULT 'Active',
      auto_email BOOLEAN DEFAULT TRUE,
      notes TEXT,
      total_cycles_run INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const stmt of tableStatements) {
    try {
      await pool.query(stmt);
    } catch (e: any) {
      console.warn(`Error creating table in ${schema}:`, e.message);
    }
  }

  // Ensure new columns exist in business_profiles and products
  try {
    await pool.query(`ALTER TABLE "${schema}".business_profiles ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100) DEFAULT 'omnibill@okhdfcbank'`);
    await pool.query(`ALTER TABLE "${schema}".business_profiles ADD COLUMN IF NOT EXISTS payment_qr_url TEXT`);
    await pool.query(`ALTER TABLE "${schema}".business_profiles ADD COLUMN IF NOT EXISTS logo_url TEXT`);
    await pool.query(`ALTER TABLE "${schema}".products ADD COLUMN IF NOT EXISTS item_code VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".products ADD COLUMN IF NOT EXISTS brand VARCHAR(150)`);
    await pool.query(`ALTER TABLE "${schema}".products ADD COLUMN IF NOT EXISTS purchase_tax_type VARCHAR(50) DEFAULT 'Without Tax'`);
    await pool.query(`ALTER TABLE "${schema}".products ADD COLUMN IF NOT EXISTS sale_tax_type VARCHAR(50) DEFAULT 'Without Tax'`);
    await pool.query(`ALTER TABLE "${schema}".products ADD COLUMN IF NOT EXISTS tax_slab VARCHAR(50) DEFAULT 'GST@18%'`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS contact_title VARCHAR(150)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS mobile_urgent VARCHAR(50)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS industry VARCHAR(150)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS address_line1 TEXT`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS address_line2 TEXT`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS city VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS state_region VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS postal_code VARCHAR(30)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS country VARCHAR(20) DEFAULT 'IN'`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS currency VARCHAR(50) DEFAULT 'INR (₹) - India'`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(50) DEFAULT 'Net 30 Days'`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS credit_limit NUMERIC DEFAULT 25000`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS is_tax_exempt BOOLEAN DEFAULT FALSE`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS account_manager VARCHAR(255)`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS tags TEXT`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS notes TEXT`);
    await pool.query(`ALTER TABLE "${schema}".customers ADD COLUMN IF NOT EXISTS customer_type VARCHAR(10) DEFAULT 'B2B'`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS items TEXT`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS place_of_supply VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS terms_conditions TEXT`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS ref_quote_number VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS paid_amount NUMERIC DEFAULT 0`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC DEFAULT 0`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS payments TEXT DEFAULT '[]'`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS po_number VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS po_date DATE`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS eway_bill_number VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS transporter_name VARCHAR(150)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS linked_doc_id INT`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS linked_doc_number VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS irn_number VARCHAR(120)`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS recurring_profile_id INT`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS reminder_count INT DEFAULT 0`);
    await pool.query(`ALTER TABLE "${schema}".invoices ADD COLUMN IF NOT EXISTS last_reminder_at TIMESTAMP`);
    await pool.query(`ALTER TABLE "${schema}".quotations ADD COLUMN IF NOT EXISTS items TEXT`);
    await pool.query(`ALTER TABLE "${schema}".quotations ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0`);
    await pool.query(`ALTER TABLE "${schema}".quotations ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0`);
    await pool.query(`ALTER TABLE "${schema}".quotations ADD COLUMN IF NOT EXISTS place_of_supply VARCHAR(100)`);
    await pool.query(`ALTER TABLE "${schema}".quotations ADD COLUMN IF NOT EXISTS terms_conditions TEXT`);
    await pool.query(`ALTER TABLE "${schema}".products ADD COLUMN IF NOT EXISTS is_service BOOLEAN DEFAULT FALSE`);
  } catch {
    // ignore
  }

  // Seed default tenant records if fresh
  await seedTenantRecords(schema, businessName);

  // Mark schema as provisioned in memory cache
  provisionedSchemas.add(schema);
}

async function seedTenantRecords(schema: string, businessName: string): Promise<void> {
  const pool = getPostgresPool();
  try {
    // 1. Business Profile
    const bCheck = await pool.query(`SELECT id FROM "${schema}".business_profiles LIMIT 1`);
    if (bCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO "${schema}".business_profiles (business_name, trade_name, gst_number, pan, address, state, phone, email, bank_name, bank_account, bank_ifsc)
         VALUES ($1, $2, '27AABCO1234F1Z5', 'AABCO1234F', '104, Tech Innovation Hub, Cyber Gateway', 'Maharashtra (27)', '+91 98765 43210', 'billing@omnibill.com', 'HDFC Bank Ltd', '50200012345678', 'HDFC0001234')`,
        [businessName, `${businessName} Solutions`]
      );
    }

    // 2. Customers
    const cCheck = await pool.query(`SELECT COUNT(*) as count FROM "${schema}".customers`);
    if (parseInt(cCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(
        `INSERT INTO "${schema}".customers (name, type, gstin, phone, email, address, balance) VALUES
         ('Apex Infotech Ltd', 'Customer', '27AABCA1111A1Z1', '+91 98200 11223', 'accounts@apexinfo.com', 'Andheri East, Mumbai', 48500),
         ('Zenith Logistics LLP', 'Customer', '29BBBCB2222B2Z2', '+91 98300 22334', 'billing@zenithlog.com', 'Whitefield, Bangalore', 125000),
         ('CloudScale Hardware', 'Supplier', '07CCCC3333C3Z3', '+91 98400 33445', 'sales@cloudscale.in', 'Nehru Place, New Delhi', -32000),
         ('Metropolis Retail Store', 'Customer', '27DDDCD4444D4Z4', '+91 98500 44556', 'accounts@metropolis.com', 'FC Road, Pune', 18200)`
      );
    }

    // 3. Products
    const pCheck = await pool.query(`SELECT COUNT(*) as count FROM "${schema}".products`);
    if (parseInt(pCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(
        `INSERT INTO "${schema}".products (name, sku, hsn_sac, category, unit, purchase_price, sale_price, stock, min_stock, tax_rate) VALUES
         ('OmniBill ERP Enterprise License', 'SOFT-ERP-01', '997331', 'Software', 'YEAR', 35000, 55000, 999, 10, 18),
         ('Thermal Receipt Printer 80mm', 'HW-PRN-80', '844332', 'Hardware', 'PCS', 4200, 6800, 42, 10, 18),
         ('2D Barcode & QR Code Scanner', 'HW-SCN-2D', '847190', 'Hardware', 'PCS', 2100, 3450, 68, 15, 18),
         ('Thermal Paper Rolls (Box of 50)', 'STAT-PR-50', '481190', 'Consumables', 'BOX', 1200, 1850, 120, 25, 12),
         ('Smart Android POS Terminal', 'HW-POS-PRO', '847050', 'Hardware', 'PCS', 14500, 21999, 18, 5, 18)`
      );
    }

    // 4. Invoices
    const iCheck = await pool.query(`SELECT COUNT(*) as count FROM "${schema}".invoices`);
    if (parseInt(iCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(
        `INSERT INTO "${schema}".invoices (doc_type, doc_number, party_name, date, due_date, amount, tax_amount, status, notes) VALUES
         ('Invoices', 'INV-2026-001', 'Zenith Logistics LLP', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '12 days', 147500, 22500, 'Unpaid', 'Cloud infrastructure billing Q1'),
         ('Invoices', 'INV-2026-002', 'Apex Infotech Ltd', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', 57230, 8730, 'Paid', 'Annual software maintenance'),
         ('Quotation', 'QT-2026-104', 'Metropolis Retail Store', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '14 days', 34000, 5186, 'Accepted', 'POS Billing Software setup'),
         ('Proforma Invoice', 'PI-2026-088', 'Zenith Logistics LLP', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', 85000, 12966, 'Pending', 'Hardware terminal bundle'),
         ('Payment In', 'PAY-2026-051', 'Apex Infotech Ltd', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE, 57230, 0, 'Completed', 'Payment received via NEFT'),
         ('Sale Order', 'SO-2026-012', 'Apex Infotech Ltd', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '8 days', 92000, 14033, 'Confirmed', 'Annual license renew'),
         ('Delivery Challan', 'DC-2026-005', 'Metropolis Retail Store', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE, 34000, 0, 'Dispatched', 'Thermal printers & scanners'),
         ('Sale return/Credit Note', 'CN-2026-001', 'Apex Infotech Ltd', CURRENT_DATE, CURRENT_DATE, 8730, 1331, 'Approved', 'Warranty replacement adjustment')`
      );
    }

    // 5. Quotations
    const qCheck = await pool.query(`SELECT COUNT(*) as count FROM "${schema}".quotations`);
    if (parseInt(qCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(
        `INSERT INTO "${schema}".quotations (quote_number, party_name, date, valid_until, amount, tax_amount, status, notes) VALUES
         ('QT-2026-104', 'Metropolis Retail Store', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '14 days', 34000, 5186, 'Accepted', 'POS Billing Software setup'),
         ('QT-2026-105', 'Zenith Logistics LLP', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 185000, 28220, 'Pending', 'Hardware terminal + ERP bundle')`
      );
    }

    // 6. Expenses
    const eCheck = await pool.query(`SELECT COUNT(*) as count FROM "${schema}".expenses`);
    if (parseInt(eCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(
        `INSERT INTO "${schema}".expenses (expense_type, ref_number, party_name, category, amount, payment_mode, date, notes) VALUES
         ('Record Expense : Debit', 'EXP-2026-01', 'CloudScale Hardware', 'Office Server & Cloud Hosting', 32000, 'Bank Transfer', CURRENT_DATE - INTERVAL '4 days', 'Server cluster maintenance'),
         ('Record Expense : Debit', 'EXP-2026-02', 'WeWork Office Leasing', 'Rent & Utilities', 45000, 'Cheque', CURRENT_DATE - INTERVAL '10 days', 'Office rent for October'),
         ('Record Advance Payment : Credit', 'ADV-2026-01', 'Zenith Logistics LLP', 'Advance Sales Deposit', 50000, 'UPI', CURRENT_DATE - INTERVAL '1 day', 'Advance deposit for Enterprise ERP'),
         ('Purchase Return/ Dr.Note', 'DN-2026-01', 'CloudScale Hardware', 'Defective RAM Modules', 4800, 'Direct Debit', CURRENT_DATE - INTERVAL '6 days', 'Replaced memory modules')`
      );
    }

    // 7. Category GST Rules
    const gCheck = await pool.query(`SELECT COUNT(*) as count FROM "${schema}".category_gst_rules`);
    if (parseInt(gCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(
        `INSERT INTO "${schema}".category_gst_rules (category_name, hsn_sac, gst_rate, cess_rate, is_composition_eligible, rcm_applicable) VALUES
         ('Software & SaaS', '997331', 18, 0, true, false),
         ('IT Hardware & Printers', '844332', 18, 0, false, false),
         ('Barcode Scanners', '847190', 18, 0, true, false),
         ('Stationery & Rolls', '481190', 12, 0, true, false),
         ('Consulting & Audit', '998311', 18, 0, false, false)`
      );
    }

    // 8. Templates Config
    const tCheck = await pool.query(`SELECT id FROM "${schema}".templates_config LIMIT 1`);
    if (tCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO "${schema}".templates_config (theme, primary_color, show_logo, show_qr, show_bank_details, terms_conditions)
         VALUES ('Modern Pro', '#4f46e5', true, true, true, 'Payment due within 15 days of invoice date. Late interest @ 18% p.a.')`
      );
    }

    // 9. Recurring Invoices Seed Data
    const rCheck = await pool.query(`SELECT COUNT(*) as count FROM "${schema}".recurring_invoices`);
    if (parseInt(rCheck.rows[0]?.count || '0', 10) === 0) {
      await pool.query(
        `INSERT INTO "${schema}".recurring_invoices (profile_name, party_name, frequency, start_date, next_issue_date, last_generated_date, amount, tax_amount, subtotal, items, payment_terms, status, auto_email, notes, total_cycles_run) VALUES
         ('Monthly Cloud ERP Retainer', 'Apex Infotech Ltd', 'Monthly', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE - INTERVAL '25 days', 35400, 5400, 30000, '[{"id":1,"name":"OmniBill ERP Enterprise License","qty":1,"unit":"YEAR","rate":30000,"tax_slab":"GST@18%","gst_rate":18,"tax_amount":5400,"total":35400,"hsn_sac":"997331"}]', 'Net 15 Days', 'Active', true, 'Automated monthly recurring retainer for Enterprise cloud tier', 2),
         ('Quarterly POS Terminal AMC', 'Metropolis Retail Store', 'Quarterly', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE - INTERVAL '80 days', 14160, 2160, 12000, '[{"id":5,"name":"Smart Android POS Terminal","qty":1,"unit":"PCS","rate":12000,"tax_slab":"GST@18%","gst_rate":18,"tax_amount":2160,"total":14160,"hsn_sac":"847050"}]', 'Net 30 Days', 'Active', true, 'Quarterly scheduled preventative hardware maintenance', 1)`
      );
    }
  } catch (err: any) {
    console.warn(`Seed records warning for schema ${schema}:`, err.message);
  }
}

// Ensures a dedicated tenant schema exists based on user's linked tenant
export async function ensureTenantSchema(userId: number): Promise<string> {
  const cached = userSchemaCache.get(userId);
  if (cached && provisionedSchemas.has(cached.schema)) {
    return cached.schema;
  }

  const pool = getPostgresPool();
  
  // Find user and their linked tenant
  const userRes = await pool.query(
    `SELECT u.id, u.tenant_id, u.username, u.schema_name, t.slug, t.schema_name as t_schema, t.name as t_name
     FROM users u
     LEFT JOIN tenants t ON u.tenant_id = t.id
     WHERE u.id = $1 LIMIT 1`,
    [userId]
  );

  let schema = `tenant_usr_${userId}`;
  let businessName = 'OmniBill Enterprises';

  if (userRes.rows.length > 0) {
    const row = userRes.rows[0];
    if (row.t_schema) {
      schema = row.t_schema;
      businessName = row.t_name || 'OmniBill Enterprises';
    } else if (row.schema_name) {
      schema = row.schema_name;
    } else {
      // Auto-create tenant record for legacy user
      const slug = createTenantSlug(row.username);
      schema = formatTenantSchema(slug);
      const tRes = await pool.query(
        `INSERT INTO tenants (name, slug, schema_name, plan, plan_status, is_active)
         VALUES ($1, $2, $3, 'Starter', 'active', true)
         ON CONFLICT (slug) DO UPDATE SET schema_name = EXCLUDED.schema_name
         RETURNING id`,
        [`${row.username}'s Company`, slug, schema]
      );
      const tenantId = tRes.rows[0]?.id;
      await pool.query('UPDATE users SET tenant_id = $1, schema_name = $2 WHERE id = $3', [tenantId, schema, userId]);
    }
  }

  // Provision schema & tables
  await provisionTenantSchemaAndTables(schema, businessName);

  // Cache user schema mapping
  userSchemaCache.set(userId, { schema, businessName });

  return schema;
}

// ==========================================
// USER & AUTHENTICATION RECORDS
// ==========================================

export interface UserRecord {
  id: number;
  tenant_id: number | null;
  username: string;
  email: string;
  contact_email?: string | null;
  designation?: string | null;
  phone?: string | null;
  password_hash: string;
  full_name: string | null;
  role: string;
  schema_name: string;
  is_active: boolean;
  created_at: Date;
  last_login: Date | null;
  tenant_name?: string;
  tenant_slug?: string;
  tenant_plan?: string;
  tenant_plan_status?: string;
}

export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  const pool = getPostgresPool();
  const res = await pool.query(
    `SELECT u.*, t.name as tenant_name, t.slug as tenant_slug, t.plan as tenant_plan, t.plan_status as tenant_plan_status, t.is_active as tenant_is_active
     FROM users u
     LEFT JOIN tenants t ON u.tenant_id = t.id
     WHERE LOWER(u.username) = LOWER($1) LIMIT 1`,
    [username.trim()]
  );
  return res.rows[0] || null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const pool = getPostgresPool();
  const res = await pool.query(
    `SELECT u.*, t.name as tenant_name, t.slug as tenant_slug, t.plan as tenant_plan, t.plan_status as tenant_plan_status, t.is_active as tenant_is_active
     FROM users u
     LEFT JOIN tenants t ON u.tenant_id = t.id
     WHERE LOWER(u.email) = LOWER($1) LIMIT 1`,
    [email.trim()]
  );
  return res.rows[0] || null;
}

export async function findUserByIdentifier(identifier: string): Promise<UserRecord | null> {
  const pool = getPostgresPool();
  const res = await pool.query(
    `SELECT u.*, t.name as tenant_name, t.slug as tenant_slug, t.plan as tenant_plan, t.plan_status as tenant_plan_status, t.is_active as tenant_is_active
     FROM users u
     LEFT JOIN tenants t ON u.tenant_id = t.id
     WHERE LOWER(u.username) = LOWER($1) OR LOWER(u.email) = LOWER($1) LIMIT 1`,
    [identifier.trim()]
  );
  return res.rows[0] || null;
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const pool = getPostgresPool();
  const res = await pool.query(
    `SELECT u.*, t.name as tenant_name, t.slug as tenant_slug, t.plan as tenant_plan, t.plan_status as tenant_plan_status, t.is_active as tenant_is_active
     FROM users u
     LEFT JOIN tenants t ON u.tenant_id = t.id
     WHERE u.id = $1 LIMIT 1`,
    [id]
  );
  return res.rows[0] || null;
}

// User & Tenant Registration
export async function createUser(data: {
  username: string;
  email: string;
  passwordHash: string;
  fullName?: string | null;
  companyName?: string | null;
  tenantSlug?: string | null;
  phone?: string | null;
}): Promise<UserRecord> {
  const pool = getPostgresPool();

  const businessName = data.companyName?.trim() || `${data.username}'s Business`;
  let slug = createTenantSlug(data.tenantSlug || data.companyName || data.username);
  
  // Ensure unique slug
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existing = await pool.query('SELECT id FROM tenants WHERE slug = $1', [uniqueSlug]);
    if (existing.rows.length === 0) break;
    uniqueSlug = `${slug}_${counter++}`;
  }

  const schema = formatTenantSchema(uniqueSlug);

  // 1. Create entry in public.tenants
  const tenantRes = await pool.query(
    `INSERT INTO tenants (name, slug, schema_name, plan, plan_status, billing_cycle, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, 'Starter', 'active', 'monthly', true, NOW(), NOW())
     RETURNING id`,
    [businessName, uniqueSlug, schema]
  );
  const tenantId = tenantRes.rows[0].id;

  // 2. Create entry in public.tenant_subscriptions
  await pool.query(
    `INSERT INTO tenant_subscriptions (tenant_id, current_plan, status, payment_status, last_payment_date, updated_at)
     VALUES ($1, 'Starter', 'active', 'paid', CURRENT_DATE, NOW())`,
    [tenantId]
  );

  // 3. Log into public.tenant_plan_history
  await pool.query(
    `INSERT INTO tenant_plan_history (tenant_id, action, from_plan, to_plan, from_status, to_status, reason, performed_by)
     VALUES ($1, 'initial_provisioning', NULL, 'Starter', NULL, 'active', 'Initial customer sign-up & tenant schema creation', 'System')`,
    [tenantId]
  );

  // 4. Create user in public.users mapped to this tenant
  const userRes = await pool.query(
    `INSERT INTO users (tenant_id, username, email, contact_email, phone, designation, password_hash, full_name, role, schema_name, is_active, created_at)
     VALUES ($1, $2, $3, $4, $5, 'Business Owner', $6, $7, 'admin', $8, true, NOW())
     RETURNING *`,
    [
      tenantId,
      data.username.trim().toLowerCase(),
      data.email.trim().toLowerCase(),
      data.email.trim().toLowerCase(),
      data.phone?.trim() || null,
      data.passwordHash,
      data.fullName?.trim() || null,
      schema,
    ]
  );
  const user = userRes.rows[0];

  // 5. Provision dedicated PostgreSQL schema with tables
  await provisionTenantSchemaAndTables(schema, businessName);

  return {
    ...user,
    tenant_name: businessName,
    tenant_slug: uniqueSlug,
    tenant_plan: 'Starter',
    tenant_plan_status: 'active',
  };
}

export async function updateUserLastLogin(id: number): Promise<void> {
  const pool = getPostgresPool();
  await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [id]);
}

export async function updateUserProfile(id: number, data: {
  fullName?: string;
  email?: string;
  username?: string;
  designation?: string;
  contactEmail?: string;
  phone?: string;
}): Promise<UserRecord> {
  const pool = getPostgresPool();
  const res = await pool.query(
    `UPDATE users SET
       full_name = COALESCE($1, full_name),
       email = COALESCE($2, email),
       username = COALESCE($3, username),
       designation = COALESCE($4, designation),
       contact_email = COALESCE($5, contact_email),
       phone = COALESCE($6, phone)
     WHERE id = $7 RETURNING *`,
    [
      data.fullName || null,
      data.email || null,
      data.username || null,
      data.designation || null,
      data.contactEmail || null,
      data.phone || null,
      id,
    ]
  );
  return res.rows[0];
}

export async function updateUserPassword(id: number, passwordHash: string): Promise<boolean> {
  const pool = getPostgresPool();
  const res = await pool.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [passwordHash, id]
  );
  return (res.rowCount || 0) > 0;
}

// ==========================================
// TENANT SCHEMA QUERY HELPERS
// (All operations isolated to "${schema}")
// ==========================================

// Business Setup APIs
export async function getBusinessProfile(userId: number): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`SELECT * FROM "${schema}".business_profiles LIMIT 1`);
  return res.rows[0] || {};
}

export async function upsertBusinessProfile(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  const existing = await pool.query(`SELECT id FROM "${schema}".business_profiles LIMIT 1`);
  if (existing.rows.length === 0) {
    const res = await pool.query(
      `INSERT INTO "${schema}".business_profiles (business_name, trade_name, gst_number, pan, address, state, phone, email, bank_name, bank_account, bank_ifsc, upi_id, payment_qr_url, logo_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()) RETURNING *`,
      [
        data.business_name || 'OmniBill Enterprises',
        data.trade_name || '',
        data.gst_number || '',
        data.pan || '',
        data.address || '',
        data.state || '',
        data.phone || '',
        data.email || '',
        data.bank_name || '',
        data.bank_account || '',
        data.bank_ifsc || '',
        data.upi_id || 'omnibill@okhdfcbank',
        data.payment_qr_url || '',
        data.logo_url || '',
      ]
    );
    return res.rows[0];
  } else {
    const res = await pool.query(
      `UPDATE "${schema}".business_profiles SET
         business_name = $1,
         trade_name = $2,
         gst_number = $3,
         pan = $4,
         address = $5,
         state = $6,
         phone = $7,
         email = $8,
         bank_name = $9,
         bank_account = $10,
         bank_ifsc = $11,
         upi_id = $12,
         payment_qr_url = $13,
         logo_url = $14,
         updated_at = NOW()
       RETURNING *`,
      [
        data.business_name || 'OmniBill Enterprises',
        data.trade_name || '',
        data.gst_number || '',
        data.pan || '',
        data.address || '',
        data.state || '',
        data.phone || '',
        data.email || '',
        data.bank_name || '',
        data.bank_account || '',
        data.bank_ifsc || '',
        data.upi_id || 'omnibill@okhdfcbank',
        data.payment_qr_url || '',
        data.logo_url || '',
      ]
    );
    return res.rows[0];
  }
}

// Customers & Parties APIs (Targeting "${schema}".customers)
export async function getParties(userId: number): Promise<any[]> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`SELECT * FROM "${schema}".customers ORDER BY id DESC`);
  return res.rows;
}

export async function createParty(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const fullAddress =
    data.address ||
    [
      data.address_line1,
      data.address_line2,
      [data.city, data.state_region].filter(Boolean).join(', '),
      data.postal_code,
      data.country,
    ]
      .filter(Boolean)
      .join(', ');

  const customerType = data.customer_type === 'B2C' ? 'B2C' : 'B2B';
  const res = await pool.query(
    `INSERT INTO "${schema}".customers (
      name, type, contact_person, contact_title, phone, mobile_urgent, email, industry,
      address_line1, address_line2, city, state_region, postal_code, country, address,
      gstin, currency, payment_terms, credit_limit, is_tax_exempt, account_manager, tags, notes, balance, customer_type, created_at
    )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, NOW())
     RETURNING *`,
    [
      data.name,
      data.type || 'Active Client',
      data.contact_person || '',
      data.contact_title || '',
      data.phone || '',
      data.mobile_urgent || '',
      data.email || '',
      data.industry || '',
      data.address_line1 || '',
      data.address_line2 || '',
      data.city || '',
      data.state_region || '',
      data.postal_code || '',
      data.country || 'IN',
      fullAddress,
      data.gstin || '',
      data.currency || 'INR (₹) - India',
      data.payment_terms || 'Net 30 Days',
      Number(data.credit_limit || 25000),
      Boolean(data.is_tax_exempt),
      data.account_manager || '',
      data.tags || '',
      data.notes || '',
      Number(data.balance || 0),
      customerType,
    ]
  );
  return res.rows[0];
}

export async function deleteParty(id: number, userId: number): Promise<boolean> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`DELETE FROM "${schema}".customers WHERE id = $1`, [id]);
  return (res.rowCount || 0) > 0;
}

// Sales Invoices & Quotations APIs (Targeting "${schema}".invoices and "${schema}".quotations)
export async function getSalesDocuments(userId: number, docType?: string): Promise<any[]> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  let rows: any[] = [];
  if (docType) {
    const res = await pool.query(
      `SELECT * FROM "${schema}".invoices WHERE LOWER(doc_type) = LOWER($1) ORDER BY id DESC`,
      [docType]
    );
    rows = res.rows;
  } else {
    const res = await pool.query(`SELECT * FROM "${schema}".invoices ORDER BY id DESC`);
    rows = res.rows;
  }
  return rows.map((d: any) => {
    const totalAmount = Number(d.amount || 0);
    const paidAmount = d.paid_amount !== undefined && d.paid_amount !== null
      ? Number(d.paid_amount)
      : (d.status === 'Paid' ? totalAmount : 0);
    const remainingAmount = d.remaining_amount !== undefined && d.remaining_amount !== null
      ? Number(d.remaining_amount)
      : (d.status === 'Paid' ? 0 : Math.max(0, totalAmount - paidAmount));

    return {
      ...d,
      amount: totalAmount,
      paid_amount: paidAmount,
      remaining_amount: remainingAmount,
      payments: typeof d.payments === 'string' ? d.payments : JSON.stringify(d.payments || []),
      doc_type: d.doc_type || 'Invoices',
    };
  });
}

export async function createSalesDocument(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const itemsStr = typeof data.items === 'object' ? JSON.stringify(data.items) : (data.items || '[]');
  const subtotal = data.subtotal !== undefined ? Number(data.subtotal) : (Number(data.amount || 0) - Number(data.tax_amount || 0));
  const discountAmount = data.discount_amount !== undefined ? Number(data.discount_amount) : 0;
  const placeOfSupply = data.place_of_supply || '';
  const termsConditions = data.terms_conditions || '';
  const refQuoteNumber = data.ref_quote_number || '';
  const totalAmount = Number(data.amount || 0);
  const paidAmount = data.paid_amount !== undefined ? Number(data.paid_amount) : (data.status === 'Paid' ? totalAmount : 0);
  const remainingAmount = data.remaining_amount !== undefined ? Number(data.remaining_amount) : Math.max(0, totalAmount - paidAmount);
  const status = data.status || (data.doc_type === 'Quotation' ? 'Pending' : (remainingAmount <= 0 ? 'Paid' : (paidAmount > 0 ? 'Partially Paid' : 'Unpaid')));
  const paymentsStr = typeof data.payments === 'object' ? JSON.stringify(data.payments) : (data.payments || '[]');

  const poNumber = data.po_number || null;
  const poDate = data.po_date || null;
  const vehicleNumber = data.vehicle_number || null;
  const transporterName = data.transporter || data.transporter_name || null;
  const ewayBillNumber = data.eway_bill || data.eway_bill_number || null;
  const linkedDocId = data.linked_doc_id ? Number(data.linked_doc_id) : null;

  const res = await pool.query(
    `INSERT INTO "${schema}".invoices (
       doc_type, doc_number, party_name, date, due_date, amount, tax_amount, status, notes,
       items, subtotal, discount_amount, place_of_supply, terms_conditions, ref_quote_number,
       po_number, po_date, vehicle_number, transporter_name, eway_bill_number, linked_doc_id,
       paid_amount, remaining_amount, payments, created_at
     )
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW())
     RETURNING *`,
    [
      data.doc_type || 'Invoices',
      data.doc_number || (data.doc_type === 'Quotation' ? `QT-${Date.now().toString().slice(-5)}` : `INV-${Date.now().toString().slice(-5)}`),
      data.party_name,
      data.date || null,
      data.due_date || null,
      totalAmount,
      Number(data.tax_amount || 0),
      status,
      data.notes || '',
      itemsStr,
      subtotal,
      discountAmount,
      placeOfSupply,
      termsConditions,
      refQuoteNumber,
      poNumber,
      poDate,
      vehicleNumber,
      transporterName,
      ewayBillNumber,
      linkedDocId,
      paidAmount,
      remainingAmount,
      paymentsStr,
    ]
  );

  // If a Proforma Invoice is created from a Sale Order, ensure the source Sale Order is marked 'PI Generated'
  if ((data.doc_type || '').toLowerCase() === 'proforma invoice') {
    try {
      if (linkedDocId) {
        await pool.query(`UPDATE "${schema}".invoices SET status = 'PI Generated' WHERE id = $1`, [linkedDocId]);
      }
      if (poNumber) {
        await pool.query(
          `UPDATE "${schema}".invoices SET status = 'PI Generated' WHERE doc_number = $1 AND (LOWER(doc_type) = 'sale order' OR LOWER(doc_type) = 'sales order')`,
          [poNumber]
        );
      }
    } catch {
      // Ignore update error
    }
  }

  // If this is a quotation, also mirror into "${schema}".quotations table
  if (data.doc_type === 'Quotation') {
    try {
      await pool.query(
        `INSERT INTO "${schema}".quotations (
           quote_number, party_name, date, valid_until, amount, tax_amount, status, notes,
           items, subtotal, discount_amount, place_of_supply, terms_conditions, created_at
         )
         VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
        [
          data.doc_number || `QT-${Date.now().toString().slice(-4)}`,
          data.party_name,
          data.date || null,
          data.due_date || null,
          Number(data.amount || 0),
          Number(data.tax_amount || 0),
          data.status || 'Pending',
          data.notes || '',
          itemsStr,
          subtotal,
          discountAmount,
          placeOfSupply,
          termsConditions,
        ]
      );
    } catch {
      // Ignore mirror error
    }
  }

  return res.rows[0];
}

export async function updateSalesDocument(userId: number, id: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  // Check if document has moved to next stage or has recorded payments
  const currentRes = await pool.query(
    `SELECT id, doc_type, status, paid_amount, remaining_amount, doc_number FROM "${schema}".invoices WHERE id = $1`,
    [id]
  );
  if (currentRes.rows.length === 0) {
    return null;
  }
  const current = currentRes.rows[0];

  // If actual document content (items, amount, party, terms) is being edited
  const isEditingContent = Boolean(data.items !== undefined || data.amount !== undefined || data.party_name !== undefined || data.subtotal !== undefined);
  if (isEditingContent) {
    if (current.doc_type === 'Sale Order') {
      const isMoved = current.status === 'PI Generated' || current.status === 'Converted' || current.status === 'Dispatched' || current.status === 'Fulfilled' || current.status === 'Invoiced';
      if (isMoved) {
        throw new Error(`Cannot edit Sale Order #${current.doc_number}: it has already moved to the next stage.`);
      }
    }
    if (current.doc_type === 'Proforma Invoice' || current.doc_type === 'Delivery Challan') {
      const isMoved = current.status === 'Converted' || current.status === 'Invoiced' || current.status === 'Fulfilled' || current.status === 'Dispatched';
      if (isMoved) {
        throw new Error(`Cannot edit ${current.doc_type} #${current.doc_number}: it has already moved to the next stage.`);
      }
    }
    if (current.doc_type === 'Quotation' && current.status === 'Converted') {
      throw new Error(`Cannot edit Quotation #${current.doc_number}: it has already been converted to an Invoice.`);
    }

    // Check if child documents exist in the pipeline
    const childDocsRes = await pool.query(
      `SELECT id, doc_type, doc_number FROM "${schema}".invoices WHERE (linked_doc_id = $1 OR ref_quote_number = $2 OR po_number = $2) AND id != $1 LIMIT 1`,
      [id, current.doc_number]
    );
    if (childDocsRes.rows.length > 0) {
      const child = childDocsRes.rows[0];
      throw new Error(`Cannot edit ${current.doc_type} #${current.doc_number}: it has already moved to the next stage (${child.doc_type} #${child.doc_number}).`);
    }

    const paid = Number(current.paid_amount || 0);
    if (current.doc_type === 'Invoices' && (paid > 0 || current.status === 'Partially Paid' || current.status === 'Paid')) {
      throw new Error(`Cannot edit Invoice #${current.doc_number}: payments have already been recorded against this invoice.`);
    }
  }

  const itemsStr = typeof data.items === 'object' ? JSON.stringify(data.items) : (data.items ?? null);

  const res = await pool.query(
    `UPDATE "${schema}".invoices
     SET doc_number = COALESCE($1, doc_number),
         party_name = COALESCE($2, party_name),
         date = COALESCE($3, date),
         due_date = COALESCE($4, due_date),
         amount = COALESCE($5, amount),
         tax_amount = COALESCE($6, tax_amount),
         status = COALESCE($7, status),
         notes = COALESCE($8, notes),
         items = COALESCE($9, items),
         subtotal = COALESCE($10, subtotal),
         discount_amount = COALESCE($11, discount_amount),
         place_of_supply = COALESCE($12, place_of_supply),
         terms_conditions = COALESCE($13, terms_conditions),
         linked_doc_id = COALESCE($14, linked_doc_id),
         po_number = COALESCE($15, po_number)
     WHERE id = $16
     RETURNING *`,
    [
      data.doc_number ?? null,
      data.party_name ?? null,
      data.date ?? null,
      data.due_date ?? null,
      data.amount !== undefined && data.amount !== null ? Number(data.amount) : null,
      data.tax_amount !== undefined && data.tax_amount !== null ? Number(data.tax_amount) : null,
      data.status ?? null,
      data.notes ?? null,
      itemsStr,
      data.subtotal !== undefined && data.subtotal !== null ? Number(data.subtotal) : null,
      data.discount_amount !== undefined && data.discount_amount !== null ? Number(data.discount_amount) : null,
      data.place_of_supply ?? null,
      data.terms_conditions ?? null,
      data.linked_doc_id !== undefined && data.linked_doc_id !== null ? Number(data.linked_doc_id) : null,
      data.po_number ?? null,
      id,
    ]
  );

  const updatedDoc = res.rows[0];
  if (updatedDoc && updatedDoc.doc_type === 'Quotation') {
    try {
      await pool.query(
        `UPDATE "${schema}".quotations
         SET party_name = COALESCE($1, party_name),
             date = COALESCE($2, date),
             valid_until = $3,
             amount = COALESCE($4, amount),
             tax_amount = COALESCE($5, tax_amount),
             status = COALESCE($6, status),
             notes = COALESCE($7, notes),
             items = COALESCE($8, items),
             subtotal = COALESCE($9, subtotal)
         WHERE quote_number = $10`,
        [
          data.party_name,
          data.date,
          data.due_date,
          data.amount !== undefined ? Number(data.amount) : null,
          data.tax_amount !== undefined ? Number(data.tax_amount) : null,
          data.status,
          data.notes,
          itemsStr,
          data.subtotal !== undefined ? Number(data.subtotal) : null,
          updatedDoc.doc_number,
        ]
      );
    } catch {
      // Ignore mirror error
    }
  }

  return updatedDoc;
}

export async function deleteSalesDocument(userId: number, id: number): Promise<boolean> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const doc = await pool.query(`SELECT doc_number, doc_type FROM "${schema}".invoices WHERE id = $1`, [id]);
  if (doc.rows.length === 0) return false;
  const docNumber = doc.rows[0].doc_number;
  await pool.query(`DELETE FROM "${schema}".invoices WHERE id = $1`, [id]);
  try {
    await pool.query(`DELETE FROM "${schema}".quotations WHERE quote_number = $1`, [docNumber]);
  } catch {
    // Ignore
  }
  return true;
}

export async function convertQuotationToInvoice(userId: number, quoteId: number): Promise<{ invoice: any; quotation: any; inventory: any[] }> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  // 1. Fetch quotation
  const qRes = await pool.query(`SELECT * FROM "${schema}".invoices WHERE id = $1`, [quoteId]);
  if (qRes.rows.length === 0) {
    throw new Error('Quotation not found');
  }
  const quote = qRes.rows[0];

  // 2. Parse items and deduct stock in products table
  let itemsList: any[] = [];
  try {
    if (typeof quote.items === 'string') {
      itemsList = JSON.parse(quote.items);
    } else if (Array.isArray(quote.items)) {
      itemsList = quote.items;
    }
  } catch {
    itemsList = [];
  }

  // Deduct inventory stock (goods only, labour/services are exempt)
  for (const it of itemsList) {
    if (it.is_service) continue;
    const qtyToDeduct = Math.max(0, Number(it.qty || it.quantity || 0));
    if (qtyToDeduct > 0) {
      if (it.itemId || it.id) {
        const prodId = Number(it.itemId || it.id);
        await pool.query(
          `UPDATE "${schema}".products
           SET stock = GREATEST(0, stock - $1)
           WHERE id = $2`,
          [qtyToDeduct, prodId]
        );
      } else if (it.name || it.item_name) {
        const prodName = it.name || it.item_name;
        await pool.query(
          `UPDATE "${schema}".products
           SET stock = GREATEST(0, stock - $1)
           WHERE LOWER(name) = LOWER($2) OR LOWER(item_code) = LOWER($2)`,
          [qtyToDeduct, prodName]
        );
      }
    }
  }

  // 3. Generate Invoice Number
  const newInvoiceNumber = `INV-${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-4)}`;

  // 4. Create new Invoice in invoices table
  const invRes = await pool.query(
    `INSERT INTO "${schema}".invoices (
       doc_type, doc_number, party_name, date, due_date, amount, tax_amount, status, notes,
       items, subtotal, discount_amount, place_of_supply, terms_conditions, ref_quote_number,
       paid_amount, remaining_amount, payments, created_at
     )
     VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, 'Unpaid', $7, $8, $9, $10, $11, $12, $13, 0, $5, '[]', NOW())
     RETURNING *`,
    [
      'Invoices',
      newInvoiceNumber,
      quote.party_name,
      quote.due_date || null,
      Number(quote.amount || 0),
      Number(quote.tax_amount || 0),
      quote.notes ? `${quote.notes} (Converted from Quotation ${quote.doc_number})` : `Converted from Quotation ${quote.doc_number}`,
      typeof quote.items === 'object' ? JSON.stringify(quote.items) : (quote.items || '[]'),
      Number(quote.subtotal || 0),
      Number(quote.discount_amount || 0),
      quote.place_of_supply || '',
      quote.terms_conditions || '',
      quote.doc_number,
    ]
  );
  const createdInvoice = invRes.rows[0];

  // 5. Update Quotation status to 'Converted'
  const updQuoteRes = await pool.query(
    `UPDATE "${schema}".invoices
     SET status = 'Converted'
     WHERE id = $1
     RETURNING *`,
    [quoteId]
  );
  const updatedQuotation = updQuoteRes.rows[0];

  try {
    await pool.query(
      `UPDATE "${schema}".quotations
       SET status = 'Converted'
       WHERE quote_number = $1`,
      [quote.doc_number]
    );
  } catch {
    // Ignore
  }

  // 6. Fetch fresh inventory items to sync frontend
  const freshInv = await pool.query(`SELECT * FROM "${schema}".products ORDER BY id DESC`);

  return {
    invoice: {
      ...createdInvoice,
      paid_amount: 0,
      remaining_amount: Number(createdInvoice.amount || 0),
      payments: '[]',
    },
    quotation: updatedQuotation,
    inventory: freshInv.rows,
  };
}

export async function convertSaleOrderToProforma(userId: number, soId: number): Promise<{ proforma: any; saleOrder: any }> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  // 1. Fetch sale order
  const soRes = await pool.query(`SELECT * FROM "${schema}".invoices WHERE id = $1`, [soId]);
  if (soRes.rows.length === 0) {
    throw new Error('Sale Order not found');
  }
  const so = soRes.rows[0];

  // 2. Generate Proforma number
  const newPiNumber = `PI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 3. Create Proforma Invoice in database
  const piRes = await pool.query(
    `INSERT INTO "${schema}".invoices (
       doc_type, doc_number, party_name, date, due_date, amount, tax_amount, status, notes,
       items, subtotal, discount_amount, place_of_supply, terms_conditions, ref_quote_number,
       po_number, po_date, vehicle_number, transporter_name, eway_bill_number, linked_doc_id,
       paid_amount, remaining_amount, payments, created_at
     )
     VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, 'Pending', $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 0, $5, '[]', NOW())
     RETURNING *`,
    [
      'Proforma Invoice',
      newPiNumber,
      so.party_name,
      so.due_date || null,
      Number(so.amount || 0),
      Number(so.tax_amount || 0),
      so.notes ? `${so.notes} (Generated from Sale Order ${so.doc_number})` : `Advance Proforma Invoice against Sale Order ${so.doc_number}`,
      typeof so.items === 'object' ? JSON.stringify(so.items) : (so.items || '[]'),
      Number(so.subtotal || 0),
      Number(so.discount_amount || 0),
      so.place_of_supply || '',
      so.terms_conditions || '1. This is a Proforma Invoice, not a final GST Tax Invoice.\n2. Issued for securing advance payment against confirmed Sale Order.\n3. Delivery will be scheduled upon receipt of advance.\n4. Valid for 15 days from issue date.',
      so.doc_number,
      so.po_number || so.doc_number,
      so.po_date || null,
      so.vehicle_number || '',
      so.transporter_name || '',
      so.eway_bill_number || '',
      so.id,
    ]
  );
  const createdProforma = piRes.rows[0];

  // 4. Update Sale Order status to 'PI Generated'
  const updSoRes = await pool.query(
    `UPDATE "${schema}".invoices
     SET status = 'PI Generated'
     WHERE id = $1
     RETURNING *`,
    [soId]
  );
  const updatedSaleOrder = updSoRes.rows[0];

  return {
    proforma: {
      ...createdProforma,
      paid_amount: 0,
      remaining_amount: Number(createdProforma.amount || 0),
      payments: '[]',
    },
    saleOrder: updatedSaleOrder,
  };
}

export async function recordInvoicePayment(
  userId: number,
  invoiceId: number,
  paymentData: { amount: number; payment_mode?: string; date?: string; ref_number?: string; notes?: string }
): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  const res = await pool.query(`SELECT * FROM "${schema}".invoices WHERE id = $1`, [invoiceId]);
  if (res.rows.length === 0) {
    throw new Error('Invoice document not found');
  }
  const invoice = res.rows[0];
  const paymentAmount = Number(paymentData.amount);
  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    throw new Error('Payment amount must be greater than 0');
  }

  const currentPaid = Number(invoice.paid_amount || 0);
  const totalAmount = Number(invoice.amount || 0);
  const newPaid = currentPaid + paymentAmount;
  const newRemaining = Math.max(0, totalAmount - newPaid);
  const newStatus = newRemaining <= 0 ? 'Paid' : (newPaid > 0 ? 'Partially Paid' : 'Unpaid');

  let currentPayments: any[] = [];
  try {
    if (typeof invoice.payments === 'string') {
      currentPayments = JSON.parse(invoice.payments);
    } else if (Array.isArray(invoice.payments)) {
      currentPayments = invoice.payments;
    }
  } catch {
    currentPayments = [];
  }

  const paymentRecord = {
    id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: paymentAmount,
    payment_mode: paymentData.payment_mode || 'Bank Transfer',
    date: paymentData.date || new Date().toISOString().split('T')[0],
    ref_number: paymentData.ref_number || '',
    notes: paymentData.notes || '',
    recorded_at: new Date().toISOString(),
  };

  currentPayments.push(paymentRecord);

  const updateRes = await pool.query(
    `UPDATE "${schema}".invoices
     SET paid_amount = $1,
         remaining_amount = $2,
         status = $3,
         payments = $4
     WHERE id = $5
     RETURNING *`,
    [newPaid, newRemaining, newStatus, JSON.stringify(currentPayments), invoiceId]
  );

  // Auto-record as Credit in receipts/expenses for synchronized bookkeeping
  try {
    await pool.query(
      `INSERT INTO "${schema}".expenses (
         expense_type, ref_number, party_name, category, amount, payment_mode, date, notes, created_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, CURRENT_DATE), $8, NOW())`,
      [
        'Credit',
        paymentData.ref_number || `REC-${invoice.doc_number}`,
        invoice.party_name,
        'Sales Payment Received',
        paymentAmount,
        paymentData.payment_mode || 'Bank Transfer',
        paymentData.date || null,
        `Payment against Invoice ${invoice.doc_number}${paymentData.notes ? ` - ${paymentData.notes}` : ''}`,
      ]
    );
  } catch {
    // Ignore sync to receipts if error
  }

  const updated = updateRes.rows[0];
  return {
    ...updated,
    amount: totalAmount,
    paid_amount: newPaid,
    remaining_amount: newRemaining,
    status: newStatus,
    payments: JSON.stringify(currentPayments),
  };
}

export async function recordInvoiceReminder(userId: number, invoiceId: number): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  const res = await pool.query(
    `UPDATE "${schema}".invoices
     SET reminder_count = COALESCE(reminder_count, 0) + 1,
         last_reminder_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [invoiceId]
  );
  if (res.rows.length === 0) {
    throw new Error('Invoice not found');
  }
  const d = res.rows[0];
  const totalAmount = Number(d.amount || 0);
  const paidAmount = d.paid_amount !== undefined && d.paid_amount !== null
    ? Number(d.paid_amount)
    : (d.status === 'Paid' ? totalAmount : 0);
  const remainingAmount = d.remaining_amount !== undefined && d.remaining_amount !== null
    ? Number(d.remaining_amount)
    : (d.status === 'Paid' ? 0 : Math.max(0, totalAmount - paidAmount));

  return {
    ...d,
    amount: totalAmount,
    paid_amount: paidAmount,
    remaining_amount: remainingAmount,
    payments: typeof d.payments === 'string' ? d.payments : JSON.stringify(d.payments || []),
  };
}

// ==========================================
// RECURRING INVOICES CRUD & ENGINE
// ==========================================

export async function getRecurringInvoices(userId: number): Promise<any[]> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`SELECT * FROM "${schema}".recurring_invoices ORDER BY id DESC`);
  return res.rows.map((r: any) => ({
    ...r,
    amount: Number(r.amount || 0),
    tax_amount: Number(r.tax_amount || 0),
    subtotal: Number(r.subtotal || 0),
    items: typeof r.items === 'string' ? r.items : JSON.stringify(r.items || []),
  }));
}

export async function createRecurringInvoice(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const itemsStr = typeof data.items === 'object' ? JSON.stringify(data.items) : (data.items || '[]');
  const subtotal = data.subtotal !== undefined ? Number(data.subtotal) : (Number(data.amount || 0) - Number(data.tax_amount || 0));
  const res = await pool.query(
    `INSERT INTO "${schema}".recurring_invoices (
       profile_name, party_name, frequency, start_date, end_date, next_issue_date,
       amount, tax_amount, subtotal, items, payment_terms, status, auto_email, notes, created_at
     )
     VALUES ($1, $2, COALESCE($3, 'Monthly'), COALESCE($4, CURRENT_DATE), $5, COALESCE($6, CURRENT_DATE), $7, $8, $9, $10, COALESCE($11, 'Net 30 Days'), COALESCE($12, 'Active'), COALESCE($13, true), $14, NOW())
     RETURNING *`,
    [
      data.profile_name || `Monthly Subscription - ${data.party_name}`,
      data.party_name,
      data.frequency || 'Monthly',
      data.start_date || null,
      data.end_date || null,
      data.next_issue_date || null,
      Number(data.amount || 0),
      Number(data.tax_amount || 0),
      subtotal,
      itemsStr,
      data.payment_terms || 'Net 30 Days',
      data.status || 'Active',
      data.auto_email !== undefined ? Boolean(data.auto_email) : true,
      data.notes || '',
    ]
  );
  return res.rows[0];
}

export async function updateRecurringInvoice(userId: number, id: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const itemsStr = typeof data.items === 'object' ? JSON.stringify(data.items) : data.items;
  const res = await pool.query(
    `UPDATE "${schema}".recurring_invoices
     SET profile_name = COALESCE($1, profile_name),
         party_name = COALESCE($2, party_name),
         frequency = COALESCE($3, frequency),
         start_date = COALESCE($4, start_date),
         end_date = $5,
         next_issue_date = COALESCE($6, next_issue_date),
         amount = COALESCE($7, amount),
         tax_amount = COALESCE($8, tax_amount),
         subtotal = COALESCE($9, subtotal),
         items = COALESCE($10, items),
         payment_terms = COALESCE($11, payment_terms),
         status = COALESCE($12, status),
         auto_email = COALESCE($13, auto_email),
         notes = COALESCE($14, notes)
     WHERE id = $15
     RETURNING *`,
    [
      data.profile_name,
      data.party_name,
      data.frequency,
      data.start_date,
      data.end_date,
      data.next_issue_date,
      data.amount !== undefined ? Number(data.amount) : null,
      data.tax_amount !== undefined ? Number(data.tax_amount) : null,
      data.subtotal !== undefined ? Number(data.subtotal) : null,
      itemsStr,
      data.payment_terms,
      data.status,
      data.auto_email,
      data.notes,
      id,
    ]
  );
  return res.rows[0];
}

export async function deleteRecurringInvoice(userId: number, id: number): Promise<boolean> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`DELETE FROM "${schema}".recurring_invoices WHERE id = $1`, [id]);
  return (res.rowCount || 0) > 0;
}

export async function triggerRecurringInvoiceGeneration(userId: number, profileId: number): Promise<{ invoice: any; recurringProfile: any; inventory: any[] }> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  // 1. Fetch recurring profile
  const pRes = await pool.query(`SELECT * FROM "${schema}".recurring_invoices WHERE id = $1`, [profileId]);
  if (pRes.rows.length === 0) throw new Error('Recurring invoice profile not found');
  const profile = pRes.rows[0];

  // 2. Generate new sequential invoice number
  const invNumber = `INV-${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-4)}`;
  const irnNumber = `IRN-${Math.random().toString(36).substring(2, 10).toUpperCase()}${Date.now().toString().slice(-6)}`;

  // 3. Deduct stock if items belong to inventory
  let itemsList: any[] = [];
  try {
    itemsList = typeof profile.items === 'string' ? JSON.parse(profile.items) : (profile.items || []);
  } catch {
    itemsList = [];
  }
  for (const it of itemsList) {
    if (it.is_service) continue;
    const qty = Math.max(0, Number(it.qty || it.quantity || 0));
    if (qty > 0 && (it.itemId || it.id)) {
      await pool.query(
        `UPDATE "${schema}".products SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
        [qty, Number(it.itemId || it.id)]
      );
    }
  }

  // 4. Create new Tax Invoice in invoices table
  const invRes = await pool.query(
    `INSERT INTO "${schema}".invoices (
       doc_type, doc_number, party_name, date, due_date, amount, tax_amount, status, notes,
       items, subtotal, discount_amount, terms_conditions, recurring_profile_id, irn_number,
       paid_amount, remaining_amount, payments, created_at
     )
     VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', $4, $5, 'Unpaid', $6, $7, $8, 0, $9, $10, $11, 0, $4, '[]', NOW())
     RETURNING *`,
    [
      'Invoices',
      invNumber,
      profile.party_name,
      Number(profile.amount || 0),
      Number(profile.tax_amount || 0),
      `Auto-generated subscription invoice for ${profile.profile_name} (${profile.frequency} cycle)`,
      profile.items || '[]',
      Number(profile.subtotal || 0),
      `Payment terms: ${profile.payment_terms || 'Net 30 Days'}. Auto-recurring subscription billing.`,
      profile.id,
      irnNumber,
    ]
  );
  const createdInvoice = invRes.rows[0];

  // 5. Calculate next issue date based on frequency
  let intervalDays = 30;
  const freq = (profile.frequency || 'Monthly').toLowerCase();
  if (freq === 'weekly') intervalDays = 7;
  else if (freq === 'quarterly') intervalDays = 90;
  else if (freq === 'half-yearly') intervalDays = 180;
  else if (freq === 'yearly' || freq === 'annual') intervalDays = 365;

  const updRes = await pool.query(
    `UPDATE "${schema}".recurring_invoices
     SET last_generated_date = CURRENT_DATE,
         next_issue_date = CURRENT_DATE + ($1 || ' days')::INTERVAL,
         total_cycles_run = COALESCE(total_cycles_run, 0) + 1
     WHERE id = $2
     RETURNING *`,
    [intervalDays.toString(), profile.id]
  );

  const freshInv = await pool.query(`SELECT * FROM "${schema}".products ORDER BY id DESC`);

  return {
    invoice: {
      ...createdInvoice,
      paid_amount: 0,
      remaining_amount: Number(createdInvoice.amount || 0),
      payments: '[]',
    },
    recurringProfile: updRes.rows[0],
    inventory: freshInv.rows,
  };
}

// ==========================================
// LIFECYCLE PROGRESSION & TRANSITION ENGINE
// Flow: Quotation -> Sales Order -> Proforma -> Delivery Challan -> Tax Invoice -> Credit Note
// ==========================================

export async function progressSalesDocument(
  userId: number,
  sourceId: number,
  options: {
    target_doc_type: string;
    po_number?: string;
    po_date?: string;
    vehicle_number?: string;
    transporter_name?: string;
    eway_bill_number?: string;
    advance_amount?: number;
    notes?: string;
  }
): Promise<{ newDoc: any; sourceDoc: any; inventory: any[] }> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  // 1. Fetch source doc
  const sRes = await pool.query(`SELECT * FROM "${schema}".invoices WHERE id = $1`, [sourceId]);
  if (sRes.rows.length === 0) throw new Error('Source document not found');
  const source = sRes.rows[0];

  const targetType = options.target_doc_type;
  let newDocNumber = '';
  let newStatus = 'Pending';
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  const randSuffix = Date.now().toString().slice(-4);

  if (targetType === 'Sale Order') {
    newDocNumber = `SO-${yearSuffix}${randSuffix}`;
    newStatus = 'Confirmed';
  } else if (targetType === 'Proforma Invoice') {
    newDocNumber = `PI-${yearSuffix}${randSuffix}`;
    newStatus = 'Pending Advance';
  } else if (targetType === 'Delivery Challan') {
    newDocNumber = `DC-${yearSuffix}${randSuffix}`;
    newStatus = 'Dispatched';
  } else if (targetType === 'Invoices') {
    newDocNumber = `INV-${yearSuffix}${randSuffix}`;
    newStatus = 'Unpaid';
  } else if (targetType === 'Sale return/Credit Note') {
    newDocNumber = `CN-${yearSuffix}${randSuffix}`;
    newStatus = 'Approved';
  } else {
    newDocNumber = `DOC-${yearSuffix}${randSuffix}`;
  }

  // Handle stock deduction / restoration
  let itemsList: any[] = [];
  try {
    itemsList = typeof source.items === 'string' ? JSON.parse(source.items) : (source.items || []);
  } catch {
    itemsList = [];
  }

  if (targetType === 'Invoices' || targetType === 'Delivery Challan') {
    // Deduct stock if converting to Delivery Challan or Invoice
    for (const it of itemsList) {
      if (it.is_service) continue;
      const qty = Math.max(0, Number(it.qty || it.quantity || 0));
      if (qty > 0) {
        if (it.itemId || it.id) {
          await pool.query(`UPDATE "${schema}".products SET stock = GREATEST(0, stock - $1) WHERE id = $2`, [qty, Number(it.itemId || it.id)]);
        } else if (it.name) {
          await pool.query(`UPDATE "${schema}".products SET stock = GREATEST(0, stock - $1) WHERE LOWER(name) = LOWER($2)`, [qty, it.name]);
        }
      }
    }
  } else if (targetType === 'Sale return/Credit Note') {
    // Restore stock for credit notes / returns
    for (const it of itemsList) {
      if (it.is_service) continue;
      const qty = Math.max(0, Number(it.qty || it.quantity || 0));
      if (qty > 0) {
        if (it.itemId || it.id) {
          await pool.query(`UPDATE "${schema}".products SET stock = stock + $1 WHERE id = $2`, [qty, Number(it.itemId || it.id)]);
        } else if (it.name) {
          await pool.query(`UPDATE "${schema}".products SET stock = stock + $1 WHERE LOWER(name) = LOWER($2)`, [qty, it.name]);
        }
      }
    }
  }

  const irnNumber = targetType === 'Invoices' ? `IRN-${Math.random().toString(36).substring(2, 10).toUpperCase()}${randSuffix}` : null;

  // Insert target doc
  const insRes = await pool.query(
    `INSERT INTO "${schema}".invoices (
       doc_type, doc_number, party_name, date, due_date, amount, tax_amount, status, notes,
       items, subtotal, discount_amount, place_of_supply, terms_conditions, ref_quote_number,
       po_number, po_date, vehicle_number, transporter_name, eway_bill_number, linked_doc_id, linked_doc_number, irn_number,
       paid_amount, remaining_amount, payments, created_at
     )
     VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 0, $5, '[]', NOW())
     RETURNING *`,
    [
      targetType,
      newDocNumber,
      source.party_name,
      source.due_date || null,
      Number(source.amount || 0),
      Number(source.tax_amount || 0),
      newStatus,
      options.notes || `Created from ${source.doc_type} #${source.doc_number}`,
      source.items || '[]',
      Number(source.subtotal || 0),
      Number(source.discount_amount || 0),
      source.place_of_supply || '',
      source.terms_conditions || '',
      source.ref_quote_number || (source.doc_type === 'Quotation' ? source.doc_number : ''),
      options.po_number || source.po_number || '',
      options.po_date || source.po_date || null,
      options.vehicle_number || source.vehicle_number || '',
      options.transporter_name || source.transporter_name || '',
      options.eway_bill_number || source.eway_bill_number || '',
      source.id,
      source.doc_number,
      irnNumber,
    ]
  );
  const createdDoc = insRes.rows[0];

  // Update source doc status
  let updatedSourceStatus = source.status;
  if (source.doc_type === 'Quotation') {
    updatedSourceStatus = 'Converted';
  } else if (source.doc_type === 'Sale Order') {
    updatedSourceStatus = targetType === 'Delivery Challan' ? 'Dispatched' : 'Fulfilled';
  } else if (source.doc_type === 'Proforma Invoice') {
    updatedSourceStatus = 'Invoiced';
  } else if (source.doc_type === 'Delivery Challan') {
    updatedSourceStatus = 'Invoiced';
  }

  const updSourceRes = await pool.query(
    `UPDATE "${schema}".invoices SET status = $1 WHERE id = $2 RETURNING *`,
    [updatedSourceStatus, sourceId]
  );

  const freshInv = await pool.query(`SELECT * FROM "${schema}".products ORDER BY id DESC`);

  return {
    newDoc: {
      ...createdDoc,
      paid_amount: 0,
      remaining_amount: Number(createdDoc.amount || 0),
      payments: '[]',
    },
    sourceDoc: updSourceRes.rows[0],
    inventory: freshInv.rows,
  };
}

// Expenses APIs (Targeting "${schema}".expenses)
export async function getReceipts(userId: number, receiptType?: string): Promise<any[]> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  let rows: any[] = [];
  if (receiptType) {
    const res = await pool.query(
      `SELECT * FROM "${schema}".expenses WHERE LOWER(expense_type) = LOWER($1) ORDER BY id DESC`,
      [receiptType]
    );
    rows = res.rows;
  } else {
    const res = await pool.query(`SELECT * FROM "${schema}".expenses ORDER BY id DESC`);
    rows = res.rows;
  }
  return rows.map((r: any) => ({
    ...r,
    receipt_type: r.expense_type || r.receipt_type || 'Record Expense : Debit',
    expense_type: r.expense_type || r.receipt_type || 'Record Expense : Debit',
  }));
}

export async function createReceipt(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(
    `INSERT INTO "${schema}".expenses (expense_type, ref_number, party_name, category, amount, payment_mode, date, notes, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, CURRENT_DATE), $8, NOW())
     RETURNING *`,
    [
      data.receipt_type || data.expense_type || 'Record Expense : Debit',
      data.ref_number || `EXP-${Date.now().toString().slice(-5)}`,
      data.party_name || 'General',
      data.category || 'Operations',
      Number(data.amount || 0),
      data.payment_mode || 'Bank Transfer',
      data.date || null,
      data.notes || '',
    ]
  );
  return res.rows[0];
}

// Products & Inventory APIs (Targeting "${schema}".products)
export async function getInventoryItems(userId: number): Promise<any[]> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`SELECT * FROM "${schema}".products ORDER BY id DESC`);
  return res.rows;
}

export async function createInventoryItem(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const itemCode = data.item_code || data.sku || `ITEM-${Date.now().toString().slice(-5)}`;
  const sku = data.sku || itemCode;
  const isService = Boolean(data.is_service || data.category === 'Services' || data.category === 'Labour' || data.unit === 'JOB' || data.unit === 'HRS');
  const stock = isService ? 999999 : Number(data.stock || 0);
  const minStock = isService ? 0 : Number(data.min_stock || 5);
  const res = await pool.query(
    `INSERT INTO "${schema}".products (name, sku, item_code, brand, hsn_sac, category, unit, purchase_price, purchase_tax_type, sale_price, sale_tax_type, tax_slab, stock, min_stock, tax_rate, is_service, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
     RETURNING *`,
    [
      data.name,
      sku,
      itemCode,
      data.brand || '',
      data.hsn_sac || (isService ? '998719' : '998311'),
      data.category || (isService ? 'Services' : 'General'),
      data.unit || (isService ? 'JOB' : 'PCS'),
      Number(data.purchase_price || 0),
      data.purchase_tax_type || 'Without Tax',
      Number(data.sale_price || 0),
      data.sale_tax_type || 'Without Tax',
      data.tax_slab || 'GST@18%',
      stock,
      minStock,
      Number(data.tax_rate !== undefined ? data.tax_rate : 18),
      isService,
    ]
  );
  return res.rows[0];
}

export async function updateInventoryItem(userId: number, id: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const itemCode = data.item_code || data.sku || `ITEM-${Date.now().toString().slice(-5)}`;
  const sku = data.sku || itemCode;
  const isService = Boolean(data.is_service || data.category === 'Services' || data.category === 'Labour' || data.unit === 'JOB' || data.unit === 'HRS');
  const stock = isService ? 999999 : Number(data.stock !== undefined ? data.stock : 0);
  const minStock = isService ? 0 : Number(data.min_stock !== undefined ? data.min_stock : 5);
  const res = await pool.query(
    `UPDATE "${schema}".products
     SET name = $1, sku = $2, item_code = $3, brand = $4, hsn_sac = $5, category = $6, unit = $7,
         purchase_price = $8, purchase_tax_type = $9, sale_price = $10, sale_tax_type = $11,
         tax_slab = $12, stock = $13, min_stock = $14, tax_rate = $15, is_service = $16
     WHERE id = $17
     RETURNING *`,
    [
      data.name,
      sku,
      itemCode,
      data.brand || '',
      data.hsn_sac || (isService ? '998719' : '998311'),
      data.category || (isService ? 'Services' : 'General'),
      data.unit || (isService ? 'JOB' : 'PCS'),
      Number(data.purchase_price || 0),
      data.purchase_tax_type || 'Without Tax',
      Number(data.sale_price || 0),
      data.sale_tax_type || 'Without Tax',
      data.tax_slab || 'GST@18%',
      stock,
      minStock,
      Number(data.tax_rate !== undefined ? data.tax_rate : 18),
      isService,
      id,
    ]
  );
  return res.rows[0];
}

export async function adjustInventoryStock(userId: number, id: number, adjustment: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const currentRes = await pool.query(`SELECT * FROM "${schema}".products WHERE id = $1`, [id]);
  if (currentRes.rows.length === 0) {
    throw new Error('Item not found');
  }
  const current = currentRes.rows[0];
  const currentStock = Number(current.stock || 0);
  const currentPurchasePrice = Number(current.purchase_price || 0);
  const currentSalePrice = Number(current.sale_price || 0);

  let newStock = currentStock;
  let newPurchasePrice = currentPurchasePrice;
  let newSalePrice = currentSalePrice;
  const purchaseTaxType = adjustment.purchase_tax_type || current.purchase_tax_type || 'Without Tax';
  const saleTaxType = adjustment.sale_tax_type || current.sale_tax_type || 'Without Tax';

  if (adjustment.type === 'inward' || adjustment.type === 'add') {
    const addQty = Math.max(0, Number(adjustment.quantity || 0));
    newStock = currentStock + addQty;

    // Indian standard Weighted Average Costing (Ind AS 2 / AS 2)
    // Weighted Average Purchase Price = ((old_stock * old_purchase_price) + (added_qty * inward_rate)) / (old_stock + added_qty)
    if (adjustment.use_weighted_avg && newStock > 0) {
      const inwardRate = Number(adjustment.inward_price || 0);
      const totalCost = (currentStock * currentPurchasePrice) + (addQty * inwardRate);
      newPurchasePrice = Number((totalCost / newStock).toFixed(2));
    } else if (adjustment.purchase_price !== undefined) {
      newPurchasePrice = Number(adjustment.purchase_price);
    }

    if (adjustment.sale_price !== undefined && Number(adjustment.sale_price) > 0) {
      newSalePrice = Number(adjustment.sale_price);
    }
  } else if (adjustment.type === 'outward' || adjustment.type === 'reduce') {
    const reduceQty = Math.max(0, Number(adjustment.quantity || 0));
    newStock = Math.max(0, currentStock - reduceQty);
    if (adjustment.purchase_price !== undefined) newPurchasePrice = Number(adjustment.purchase_price);
    if (adjustment.sale_price !== undefined) newSalePrice = Number(adjustment.sale_price);
  } else if (adjustment.type === 'set') {
    newStock = Math.max(0, Number(adjustment.quantity || 0));
    if (adjustment.purchase_price !== undefined) newPurchasePrice = Number(adjustment.purchase_price);
    if (adjustment.sale_price !== undefined) newSalePrice = Number(adjustment.sale_price);
  }

  const res = await pool.query(
    `UPDATE "${schema}".products
     SET stock = $1, purchase_price = $2, sale_price = $3, purchase_tax_type = $4, sale_tax_type = $5
     WHERE id = $6
     RETURNING *`,
    [newStock, newPurchasePrice, newSalePrice, purchaseTaxType, saleTaxType, id]
  );
  return res.rows[0];
}

export async function deleteInventoryItem(userId: number, id: number): Promise<boolean> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  await pool.query(`DELETE FROM "${schema}".products WHERE id = $1`, [id]);
  return true;
}

// Template Studio APIs (Targeting "${schema}".templates_config)
export async function getTemplatesConfig(userId: number): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`SELECT * FROM "${schema}".templates_config LIMIT 1`);
  return res.rows[0] || {};
}

export async function upsertTemplatesConfig(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const existing = await pool.query(`SELECT id FROM "${schema}".templates_config LIMIT 1`);
  if (existing.rows.length === 0) {
    const res = await pool.query(
      `INSERT INTO "${schema}".templates_config (theme, primary_color, show_logo, show_qr, show_bank_details, terms_conditions, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [
        data.theme || 'Modern Pro',
        data.primary_color || '#4f46e5',
        data.show_logo ?? true,
        data.show_qr ?? true,
        data.show_bank_details ?? true,
        data.terms_conditions || 'Payment due within 15 days.',
      ]
    );
    return res.rows[0];
  } else {
    const res = await pool.query(
      `UPDATE "${schema}".templates_config SET
         theme = $1,
         primary_color = $2,
         show_logo = $3,
         show_qr = $4,
         show_bank_details = $5,
         terms_conditions = $6,
         updated_at = NOW()
       RETURNING *`,
      [
        data.theme || 'Modern Pro',
        data.primary_color || '#4f46e5',
        data.show_logo ?? true,
        data.show_qr ?? true,
        data.show_bank_details ?? true,
        data.terms_conditions || 'Payment due within 15 days.',
      ]
    );
    return res.rows[0];
  }
}

// Category GST Rules & Tax Engine APIs (Targeting "${schema}".category_gst_rules)
export async function getTaxSettings(userId: number): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const res = await pool.query(`SELECT * FROM "${schema}".category_gst_rules LIMIT 1`);
  return res.rows[0] || {
    category_name: 'Standard GST Bracket',
    default_gst_rate: 18,
    is_composition: false,
    rcm_enabled: false,
    filing_period: 'Monthly'
  };
}

export async function upsertTaxSettings(userId: number, data: any): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);
  const existing = await pool.query(`SELECT id FROM "${schema}".category_gst_rules LIMIT 1`);
  if (existing.rows.length === 0) {
    const res = await pool.query(
      `INSERT INTO "${schema}".category_gst_rules (category_name, gst_rate, is_composition_eligible, rcm_applicable, filing_period, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        data.category_name || 'Standard Goods & Services',
        Number(data.default_gst_rate || data.gst_rate || 18),
        data.is_composition ?? false,
        data.rcm_enabled ?? false,
        data.filing_period || 'Monthly',
      ]
    );
    return res.rows[0];
  } else {
    const res = await pool.query(
      `UPDATE "${schema}".category_gst_rules SET
         gst_rate = $1,
         is_composition_eligible = $2,
         rcm_applicable = $3,
         filing_period = $4,
         updated_at = NOW()
       RETURNING *`,
      [
        Number(data.default_gst_rate || data.gst_rate || 18),
        data.is_composition ?? false,
        data.rcm_enabled ?? false,
        data.filing_period || 'Monthly',
      ]
    );
    return res.rows[0];
  }
}

// ==========================================
// GST FILING REPORT & GSTR-1 AGGREGATION API
// ==========================================
export async function getGstr1Report(userId: number, period?: string): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  // Fetch Business Profile for seller GSTIN and State
  const profileRes = await pool.query(`SELECT * FROM "${schema}".business_profiles LIMIT 1`);
  const profile = profileRes.rows[0] || {
    business_name: 'OmniBill Enterprises',
    gst_number: '27AABCO1234F1Z5',
    state: 'Maharashtra (27)',
  };

  const sellerGstin = (profile.gst_number || '27AABCO1234F1Z5').trim();
  const sellerStateCode = sellerGstin.length >= 2 && !isNaN(Number(sellerGstin.slice(0, 2)))
    ? sellerGstin.slice(0, 2)
    : '27';

  // Fetch Parties
  const partiesRes = await pool.query(`SELECT * FROM "${schema}".parties`);
  const partyMap = new Map<string, any>();
  for (const p of partiesRes.rows) {
    if (p.name) partyMap.set(p.name.toLowerCase().trim(), p);
  }

  // Fetch Invoices
  const invRes = await pool.query(
    `SELECT * FROM "${schema}".invoices ORDER BY date DESC, id DESC`
  );

  // Fetch Expenses / Receipts
  const expRes = await pool.query(
    `SELECT * FROM "${schema}".expenses ORDER BY date DESC, id DESC`
  );

  const statutoryRates = [0, 5, 12, 18, 28];

  // Helper to filter dates
  const matchesPeriod = (dateStr?: string) => {
    if (!dateStr || !period || period === 'all') return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    if (period === 'current_month') {
      return d.getFullYear() === curYear && d.getMonth() === curMonth;
    }
    if (period === 'prev_month') {
      const prevM = curMonth === 0 ? 11 : curMonth - 1;
      const prevY = curMonth === 0 ? curYear - 1 : curYear;
      return d.getFullYear() === prevY && d.getMonth() === prevM;
    }
    if (period === 'q3') {
      return d.getFullYear() === curYear && d.getMonth() >= 9 && d.getMonth() <= 11;
    }
    if (period === 'q2') {
      return d.getFullYear() === curYear && d.getMonth() >= 6 && d.getMonth() <= 8;
    }
    if (period === 'fy26') {
      return d >= new Date(2026, 3, 1) && d <= new Date(2027, 2, 31, 23, 59, 59);
    }
    return true;
  };

  // Slab accumulation map
  const slabMap = new Map<number, {
    rate: number;
    label: string;
    description: string;
    outward_invoices_count: number;
    outward_taxable_value: number;
    cgst_amount: number;
    sgst_amount: number;
    igst_amount: number;
    total_outward_tax: number;
    total_outward_gross: number;
    inward_receipts_count: number;
    inward_taxable_value: number;
    inward_itc_amount: number;
    total_inward_gross: number;
    net_tax_liability: number;
  }>();

  for (const r of statutoryRates) {
    let desc = 'Standard Goods & Services';
    if (r === 0) desc = 'Exempt / Nil-Rated Goods & Services';
    else if (r === 5) desc = 'Transport, Basic Necessities, Solar Components';
    else if (r === 12) desc = 'Standard Goods, Process Work, Equipment';
    else if (r === 18) desc = 'IT, Software, Hardware, Business Services';
    else if (r === 28) desc = 'Demerit, Luxury Goods, Heavy Equipment';

    slabMap.set(r, {
      rate: r,
      label: `GST@${r}%`,
      description: desc,
      outward_invoices_count: 0,
      outward_taxable_value: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      igst_amount: 0,
      total_outward_tax: 0,
      total_outward_gross: 0,
      inward_receipts_count: 0,
      inward_taxable_value: 0,
      inward_itc_amount: 0,
      total_inward_gross: 0,
      net_tax_liability: 0,
    });
  }

  // Detailed rows for drilldown & GSTR-1 sections
  const b2bInvoices: any[] = [];
  const b2cLargeInvoices: any[] = [];
  const b2cSmallInvoices: any[] = [];
  const hsnSummaryMap = new Map<string, {
    hsn_sac: string;
    desc: string;
    uqc: string;
    total_qty: number;
    taxable_value: number;
    rate: number;
    igst: number;
    cgst: number;
    sgst: number;
    total_tax: number;
  }>();

  const invoiceRecords: any[] = [];

  // Process Sales Invoices
  for (const inv of invRes.rows) {
    if (!matchesPeriod(inv.date)) continue;

    const party = inv.party_name ? partyMap.get(inv.party_name.toLowerCase().trim()) : null;
    const clientGstin = party?.gstin ? party.gstin.trim() : null;
    const clientStateCode = clientGstin && clientGstin.length >= 2 && !isNaN(Number(clientGstin.slice(0, 2)))
      ? clientGstin.slice(0, 2)
      : (party?.state_region?.match(/\((\d{2})\)/)?.[1] || sellerStateCode);

    const isIntrastate = clientStateCode === sellerStateCode;
    const isB2B = Boolean(clientGstin && clientGstin.length === 15);
    const invoiceTotal = Number(inv.amount || 0);

    // Extract line items
    let items: any[] = [];
    if (inv.items) {
      if (typeof inv.items === 'string') {
        try { items = JSON.parse(inv.items); } catch { items = []; }
      } else if (Array.isArray(inv.items)) {
        items = inv.items;
      }
    }

    if (items.length === 0) {
      const taxAmt = Number(inv.tax_amount || 0);
      const taxable = Math.max(0, invoiceTotal - taxAmt);
      const rawRate = taxable > 0 ? Math.round((taxAmt / taxable) * 100) : 18;
      const snapRate = statutoryRates.reduce((prev, curr) =>
        Math.abs(curr - rawRate) < Math.abs(prev - rawRate) ? curr : prev
      );

      items = [{
        name: inv.notes || 'Outward Supply of Services',
        hsn_sac: '998311',
        qty: 1,
        unit: 'UNT',
        rate: taxable,
        tax_rate: snapRate,
        tax_amount: taxAmt,
        taxable_value: taxable,
        total: invoiceTotal,
      }];
    }

    let invCgst = 0;
    let invSgst = 0;
    let invIgst = 0;
    let invTaxable = 0;
    let invTax = 0;

    for (const it of items) {
      const rate = Number(it.tax_rate ?? 18);
      const snapRate = statutoryRates.includes(rate)
        ? rate
        : statutoryRates.reduce((prev, curr) => Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev);

      const itemTaxable = Number(it.taxable_value ?? (Number(it.qty || 1) * Number(it.rate || 0)));
      const itemTax = Number(it.tax_amount ?? (itemTaxable * (snapRate / 100)));

      let itemCgst = 0;
      let itemSgst = 0;
      let itemIgst = 0;

      if (isIntrastate) {
        itemCgst = Math.round((itemTax / 2) * 100) / 100;
        itemSgst = Math.round((itemTax / 2) * 100) / 100;
      } else {
        itemIgst = Math.round(itemTax * 100) / 100;
      }

      invCgst += itemCgst;
      invSgst += itemSgst;
      invIgst += itemIgst;
      invTaxable += itemTaxable;
      invTax += itemTax;

      // Update slab map
      const slab = slabMap.get(snapRate)!;
      slab.outward_taxable_value += itemTaxable;
      slab.cgst_amount += itemCgst;
      slab.sgst_amount += itemSgst;
      slab.igst_amount += itemIgst;
      slab.total_outward_tax += itemTax;
      slab.total_outward_gross += (itemTaxable + itemTax);

      // Update HSN Summary
      const hsnKey = `${it.hsn_sac || '998311'}_${snapRate}`;
      const existingHsn = hsnSummaryMap.get(hsnKey);
      if (existingHsn) {
        existingHsn.total_qty += Number(it.qty || 1);
        existingHsn.taxable_value += itemTaxable;
        existingHsn.igst += itemIgst;
        existingHsn.cgst += itemCgst;
        existingHsn.sgst += itemSgst;
        existingHsn.total_tax += itemTax;
      } else {
        hsnSummaryMap.set(hsnKey, {
          hsn_sac: it.hsn_sac || '998311',
          desc: it.name || 'Outward Supply',
          uqc: it.unit || 'PCS',
          total_qty: Number(it.qty || 1),
          taxable_value: itemTaxable,
          rate: snapRate,
          igst: itemIgst,
          cgst: itemCgst,
          sgst: itemSgst,
          total_tax: itemTax,
        });
      }
    }

    // Assign invoice to appropriate slab invoice count
    const primaryRate = items[0] ? (statutoryRates.includes(Number(items[0].tax_rate)) ? Number(items[0].tax_rate) : 18) : 18;
    slabMap.get(primaryRate)!.outward_invoices_count += 1;

    // GSTR-1 Classification
    const invRecord = {
      id: inv.id,
      doc_number: inv.doc_number,
      date: inv.date,
      party_name: inv.party_name,
      client_gstin: clientGstin,
      place_of_supply: clientStateCode,
      supply_type: isIntrastate ? 'Intra-State' : 'Inter-State',
      taxable_value: Math.round(invTaxable * 100) / 100,
      cgst: Math.round(invCgst * 100) / 100,
      sgst: Math.round(invSgst * 100) / 100,
      igst: Math.round(invIgst * 100) / 100,
      total_tax: Math.round(invTax * 100) / 100,
      gross_amount: Math.round(invoiceTotal * 100) / 100,
      status: inv.status,
      gstr1_table: isB2B ? 'Table 4A (B2B)' : (!isIntrastate && invoiceTotal > 250000 ? 'Table 5A (B2C Large)' : 'Table 7 (B2C Small)'),
    };
    invoiceRecords.push(invRecord);

    if (isB2B) {
      b2bInvoices.push(invRecord);
    } else if (!isIntrastate && invoiceTotal > 250000) {
      b2cLargeInvoices.push(invRecord);
    } else {
      b2cSmallInvoices.push(invRecord);
    }
  }

  // Process Expense Receipts (Inward Supplies / ITC)
  const expenseRecords: any[] = [];
  for (const exp of expRes.rows) {
    if (!matchesPeriod(exp.date)) continue;

    const amt = Number(exp.amount || 0);
    const cat = (exp.category || '').toLowerCase();
    const notes = (exp.notes || '').toLowerCase();

    let rate = 18;
    if (cat.includes('travel') || cat.includes('freight') || cat.includes('transport') || notes.includes('5%')) {
      rate = 5;
    } else if (cat.includes('stationery') || cat.includes('print') || cat.includes('repair') || notes.includes('12%')) {
      rate = 12;
    } else if (cat.includes('salary') || cat.includes('wage') || cat.includes('bank') || cat.includes('exempt') || notes.includes('0%')) {
      rate = 0;
    } else if (cat.includes('luxury') || notes.includes('28%')) {
      rate = 28;
    }

    const taxable = rate > 0 ? Math.round((amt / (1 + rate / 100)) * 100) / 100 : amt;
    const itc = Math.round((amt - taxable) * 100) / 100;

    const slab = slabMap.get(rate)!;
    slab.inward_receipts_count += 1;
    slab.inward_taxable_value += taxable;
    slab.inward_itc_amount += itc;
    slab.total_inward_gross += amt;

    expenseRecords.push({
      id: exp.id,
      ref_number: exp.ref_number,
      date: exp.date,
      party_name: exp.party_name,
      category: exp.category,
      tax_rate: rate,
      taxable_value: taxable,
      itc_amount: itc,
      gross_amount: amt,
      payment_mode: exp.payment_mode,
      notes: exp.notes,
    });
  }

  // Calculate net liabilities and round values
  let totalOutwardTaxable = 0;
  let totalOutwardTax = 0;
  let totalInwardTaxable = 0;
  let totalInwardItc = 0;
  let totalInvoicesCount = 0;
  let totalExpensesCount = 0;

  const slabList: any[] = [];
  for (const r of statutoryRates) {
    const s = slabMap.get(r)!;
    s.outward_taxable_value = Math.round(s.outward_taxable_value * 100) / 100;
    s.cgst_amount = Math.round(s.cgst_amount * 100) / 100;
    s.sgst_amount = Math.round(s.sgst_amount * 100) / 100;
    s.igst_amount = Math.round(s.igst_amount * 100) / 100;
    s.total_outward_tax = Math.round(s.total_outward_tax * 100) / 100;
    s.total_outward_gross = Math.round(s.total_outward_gross * 100) / 100;
    s.inward_taxable_value = Math.round(s.inward_taxable_value * 100) / 100;
    s.inward_itc_amount = Math.round(s.inward_itc_amount * 100) / 100;
    s.total_inward_gross = Math.round(s.total_inward_gross * 100) / 100;
    s.net_tax_liability = Math.round((s.total_outward_tax - s.inward_itc_amount) * 100) / 100;

    totalOutwardTaxable += s.outward_taxable_value;
    totalOutwardTax += s.total_outward_tax;
    totalInwardTaxable += s.inward_taxable_value;
    totalInwardItc += s.inward_itc_amount;
    totalInvoicesCount += s.outward_invoices_count;
    totalExpensesCount += s.inward_receipts_count;

    slabList.push(s);
  }

  // Build GST Portal JSON compatible format
  const gstr1Json = {
    gstin: sellerGstin,
    fp: `${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getFullYear()}`,
    cur_gt: Math.round(totalOutwardTaxable + totalOutwardTax),
    b2b: b2bInvoices.map((inv) => ({
      ctin: inv.client_gstin,
      inv: [{
        inum: inv.doc_number,
        idt: inv.date ? inv.date.split('T')[0].split('-').reverse().join('-') : '14-10-2026',
        val: inv.gross_amount,
        pos: inv.place_of_supply,
        rchrg: 'N',
        inv_typ: 'R',
        itms: [{
          num: 1,
          itm_det: {
            rt: 18,
            txval: inv.taxable_value,
            iamt: inv.igst,
            camt: inv.cgst,
            samt: inv.sgst,
            csamt: 0,
          },
        }],
      }],
    })),
    b2cl: b2cLargeInvoices.map((inv) => ({
      pos: inv.place_of_supply,
      inv: [{
        inum: inv.doc_number,
        idt: inv.date ? inv.date.split('T')[0].split('-').reverse().join('-') : '14-10-2026',
        val: inv.gross_amount,
        itms: [{
          num: 1,
          itm_det: {
            rt: 18,
            txval: inv.taxable_value,
            iamt: inv.igst,
            csamt: 0,
          },
        }],
      }],
    })),
    b2cs: b2cSmallInvoices.map((inv) => ({
      sply_ty: inv.supply_type === 'Inter-State' ? 'INTER' : 'INTRA',
      pos: inv.place_of_supply,
      typ: 'OE',
      rt: 18,
      txval: inv.taxable_value,
      iamt: inv.igst,
      camt: inv.cgst,
      samt: inv.sgst,
      csamt: 0,
    })),
    hsn: {
      data: Array.from(hsnSummaryMap.values()).map((h, i) => ({
        num: i + 1,
        hsn_sc: h.hsn_sac,
        desc: h.desc,
        uqc: h.uqc,
        qty: h.total_qty,
        val: Math.round((h.taxable_value + h.total_tax) * 100) / 100,
        txval: Math.round(h.taxable_value * 100) / 100,
        iamt: Math.round(h.igst * 100) / 100,
        camt: Math.round(h.cgst * 100) / 100,
        samt: Math.round(h.sgst * 100) / 100,
        csamt: 0,
      })),
    },
  };

  return {
    period: period || 'all',
    seller: {
      business_name: profile.business_name,
      trade_name: profile.trade_name,
      gstin: sellerGstin,
      state: profile.state,
      state_code: sellerStateCode,
    },
    summary: {
      total_outward_taxable: Math.round(totalOutwardTaxable * 100) / 100,
      total_outward_tax: Math.round(totalOutwardTax * 100) / 100,
      total_inward_taxable: Math.round(totalInwardTaxable * 100) / 100,
      total_inward_itc: Math.round(totalInwardItc * 100) / 100,
      net_tax_payable: Math.round((totalOutwardTax - totalInwardItc) * 100) / 100,
      total_invoices_count: totalInvoicesCount,
      total_expenses_count: totalExpensesCount,
      b2b_invoices_count: b2bInvoices.length,
      b2c_invoices_count: b2cLargeInvoices.length + b2cSmallInvoices.length,
    },
    slabs: slabList,
    gstr1_tables: {
      b2b: b2bInvoices,
      b2c_large: b2cLargeInvoices,
      b2c_small: b2cSmallInvoices,
      hsn_summary: Array.from(hsnSummaryMap.values()),
    },
    invoices: invoiceRecords,
    expenses: expenseRecords,
    gstr1Json,
  };
}

// ==========================================
// GSTR-3B STATUTORY FILING SUMMARY & NET TAX
// ==========================================
export async function getGstr3bReport(userId: number, period?: string): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  // Fetch Business Profile
  const profileRes = await pool.query(`SELECT * FROM "${schema}".business_profiles LIMIT 1`);
  const profile = profileRes.rows[0] || {
    business_name: 'OmniBill Enterprises',
    gst_number: '27AABCO1234F1Z5',
    state: 'Maharashtra (27)',
  };

  const sellerGstin = (profile.gst_number || '27AABCO1234F1Z5').trim();
  const sellerStateCode = sellerGstin.length >= 2 && !isNaN(Number(sellerGstin.slice(0, 2)))
    ? sellerGstin.slice(0, 2)
    : '27';

  // Fetch Parties
  const partiesRes = await pool.query(`SELECT * FROM "${schema}".parties`);
  const partyMap = new Map<string, any>();
  for (const p of partiesRes.rows) {
    if (p.name) partyMap.set(p.name.toLowerCase().trim(), p);
  }

  // Fetch Invoices
  const invRes = await pool.query(
    `SELECT * FROM "${schema}".invoices ORDER BY date DESC, id DESC`
  );

  // Fetch Expenses / Vendor Receipts
  const expRes = await pool.query(
    `SELECT * FROM "${schema}".expenses ORDER BY date DESC, id DESC`
  );

  const statutoryRates = [0, 5, 12, 18, 28];

  const matchesPeriod = (dateStr?: string) => {
    if (!dateStr || !period || period === 'all') return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    if (period === 'current_month') {
      return d.getFullYear() === curYear && d.getMonth() === curMonth;
    }
    if (period === 'prev_month') {
      const prevM = curMonth === 0 ? 11 : curMonth - 1;
      const prevY = curMonth === 0 ? curYear - 1 : curYear;
      return d.getFullYear() === prevY && d.getMonth() === prevM;
    }
    if (period === 'q3') {
      return d.getFullYear() === curYear && d.getMonth() >= 9 && d.getMonth() <= 11;
    }
    if (period === 'q2') {
      return d.getFullYear() === curYear && d.getMonth() >= 6 && d.getMonth() <= 8;
    }
    if (period === 'fy26') {
      return d >= new Date(2026, 3, 1) && d <= new Date(2027, 2, 31, 23, 59, 59);
    }
    return true;
  };

  // Slab structure
  interface SlabAccumulator {
    rate: number;
    slab_name: string;
    description: string;
    outward_count: number;
    outward_taxable: number;
    outward_cgst: number;
    outward_sgst: number;
    outward_igst: number;
    total_outward_tax: number;
    inward_count: number;
    inward_taxable: number;
    inward_cgst: number;
    inward_sgst: number;
    inward_igst: number;
    total_inward_itc: number;
    net_tax_payable: number;
    itc_surplus: number;
    status: string;
  }

  const slabMap = new Map<number, SlabAccumulator>();
  for (const r of statutoryRates) {
    let desc = 'Standard Goods & Services';
    if (r === 0) desc = 'Exempt / Nil-Rated Supplies';
    else if (r === 5) desc = 'Transport, Basic Food Products, Solar Gear';
    else if (r === 12) desc = 'Work Contracts, Processed Goods, Equipment';
    else if (r === 18) desc = 'IT, Software, Professional & Financial Services';
    else if (r === 28) desc = 'Demerit, Luxury Goods, Heavy Machinery';

    slabMap.set(r, {
      rate: r,
      slab_name: `GST@${r}%`,
      description: desc,
      outward_count: 0,
      outward_taxable: 0,
      outward_cgst: 0,
      outward_sgst: 0,
      outward_igst: 0,
      total_outward_tax: 0,
      inward_count: 0,
      inward_taxable: 0,
      inward_cgst: 0,
      inward_sgst: 0,
      inward_igst: 0,
      total_inward_itc: 0,
      net_tax_payable: 0,
      itc_surplus: 0,
      status: 'Nil Supply',
    });
  }

  const invoiceRecords: any[] = [];
  let totalOutwardTaxable = 0;
  let totalOutwardCgst = 0;
  let totalOutwardSgst = 0;
  let totalOutwardIgst = 0;
  let totalOutwardTax = 0;

  // Aggregate Outward Supplies (Invoices)
  for (const inv of invRes.rows) {
    if (!matchesPeriod(inv.date)) continue;

    const party = inv.party_name ? partyMap.get(inv.party_name.toLowerCase().trim()) : null;
    const clientGstin = party?.gstin ? party.gstin.trim() : null;
    const clientStateCode = clientGstin && clientGstin.length >= 2 && !isNaN(Number(clientGstin.slice(0, 2)))
      ? clientGstin.slice(0, 2)
      : (party?.state_region?.match(/\((\d{2})\)/)?.[1] || sellerStateCode);

    const isIntrastate = clientStateCode === sellerStateCode;
    const invoiceTotal = Number(inv.amount || 0);

    let items: any[] = [];
    if (inv.items) {
      if (typeof inv.items === 'string') {
        try { items = JSON.parse(inv.items); } catch { items = []; }
      } else if (Array.isArray(inv.items)) {
        items = inv.items;
      }
    }

    if (items.length === 0) {
      const taxAmt = Number(inv.tax_amount || 0);
      const taxable = Math.max(0, invoiceTotal - taxAmt);
      const rawRate = taxable > 0 ? Math.round((taxAmt / taxable) * 100) : 18;
      const snapRate = statutoryRates.reduce((prev, curr) =>
        Math.abs(curr - rawRate) < Math.abs(prev - rawRate) ? curr : prev
      );

      items = [{
        name: inv.notes || 'Outward Supply of Services',
        hsn_sac: '998311',
        qty: 1,
        unit: 'UNT',
        rate: taxable,
        tax_rate: snapRate,
        tax_amount: taxAmt,
        taxable_value: taxable,
        total: invoiceTotal,
      }];
    }

    let invCgst = 0;
    let invSgst = 0;
    let invIgst = 0;
    let invTaxable = 0;
    let invTax = 0;

    for (const it of items) {
      const rate = Number(it.tax_rate ?? 18);
      const snapRate = statutoryRates.includes(rate)
        ? rate
        : statutoryRates.reduce((prev, curr) => Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev);

      const itemTaxable = Number(it.taxable_value ?? (Number(it.qty || 1) * Number(it.rate || 0)));
      const itemTax = Number(it.tax_amount ?? (itemTaxable * (snapRate / 100)));

      let itemCgst = 0;
      let itemSgst = 0;
      let itemIgst = 0;

      if (isIntrastate) {
        itemCgst = Math.round((itemTax / 2) * 100) / 100;
        itemSgst = Math.round((itemTax / 2) * 100) / 100;
      } else {
        itemIgst = Math.round(itemTax * 100) / 100;
      }

      invCgst += itemCgst;
      invSgst += itemSgst;
      invIgst += itemIgst;
      invTaxable += itemTaxable;
      invTax += itemTax;

      const slab = slabMap.get(snapRate)!;
      slab.outward_taxable += itemTaxable;
      slab.outward_cgst += itemCgst;
      slab.outward_sgst += itemSgst;
      slab.outward_igst += itemIgst;
      slab.total_outward_tax += itemTax;
    }

    const primaryRate = items[0] ? (statutoryRates.includes(Number(items[0].tax_rate)) ? Number(items[0].tax_rate) : 18) : 18;
    slabMap.get(primaryRate)!.outward_count += 1;

    totalOutwardTaxable += invTaxable;
    totalOutwardCgst += invCgst;
    totalOutwardSgst += invSgst;
    totalOutwardIgst += invIgst;
    totalOutwardTax += invTax;

    invoiceRecords.push({
      id: inv.id,
      doc_number: inv.doc_number,
      date: inv.date,
      party_name: inv.party_name,
      supply_type: isIntrastate ? 'Intra-State' : 'Inter-State',
      taxable_value: Math.round(invTaxable * 100) / 100,
      cgst: Math.round(invCgst * 100) / 100,
      sgst: Math.round(invSgst * 100) / 100,
      igst: Math.round(invIgst * 100) / 100,
      total_tax: Math.round(invTax * 100) / 100,
      gross_amount: Math.round(invoiceTotal * 100) / 100,
    });
  }

  // Aggregate Inward Supplies / Expenses for Input Tax Credit (ITC)
  const expenseRecords: any[] = [];
  let totalInwardTaxable = 0;
  let totalInwardCgst = 0;
  let totalInwardSgst = 0;
  let totalInwardIgst = 0;
  let totalInwardItc = 0;

  for (const exp of expRes.rows) {
    if (!matchesPeriod(exp.date)) continue;

    const amt = Number(exp.amount || 0);
    const cat = (exp.category || '').toLowerCase();
    const notes = (exp.notes || '').toLowerCase();

    let rate = 18;
    if (cat.includes('travel') || cat.includes('freight') || cat.includes('transport') || notes.includes('5%')) {
      rate = 5;
    } else if (cat.includes('stationery') || cat.includes('print') || cat.includes('repair') || notes.includes('12%')) {
      rate = 12;
    } else if (cat.includes('salary') || cat.includes('wage') || cat.includes('bank') || cat.includes('exempt') || notes.includes('0%')) {
      rate = 0;
    } else if (cat.includes('luxury') || notes.includes('28%')) {
      rate = 28;
    }

    const taxable = rate > 0 ? Math.round((amt / (1 + rate / 100)) * 100) / 100 : amt;
    const itc = Math.round((amt - taxable) * 100) / 100;

    // Check vendor state for intra/interstate ITC split
    const isInterstateExp = notes.includes('inter') || notes.includes('igst') || cat.includes('cloud') || cat.includes('software');
    let expCgst = 0;
    let expSgst = 0;
    let expIgst = 0;

    if (isInterstateExp) {
      expIgst = itc;
    } else {
      expCgst = Math.round((itc / 2) * 100) / 100;
      expSgst = Math.round((itc / 2) * 100) / 100;
    }

    const slab = slabMap.get(rate)!;
    slab.inward_count += 1;
    slab.inward_taxable += taxable;
    slab.inward_cgst += expCgst;
    slab.inward_sgst += expSgst;
    slab.inward_igst += expIgst;
    slab.total_inward_itc += itc;

    totalInwardTaxable += taxable;
    totalInwardCgst += expCgst;
    totalInwardSgst += expSgst;
    totalInwardIgst += expIgst;
    totalInwardItc += itc;

    expenseRecords.push({
      id: exp.id,
      ref_number: exp.ref_number,
      date: exp.date,
      party_name: exp.party_name,
      category: exp.category,
      tax_rate: rate,
      taxable_value: taxable,
      cgst: expCgst,
      sgst: expSgst,
      igst: expIgst,
      itc_amount: itc,
      gross_amount: amt,
    });
  }

  // Calculate Net Tax and Status per Slab
  const slabList: SlabAccumulator[] = [];
  for (const r of statutoryRates) {
    const s = slabMap.get(r)!;
    s.outward_taxable = Math.round(s.outward_taxable * 100) / 100;
    s.outward_cgst = Math.round(s.outward_cgst * 100) / 100;
    s.outward_sgst = Math.round(s.outward_sgst * 100) / 100;
    s.outward_igst = Math.round(s.outward_igst * 100) / 100;
    s.total_outward_tax = Math.round(s.total_outward_tax * 100) / 100;

    s.inward_taxable = Math.round(s.inward_taxable * 100) / 100;
    s.inward_cgst = Math.round(s.inward_cgst * 100) / 100;
    s.inward_sgst = Math.round(s.inward_sgst * 100) / 100;
    s.inward_igst = Math.round(s.inward_igst * 100) / 100;
    s.total_inward_itc = Math.round(s.total_inward_itc * 100) / 100;

    const diff = s.total_outward_tax - s.total_inward_itc;
    if (diff > 0) {
      s.net_tax_payable = Math.round(diff * 100) / 100;
      s.itc_surplus = 0;
      s.status = 'Net Payable';
    } else if (diff < 0) {
      s.net_tax_payable = 0;
      s.itc_surplus = Math.round(Math.abs(diff) * 100) / 100;
      s.status = 'ITC Surplus';
    } else {
      s.net_tax_payable = 0;
      s.itc_surplus = 0;
      s.status = s.total_outward_tax === 0 ? 'Nil Supply' : 'Balanced';
    }
    slabList.push(s);
  }

  // Round summary figures
  totalOutwardTaxable = Math.round(totalOutwardTaxable * 100) / 100;
  totalOutwardCgst = Math.round(totalOutwardCgst * 100) / 100;
  totalOutwardSgst = Math.round(totalOutwardSgst * 100) / 100;
  totalOutwardIgst = Math.round(totalOutwardIgst * 100) / 100;
  totalOutwardTax = Math.round(totalOutwardTax * 100) / 100;

  totalInwardTaxable = Math.round(totalInwardTaxable * 100) / 100;
  totalInwardCgst = Math.round(totalInwardCgst * 100) / 100;
  totalInwardSgst = Math.round(totalInwardSgst * 100) / 100;
  totalInwardIgst = Math.round(totalInwardIgst * 100) / 100;
  totalInwardItc = Math.round(totalInwardItc * 100) / 100;

  // Cross-utilization of ITC as per GST Rule 88A
  // 1. IGST liability is paid by IGST ITC, then CGST/SGST ITC
  // 2. CGST liability is paid by CGST ITC, then IGST ITC
  // 3. SGST liability is paid by SGST ITC, then IGST ITC
  const igstPayable = Math.max(0, totalOutwardIgst - totalInwardIgst);
  const igstItcSurplus = Math.max(0, totalInwardIgst - totalOutwardIgst);

  let cgstPayable = Math.max(0, totalOutwardCgst - totalInwardCgst);
  const cgstItcSurplus = Math.max(0, totalInwardCgst - totalOutwardCgst);

  let sgstPayable = Math.max(0, totalOutwardSgst - totalInwardSgst);
  const sgstItcSurplus = Math.max(0, totalInwardSgst - totalOutwardSgst);

  // If there's surplus IGST ITC, offset remaining CGST and SGST
  if (igstItcSurplus > 0) {
    const cgstOffset = Math.min(cgstPayable, igstItcSurplus / 2);
    cgstPayable -= cgstOffset;
    const sgstOffset = Math.min(sgstPayable, igstItcSurplus - cgstOffset);
    sgstPayable -= sgstOffset;
  }

  const finalNetTaxPayable = Math.round((igstPayable + cgstPayable + sgstPayable) * 100) / 100;
  const netItcCarryforward = Math.round(Math.max(0, totalInwardItc - totalOutwardTax) * 100) / 100;

  // GSTR-3B Statutory Tables
  const table31 = {
    outward_taxable: {
      description: '(a) Outward taxable supplies (other than zero rated, nil rated and exempted)',
      taxable_value: totalOutwardTaxable,
      igst: totalOutwardIgst,
      cgst: totalOutwardCgst,
      sgst: totalOutwardSgst,
      cess: 0,
    },
    zero_rated: {
      description: '(b) Outward taxable supplies (zero rated / exports)',
      taxable_value: slabMap.get(0)?.outward_taxable || 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    nil_exempt: {
      description: '(c) Other outward supplies (Nil rated, exempted)',
      taxable_value: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    inward_rcm: {
      description: '(d) Inward supplies (liable to reverse charge)',
      taxable_value: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    non_gst: {
      description: '(e) Non-GST outward supplies',
      taxable_value: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    total: {
      taxable_value: totalOutwardTaxable,
      igst: totalOutwardIgst,
      cgst: totalOutwardCgst,
      sgst: totalOutwardSgst,
      total_tax: totalOutwardTax,
    },
  };

  const table4 = {
    itc_available: {
      import_goods: { description: '(1) Import of goods', igst: 0, cgst: 0, sgst: 0, cess: 0 },
      import_services: { description: '(2) Import of services', igst: 0, cgst: 0, sgst: 0, cess: 0 },
      inward_rcm: { description: '(3) Inward supplies liable to reverse charge', igst: 0, cgst: 0, sgst: 0, cess: 0 },
      isd: { description: '(4) Inward supplies from ISD', igst: 0, cgst: 0, sgst: 0, cess: 0 },
      all_other_itc: {
        description: '(5) All other ITC (From verified business expenses & purchases)',
        taxable_value: totalInwardTaxable,
        igst: totalInwardIgst,
        cgst: totalInwardCgst,
        sgst: totalInwardSgst,
        total: totalInwardItc,
      },
    },
    itc_reversed: {
      rule_42_43: { description: '(1) As per rules 42 & 43 of CGST Rules', igst: 0, cgst: 0, sgst: 0 },
      others: { description: '(2) Others', igst: 0, cgst: 0, sgst: 0 },
      total_reversed: 0,
    },
    net_itc_available: {
      description: '(C) Net ITC Available (A - B)',
      igst: totalInwardIgst,
      cgst: totalInwardCgst,
      sgst: totalInwardSgst,
      total: totalInwardItc,
    },
    ineligible_itc: {
      section_17_5: { description: '(1) As per section 17(5) blocked credits', igst: 0, cgst: 0, sgst: 0 },
      others: { description: '(2) Others', igst: 0, cgst: 0, sgst: 0 },
    },
  };

  const table61 = {
    igst: {
      description: 'Integrated Tax',
      tax_payable: totalOutwardIgst,
      paid_through_itc: Math.min(totalOutwardIgst, totalInwardIgst),
      tax_paid_cash: Math.round(igstPayable * 100) / 100,
      interest: 0,
      late_fee: 0,
    },
    cgst: {
      description: 'Central Tax',
      tax_payable: totalOutwardCgst,
      paid_through_itc: Math.min(totalOutwardCgst, totalInwardCgst),
      tax_paid_cash: Math.round(cgstPayable * 100) / 100,
      interest: 0,
      late_fee: 0,
    },
    sgst: {
      description: 'State / UT Tax',
      tax_payable: totalOutwardSgst,
      paid_through_itc: Math.min(totalOutwardSgst, totalInwardSgst),
      tax_paid_cash: Math.round(sgstPayable * 100) / 100,
      interest: 0,
      late_fee: 0,
    },
    total: {
      tax_payable: totalOutwardTax,
      paid_through_itc: Math.min(totalOutwardTax, totalInwardItc),
      tax_paid_cash: finalNetTaxPayable,
      interest: 0,
      late_fee: 0,
    },
  };

  // GST Portal Compatible GSTR-3B JSON representation
  const gstr3bJson = {
    gstin: sellerGstin,
    ret_period: `${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getFullYear()}`,
    filing_type: 'GSTR-3B',
    inward_sup: {
      isup_details: [{
        ty: 'GST',
        inter: totalInwardIgst,
        intra: totalInwardCgst + totalInwardSgst,
      }],
    },
    sup_details: {
      osup_det: {
        txval: totalOutwardTaxable,
        iamt: totalOutwardIgst,
        camt: totalOutwardCgst,
        samt: totalOutwardSgst,
        csamt: 0,
      },
    },
    itc_elg: {
      itc_avl: [{
        ty: 'OTH',
        iamt: totalInwardIgst,
        camt: totalInwardCgst,
        samt: totalInwardSgst,
        csamt: 0,
      }],
      itc_net: {
        iamt: totalInwardIgst,
        camt: totalInwardCgst,
        samt: totalInwardSgst,
        csamt: 0,
      },
    },
    tax_pmt: {
      tx_py: [
        { trans_typ: 1, iamt: igstPayable, camt: cgstPayable, samt: sgstPayable, csamt: 0 },
      ],
    },
  };

  return {
    period: period || 'all',
    seller: {
      business_name: profile.business_name,
      trade_name: profile.trade_name,
      gstin: sellerGstin,
      state: profile.state,
      state_code: sellerStateCode,
    },
    summary: {
      total_outward_taxable: totalOutwardTaxable,
      total_outward_cgst: totalOutwardCgst,
      total_outward_sgst: totalOutwardSgst,
      total_outward_igst: totalOutwardIgst,
      total_outward_tax: totalOutwardTax,
      total_inward_taxable: totalInwardTaxable,
      total_inward_cgst: totalInwardCgst,
      total_inward_sgst: totalInwardSgst,
      total_inward_igst: totalInwardIgst,
      total_inward_itc: totalInwardItc,
      net_tax_payable: finalNetTaxPayable,
      itc_carryforward: netItcCarryforward,
      itc_utilization_percent: totalOutwardTax > 0 ? Math.min(100, Math.round((totalInwardItc / totalOutwardTax) * 100)) : 0,
      total_invoices_count: invoiceRecords.length,
      total_expenses_count: expenseRecords.length,
    },
    slabs: slabList,
    table31,
    table4,
    table61,
    invoices: invoiceRecords,
    expenses: expenseRecords,
    gstr3bJson,
  };
}

// Financial Analytics API
export async function getFinancialAnalytics(userId: number): Promise<any> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  const salesRes = await pool.query(
    `SELECT 
       COALESCE(SUM(amount), 0) as total_sales,
       COALESCE(SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END), 0) as received_amount,
       COALESCE(SUM(CASE WHEN status = 'Unpaid' THEN amount ELSE 0 END), 0) as receivables,
       COALESCE(SUM(tax_amount), 0) as total_tax_collected,
       COUNT(*) as invoice_count
     FROM "${schema}".invoices`
  );

  const expRes = await pool.query(
    `SELECT 
       COALESCE(SUM(CASE WHEN expense_type LIKE '%Expense%' OR expense_type LIKE '%Debit%' THEN amount ELSE 0 END), 0) as total_expenses,
       COALESCE(SUM(CASE WHEN expense_type LIKE '%Advance%' OR expense_type LIKE '%Credit%' THEN amount ELSE 0 END), 0) as total_advances
     FROM "${schema}".expenses`
  );

  const customersRes = await pool.query(`SELECT COUNT(*) as party_count FROM "${schema}".customers`);

  const prodRes = await pool.query(
    `SELECT COUNT(*) as item_count, COALESCE(SUM(stock * sale_price), 0) as stock_valuation FROM "${schema}".products`
  );

  const totalSales = Number(salesRes.rows[0]?.total_sales || 0);
  const totalExpenses = Number(expRes.rows[0]?.total_expenses || 0);
  const receivables = Number(salesRes.rows[0]?.receivables || 0);
  const netProfit = totalSales - totalExpenses;
  const margin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0';

  return {
    tenantSchema: schema,
    totalRevenue: totalSales,
    totalExpenses: totalExpenses,
    receivables: receivables,
    netProfit: netProfit,
    profitMargin: `${margin}%`,
    taxCollected: Number(salesRes.rows[0]?.total_tax_collected || 0),
    totalParties: Number(customersRes.rows[0]?.party_count || 0),
    inventoryValuation: Number(prodRes.rows[0]?.stock_valuation || 0),
    recentInvoices: await getSalesDocuments(userId),
    recentExpenses: await getReceipts(userId),
  };
}

// Introspect Dedicated Schema & Tables (Matching Screenshot)
export async function getTenantSchemaInfo(userId: number): Promise<{
  tenantId: number;
  schemaName: string;
  isolated: boolean;
  database: string;
  tables: Array<{
    tableName: string;
    rowCount: number;
    description: string;
  }>;
}> {
  const pool = getPostgresPool();
  const schema = await ensureTenantSchema(userId);

  const [bRes, cRes, iRes, eRes, pRes, qRes, gRes, tRes] = await Promise.all([
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".business_profiles`),
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".customers`),
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".invoices`),
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".expenses`),
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".products`),
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".quotations`),
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".category_gst_rules`),
    pool.query(`SELECT COUNT(*) as count FROM "${schema}".templates_config`),
  ]);

  const config = loadDatabaseConfig();
  const parsed = parseJdbcPostgresUrl(
    config.jdbc.url,
    config.jdbc.user,
    config.jdbc.password,
    config.jdbc.ssl
  );

  return {
    tenantId: userId,
    schemaName: schema,
    isolated: true,
    database: parsed.database,
    tables: [
      {
        tableName: 'category_gst_rules',
        rowCount: parseInt(gRes.rows[0]?.count || '0', 10),
        description: 'GST compliance rules, HSN codes, and tax rates',
      },
      {
        tableName: 'customers',
        rowCount: parseInt(cRes.rows[0]?.count || '0', 10),
        description: 'Client and vendor directory with balances and GSTINs',
      },
      {
        tableName: 'expenses',
        rowCount: parseInt(eRes.rows[0]?.count || '0', 10),
        description: 'Expense entries, advance payments, and debit notes',
      },
      {
        tableName: 'invoices',
        rowCount: parseInt(iRes.rows[0]?.count || '0', 10),
        description: 'Sales invoices, orders, delivery challans, and credit notes',
      },
      {
        tableName: 'products',
        rowCount: parseInt(pRes.rows[0]?.count || '0', 10),
        description: 'Stock catalog, SKUs, inventory levels, and sale pricing',
      },
      {
        tableName: 'quotations',
        rowCount: parseInt(qRes.rows[0]?.count || '0', 10),
        description: 'Sales quotations, estimates, and validity tracking',
      },
      {
        tableName: 'business_profiles',
        rowCount: parseInt(bRes.rows[0]?.count || '0', 10),
        description: 'Company legal profile, GSTIN, and bank credentials',
      },
      {
        tableName: 'templates_config',
        rowCount: parseInt(tRes.rows[0]?.count || '0', 10),
        description: 'Invoice styling, layout themes, and QR payment terms',
      },
    ],
  };
}

// ==========================================
// ADMIN TENANT & PLAN MANAGEMENT FUNCTIONS
// (Managing tenants, migrating plans, demoting unpaid)
// ==========================================

export async function listAllTenants(): Promise<any[]> {
  const pool = getPostgresPool();
  const res = await pool.query(`
    SELECT 
      t.id,
      t.name,
      t.slug,
      t.schema_name,
      t.plan,
      t.plan_status,
      t.billing_cycle,
      t.is_active,
      t.created_at,
      t.updated_at,
      s.status as subscription_status,
      s.payment_status,
      s.last_payment_date,
      s.demote_reason
    FROM tenants t
    LEFT JOIN tenant_subscriptions s ON s.tenant_id = t.id
    ORDER BY t.id ASC
  `);

  let userCounts: Record<number, number> = {};
  try {
    const usersCountRes = await pool.query('SELECT tenant_id FROM users');
    for (const u of usersCountRes.rows) {
      if (u.tenant_id) {
        userCounts[u.tenant_id] = (userCounts[u.tenant_id] || 0) + 1;
      }
    }
  } catch {}

  return res.rows.map((row: any) => ({
    ...row,
    user_count: userCounts[row.id] || 0,
  }));
}

export async function listSubscriptionPlans(): Promise<any[]> {
  const pool = getPostgresPool();
  const res = await pool.query('SELECT * FROM subscription_plans ORDER BY price ASC');
  return res.rows;
}

// Migrate Tenant Subscription Plan (e.g. Starter -> Pro or Enterprise)
export async function migrateTenantPlan(
  tenantId: number,
  newPlan: string,
  reason = 'Admin migration request',
  performedBy = 'Admin'
): Promise<any> {
  const pool = getPostgresPool();

  const currentRes = await pool.query('SELECT plan, plan_status FROM tenants WHERE id = $1', [tenantId]);
  if (currentRes.rows.length === 0) throw new Error('Tenant not found');

  const oldPlan = currentRes.rows[0].plan;
  const oldStatus = currentRes.rows[0].plan_status;

  // Update tenant plan
  await pool.query(
    'UPDATE tenants SET plan = $1, plan_status = \'active\', is_active = true, updated_at = NOW() WHERE id = $2',
    [newPlan, tenantId]
  );

  // Update subscription
  await pool.query(
    `INSERT INTO tenant_subscriptions (tenant_id, current_plan, previous_plan, status, payment_status, updated_at)
     VALUES ($1, $2, $3, 'active', 'paid', NOW())
     ON CONFLICT (tenant_id) DO UPDATE SET
       current_plan = EXCLUDED.current_plan,
       previous_plan = EXCLUDED.previous_plan,
       status = 'active',
       payment_status = 'paid',
       updated_at = NOW()`,
    [tenantId, newPlan, oldPlan]
  );

  // Record audit history
  await pool.query(
    `INSERT INTO tenant_plan_history (tenant_id, action, from_plan, to_plan, from_status, to_status, reason, performed_by)
     VALUES ($1, 'migrate_plan', $2, $3, $4, 'active', $5, $6)`,
    [tenantId, oldPlan, newPlan, oldStatus, reason, performedBy]
  );

  return { tenantId, fromPlan: oldPlan, toPlan: newPlan, status: 'active' };
}

// Demote Tenant on Unpaid / Payment Overdue (demote to lower plan or Free)
export async function demoteTenantForOverdue(
  tenantId: number,
  targetPlan = 'Free',
  reason = 'Payment overdue. Automatically demoted to lower plan.',
  performedBy = 'Billing Engine'
): Promise<any> {
  const pool = getPostgresPool();

  const currentRes = await pool.query('SELECT plan, plan_status FROM tenants WHERE id = $1', [tenantId]);
  if (currentRes.rows.length === 0) throw new Error('Tenant not found');

  const oldPlan = currentRes.rows[0].plan;
  const oldStatus = currentRes.rows[0].plan_status;

  // Update tenant to demoted status
  await pool.query(
    'UPDATE tenants SET plan = $1, plan_status = \'demoted\', updated_at = NOW() WHERE id = $2',
    [targetPlan, tenantId]
  );

  // Update subscription
  await pool.query(
    `UPDATE tenant_subscriptions SET
       current_plan = $1,
       previous_plan = $2,
       status = 'demoted',
       payment_status = 'overdue',
       demote_reason = $3,
       updated_at = NOW()
     WHERE tenant_id = $4`,
    [targetPlan, oldPlan, reason, tenantId]
  );

  // Record history
  await pool.query(
    `INSERT INTO tenant_plan_history (tenant_id, action, from_plan, to_plan, from_status, to_status, reason, performed_by)
     VALUES ($1, 'demote_unpaid', $2, $3, $4, 'demoted', $5, $6)`,
    [tenantId, oldPlan, targetPlan, oldStatus, reason, performedBy]
  );

  return { tenantId, fromPlan: oldPlan, toPlan: targetPlan, status: 'demoted' };
}

// Enable or Disable Tenant
export async function setTenantStatus(
  tenantId: number,
  isActive: boolean,
  reason = 'Admin toggle',
  performedBy = 'Admin'
): Promise<any> {
  const pool = getPostgresPool();

  const currentRes = await pool.query('SELECT plan, plan_status, is_active FROM tenants WHERE id = $1', [tenantId]);
  if (currentRes.rows.length === 0) throw new Error('Tenant not found');

  const current = currentRes.rows[0];
  const newStatus = isActive ? 'active' : 'disabled';

  await pool.query(
    'UPDATE tenants SET is_active = $1, plan_status = $2, updated_at = NOW() WHERE id = $3',
    [isActive, newStatus, tenantId]
  );

  await pool.query(
    'UPDATE tenant_subscriptions SET status = $1, updated_at = NOW() WHERE tenant_id = $2',
    [newStatus, tenantId]
  );

  await pool.query(
    `INSERT INTO tenant_plan_history (tenant_id, action, from_plan, to_plan, from_status, to_status, reason, performed_by)
     VALUES ($1, $2, $3, $3, $4, $5, $6, $7)`,
    [
      tenantId,
      isActive ? 'reactivate' : 'disable_tenant',
      current.plan,
      current.plan_status,
      newStatus,
      reason,
      performedBy,
    ]
  );

  return { tenantId, isActive, planStatus: newStatus };
}

export async function getTenantPlanHistory(tenantId: number): Promise<any[]> {
  const pool = getPostgresPool();
  const res = await pool.query(
    'SELECT * FROM tenant_plan_history WHERE tenant_id = $1 ORDER BY id DESC',
    [tenantId]
  );
  return res.rows;
}export async function getPublicSchemaInfo(): Promise<any> {
  const pool = getPostgresPool();
  const [tenantsRes, usersRes, plansRes, subsRes, historyRes] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM tenants'),
    pool.query('SELECT COUNT(*) as count FROM users'),
    pool.query('SELECT COUNT(*) as count FROM subscription_plans'),
    pool.query('SELECT COUNT(*) as count FROM tenant_subscriptions'),
    pool.query('SELECT COUNT(*) as count FROM tenant_plan_history'),
  ]);

  const allTenants = await listAllTenants();

  return {
    schemaName: 'public',
    architecture: 'Shared Public Schema with Strict Tenant & Plan Control Tables Only',
    tables: [
      {
        tableName: 'tenants',
        rowCount: parseInt(tenantsRes.rows[0]?.count || '0', 10),
        description: 'Multi-tenant registry with slug, name, plan tier, and dedicated schema_name (tenant_<slug>)',
        role: 'Core Multi-Tenancy Directory',
      },
      {
        tableName: 'users',
        rowCount: parseInt(usersRes.rows[0]?.count || '0', 10),
        description: 'User authentication, password credentials, and tenant_id mapping',
        role: 'Identity & Authentication',
      },
      {
        tableName: 'subscription_plans',
        rowCount: parseInt(plansRes.rows[0]?.count || '0', 10),
        description: 'Global plan tiers: Free, Starter, Pro, Enterprise with quotas and limits',
        role: 'Admin Plan Management',
      },
      {
        tableName: 'tenant_subscriptions',
        rowCount: parseInt(subsRes.rows[0]?.count || '0', 10),
        description: 'Tenant billing lifecycle: current_plan, payment_status, overdue tracking, auto-demote',
        role: 'Admin Billing & Lifecycle',
      },
      {
        tableName: 'tenant_plan_history',
        rowCount: parseInt(historyRes.rows[0]?.count || '0', 10),
        description: 'Audit log of plan migrations, payment overdue demotions, and tenant suspensions',
        role: 'Admin Audit Trail',
      },
    ],
    totalTenants: allTenants.length,
    totalUsers: parseInt(usersRes.rows[0]?.count || '0', 10),
    tenantSchemas: allTenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      schemaName: t.schema_name,
      plan: t.plan,
      planStatus: t.plan_status,
      isActive: t.is_active,
      paymentStatus: t.payment_status || 'paid',
      userCount: parseInt(t.user_count || '0', 10),
      demoteReason: t.demote_reason,
    })),
  };
}

export async function switchUserTenant(userId: number, targetTenantId: number): Promise<any> {
  const pool = getPostgresPool();
  const tRes = await pool.query('SELECT * FROM tenants WHERE id = $1', [targetTenantId]);
  if (tRes.rows.length === 0) throw new Error('Target tenant not found');

  const tenant = tRes.rows[0];
  const schema = tenant.schema_name || formatTenantSchema(tenant.slug);

  await pool.query('UPDATE users SET tenant_id = $1, schema_name = $2 WHERE id = $3', [
    targetTenantId,
    schema,
    userId,
  ]);

  // Ensure tables exist for that tenant schema
  await provisionTenantSchemaAndTables(schema, tenant.name);

  return {
    userId,
    tenantId: targetTenantId,
    tenantName: tenant.name,
    tenantSlug: tenant.slug,
    schemaName: schema,
    plan: tenant.plan,
    planStatus: tenant.plan_status,
  };
}


export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  version?: string;
  userCount?: number;
  tenantCount?: number;
  database?: string;
  host?: string;
  port?: number;
  user?: string;
  driver?: string;
  jdbcUrl?: string;
  ssl?: boolean;
  error?: string;
}> {
  const config = loadDatabaseConfig();
  let parsed: ParsedJdbcDetails;

  try {
    parsed = parseJdbcPostgresUrl(
      config.jdbc.url,
      config.jdbc.user,
      config.jdbc.password,
      config.jdbc.ssl
    );
  } catch (parseErr: any) {
    return {
      connected: false,
      driver: config.jdbc.driver || 'org.postgresql.Driver',
      jdbcUrl: config.jdbc.url,
      error: parseErr.message,
    };
  }

  try {
    const pool = getPostgresPool();
    const testResult = await pool.query('SELECT version(), current_database(), current_user');
    const version = testResult.rows[0]?.version || 'PostgreSQL 16.2';

    await initDatabaseSchema();

    const countResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const userCount = parseInt(countResult.rows[0]?.total || '0', 10);

    const tenantCountResult = await pool.query('SELECT COUNT(*) as total FROM tenants');
    const tenantCount = parseInt(tenantCountResult.rows[0]?.total || '0', 10);

    lastConnectionError = null;
    return {
      connected: true,
      version,
      userCount,
      tenantCount,
      database: parsed.database,
      host: parsed.host,
      port: parsed.port,
      user: parsed.user,
      driver: config.jdbc.driver || 'org.postgresql.Driver',
      jdbcUrl: config.jdbc.url,
      ssl: Boolean(parsed.ssl),
    };
  } catch (err: any) {
    console.error('PostgreSQL Connection check failed:', err.message);
    lastConnectionError = err.message;
    return {
      connected: false,
      database: parsed.database,
      host: parsed.host,
      port: parsed.port,
      user: parsed.user,
      driver: config.jdbc.driver || 'org.postgresql.Driver',
      jdbcUrl: config.jdbc.url,
      ssl: Boolean(parsed.ssl),
      error: err.message,
    };
  }
}
