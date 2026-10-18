from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.config import settings

# Production-ready PostgreSQL SQLAlchemy Engine strictly using PostgreSQL from JDBC config
engine = create_engine(
    settings.database.sqlalchemy_url,
    pool_size=settings.database.max_pool_size,
    max_overflow=5,
    pool_timeout=settings.database.connection_timeout_ms / 1000.0,
    pool_pre_ping=True,  # Ensures disconnected connections are discarded
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def format_tenant_slug(name: str) -> str:
    """Format name into clean slug."""
    import re
    if not name:
        return "default_tenant"
    clean = re.sub(r"[^a-z0-9]+", "_", name.lower().strip())
    clean = re.sub(r"^_+|_\+$", "", clean)
    return clean[:60] if len(clean) >= 2 else "tenant_app"

def format_tenant_schema(slug: str) -> str:
    """Strict tenant_<slug_name> nomenclature matching DBeaver navigator."""
    clean = format_tenant_slug(slug)
    return clean if clean.startswith("tenant_") else f"tenant_{clean}"

def get_tenant_schema_name(db: Session, user_id: int) -> str:
    """Returns safe tenant PostgreSQL schema name with tenant_<slug_name> nomenclature."""
    try:
        row = db.execute(
            text("""SELECT u.schema_name, t.schema_name as t_schema, t.slug, u.username
                 FROM public.users u
                 LEFT JOIN public.tenants t ON u.tenant_id = t.id
                 WHERE u.id = :uid LIMIT 1"""),
            {"uid": user_id}
        ).fetchone()
        if row:
            if row[0]:  # u.schema_name
                return row[0]
            if row[1]:  # t.schema_name
                return row[1]
            if row[2]:  # t.slug
                return format_tenant_schema(row[2])
            if row[3]:  # u.username
                return format_tenant_schema(row[3])
    except Exception:
        pass
    return f"tenant_usr_{user_id}"

def ensure_tenant_schema(db: Session, user_id: int) -> str:
    """
    Guarantees dedicated PostgreSQL schema and isolated tables for the tenant.
    Creates schema and all tenant-specific tables, and seeds initial records if fresh.
    Follows strict tenant_<slug_name> nomenclature.
    """
    schema = get_tenant_schema_name(db, user_id)
    
    # 1. Create dedicated schema
    db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{schema}"'))

    # 2. Create isolated tenant tables
    db.execute(text(f'''
        CREATE TABLE IF NOT EXISTS "{schema}".business_profiles (
            id SERIAL PRIMARY KEY,
            user_id INT,
            business_name VARCHAR(255) DEFAULT 'OmniBill Enterprises',
            trade_name VARCHAR(255) DEFAULT 'OmniBill Tech Solutions',
            gst_number VARCHAR(50) DEFAULT '27AABCO1234F1Z5',
            pan VARCHAR(20) DEFAULT 'AABCO1234F',
            address TEXT DEFAULT '104, Tech Innovation Hub, Cyber Gateway',
            state VARCHAR(100) DEFAULT 'Maharashtra (27)',
            phone VARCHAR(50) DEFAULT '+91 98765 43210',
            email VARCHAR(255) DEFAULT 'billing@omnibill.com',
            bank_name VARCHAR(100) DEFAULT 'HDFC Bank Ltd',
            bank_account VARCHAR(100) DEFAULT '50200012345678',
            bank_ifsc VARCHAR(50) DEFAULT 'HDFC0001234',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "{schema}".parties (
            id SERIAL PRIMARY KEY,
            user_id INT,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) DEFAULT 'Customer',
            gstin VARCHAR(50),
            phone VARCHAR(50),
            email VARCHAR(255),
            address TEXT,
            balance NUMERIC DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "{schema}".sales_documents (
            id SERIAL PRIMARY KEY,
            user_id INT,
            doc_type VARCHAR(50) NOT NULL,
            doc_number VARCHAR(100) NOT NULL,
            party_name VARCHAR(255) NOT NULL,
            date DATE NOT NULL DEFAULT CURRENT_DATE,
            due_date DATE,
            amount NUMERIC NOT NULL,
            tax_amount NUMERIC DEFAULT 0,
            status VARCHAR(50) DEFAULT 'Unpaid',
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "{schema}".receipts (
            id SERIAL PRIMARY KEY,
            user_id INT,
            receipt_type VARCHAR(50) NOT NULL,
            ref_number VARCHAR(100) NOT NULL,
            party_name VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            amount NUMERIC NOT NULL,
            payment_mode VARCHAR(50) DEFAULT 'Bank Transfer',
            date DATE NOT NULL DEFAULT CURRENT_DATE,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "{schema}".inventory_items (
            id SERIAL PRIMARY KEY,
            user_id INT,
            name VARCHAR(255) NOT NULL,
            sku VARCHAR(100),
            hsn_sac VARCHAR(50),
            category VARCHAR(100),
            unit VARCHAR(50) DEFAULT 'PCS',
            purchase_price NUMERIC DEFAULT 0,
            sale_price NUMERIC NOT NULL,
            stock INT DEFAULT 0,
            min_stock INT DEFAULT 5,
            tax_rate NUMERIC DEFAULT 18,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "{schema}".templates_config (
            id SERIAL PRIMARY KEY,
            user_id INT,
            theme VARCHAR(50) DEFAULT 'Modern Pro',
            primary_color VARCHAR(50) DEFAULT '#4f46e5',
            show_logo BOOLEAN DEFAULT TRUE,
            show_qr BOOLEAN DEFAULT TRUE,
            show_bank_details BOOLEAN DEFAULT TRUE,
            terms_conditions TEXT DEFAULT 'Payment due within 15 days of invoice date. Late interest @ 18% p.a.',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "{schema}".tax_settings (
            id SERIAL PRIMARY KEY,
            user_id INT,
            is_composition BOOLEAN DEFAULT FALSE,
            default_gst_rate NUMERIC DEFAULT 18,
            rcm_enabled BOOLEAN DEFAULT FALSE,
            filing_period VARCHAR(50) DEFAULT 'Monthly',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    '''))

    # Update public.users schema_name record
    try:
        db.execute(text(f'UPDATE public.users SET schema_name = :schema WHERE id = :uid AND (schema_name IS NULL OR schema_name = \'\')'), {"schema": schema, "uid": user_id})
    except Exception:
        pass

    # 3. Seed initial records if empty
    b_count = db.execute(text(f'SELECT COUNT(*) FROM "{schema}".business_profiles')).scalar()
    if b_count == 0:
        db.execute(text(f'''
            INSERT INTO "{schema}".business_profiles (business_name, trade_name, gst_number, pan, address, state, phone, email, bank_name, bank_account, bank_ifsc)
            VALUES ('OmniBill Enterprises', 'OmniBill Tech Solutions', '27AABCO1234F1Z5', 'AABCO1234F', '104, Tech Innovation Hub, Cyber Gateway', 'Maharashtra (27)', '+91 98765 43210', 'billing@omnibill.com', 'HDFC Bank Ltd', '50200012345678', 'HDFC0001234')
        '''))

    p_count = db.execute(text(f'SELECT COUNT(*) FROM "{schema}".parties')).scalar()
    if p_count == 0:
        db.execute(text(f'''
            INSERT INTO "{schema}".parties (name, type, gstin, phone, email, address, balance) VALUES
            ('Apex Infotech Ltd', 'Customer', '27AABCA1111A1Z1', '+91 98200 11223', 'accounts@apexinfo.com', 'Andheri East, Mumbai', 48500),
            ('Zenith Logistics LLP', 'Customer', '29BBBCB2222B2Z2', '+91 98300 22334', 'billing@zenithlog.com', 'Whitefield, Bangalore', 125000),
            ('CloudScale Hardware', 'Supplier', '07CCCC3333C3Z3', '+91 98400 33445', 'sales@cloudscale.in', 'Nehru Place, New Delhi', -32000),
            ('Metropolis Retail Store', 'Customer', '27DDDCD4444D4Z4', '+91 98500 44556', 'accounts@metropolis.com', 'FC Road, Pune', 18200)
        '''))

    s_count = db.execute(text(f'SELECT COUNT(*) FROM "{schema}".sales_documents')).scalar()
    if s_count == 0:
        db.execute(text(f'''
            INSERT INTO "{schema}".sales_documents (doc_type, doc_number, party_name, date, due_date, amount, tax_amount, status, notes) VALUES
            ('Invoices', 'INV-2026-001', 'Zenith Logistics LLP', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '12 days', 147500, 22500, 'Unpaid', 'Cloud infrastructure billing Q1'),
            ('Invoices', 'INV-2026-002', 'Apex Infotech Ltd', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', 57230, 8730, 'Paid', 'Annual software maintenance'),
            ('Quotation', 'QT-2026-104', 'Metropolis Retail Store', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '14 days', 34000, 5186, 'Accepted', 'POS Billing Software setup'),
            ('Proforma Invoice', 'PI-2026-088', 'Zenith Logistics LLP', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', 85000, 12966, 'Pending', 'Hardware terminal bundle'),
            ('Payment In', 'PAY-2026-051', 'Apex Infotech Ltd', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE, 57230, 0, 'Completed', 'Payment received via NEFT'),
            ('Sale Order', 'SO-2026-012', 'Apex Infotech Ltd', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '8 days', 92000, 14033, 'Confirmed', 'Annual license renew'),
            ('Delivery Challan', 'DC-2026-005', 'Metropolis Retail Store', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE, 34000, 0, 'Dispatched', 'Thermal printers & scanners'),
            ('Sale return/Credit Note', 'CN-2026-001', 'Apex Infotech Ltd', CURRENT_DATE, CURRENT_DATE, 8730, 1331, 'Approved', 'Warranty replacement adjustment')
        '''))

    r_count = db.execute(text(f'SELECT COUNT(*) FROM "{schema}".receipts')).scalar()
    if r_count == 0:
        db.execute(text(f'''
            INSERT INTO "{schema}".receipts (receipt_type, ref_number, party_name, category, amount, payment_mode, date, notes) VALUES
            ('Record Expense : Debit', 'EXP-2026-01', 'CloudScale Hardware', 'Office Server & Cloud Hosting', 32000, 'Bank Transfer', CURRENT_DATE - INTERVAL '4 days', 'Server cluster maintenance'),
            ('Record Expense : Debit', 'EXP-2026-02', 'WeWork Office Leasing', 'Rent & Utilities', 45000, 'Cheque', CURRENT_DATE - INTERVAL '10 days', 'Office rent for October'),
            ('Record Advance Payment : Credit', 'ADV-2026-01', 'Zenith Logistics LLP', 'Advance Sales Deposit', 50000, 'UPI', CURRENT_DATE - INTERVAL '1 day', 'Advance deposit for Enterprise ERP'),
            ('Purchase Return/ Dr.Note', 'DN-2026-01', 'CloudScale Hardware', 'Defective RAM Modules', 4800, 'Direct Debit', CURRENT_DATE - INTERVAL '6 days', 'Replaced memory modules')
        '''))

    i_count = db.execute(text(f'SELECT COUNT(*) FROM "{schema}".inventory_items')).scalar()
    if i_count == 0:
        db.execute(text(f'''
            INSERT INTO "{schema}".inventory_items (name, sku, hsn_sac, category, unit, purchase_price, sale_price, stock, min_stock, tax_rate) VALUES
            ('OmniBill ERP Enterprise License', 'SOFT-ERP-01', '997331', 'Software', 'YEAR', 35000, 55000, 999, 10, 18),
            ('Thermal Receipt Printer 80mm', 'HW-PRN-80', '844332', 'Hardware', 'PCS', 4200, 6800, 42, 10, 18),
            ('2D Barcode & QR Code Scanner', 'HW-SCN-2D', '847190', 'Hardware', 'PCS', 2100, 3450, 68, 15, 18),
            ('Thermal Paper Rolls (Box of 50)', 'STAT-PR-50', '481190', 'Consumables', 'BOX', 1200, 1850, 120, 25, 12),
            ('Smart Android POS Terminal', 'HW-POS-PRO', '847050', 'Hardware', 'PCS', 14500, 21999, 18, 5, 18)
        '''))

    t_count = db.execute(text(f'SELECT COUNT(*) FROM "{schema}".templates_config')).scalar()
    if t_count == 0:
        db.execute(text(f'''
            INSERT INTO "{schema}".templates_config (theme, primary_color, show_logo, show_qr, show_bank_details, terms_conditions)
            VALUES ('Modern Pro', '#4f46e5', true, true, true, 'Payment due within 15 days of invoice date. Late interest @ 18% p.a.')
        '''))

    tx_count = db.execute(text(f'SELECT COUNT(*) FROM "{schema}".tax_settings')).scalar()
    if tx_count == 0:
        db.execute(text(f'''
            INSERT INTO "{schema}".tax_settings (is_composition, default_gst_rate, rcm_enabled, filing_period)
            VALUES (false, 18, false, 'Monthly')
        '''))

    db.commit()
    return schema

def get_db():
    """FastAPI database session dependency for clean transactional lifecycles."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

