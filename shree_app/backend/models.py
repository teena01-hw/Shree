from datetime import datetime, timezone, date
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, Numeric, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

# ==========================================
# PUBLIC SCHEMA ONLY MODELS
# (tenants, users, and admin plan management)
# ==========================================

class Tenant(Base):
    __tablename__ = "tenants"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    schema_name = Column(String(120), unique=True, index=True, nullable=False)
    plan = Column(String(50), default="Starter", nullable=False)
    plan_status = Column(String(50), default="active", nullable=False)
    billing_cycle = Column(String(50), default="monthly")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Numeric, default=0, nullable=False)
    currency = Column(String(10), default="INR")
    max_users = Column(Integer, default=1)
    max_invoices_per_month = Column(Integer, default=100)
    max_parties = Column(Integer, default=50)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)


class TenantSubscription(Base):
    __tablename__ = "tenant_subscriptions"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("public.tenants.id", ondelete="CASCADE"), unique=True)
    current_plan = Column(String(50), default="Starter", nullable=False)
    previous_plan = Column(String(50), nullable=True)
    status = Column(String(50), default="active", nullable=False)
    payment_status = Column(String(50), default="paid", nullable=False)
    last_payment_date = Column(Date, default=date.today)
    next_billing_date = Column(Date, nullable=True)
    auto_demote_on_overdue = Column(Boolean, default=True)
    demote_reason = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class TenantPlanHistory(Base):
    __tablename__ = "tenant_plan_history"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("public.tenants.id", ondelete="CASCADE"))
    action = Column(String(50), nullable=False)
    from_plan = Column(String(50), nullable=True)
    to_plan = Column(String(50), nullable=True)
    from_status = Column(String(50), nullable=True)
    to_status = Column(String(50), nullable=True)
    reason = Column(Text, nullable=True)
    performed_by = Column(String(100), default="Admin")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("public.tenants.id", ondelete="CASCADE"), nullable=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(50), default="admin", nullable=False)
    schema_name = Column(String(120), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)

    tenant = relationship("Tenant", back_populates="users")
    business_profile = relationship("BusinessProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    parties = relationship("Party", back_populates="user", cascade="all, delete-orphan")
    sales_documents = relationship("SalesDocument", back_populates="user", cascade="all, delete-orphan")
    receipts = relationship("Receipt", back_populates="user", cascade="all, delete-orphan")
    inventory_items = relationship("InventoryItem", back_populates="user", cascade="all, delete-orphan")
    template_config = relationship("TemplateConfig", back_populates="user", uselist=False, cascade="all, delete-orphan")
    tax_settings = relationship("TaxSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    business_name = Column(String(255), default="OmniBill Enterprises")
    trade_name = Column(String(255), default="OmniBill Tech Solutions")
    gst_number = Column(String(50), default="27AABCO1234F1Z5")
    pan = Column(String(20), default="AABCO1234F")
    address = Column(Text, default="104, Tech Innovation Hub, Cyber Gateway")
    state = Column(String(100), default="Maharashtra (27)")
    phone = Column(String(50), default="+91 98765 43210")
    email = Column(String(255), default="billing@omnibill.com")
    bank_name = Column(String(100), default="HDFC Bank Ltd")
    bank_account = Column(String(100), default="50200012345678")
    bank_ifsc = Column(String(50), default="HDFC0001234")
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="business_profile")

class Party(Base):
    __tablename__ = "parties"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(50), default="Customer")  # Customer, Supplier
    gstin = Column(String(50), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    balance = Column(Numeric, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="parties")

class SalesDocument(Base):
    __tablename__ = "sales_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Quotation, Invoices, Proforma Invoice, Payment In, Sale Order, Delivery Challan, Sale return/Credit Note
    doc_type = Column(String(50), nullable=False)
    doc_number = Column(String(100), nullable=False)
    party_name = Column(String(255), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    due_date = Column(Date, nullable=True)
    amount = Column(Numeric, nullable=False)
    tax_amount = Column(Numeric, default=0)
    status = Column(String(50), default="Unpaid")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="sales_documents")

class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Record Expense : Debit, Record Advance Payment : Credit, Purchase Return/ Dr.Note
    receipt_type = Column(String(50), nullable=False)
    ref_number = Column(String(100), nullable=False)
    party_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    amount = Column(Numeric, nullable=False)
    payment_mode = Column(String(50), default="Bank Transfer")
    date = Column(Date, default=date.today, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="receipts")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True)
    hsn_sac = Column(String(50), nullable=True)
    category = Column(String(100), nullable=True)
    unit = Column(String(50), default="PCS")
    purchase_price = Column(Numeric, default=0)
    sale_price = Column(Numeric, nullable=False)
    stock = Column(Integer, default=0)
    min_stock = Column(Integer, default=5)
    tax_rate = Column(Numeric, default=18)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="inventory_items")

class TemplateConfig(Base):
    __tablename__ = "templates_config"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    theme = Column(String(50), default="Modern Pro")
    primary_color = Column(String(50), default="#4f46e5")
    show_logo = Column(Boolean, default=True)
    show_qr = Column(Boolean, default=True)
    show_bank_details = Column(Boolean, default=True)
    terms_conditions = Column(Text, default="Payment due within 15 days of invoice date.")
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="template_config")

class TaxSettings(Base):
    __tablename__ = "tax_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    is_composition = Column(Boolean, default=False)
    default_gst_rate = Column(Numeric, default=18)
    rcm_enabled = Column(Boolean, default=False)
    filing_period = Column(String(50), default="Monthly")
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="tax_settings")
