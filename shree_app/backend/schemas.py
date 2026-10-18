from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    schema_name: Optional[str] = None
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400
    user: UserOut

class TokenPayload(BaseModel):
    sub: str
    username: str
    email: str
    exp: Optional[int] = None

# Tenant Schema Information Schema
class TenantTableInfo(BaseModel):
    table_name: str
    row_count: int
    description: str

class TenantSchemaInfoOut(BaseModel):
    tenant_id: int
    schema_name: str
    isolated: bool = True
    database: str
    tables: List[TenantTableInfo]

# Business Setup Schema
class BusinessProfileSchema(BaseModel):
    business_name: Optional[str] = "OmniBill Enterprises"
    trade_name: Optional[str] = "OmniBill Tech Solutions"
    gst_number: Optional[str] = "27AABCO1234F1Z5"
    pan: Optional[str] = "AABCO1234F"
    address: Optional[str] = "104, Tech Innovation Hub, Cyber Gateway"
    state: Optional[str] = "Maharashtra (27)"
    phone: Optional[str] = "+91 98765 43210"
    email: Optional[str] = "billing@omnibill.com"
    bank_name: Optional[str] = "HDFC Bank Ltd"
    bank_account: Optional[str] = "50200012345678"
    bank_ifsc: Optional[str] = "HDFC0001234"

class BusinessProfileOut(BusinessProfileSchema):
    id: int
    user_id: Optional[int] = None
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Party / Client Schema
class PartyCreate(BaseModel):
    name: str = Field(..., min_length=1)
    type: str = "Customer"
    gstin: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    balance: float = 0.0

class PartyOut(PartyCreate):
    id: int
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Sales Document Schema
class SalesDocumentCreate(BaseModel):
    doc_type: str
    doc_number: Optional[str] = None
    party_name: str
    date: Optional[date] = None
    due_date: Optional[date] = None
    amount: float
    tax_amount: Optional[float] = 0.0
    status: Optional[str] = "Unpaid"
    notes: Optional[str] = None

class SalesDocumentOut(SalesDocumentCreate):
    id: int
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Receipt Schema
class ReceiptCreate(BaseModel):
    receipt_type: str
    ref_number: Optional[str] = None
    party_name: Optional[str] = "General"
    category: Optional[str] = "Operations"
    amount: float
    payment_mode: Optional[str] = "Bank Transfer"
    date: Optional[date] = None
    notes: Optional[str] = None

class ReceiptOut(ReceiptCreate):
    id: int
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Inventory Item Schema
class InventoryItemCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    hsn_sac: Optional[str] = "998311"
    category: Optional[str] = "General"
    unit: Optional[str] = "PCS"
    purchase_price: Optional[float] = 0.0
    sale_price: float
    stock: Optional[int] = 0
    min_stock: Optional[int] = 5
    tax_rate: Optional[float] = 18.0

class InventoryItemOut(InventoryItemCreate):
    id: int
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Template Studio Schema
class TemplateConfigSchema(BaseModel):
    theme: Optional[str] = "Modern Pro"
    primary_color: Optional[str] = "#4f46e5"
    show_logo: Optional[bool] = True
    show_qr: Optional[bool] = True
    show_bank_details: Optional[bool] = True
    terms_conditions: Optional[str] = "Payment due within 15 days of invoice."

class TemplateConfigOut(TemplateConfigSchema):
    id: int
    user_id: Optional[int] = None
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Tax Settings Schema
class TaxSettingsSchema(BaseModel):
    is_composition: Optional[bool] = False
    default_gst_rate: Optional[float] = 18.0
    rcm_enabled: Optional[bool] = False
    filing_period: Optional[str] = "Monthly"

class TaxSettingsOut(TaxSettingsSchema):
    id: int
    user_id: Optional[int] = None
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

# Financial Analytics Schema
class FinancialAnalyticsOut(BaseModel):
    totalRevenue: float
    totalExpenses: float
    receivables: float
    netProfit: float
    profitMargin: str
    taxCollected: float
    totalParties: int
    inventoryValuation: float
    recentInvoices: List[Any]
    recentExpenses: List[Any]
