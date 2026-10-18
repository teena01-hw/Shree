import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  Mail,
  Key,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Clock,
  ArrowRight,
  Shield,
  FileText,
  Building2,
  LayoutDashboard,
  Users,
  ShoppingBag,
  ReceiptText,
  Package,
  Palette,
  Calculator,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Upload,
  Scan,
  Printer,
  Download,
  FileSpreadsheet,
  Filter,
  CreditCard,
  TrendingUp,
  Wallet,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Edit2,
  Trash2,
  HelpCircle,
  Briefcase,
  Sliders,
  Database,
  Server,
  Layers,
  FolderTree,
  History,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX,
  ExternalLink,
  ShieldAlert,
  MapPin,
  Tag,
  DollarSign,
  AlertTriangle,
  Barcode,
  Boxes,
  ArrowRightCircle,
  Calendar,
  Repeat,
  Truck,
  ArrowLeftRight,
  Play,
  Pause,
  Zap,
  MessageCircle,
  Send,
  Copy,
  Wrench,
} from 'lucide-react';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  contact_email?: string | null;
  designation?: string | null;
  phone?: string | null;
  full_name?: string | null;
  role?: string;
  schema_name?: string | null;
  is_active: boolean;
  created_at: string;
  last_login?: string | null;
}

interface TenantTableInfo {
  tableName: string;
  rowCount: number;
  description: string;
}

interface TenantSchemaInfo {
  tenantId: number;
  schemaName: string;
  isolated: boolean;
  database: string;
  tables: TenantTableInfo[];
}

export const GST_STATES: { code: string; name: string }[] = [
  { code: '01', name: 'Jammu and Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman and Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
  { code: '97', name: 'Other Territory' },
];

interface BusinessProfile {
  id?: number;
  business_name: string;
  trade_name: string;
  gst_number: string;
  pan: string;
  address: string;
  state: string;
  phone: string;
  email: string;
  bank_name: string;
  bank_account: string;
  bank_ifsc: string;
  upi_id?: string;
  payment_qr_url?: string;
  logo_url?: string;
}

interface Party {
  id: number;
  name: string;
  type: string;
  customer_type?: 'B2B' | 'B2C' | string;
  contact_person?: string;
  contact_title?: string;
  phone?: string;
  mobile_urgent?: string;
  email?: string;
  industry?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_region?: string;
  postal_code?: string;
  country?: string;
  address?: string;
  gstin?: string;
  currency?: string;
  payment_terms?: string;
  credit_limit?: number;
  is_tax_exempt?: boolean;
  account_manager?: string;
  tags?: string;
  notes?: string;
  balance: number;
  created_at: string;
}

interface InvoicePayment {
  id: string;
  amount: number;
  date: string;
  payment_mode: string;
  ref_number?: string;
  notes?: string;
  recorded_at: string;
}

interface SalesDoc {
  id: number;
  doc_type: string;
  doc_number: string;
  party_name: string;
  date: string;
  due_date?: string;
  amount: number;
  tax_amount: number;
  status: string;
  notes?: string;
  items?: string | any[];
  subtotal?: number;
  discount_amount?: number;
  place_of_supply?: string;
  terms_conditions?: string;
  ref_quote_number?: string;
  paid_amount?: number;
  remaining_amount?: number;
  payments?: string | InvoicePayment[];
  po_number?: string;
  po_date?: string;
  vehicle_number?: string;
  transporter_name?: string;
  eway_bill_number?: string;
  linked_doc_id?: number;
  linked_doc_number?: string;
  irn_number?: string;
  recurring_profile_id?: number;
  reminder_count?: number;
  last_reminder_at?: string;
}

interface RecurringInvoiceProfile {
  id: number;
  profile_name: string;
  party_name: string;
  frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Weekly';
  start_date: string;
  end_date?: string | null;
  next_issue_date: string;
  last_generated_date?: string | null;
  amount: number;
  tax_amount: number;
  subtotal: number;
  items: any;
  payment_terms: string;
  status: 'Active' | 'Paused' | 'Completed';
  auto_email: boolean;
  notes?: string;
  total_cycles_run: number;
  created_at?: string;
}

interface QuotationLineItem {
  id: string;
  itemId?: number;
  name: string;
  sku?: string;
  hsn_sac?: string;
  available_stock: number;
  unit: string;
  qty: number;
  rate: number;
  discount_percent: number;
  tax_slab: string;
  tax_rate: number;
  tax_amount: number;
  total: number;
  is_service?: boolean;
}

function numberToIndianWords(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Zero Rupees Only';

  function inWords(val: number): string {
    let str = '';
    if (val > 9999999) {
      str += inWords(Math.floor(val / 10000000)) + 'Crore ';
      val %= 10000000;
    }
    if (val > 99999) {
      str += inWords(Math.floor(val / 100000)) + 'Lakh ';
      val %= 100000;
    }
    if (val > 999) {
      str += inWords(Math.floor(val / 1000)) + 'Thousand ';
      val %= 1000;
    }
    if (val > 99) {
      str += inWords(Math.floor(val / 100)) + 'Hundred ';
      val %= 100;
    }
    if (val > 0) {
      if (val < 20) {
        str += a[val];
      } else {
        str += b[Math.floor(val / 10)] + (val % 10 !== 0 ? ' ' + a[val % 10] : ' ');
      }
    }
    return str;
  }

  return 'Rupees ' + inWords(n).trim() + ' Only';
}

interface ReceiptItem {
  id: number;
  receipt_type: string;
  ref_number: string;
  party_name: string;
  category: string;
  amount: number;
  payment_mode: string;
  date: string;
  notes?: string;
}

export const TAX_SLABS: { label: string; rate: number }[] = [
  { label: 'None', rate: 0 },
  { label: 'IGST@0%', rate: 0 },
  { label: 'GST@0%', rate: 0 },
  { label: 'IGST@0.25%', rate: 0.25 },
  { label: 'GST@0.25%', rate: 0.25 },
  { label: 'IGST@3%', rate: 3 },
  { label: 'GST@3%', rate: 3 },
  { label: 'IGST@5%', rate: 5 },
  { label: 'GST@5%', rate: 5 },
  { label: 'IGST@12%', rate: 12 },
  { label: 'GST@12%', rate: 12 },
  { label: 'IGST@18%', rate: 18 },
  { label: 'GST@18%', rate: 18 },
  { label: 'IGST@28%', rate: 28 },
  { label: 'GST@28%', rate: 28 },
  { label: 'IGST@40%', rate: 40 },
  { label: 'GST@40%', rate: 40 },
  { label: 'Exempt', rate: 0 },
];

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  item_code?: string;
  brand?: string;
  hsn_sac: string;
  category: string;
  unit: string;
  purchase_price: number;
  purchase_tax_type?: string;
  sale_price: number;
  sale_tax_type?: string;
  tax_slab?: string;
  stock: number;
  min_stock: number;
  tax_rate: number;
  is_service?: boolean;
}

export default function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');

  // Auth Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetToken, setResetToken] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Authenticated State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt_access_token'));
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Profile Form State (Instead of Display Name: UserName, designation, Account Email, contact email, phone)
  const [profileUsername, setProfileUsername] = useState('');
  const [profileDesignation, setProfileDesignation] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileContactEmail, setProfileContactEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileUpdating, setProfileUpdating] = useState(false);

  // App Navigation (OmniBill Sidebar)
  const [activeNav, setActiveNav] = useState<string>('analytics');
  const [activeSaleSub, setActiveSaleSub] = useState<string>('Invoices');
  const [activeReceiptSub, setActiveReceiptSub] = useState<string>('Record Expense : Debit');
  const [activeInventorySub, setActiveInventorySub] = useState<string>('Manual');

  // Sidebar accordion states
  const [salesExpanded, setSalesExpanded] = useState<boolean>(true);
  const [receiptsExpanded, setReceiptsExpanded] = useState<boolean>(true);
  const [inventoryExpanded, setInventoryExpanded] = useState<boolean>(true);

  // Profile & Business Setup Dropdown/Modal
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [activeSetupTab, setActiveSetupTab] = useState<'profile' | 'business' | 'bank'>('business');
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [tenantInfo, setTenantInfo] = useState<TenantSchemaInfo | null>(null);
  const [loadingTenantInfo, setLoadingTenantInfo] = useState<boolean>(false);

  // Data States
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    business_name: 'OmniBill Enterprises',
    trade_name: 'OmniBill Tech Solutions',
    gst_number: '27AABCO1234F1Z5',
    pan: 'AABCO1234F',
    address: '104, Tech Innovation Hub, Cyber Gateway',
    state: 'Maharashtra (27)',
    phone: '+91 98765 43210',
    email: 'billing@omnibill.com',
    bank_name: 'HDFC Bank Ltd',
    bank_account: '50200012345678',
    bank_ifsc: 'HDFC0001234',
    upi_id: 'omnibill@okhdfcbank',
    payment_qr_url: '',
    logo_url: '',
  });

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [salesDocs, setSalesDocs] = useState<SalesDoc[]>([]);
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [templates, setTemplates] = useState<any>({
    theme: 'Modern Pro',
    primary_color: '#4f46e5',
    show_logo: true,
    show_qr: true,
    show_bank_details: true,
    terms_conditions: 'Payment due within 15 days of invoice date. Late interest @ 18% p.a.',
  });
  const [taxSettings, setTaxSettings] = useState<any>({
    is_composition: false,
    default_gst_rate: 18,
    rcm_enabled: false,
    filing_period: 'Monthly',
  });

  // Admin & Public Schema Management States
  const [adminPublicSchema, setAdminPublicSchema] = useState<any>(null);
  const [adminTenants, setAdminTenants] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [loadingAdminData, setLoadingAdminData] = useState<boolean>(false);
  const [showMigrateModal, setShowMigrateModal] = useState<boolean>(false);
  const [selectedTenantForAction, setSelectedTenantForAction] = useState<any>(null);
  const [targetMigrationPlan, setTargetMigrationPlan] = useState<string>('Pro');
  const [migrationReason, setMigrationReason] = useState<string>('Plan tier upgraded for high invoice volume');
  const [showDemoteModal, setShowDemoteModal] = useState<boolean>(false);
  const [demoteReason, setDemoteReason] = useState<string>('Subscription invoice overdue. Auto-demoted to Free Community tier.');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [tenantHistory, setTenantHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [adminActionSuccess, setAdminActionSuccess] = useState<string | null>(null);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [expandedNavigatorSchema, setExpandedNavigatorSchema] = useState<string | null>('public');

  // Action Modals
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showAddReceiptModal, setShowAddReceiptModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [scanningBill, setScanningBill] = useState(false);

  // New item form states
  const initialNewParty = {
    customer_type: 'B2B' as 'B2B' | 'B2C',
    name: '',
    type: 'Active Client',
    contact_person: '',
    contact_title: '',
    email: '',
    phone: '',
    mobile_urgent: '',
    industry: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_region: '',
    postal_code: '',
    country: 'IN',
    gstin: '',
    currency: 'INR (₹) – India',
    payment_terms: 'Net 30 Days',
    credit_limit: 25000,
    is_tax_exempt: false,
    account_manager: '',
    tags: '',
    notes: '',
    balance: 0,
  };
  const [newParty, setNewParty] = useState(initialNewParty);
  const [partyModalError, setPartyModalError] = useState<string | null>(null);
  const [newSaleDoc, setNewSaleDoc] = useState({ party_name: '', amount: 0, tax_amount: 0, status: 'Unpaid', notes: '' });
  const [newReceipt, setNewReceipt] = useState({ party_name: '', category: 'Operations', amount: 0, payment_mode: 'Bank Transfer', notes: '' });

  // Quotation Specific Modals & Form States
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [editingQuotationId, setEditingQuotationId] = useState<number | null>(null);
  const [viewingQuotation, setViewingQuotation] = useState<SalesDoc | null>(null);
  const [convertingQuotation, setConvertingQuotation] = useState<SalesDoc | null>(null);
  const [isConvertingQuote, setIsConvertingQuote] = useState(false);
  const [migratingSaleOrder, setMigratingSaleOrder] = useState<SalesDoc | null>(null);
  const [isMigratingSo, setIsMigratingSo] = useState(false);
  const [quoteSaveError, setQuoteSaveError] = useState<string | null>(null);
  const [sourceSaleOrderId, setSourceSaleOrderId] = useState<number | null>(null);

  // Payment Reminders / WhatsApp Notification States
  const [reminderInvoice, setReminderInvoice] = useState<SalesDoc | null>(null);
  const [reminderRecipientPhone, setReminderRecipientPhone] = useState('');
  const [reminderRecipientName, setReminderRecipientName] = useState('');
  const [reminderCustomMessage, setReminderCustomMessage] = useState('');
  const [reminderCopied, setReminderCopied] = useState(false);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const [quoteFormNumber, setQuoteFormNumber] = useState('');
  const [quoteFormDate, setQuoteFormDate] = useState('');
  const [quoteFormValidUntil, setQuoteFormValidUntil] = useState('');
  const [quoteFormPartyName, setQuoteFormPartyName] = useState('');
  const [quoteFormPlaceOfSupply, setQuoteFormPlaceOfSupply] = useState('Maharashtra (27)');
  const [quoteFormBillingAddress, setQuoteFormBillingAddress] = useState('');
  const [quoteFormPartyGstin, setQuoteFormPartyGstin] = useState('');
  const [quoteFormPartyPhone, setQuoteFormPartyPhone] = useState('');
  const [quoteFormStatus, setQuoteFormStatus] = useState('Pending');
  const [quoteFormNotes, setQuoteFormNotes] = useState('');
  const [quoteFormTerms, setQuoteFormTerms] = useState(
    '1. Quotation valid for 15 days from date of issue.\n2. 50% advance along with purchase order confirmation.\n3. GST and other government taxes as applicable.\n4. Subject to local commercial jurisdiction.'
  );
  const [quoteFormItems, setQuoteFormItems] = useState<QuotationLineItem[]>([]);
  
  // Universal Sales Document Type ('Quotation' | 'Sale Order' | 'Proforma Invoice' | 'Delivery Challan' | 'Invoices' | 'Sale return/Credit Note')
  const [activeSalesDocType, setActiveSalesDocType] = useState<string>('Quotation');
  const [quoteFormPoNumber, setQuoteFormPoNumber] = useState<string>('');
  const [quoteFormPoDate, setQuoteFormPoDate] = useState<string>('');
  const [quoteFormVehicle, setQuoteFormVehicle] = useState<string>('');
  const [quoteFormTransporter, setQuoteFormTransporter] = useState<string>('');
  const [quoteFormEwayBill, setQuoteFormEwayBill] = useState<string>('');
  const [quoteFormLinkedDoc, setQuoteFormLinkedDoc] = useState<string>('');
  const [quoteFormReturnReason, setQuoteFormReturnReason] = useState<string>('Defective / Damaged in Transit');

  // Sales Lifecycle Progression Modal States
  const [progressTargetDoc, setProgressTargetDoc] = useState<SalesDoc | null>(null);
  const [progressTargetType, setProgressTargetType] = useState<string>('Sale Order');
  const [progressPoNumber, setProgressPoNumber] = useState<string>('');
  const [progressPoDate, setProgressPoDate] = useState<string>('');
  const [progressVehicle, setProgressVehicle] = useState<string>('');
  const [progressTransporter, setProgressTransporter] = useState<string>('');
  const [progressEwayBill, setProgressEwayBill] = useState<string>('');
  const [progressNotes, setProgressNotes] = useState<string>('');
  const [isProgressingDoc, setIsProgressingDoc] = useState<boolean>(false);

  // Recurring Invoices State
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoiceProfile[]>([
    {
      id: 1,
      profile_name: 'Monthly Cloud ERP Retainer',
      party_name: 'Apex Infotech Ltd',
      frequency: 'Monthly',
      start_date: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
      end_date: null,
      next_issue_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      last_generated_date: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
      amount: 35400,
      tax_amount: 5400,
      subtotal: 30000,
      items: [
        {
          id: 'rec-1',
          name: 'OmniBill ERP Enterprise License',
          available_stock: 999,
          unit: 'YEAR',
          qty: 1,
          rate: 30000,
          discount_percent: 0,
          tax_slab: 'GST@18%',
          tax_rate: 18,
          tax_amount: 5400,
          total: 35400,
          hsn_sac: '997331',
        },
      ],
      payment_terms: 'Net 15 Days',
      status: 'Active',
      auto_email: true,
      notes: 'Automated monthly recurring retainer for Enterprise cloud tier',
      total_cycles_run: 2,
    },
    {
      id: 2,
      profile_name: 'Quarterly POS Terminal AMC',
      party_name: 'Metropolis Retail Store',
      frequency: 'Quarterly',
      start_date: new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0],
      end_date: null,
      next_issue_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      last_generated_date: new Date(Date.now() - 80 * 86400000).toISOString().split('T')[0],
      amount: 14160,
      tax_amount: 2160,
      subtotal: 12000,
      items: [
        {
          id: 'rec-2',
          name: 'Smart Android POS Terminal',
          available_stock: 18,
          unit: 'PCS',
          qty: 1,
          rate: 12000,
          discount_percent: 0,
          tax_slab: 'GST@18%',
          tax_rate: 18,
          tax_amount: 2160,
          total: 14160,
          hsn_sac: '847050',
        },
      ],
      payment_terms: 'Net 30 Days',
      status: 'Active',
      auto_email: true,
      notes: 'Quarterly scheduled preventative hardware maintenance',
      total_cycles_run: 1,
    },
  ]);
  const [showRecurringModal, setShowRecurringModal] = useState<boolean>(false);
  const [editingRecurringProfile, setEditingRecurringProfile] = useState<RecurringInvoiceProfile | null>(null);
  const [isGeneratingRecurringId, setIsGeneratingRecurringId] = useState<number | null>(null);
  const [recurringFormName, setRecurringFormName] = useState<string>('');
  const [recurringFormParty, setRecurringFormParty] = useState<string>('');
  const [recurringFormFreq, setRecurringFormFreq] = useState<'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Weekly'>('Monthly');
  const [recurringFormStartDate, setRecurringFormStartDate] = useState<string>('');
  const [recurringFormEndDate, setRecurringFormEndDate] = useState<string>('');
  const [recurringFormNextDate, setRecurringFormNextDate] = useState<string>('');
  const [recurringFormPaymentTerms, setRecurringFormPaymentTerms] = useState<string>('Net 30 Days');
  const [recurringFormNotes, setRecurringFormNotes] = useState<string>('');
  const [recurringFormAutoEmail, setRecurringFormAutoEmail] = useState<boolean>(true);
  const [recurringFormItems, setRecurringFormItems] = useState<QuotationLineItem[]>([]);
  const [showRecurringPartyDropdown, setShowRecurringPartyDropdown] = useState<boolean>(false);
  
  // Search state for Client Party in Quotation and Invoice dialogs
  const [showQuotePartyDropdown, setShowQuotePartyDropdown] = useState(false);
  const [showSalePartyDropdown, setShowSalePartyDropdown] = useState(false);

  // Search state for Line Items in Quotation
  const [activeItemSearchId, setActiveItemSearchId] = useState<string | null>(null);
  const [itemSearchQueries, setItemSearchQueries] = useState<Record<string, string>>({});

  // Record Payment Modal States
  const [recordingPaymentDoc, setRecordingPaymentDoc] = useState<SalesDoc | null>(null);
  const [paymentFormAmount, setPaymentFormAmount] = useState<number>(0);
  const [paymentFormMode, setPaymentFormMode] = useState<string>('Bank Transfer');
  const [paymentFormDate, setPaymentFormDate] = useState<string>('');
  const [paymentFormRef, setPaymentFormRef] = useState<string>('');
  const [paymentFormNotes, setPaymentFormNotes] = useState<string>('');
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [paymentRecordError, setPaymentRecordError] = useState<string | null>(null);

  // GST Filing Report & Tax Engine States (GSTR-3B & GSTR-1)
  const [taxViewTab, setTaxViewTab] = useState<'gstr3b' | 'report' | 'settings'>('gstr3b');
  const [gstr3bActiveTab, setGstr3bActiveTab] = useState<'overview' | 'tables' | 'drilldown'>('overview');
  const [gstFilingPeriod, setGstFilingPeriod] = useState<string>('all');
  const [gstFilterType, setGstFilterType] = useState<'all' | 'b2b' | 'b2c'>('all');
  const [gstActiveSubTab, setGstActiveSubTab] = useState<'slabs' | 'gstr1_tables' | 'hsn' | 'drilldown'>('slabs');
  const [gstSearchQuery, setGstSearchQuery] = useState<string>('');
  
  // Product / Inventory Form State (matching screenshot fields)
  const [categories, setCategories] = useState<string[]>([
    'Solar Panels',
    'Hardware',
    'Software',
    'Electronics',
    'Consumables',
    'Services',
    'General',
  ]);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [newInventory, setNewInventory] = useState({
    name: '',
    item_code: '',
    sku: '',
    brand: '',
    hsn_sac: '5463',
    category: 'Solar Panels',
    unit: 'PCS',
    purchase_price: 0,
    purchase_tax_type: 'Without Tax',
    sale_price: 0,
    sale_tax_type: 'Without Tax',
    tax_slab: 'GST@18%',
    tax_rate: 18,
    stock: 10,
    min_stock: 5,
    is_service: false,
  });

  // Inventory Search, Filter & Actions States
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | 'low_stock' | 'in_stock' | 'out_of_stock'>('all');
  
  // Product Deletion State
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Sales Document Deletion State
  const [salesDocToDelete, setSalesDocToDelete] = useState<SalesDoc | null>(null);
  const [isDeletingSalesDoc, setIsDeletingSalesDoc] = useState(false);

  // Import / Scan Bill Verification States
  const [showScanBillModal, setShowScanBillModal] = useState(false);
  const [scanBillStep, setScanBillStep] = useState<'upload' | 'verify'>('upload');
  const [isExtractingBill, setIsExtractingBill] = useState(false);
  const [isConfirmingBillAdd, setIsConfirmingBillAdd] = useState(false);
  const [scannedBillMeta, setScannedBillMeta] = useState<{
    fileName: string;
    supplier_name?: string;
    invoice_no?: string;
    invoice_date?: string;
    confidenceScore?: number;
  }>({ fileName: '' });
  const [scannedBillMissingFields, setScannedBillMissingFields] = useState<string[]>([]);
  const [scannedBillForm, setScannedBillForm] = useState({
    name: '',
    item_code: '',
    brand: '',
    category: 'General',
    hsn_sac: '',
    unit: 'PCS',
    purchase_price: 0,
    purchase_tax_type: 'Without Tax' as 'With Tax' | 'Without Tax',
    sale_price: 0,
    sale_tax_type: 'Without Tax' as 'With Tax' | 'Without Tax',
    tax_slab: 'GST@18%',
    tax_rate: 18,
    stock: 10,
    min_stock: 5,
    supplier_name: '',
    invoice_no: '',
    notes: '',
  });
  const [showScanCategoryInput, setShowScanCategoryInput] = useState(false);
  const [scanNewCategoryName, setScanNewCategoryName] = useState('');

  // Stock Adjustment State (Indian Accounting Standard Ind AS 2)
  const [adjustModalItem, setAdjustModalItem] = useState<InventoryItem | null>(null);
  const [adjustForm, setAdjustForm] = useState({
    type: 'inward' as 'inward' | 'outward' | 'set',
    quantity: 10,
    inward_price: 0,
    inward_tax_type: 'Without Tax',
    valuation_method: 'weighted_avg' as 'weighted_avg' | 'latest' | 'keep',
    sale_price: 0,
    sale_tax_type: 'Without Tax',
    reason: 'Supplier Inward / New Batch Stock',
  });

  // Edit Inventory Item State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editInventoryForm, setEditInventoryForm] = useState({
    name: '',
    item_code: '',
    sku: '',
    brand: '',
    hsn_sac: '998311',
    category: 'Solar Panels',
    unit: 'PCS',
    purchase_price: 0,
    purchase_tax_type: 'Without Tax',
    sale_price: 0,
    sale_tax_type: 'Without Tax',
    tax_slab: 'GST@18%',
    tax_rate: 18,
    stock: 0,
    min_stock: 5,
  });
  const [showEditCategoryInput, setShowEditCategoryInput] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Barcode & Shelf Label State
  const [labelModalItem, setLabelModalItem] = useState<InventoryItem | null>(null);
  const [labelCopies, setLabelCopies] = useState(1);
  const [labelFormat, setLabelFormat] = useState<'shelf' | 'barcode' | 'sheet'>('shelf');

  const fetchAdminData = async (authToken?: string) => {
    const authT = authToken || token;
    if (!authT) return;
    setLoadingAdminData(true);
    try {
      const headers = { Authorization: `Bearer ${authT}` };
      const [pubRes, tRes, pRes] = await Promise.all([
        fetch('/api/admin/public-schema-info', { headers }),
        fetch('/api/admin/tenants', { headers }),
        fetch('/api/admin/subscription-plans', { headers }),
      ]);
      if (pubRes.ok) setAdminPublicSchema(await pubRes.json());
      if (tRes.ok) {
        const data = await tRes.json();
        setAdminTenants(Array.isArray(data) ? data : []);
      }
      if (pRes.ok) {
        const data = await pRes.json();
        setSubscriptionPlans(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingAdminData(false);
    }
  };

  const handleMigratePlan = async () => {
    if (!token || !selectedTenantForAction) return;
    try {
      const res = await fetch(`/api/admin/tenants/${selectedTenantForAction.id}/migrate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPlan: targetMigrationPlan, reason: migrationReason }),
      });
      if (res.ok) {
        setAdminActionSuccess(`Tenant ${selectedTenantForAction.name} successfully migrated to ${targetMigrationPlan}!`);
        setShowMigrateModal(false);
        fetchAdminData();
        setTimeout(() => setAdminActionSuccess(null), 4000);
      } else {
        const err = await res.json();
        setAdminActionError(err.message || 'Failed to migrate plan');
      }
    } catch (e: any) {
      setAdminActionError(e.message);
    }
  };

  const handleDemoteUnpaid = async () => {
    if (!token || !selectedTenantForAction) return;
    try {
      const res = await fetch(`/api/admin/tenants/${selectedTenantForAction.id}/demote-unpaid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetPlan: 'Free', reason: demoteReason }),
      });
      if (res.ok) {
        setAdminActionSuccess(`Tenant ${selectedTenantForAction.name} successfully demoted to Free plan due to non-payment.`);
        setShowDemoteModal(false);
        fetchAdminData();
        setTimeout(() => setAdminActionSuccess(null), 4000);
      } else {
        const err = await res.json();
        setAdminActionError(err.message || 'Failed to demote tenant');
      }
    } catch (e: any) {
      setAdminActionError(e.message);
    }
  };

  const handleToggleTenantStatus = async (tenant: any) => {
    if (!token) return;
    const newActive = !tenant.is_active;
    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          isActive: newActive,
          reason: newActive ? 'Reactivated by Admin' : 'Suspended due to non-payment or admin policy',
        }),
      });
      if (res.ok) {
        setAdminActionSuccess(`Tenant ${tenant.name} is now ${newActive ? 'Active' : 'Disabled'}.`);
        fetchAdminData();
        setTimeout(() => setAdminActionSuccess(null), 3500);
      }
    } catch (e: any) {
      setAdminActionError(e.message);
    }
  };

  const handleSwitchTenant = async (tenant: any) => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/switch-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetTenantId: tenant.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminActionSuccess(`Active session switched to ${tenant.name} (${data.tenant.schemaName})`);
        loadAppData(token);
        fetchTenantSchemaInfo();
        fetchAdminData();
        setTimeout(() => setAdminActionSuccess(null), 4000);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleViewTenantHistory = async (tenant: any) => {
    if (!token) return;
    setSelectedTenantForAction(tenant);
    setShowHistoryModal(true);
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTenantHistory(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load all app data on login
  const loadAppData = async (jwtToken: string) => {
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const [bRes, aRes, pRes, sRes, rRes, iRes, tRes, txRes, scRes, recRes] = await Promise.all([
        fetch('/api/business', { headers }),
        fetch('/api/analytics/financial', { headers }),
        fetch('/api/parties', { headers }),
        fetch('/api/sales', { headers }),
        fetch('/api/receipts', { headers }),
        fetch('/api/inventory', { headers }),
        fetch('/api/templates', { headers }),
        fetch('/api/tax-engine', { headers }),
        fetch('/api/tenant/schema-info', { headers }),
        fetch('/api/recurring-invoices', { headers }),
      ]);

      if (bRes.ok) setBusinessProfile(await bRes.json());
      if (aRes.ok) setAnalyticsData(await aRes.json());
      if (pRes.ok) {
        const data = await pRes.json();
        setParties(Array.isArray(data) ? data : []);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setSalesDocs(Array.isArray(data) ? data : []);
      }
      if (rRes.ok) {
        const data = await rRes.json();
        const normalized = (Array.isArray(data) ? data : []).map((r: any) => ({
          ...r,
          receipt_type: r.expense_type || r.receipt_type || 'Record Expense : Debit',
          expense_type: r.expense_type || r.receipt_type || 'Record Expense : Debit',
        }));
        setReceipts(normalized);
      }
      if (iRes.ok) {
        const data = await iRes.json();
        setInventory(Array.isArray(data) ? data : []);
      }
      if (tRes.ok) setTemplates(await tRes.json());
      if (txRes.ok) setTaxSettings(await txRes.json());
      if (scRes.ok) setTenantInfo(await scRes.json());
      if (recRes && recRes.ok) {
        const recData = await recRes.json();
        if (Array.isArray(recData) && recData.length > 0) {
          setRecurringInvoices(recData);
        }
      }
      fetchAdminData(jwtToken);
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  };

  const fetchTenantSchemaInfo = async () => {
    if (!token) return;
    setLoadingTenantInfo(true);
    try {
      const res = await fetch('/api/tenant/schema-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTenantInfo(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTenantInfo(false);
    }
  };

  const fetchCurrentUser = async (jwtToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        loadAppData(jwtToken);
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      setProfileUsername(currentUser.username || '');
      setProfileDesignation(currentUser.designation || 'Business Owner');
      setProfileEmail(currentUser.email || '');
      setProfileContactEmail(currentUser.contact_email || currentUser.email || '');
      setProfilePhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const clearRegistrationForm = () => {
    setUsername('');
    setEmail('');
    setFullName('');
    setRegisterPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify both fields.');
      return;
    }
    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          full_name: fullName.trim() || undefined,
          phone: registerPhone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.issues) throw new Error(data.issues.map((i: any) => i.message).join(' • '));
        throw new Error(data.message || data.error || 'Registration failed');
      }

      // Requirement: "once customer get registered ...lets empty all fields in registartion form"
      clearRegistrationForm();

      localStorage.setItem('jwt_access_token', data.access_token);
      setToken(data.access_token);
      setCurrentUser(data.user);
      loadAppData(data.access_token);
      setAuthSuccess('Account registered successfully! Welcome to OmniBill.');
      setActiveNav('analytics');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: username.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.issues) throw new Error(data.issues.map((i: any) => i.message).join(' • '));
        throw new Error(data.message || data.error || 'Login failed');
      }

      setPassword('');
      localStorage.setItem('jwt_access_token', data.access_token);
      setToken(data.access_token);
      setCurrentUser(data.user);
      loadAppData(data.access_token);
      setAuthSuccess('Welcome back!');
      setActiveNav('analytics');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_access_token');
    setToken(null);
    setCurrentUser(null);
    setShowProfileMenu(false);
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!forgotIdentifier.trim()) {
      setAuthError('Please enter your username or registered email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to request password reset');
      }
      setResetToken(data.resetToken || '');
      setResetCode(data.resetCode || '');
      setForgotStep(2);
      setAuthSuccess(`Account verified for ${data.username}! Verification code: ${data.resetCode}. Set your new password below.`);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setAuthError('New passwords do not match. Please verify both fields.');
      return;
    }
    if (newPassword.length < 8) {
      setAuthError('New password must be at least 8 characters long.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdentifier.trim(),
          newPassword,
          resetToken: resetToken || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to reset password');
      }
      setAuthSuccess('Password has been successfully updated! You can now sign in with your new password.');
      setUsername(forgotIdentifier.trim());
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setResetToken('');
      setResetCode('');
      setAuthMode('login');
      setForgotStep(1);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSaveBusinessSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (activeSetupTab === 'profile') {
        setProfileUpdating(true);
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: profileUsername.trim(),
            designation: profileDesignation.trim(),
            email: profileEmail.trim(),
            contact_email: profileContactEmail.trim(),
            phone: profilePhone.trim(),
          }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setCurrentUser(data.user);
          setShowSetupModal(false);
          setAuthSuccess('User profile (UserName, designation & email) updated successfully!');
          setTimeout(() => setAuthSuccess(null), 4000);
        } else {
          setAuthError(data.message || 'Failed to update profile');
        }
      } else {
        const res = await fetch('/api/business', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(businessProfile),
        });
        if (res.ok) {
          setShowSetupModal(false);
          setAuthSuccess('Business details, GST and bank accounts updated successfully!');
          setTimeout(() => setAuthSuccess(null), 4000);
        }
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Operation failed');
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPartyModalError(null);

    const cType = newParty.customer_type || 'B2B';
    const gstinTrimmed = (newParty.gstin || '').trim();

    if (cType === 'B2B' && !gstinTrimmed) {
      setPartyModalError('GSTIN is mandatory for B2B (Business-to-Business) clients. Please provide a valid 15-character GST identification number.');
      return;
    }

    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newParty,
          customer_type: cType,
          gstin: gstinTrimmed,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setParties([data.party, ...parties]);
        setShowAddPartyModal(false);
        setNewParty(initialNewParty);
        setPartyModalError(null);
      } else {
        setPartyModalError(data.error || 'Failed to register client');
      }
    } catch (err: any) {
      console.error(err);
      setPartyModalError(err.message || 'Network error occurred while registering client');
    }
  };

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          doc_type: activeSaleSub,
          party_name: newSaleDoc.party_name,
          amount: newSaleDoc.amount,
          tax_amount: newSaleDoc.tax_amount,
          status: newSaleDoc.status,
          notes: newSaleDoc.notes,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setSalesDocs([created.document, ...salesDocs]);
        setShowAddSaleModal(false);
        setNewSaleDoc({ party_name: '', amount: 0, tax_amount: 0, status: 'Unpaid', notes: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to check if an invoice is partially or fully paid (locked against editing)
  const isInvoicePaymentLocked = (doc: SalesDoc | null): boolean => {
    if (!doc) return false;
    if (doc.doc_type !== 'Invoices') return false;
    const paid = Number(doc.paid_amount || 0);
    const total = Number(doc.amount || 0);
    const remaining = doc.remaining_amount !== undefined ? Number(doc.remaining_amount) : Math.max(0, total - paid);
    const isPartiallyPaid = (paid > 0 && remaining > 0) || doc.status === 'Partially Paid';
    const isPaid = doc.status === 'Paid' || (paid > 0 && remaining <= 0);
    return isPartiallyPaid || isPaid || paid > 0;
  };

  // Helper to check if a sales document has progressed to the next stage in the lifecycle
  const isDocMovedToNextStage = (doc: SalesDoc | null): boolean => {
    if (!doc) return false;

    // 1. Quotation: moved if converted or has linked invoice / sale order
    if (doc.doc_type === 'Quotation') {
      return (
        doc.status === 'Converted' ||
        salesDocs.some(
          (d) =>
            d.doc_type === 'Invoices' &&
            (d.ref_quote_number === doc.doc_number || Number(d.linked_doc_id) === Number(doc.id))
        )
      );
    }

    // 2. Sale Order: moved if Proforma generated, or dispatched, fulfilled, converted, or invoiced
    if (doc.doc_type === 'Sale Order') {
      if (
        doc.status === 'PI Generated' ||
        doc.status === 'Converted' ||
        doc.status === 'Dispatched' ||
        doc.status === 'Fulfilled' ||
        doc.status === 'Invoiced' ||
        Boolean((doc as any).is_pi_generated)
      ) {
        return true;
      }
      return salesDocs.some(
        (d) =>
          d.id !== doc.id &&
          (d.doc_type === 'Proforma Invoice' ||
            d.doc_type === 'Delivery Challan' ||
            d.doc_type === 'Invoices' ||
            (d.doc_number && (d.doc_number.startsWith('PI-') || d.doc_number.startsWith('INV-') || d.doc_number.startsWith('DC-')))) &&
          (d.po_number === doc.doc_number ||
            d.ref_quote_number === doc.doc_number ||
            Number(d.linked_doc_id) === Number(doc.id) ||
            d.linked_doc_number === doc.doc_number ||
            (d.notes && d.notes.toLowerCase().includes(doc.doc_number.toLowerCase())))
      );
    }

    // 3. Proforma Invoice: moved if converted to Tax Invoice or Delivery Challan
    if (doc.doc_type === 'Proforma Invoice') {
      if (
        doc.status === 'Invoiced' ||
        doc.status === 'Converted' ||
        doc.status === 'Fulfilled' ||
        doc.status === 'Dispatched'
      ) {
        return true;
      }
      return salesDocs.some(
        (d) =>
          d.id !== doc.id &&
          (d.doc_type === 'Invoices' ||
            d.doc_type === 'Delivery Challan' ||
            (d.doc_number && (d.doc_number.startsWith('INV-') || d.doc_number.startsWith('DC-')))) &&
          (d.ref_quote_number === doc.doc_number ||
            d.po_number === doc.doc_number ||
            Number(d.linked_doc_id) === Number(doc.id) ||
            d.linked_doc_number === doc.doc_number ||
            (d.notes && d.notes.includes(doc.doc_number)))
      );
    }

    // 4. Delivery Challan: moved if invoiced
    if (doc.doc_type === 'Delivery Challan') {
      if (doc.status === 'Invoiced' || doc.status === 'Converted') return true;
      return salesDocs.some(
        (d) =>
          d.id !== doc.id &&
          d.doc_type === 'Invoices' &&
          (d.ref_quote_number === doc.doc_number ||
            d.po_number === doc.doc_number ||
            Number(d.linked_doc_id) === Number(doc.id) ||
            d.linked_doc_number === doc.doc_number ||
            (d.notes && d.notes.includes(doc.doc_number)))
      );
    }

    return false;
  };

  // Universal Sales Document Handlers (Quotation, Sale Order, Proforma Invoice, Delivery Challan)
  const handleOpenCreateSalesDoc = (docType: string) => {
    setActiveSalesDocType(docType);
    setEditingQuotationId(null);
    setSourceSaleOrderId(null);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + (docType === 'Sale Order' ? 30 : 15));
    const validUntilStr = validUntilDate.toISOString().split('T')[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    let prefix = 'QT';
    if (docType === 'Sale Order') prefix = 'SO';
    else if (docType === 'Proforma Invoice') prefix = 'PI';
    else if (docType === 'Delivery Challan') prefix = 'DC';
    else if (docType === 'Invoices') prefix = 'INV';

    setQuoteFormNumber(`${prefix}-${now.getFullYear()}-${randomSuffix}`);
    setQuoteFormDate(todayStr);
    setQuoteFormValidUntil(validUntilStr);
    setQuoteFormPoNumber('');
    setQuoteFormPoDate(todayStr);
    setQuoteFormVehicle('');
    setQuoteFormTransporter('');
    setQuoteFormEwayBill('');
    setQuoteFormPartyName(parties.length > 0 ? parties[0].name : '');
    if (parties.length > 0) {
      const p = parties[0];
      setQuoteFormPartyGstin(p.gstin || '');
      setQuoteFormPartyPhone(p.phone || '');
      setQuoteFormBillingAddress(p.address || p.address_line1 || '');
      setQuoteFormPlaceOfSupply(p.state_region || businessProfile.state || 'Maharashtra (27)');
    } else {
      setQuoteFormPartyGstin('');
      setQuoteFormPartyPhone('');
      setQuoteFormBillingAddress('');
      setQuoteFormPlaceOfSupply(businessProfile.state || 'Maharashtra (27)');
    }
    setQuoteFormStatus(docType === 'Sale Order' ? 'Confirmed' : 'Pending');
    setQuoteFormNotes('');

    if (docType === 'Sale Order') {
      setQuoteFormTerms(
        '1. Goods reserved in inventory against verified Buyer Purchase Order.\n2. Delivery within 7-10 business days as agreed.\n3. Prices firm as per order confirmation.\n4. GST and freight charges extra as per statutory norms.'
      );
    } else if (docType === 'Proforma Invoice') {
      setQuoteFormTerms(
        '1. This is a Proforma Invoice, not a final GST Tax Invoice.\n2. Issued for securing advance payment or letter of credit (LC).\n3. Delivery will be scheduled upon receipt of advance.\n4. Valid for 15 days from issue date.'
      );
    } else if (docType === 'Delivery Challan') {
      setQuoteFormTerms(
        '1. Goods dispatched for delivery / job work / approval.\n2. Accompanies transit vehicle with statutory E-Way bill if goods value > ₹50,000.\n3. Recipient to verify stock seal and sign proof of delivery (POD).'
      );
    } else {
      setQuoteFormTerms(
        '1. Quotation valid for 15 days from date of issue.\n2. 50% advance along with purchase order confirmation.\n3. GST and other government taxes as applicable under statutory rules.\n4. Subject to local commercial jurisdiction.'
      );
    }

    const firstInStock = inventory.find((i) => Number(i.stock) > 0);
    if (firstInStock) {
      const rate = Number(firstInStock.sale_price || 0);
      const taxRate = Number(firstInStock.tax_rate ?? 18);
      const taxAmt = Number(((rate * taxRate) / 100).toFixed(2));
      setQuoteFormItems([
        {
          id: `item-${Date.now()}`,
          itemId: firstInStock.id,
          name: firstInStock.name,
          sku: firstInStock.sku || firstInStock.item_code || '',
          hsn_sac: firstInStock.hsn_sac || '998311',
          available_stock: Number(firstInStock.stock || 0),
          unit: firstInStock.unit || 'PCS',
          qty: 1,
          rate: rate,
          discount_percent: 0,
          tax_slab: firstInStock.tax_slab || 'GST@18%',
          tax_rate: taxRate,
          tax_amount: taxAmt,
          total: Number((rate + taxAmt).toFixed(2)),
        },
      ]);
    } else {
      setQuoteFormItems([]);
    }

    setQuoteSaveError(null);
    setShowQuotationModal(true);
  };

  const handleOpenCreateQuotation = () => handleOpenCreateSalesDoc('Quotation');

  // Migrate confirmed Sale Order to Proforma Invoice with prefilled line items & link
  const handleMigrateSaleOrderToProforma = (doc: SalesDoc) => {
    setActiveSalesDocType('Proforma Invoice');
    setEditingQuotationId(null);
    setSourceSaleOrderId(doc.id);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 15);
    const validUntilStr = validUntilDate.toISOString().split('T')[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    setQuoteFormNumber(`PI-${now.getFullYear()}-${randomSuffix}`);
    setQuoteFormDate(todayStr);
    setQuoteFormValidUntil(validUntilStr);
    setQuoteFormPoNumber(doc.doc_number); // Reference to source Sale Order
    setQuoteFormPoDate((doc as any).po_date ? new Date((doc as any).po_date).toISOString().split('T')[0] : todayStr);
    setQuoteFormVehicle((doc as any).vehicle_number || '');
    setQuoteFormTransporter((doc as any).transporter || (doc as any).transporter_name || '');
    setQuoteFormEwayBill((doc as any).eway_bill || (doc as any).eway_bill_number || '');
    setQuoteFormPartyName(doc.party_name);

    const matchedParty = parties.find((p) => p.name.toLowerCase() === doc.party_name.toLowerCase());
    if (matchedParty) {
      setQuoteFormPartyGstin(matchedParty.gstin || '');
      setQuoteFormPartyPhone(matchedParty.phone || '');
      setQuoteFormBillingAddress(matchedParty.address || matchedParty.address_line1 || '');
      setQuoteFormPlaceOfSupply(doc.place_of_supply || matchedParty.state_region || businessProfile.state || 'Maharashtra (27)');
    } else {
      setQuoteFormPartyGstin('');
      setQuoteFormPartyPhone('');
      setQuoteFormBillingAddress('');
      setQuoteFormPlaceOfSupply(doc.place_of_supply || businessProfile.state || 'Maharashtra (27)');
    }

    setQuoteFormStatus('Pending');
    setQuoteFormNotes(
      doc.notes ? `${doc.notes} (Generated from Sale Order ${doc.doc_number})` : `Advance Proforma Invoice issued against Sale Order ${doc.doc_number}`
    );
    setQuoteFormTerms(
      '1. This is a Proforma Invoice, not a final GST Tax Invoice.\n2. Issued for securing advance payment against confirmed Sale Order.\n3. Delivery will be scheduled upon receipt of advance.\n4. Valid for 15 days from issue date.'
    );

    // Parse items from the source Sale Order
    let parsedItems: any[] = [];
    try {
      if (typeof doc.items === 'string') {
        parsedItems = JSON.parse(doc.items);
      } else if (Array.isArray(doc.items)) {
        parsedItems = doc.items;
      }
    } catch {
      parsedItems = [];
    }

    if (parsedItems.length > 0) {
      const mapped = parsedItems.map((item, idx) => {
        const invItem = inventory.find((i) => i.id === item.itemId || i.name.toLowerCase() === (item.name || '').toLowerCase());
        const availStock = invItem ? Number(invItem.stock || 0) : Number(item.available_stock || item.qty || 10);
        const rate = Number(item.rate || 0);
        const qty = Number(item.qty || 1);
        const disc = Number(item.discount_percent || 0);
        const taxable = (rate * qty) * (1 - disc / 100);
        const taxRate = Number(item.tax_rate ?? 18);
        const taxAmt = (taxable * taxRate) / 100;

        return {
          id: `row-${idx}-${Date.now()}`,
          itemId: invItem?.id || item.itemId,
          name: item.name || '',
          sku: item.sku || invItem?.sku || '',
          hsn_sac: item.hsn_sac || invItem?.hsn_sac || '998311',
          available_stock: availStock,
          unit: item.unit || invItem?.unit || 'PCS',
          qty: qty,
          rate: rate,
          discount_percent: disc,
          tax_slab: item.tax_slab || invItem?.tax_slab || 'GST@18%',
          tax_rate: taxRate,
          tax_amount: Number(taxAmt.toFixed(2)),
          total: Number((taxable + taxAmt).toFixed(2)),
        };
      });
      setQuoteFormItems(mapped);
    } else {
      const firstInStock = inventory.find((i) => Number(i.stock) > 0);
      if (firstInStock) {
        const rate = Number(firstInStock.sale_price || 0);
        const taxRate = Number(firstInStock.tax_rate ?? 18);
        const taxAmt = Number(((rate * taxRate) / 100).toFixed(2));
        setQuoteFormItems([
          {
            id: `item-${Date.now()}`,
            itemId: firstInStock.id,
            name: firstInStock.name,
            sku: firstInStock.sku || firstInStock.item_code || '',
            hsn_sac: firstInStock.hsn_sac || '998311',
            available_stock: Number(firstInStock.stock || 0),
            unit: firstInStock.unit || 'PCS',
            qty: 1,
            rate: rate,
            discount_percent: 0,
            tax_slab: firstInStock.tax_slab || 'GST@18%',
            tax_rate: taxRate,
            tax_amount: taxAmt,
            total: Number((rate + taxAmt).toFixed(2)),
          },
        ]);
      } else {
        setQuoteFormItems([]);
      }
    }

    setQuoteSaveError(null);
    setShowQuotationModal(true);
  };

  const handleOpenEditSalesDoc = (doc: SalesDoc) => {
    const targetDocType = doc.doc_type || (activeSaleSub === 'Sale Order' ? 'Sale Order' : 'Quotation');
    setActiveSalesDocType(targetDocType);
    setEditingQuotationId(doc.id);
    setQuoteFormNumber(doc.doc_number);
    setQuoteFormDate(doc.date ? new Date(doc.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setQuoteFormValidUntil(doc.due_date ? new Date(doc.due_date).toISOString().split('T')[0] : '');
    setQuoteFormPoNumber((doc as any).po_number || '');
    setQuoteFormPoDate((doc as any).po_date ? new Date((doc as any).po_date).toISOString().split('T')[0] : '');
    setQuoteFormVehicle((doc as any).vehicle_number || '');
    setQuoteFormTransporter((doc as any).transporter || '');
    setQuoteFormEwayBill((doc as any).eway_bill || '');
    setQuoteFormPartyName(doc.party_name);

    const matchedParty = parties.find((p) => p.name.toLowerCase() === doc.party_name.toLowerCase());
    if (matchedParty) {
      setQuoteFormPartyGstin(matchedParty.gstin || '');
      setQuoteFormPartyPhone(matchedParty.phone || '');
      setQuoteFormBillingAddress(matchedParty.address || matchedParty.address_line1 || '');
      setQuoteFormPlaceOfSupply(doc.place_of_supply || matchedParty.state_region || businessProfile.state || 'Maharashtra (27)');
    } else {
      setQuoteFormPartyGstin('');
      setQuoteFormPartyPhone('');
      setQuoteFormBillingAddress('');
      setQuoteFormPlaceOfSupply(doc.place_of_supply || businessProfile.state || 'Maharashtra (27)');
    }

    setQuoteFormStatus(doc.status || 'Pending');
    setQuoteFormNotes(doc.notes || '');
    setQuoteFormTerms(
      doc.terms_conditions ||
        '1. Terms and conditions as per contract agreement.\n2. GST and other statutory duties extra as applicable.\n3. Subject to local jurisdiction.'
    );

    // Parse items if present
    let parsedItems: any[] = [];
    try {
      if (typeof doc.items === 'string') {
        parsedItems = JSON.parse(doc.items);
      } else if (Array.isArray(doc.items)) {
        parsedItems = doc.items;
      }
    } catch {
      parsedItems = [];
    }

    if (parsedItems.length > 0) {
      const mapped = parsedItems.map((item, idx) => {
        const invItem = inventory.find((i) => i.id === item.itemId || i.name.toLowerCase() === (item.name || '').toLowerCase());
        const availStock = invItem ? Number(invItem.stock || 0) : Number(item.available_stock || item.qty || 10);
        const rate = Number(item.rate || 0);
        const qty = Math.min(Number(item.qty || 1), Math.max(1, availStock));
        const disc = Number(item.discount_percent || 0);
        const taxable = (rate * qty) * (1 - disc / 100);
        const taxRate = Number(item.tax_rate ?? 18);
        const taxAmt = (taxable * taxRate) / 100;

        return {
          id: item.id || `row-${idx}-${Date.now()}`,
          itemId: invItem?.id || item.itemId,
          name: item.name || '',
          sku: item.sku || invItem?.sku || '',
          hsn_sac: item.hsn_sac || invItem?.hsn_sac || '998311',
          available_stock: availStock,
          unit: item.unit || invItem?.unit || 'PCS',
          qty: qty,
          rate: rate,
          discount_percent: disc,
          tax_slab: item.tax_slab || invItem?.tax_slab || 'GST@18%',
          tax_rate: taxRate,
          tax_amount: Number(taxAmt.toFixed(2)),
          total: Number((taxable + taxAmt).toFixed(2)),
        };
      });
      setQuoteFormItems(mapped);
    } else {
      setQuoteFormItems([]);
    }

    setQuoteSaveError(null);
    setShowQuotationModal(true);
  };

  const handleOpenEditQuotation = (doc: SalesDoc) => handleOpenEditSalesDoc(doc);

  const handleAddLabourServiceRow = (
    customName = 'Labour Charges',
    sac = '998719',
    defaultRate = 0
  ) => {
    const newRow: QuotationLineItem = {
      id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      itemId: undefined,
      name: customName,
      sku: 'SRV-LABOUR',
      hsn_sac: sac || '998719',
      available_stock: 999999,
      unit: 'JOB',
      qty: 1,
      rate: defaultRate,
      discount_percent: 0,
      tax_slab: 'GST@18%',
      tax_rate: 18,
      tax_amount: Number(((defaultRate * 18) / 100).toFixed(2)),
      total: Number((defaultRate + (defaultRate * 18) / 100).toFixed(2)),
      is_service: true,
    };
    setQuoteFormItems((prev) => [...prev, newRow]);
    setQuoteSaveError(null);
  };

  const handleAddQuoteItemRow = () => {
    // Check if there are in-stock products
    const availableItems = inventory.filter((i) => !i.is_service && Number(i.stock) > 0 && !quoteFormItems.some((qi) => qi.itemId === i.id));
    const targetItem = availableItems[0] || inventory.find((i) => !i.is_service && Number(i.stock) > 0);

    if (!targetItem) {
      // If no in-stock physical products exist, automatically add a Labour / Service charge row
      handleAddLabourServiceRow('Labour Charges', '998719', 0);
      setQuoteSaveError('Added Labour / Service charge row (exempt from stock count, 18% GST). Add inventory stock for physical products.');
      setTimeout(() => setQuoteSaveError(null), 4000);
      return;
    }

    const rate = Number(targetItem.sale_price || 0);
    const taxRate = Number(targetItem.tax_rate ?? 18);
    const taxAmt = Number(((rate * taxRate) / 100).toFixed(2));

    const newRow: QuotationLineItem = {
      id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      itemId: targetItem.id,
      name: targetItem.name,
      sku: targetItem.sku || targetItem.item_code || '',
      hsn_sac: targetItem.hsn_sac || '998311',
      available_stock: Number(targetItem.stock || 0),
      unit: targetItem.unit || 'PCS',
      qty: 1,
      rate: rate,
      discount_percent: 0,
      tax_slab: targetItem.tax_slab || 'GST@18%',
      tax_rate: taxRate,
      tax_amount: taxAmt,
      total: Number((rate + taxAmt).toFixed(2)),
      is_service: false,
    };

    setQuoteFormItems([...quoteFormItems, newRow]);
    setQuoteSaveError(null);
  };

  const handleQuoteItemChange = (
    rowId: string,
    field: keyof QuotationLineItem,
    value: any
  ) => {
    setQuoteFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== rowId) return item;

        const updated = { ...item };

        if (field === 'itemId') {
          const selectedProd = inventory.find((p) => p.id === Number(value));
          if (selectedProd) {
            const isSrv = Boolean(
              selectedProd.is_service ||
              selectedProd.category === 'Services' ||
              selectedProd.category === 'Labour' ||
              selectedProd.unit === 'JOB' ||
              selectedProd.unit === 'HRS'
            );
            const availStock = isSrv ? 999999 : Number(selectedProd.stock || 0);
            if (!isSrv && availStock <= 0) {
              setQuoteSaveError(`"${selectedProd.name}" is out of stock (Stock: 0). Quotations only permit adding in-stock items.`);
              setTimeout(() => setQuoteSaveError(null), 4000);
              return item;
            }
            updated.itemId = selectedProd.id;
            updated.name = selectedProd.name;
            updated.sku = selectedProd.sku || selectedProd.item_code || '';
            updated.hsn_sac = selectedProd.hsn_sac || (isSrv ? '998719' : '998311');
            updated.available_stock = availStock;
            updated.is_service = isSrv;
            updated.unit = selectedProd.unit || (isSrv ? 'JOB' : 'PCS');
            updated.rate = Number(selectedProd.sale_price || 0);
            updated.tax_slab = selectedProd.tax_slab || 'GST@18%';
            const slabObj = TAX_SLABS.find((s) => s.label === updated.tax_slab);
            updated.tax_rate = slabObj ? slabObj.rate : Number(selectedProd.tax_rate ?? 18);
            updated.qty = isSrv ? Math.max(1, updated.qty) : Math.min(Math.max(1, updated.qty), availStock);
          }
        } else if (field === 'qty') {
          let inputQty = Number(value);
          if (isNaN(inputQty) || inputQty < 1) inputQty = 1;
          // Enforce stock limit strictly ONLY for physical products, NOT services or labour costs
          if (!updated.is_service && inputQty > updated.available_stock) {
            setQuoteSaveError(`Quantity cannot exceed available stock (${updated.available_stock} ${updated.unit}) for "${updated.name}"`);
            setTimeout(() => setQuoteSaveError(null), 4000);
            inputQty = updated.available_stock;
          }
          updated.qty = Math.max(1, inputQty);
        } else if (field === 'name') {
          updated.name = String(value);
          const lower = String(value).toLowerCase();
          if (
            lower.includes('labour') ||
            lower.includes('labor') ||
            lower.includes('service') ||
            lower.includes('installation') ||
            lower.includes('repair') ||
            lower.includes('freight') ||
            lower.includes('transport') ||
            lower.includes('charges')
          ) {
            updated.is_service = true;
            if (updated.available_stock < 999999) updated.available_stock = 999999;
            if (!updated.hsn_sac || updated.hsn_sac === '998311') updated.hsn_sac = '998719';
            if (updated.unit === 'PCS') updated.unit = 'JOB';
          }
        } else if (field === 'is_service') {
          updated.is_service = Boolean(value);
          if (value) {
            if (updated.available_stock < 999999) updated.available_stock = 999999;
            if (!updated.hsn_sac || updated.hsn_sac === '998311') updated.hsn_sac = '998719';
            if (updated.unit === 'PCS') updated.unit = 'JOB';
          }
        } else if (field === 'rate') {
          updated.rate = Math.max(0, Number(value));
        } else if (field === 'discount_percent') {
          updated.discount_percent = Math.min(100, Math.max(0, Number(value)));
        } else if (field === 'tax_slab') {
          updated.tax_slab = String(value);
          const slabObj = TAX_SLABS.find((s) => s.label === value);
          updated.tax_rate = slabObj ? slabObj.rate : 18;
        } else {
          (updated as any)[field] = value;
        }

        // Recalculate row amounts
        const base = updated.qty * updated.rate;
        const discount = (base * (updated.discount_percent || 0)) / 100;
        const taxable = Math.max(0, base - discount);
        const taxRate = updated.tax_rate ?? 18;
        const taxAmount = (taxable * taxRate) / 100;
        updated.tax_amount = Number(taxAmount.toFixed(2));
        updated.total = Number((taxable + taxAmount).toFixed(2));

        return updated;
      })
    );
  };

  const handleRemoveQuoteItemRow = (rowId: string) => {
    setQuoteFormItems((prev) => prev.filter((it) => it.id !== rowId));
  };

  // Calculations for current Quotation Form
  const currentQuoteSubtotal = quoteFormItems.reduce((acc, it) => {
    const base = it.qty * it.rate;
    const disc = (base * (it.discount_percent || 0)) / 100;
    return acc + Math.max(0, base - disc);
  }, 0);

  const currentQuoteDiscount = quoteFormItems.reduce((acc, it) => {
    const base = it.qty * it.rate;
    return acc + (base * (it.discount_percent || 0)) / 100;
  }, 0);

  const currentQuoteTax = quoteFormItems.reduce((acc, it) => acc + (it.tax_amount || 0), 0);
  const isQuoteIntraState = (quoteFormPlaceOfSupply || '').trim().toLowerCase() === (businessProfile.state || '').trim().toLowerCase();
  const currentQuoteGrandTotal = Math.round(currentQuoteSubtotal + currentQuoteTax);
  const currentQuoteRoundOff = Number((currentQuoteGrandTotal - (currentQuoteSubtotal + currentQuoteTax)).toFixed(2));

  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!quoteFormPartyName.trim()) {
      setQuoteSaveError('Please select or specify a Client / Party.');
      return;
    }
    if (quoteFormItems.length === 0) {
      setQuoteSaveError('Please add at least 1 item or labour cost to the quotation.');
      return;
    }

    // Double-check stock limit ONLY for physical products (exempt services / labour charges)
    for (const item of quoteFormItems) {
      if (!item.is_service && item.available_stock !== undefined && item.qty > item.available_stock) {
        setQuoteSaveError(`Cannot save quotation: "${item.name}" quantity (${item.qty}) exceeds available stock (${item.available_stock} ${item.unit}).`);
        return;
      }
      if (item.qty <= 0) {
        setQuoteSaveError(`Quantity for "${item.name}" must be at least 1.`);
        return;
      }
    }

    const docTitle = activeSalesDocType || 'Quotation';
    const payload = {
      doc_type: docTitle,
      doc_number: quoteFormNumber,
      party_name: quoteFormPartyName,
      date: quoteFormDate,
      due_date: quoteFormValidUntil,
      amount: currentQuoteGrandTotal,
      tax_amount: currentQuoteTax,
      status: quoteFormStatus,
      notes: quoteFormNotes,
      items: quoteFormItems,
      subtotal: currentQuoteSubtotal,
      discount_amount: currentQuoteDiscount,
      place_of_supply: quoteFormPlaceOfSupply,
      terms_conditions: quoteFormTerms,
      po_number: quoteFormPoNumber,
      po_date: quoteFormPoDate,
      vehicle_number: quoteFormVehicle,
      transporter: quoteFormTransporter,
      eway_bill: quoteFormEwayBill,
      linked_doc_id: sourceSaleOrderId || null,
      ref_quote_number: quoteFormPoNumber || null,
    };

    try {
      if (editingQuotationId) {
        const res = await fetch(`/api/sales/${editingQuotationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setSalesDocs((prev) => prev.map((d) => (d.id === editingQuotationId ? { ...d, ...data.document } : d)));
          setShowQuotationModal(false);
          setEditingQuotationId(null);
          setAdminActionSuccess(`${docTitle} ${quoteFormNumber} updated successfully.`);
          setTimeout(() => setAdminActionSuccess(null), 4000);
        } else {
          const err = await res.json();
          setQuoteSaveError(err.error || `Failed to update ${docTitle}`);
        }
      } else {
        const res = await fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          let nextDocs = [data.document, ...salesDocs];

          // If this Proforma Invoice was migrated from a confirmed Sale Order, mark source Sale Order as 'PI Generated'
          if (docTitle === 'Proforma Invoice' && sourceSaleOrderId) {
            try {
              await fetch(`/api/sales/${sourceSaleOrderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: 'PI Generated' }),
              });
              nextDocs = nextDocs.map((d) => (d.id === sourceSaleOrderId ? { ...d, status: 'PI Generated' } : d));
            } catch (soErr) {
              console.error('Failed to update source Sale Order status:', soErr);
            }
            setSourceSaleOrderId(null);
          }

          setSalesDocs(nextDocs);
          setShowQuotationModal(false);
          setAdminActionSuccess(`${docTitle} ${quoteFormNumber} created successfully.`);
          setTimeout(() => setAdminActionSuccess(null), 4000);
        } else {
          const err = await res.json();
          setQuoteSaveError(err.error || `Failed to create ${docTitle}`);
        }
      }
    } catch (err: any) {
      setQuoteSaveError(err.message || `Error saving ${docTitle}`);
    }
  };

  const handleConfirmConvertQuotationToInvoice = async () => {
    if (!token || !convertingQuotation) return;
    setIsConvertingQuote(true);
    try {
      const res = await fetch(`/api/sales/${convertingQuotation.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Update sales documents state: marked quotation as 'Converted' and prepend new invoice
        setSalesDocs((prev) => {
          const updated = prev.map((d) => (d.id === convertingQuotation.id ? { ...d, status: 'Converted' } : d));
          return [data.invoice, ...updated];
        });
        // Synchronize inventory with the deducted stock returned by backend
        if (data.inventory && Array.isArray(data.inventory)) {
          setInventory(data.inventory);
        }
        setConvertingQuotation(null);
        setAdminActionSuccess(`🎉 Quotation ${convertingQuotation.doc_number} successfully converted to Invoice ${data.invoice.doc_number}! Inventory stock synchronized.`);
        setTimeout(() => setAdminActionSuccess(null), 6000);
      } else {
        const err = await res.json();
        setAuthError(err.error || 'Failed to convert quotation');
        setTimeout(() => setAuthError(null), 4000);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error converting quotation');
      setTimeout(() => setAuthError(null), 4000);
    } finally {
      setIsConvertingQuote(false);
    }
  };

  // One-click atomic migration of confirmed Sale Order to Proforma Invoice
  const handleConfirmMigrateSaleOrderToProforma = async () => {
    if (!token || !migratingSaleOrder) return;
    setIsMigratingSo(true);
    const so = migratingSaleOrder;
    try {
      const res = await fetch(`/api/sales/${so.id}/to-proforma`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state: add the new Proforma, and update the Sale Order status to 'PI Generated'
        setSalesDocs((prev) => {
          const updated = prev.map((d) => (d.id === so.id ? { ...d, status: 'PI Generated' } : d));
          return [data.proforma, ...updated];
        });
        setAdminActionSuccess(`✓ Proforma Invoice ${data.proforma.doc_number} generated from Sale Order #${so.doc_number}. Sale Order marked as PI Generated!`);
        setTimeout(() => setAdminActionSuccess(null), 5000);
        setMigratingSaleOrder(null);
      } else {
        const err = await res.json();
        setAdminActionError(err.error || 'Failed to generate Proforma Invoice');
        setTimeout(() => setAdminActionError(null), 5000);
      }
    } catch (err: any) {
      setAdminActionError(err.message || 'Error migrating Sale Order');
      setTimeout(() => setAdminActionError(null), 5000);
    } finally {
      setIsMigratingSo(false);
    }
  };

  // Payment Reminders & WhatsApp Notification Handlers
  const handleOpenWhatsAppReminder = (doc: SalesDoc) => {
    setReminderInvoice(doc);
    const matchedParty = parties.find((p) => p.name.toLowerCase() === doc.party_name.toLowerCase());
    const rawPhone = matchedParty?.phone || (doc as any).phone || '';
    setReminderRecipientPhone(rawPhone);
    setReminderRecipientName(doc.party_name);
    setReminderCopied(false);

    const total = Number(doc.amount || 0);
    const paid = Number(doc.paid_amount !== undefined ? doc.paid_amount : (doc.status === 'Paid' ? total : 0));
    const remaining = doc.remaining_amount !== undefined ? Number(doc.remaining_amount) : (doc.status === 'Paid' ? 0 : Math.max(0, total - paid));
    const dueDateStr = doc.due_date ? new Date(doc.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Immediate';
    const issueDateStr = doc.date ? new Date(doc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
    const dueDateObj = doc.due_date ? new Date(doc.due_date) : null;
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const daysOverdue = dueDateObj ? Math.max(1, Math.ceil((todayObj.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24))) : 0;

    const defaultMsg = `🔔 *PAYMENT REMINDER*
Dear *${doc.party_name}*,

This is a gentle payment reminder from *${businessProfile.business_name || 'OmniBill Technologies'}* regarding your Tax Invoice *#${doc.doc_number}*.

📄 *Invoice Details:*
• Invoice Number: *#${doc.doc_number}*
• Issue Date: ${issueDateStr}
• Due Date: ${dueDateStr} (*${daysOverdue} days overdue*)
• Total Invoice Value: ₹${total.toLocaleString('en-IN')}
• Outstanding Balance Due: *₹${remaining.toLocaleString('en-IN')}*

💳 *Instant Payment Options:*
• UPI VPA: ${businessProfile.upi_id || 'omnibill@okhdfcbank'}
• Bank: ${businessProfile.bank_name || 'HDFC Bank Ltd'}
• Account Number: ${businessProfile.bank_account || '50200012345678'}
• IFSC Code: ${businessProfile.bank_ifsc || 'HDFC0001234'}

Kindly process the payment at your earliest convenience to maintain an uninterrupted credit cycle. If payment has already been sent, kindly share the bank reference / UTR number.

Thank you,
*${businessProfile.business_name || 'Accounts Department'}*`;

    setReminderCustomMessage(defaultMsg);
  };

  const handleSendWhatsAppNotification = async () => {
    if (!reminderInvoice) return;
    const inv = reminderInvoice;
    let cleanPhone = reminderRecipientPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const encodedMsg = encodeURIComponent(reminderCustomMessage);
    const waUrl = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}` : `https://api.whatsapp.com/send?text=${encodedMsg}`;

    // Record reminder dispatch on backend
    if (token) {
      try {
        const res = await fetch(`/api/sales/${inv.id}/reminder`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSalesDocs((prev) =>
            prev.map((d) => (d.id === inv.id ? { ...d, reminder_count: (d.reminder_count || 0) + 1, last_reminder_at: new Date().toISOString() } : d))
          );
        }
      } catch {
        // Continue opening WhatsApp regardless of logging
      }
    }

    // Trigger WhatsApp
    const win = window.open(waUrl, '_blank');
    if (!win) {
      window.location.href = waUrl;
    }

    setAdminActionSuccess(`✓ WhatsApp payment reminder opened for ${inv.party_name} (#${inv.doc_number})!`);
    setTimeout(() => setAdminActionSuccess(null), 5000);
    setReminderInvoice(null);
  };

  const handleCopyReminderMessage = () => {
    navigator.clipboard.writeText(reminderCustomMessage);
    setReminderCopied(true);
    setTimeout(() => setReminderCopied(false), 3000);
  };

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          receipt_type: activeReceiptSub,
          party_name: newReceipt.party_name,
          category: newReceipt.category,
          amount: newReceipt.amount,
          payment_mode: newReceipt.payment_mode,
          notes: newReceipt.notes,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setReceipts([created.receipt, ...receipts]);
        setShowAddReceiptModal(false);
        setNewReceipt({ party_name: '', category: 'Operations', amount: 0, payment_mode: 'Bank Transfer', notes: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenRecordPayment = (doc: SalesDoc) => {
    setRecordingPaymentDoc(doc);
    const total = Number(doc.amount || 0);
    const paid = Number(doc.paid_amount || 0);
    const remaining = doc.remaining_amount !== undefined ? Number(doc.remaining_amount) : Math.max(0, total - paid);
    setPaymentFormAmount(remaining > 0 ? remaining : 0);
    setPaymentFormMode('Bank Transfer');
    setPaymentFormDate(new Date().toISOString().split('T')[0]);
    setPaymentFormRef('');
    setPaymentFormNotes('');
    setPaymentRecordError(null);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !recordingPaymentDoc) return;
    const amountNum = Number(paymentFormAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPaymentRecordError('Please enter a valid payment amount greater than 0.');
      return;
    }

    setIsRecordingPayment(true);
    setPaymentRecordError(null);
    try {
      const res = await fetch(`/api/sales/${recordingPaymentDoc.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: amountNum,
          payment_mode: paymentFormMode,
          date: paymentFormDate || new Date().toISOString().split('T')[0],
          ref_number: paymentFormRef,
          notes: paymentFormNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update sales documents state with new paid amount and remaining balance
        setSalesDocs((prev) =>
          prev.map((d) => (d.id === recordingPaymentDoc.id ? { ...d, ...data.invoice } : d))
        );
        // Also refresh receipts list if in background
        try {
          const recRes = await fetch('/api/receipts', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (recRes.ok) {
            const freshRec = await recRes.json();
            setReceipts(freshRec);
          }
        } catch {
          // ignore
        }
        setAdminActionSuccess(`✓ Payment of ₹${amountNum.toLocaleString('en-IN')} successfully recorded for Invoice ${recordingPaymentDoc.doc_number}!`);
        setTimeout(() => setAdminActionSuccess(null), 5000);
        setRecordingPaymentDoc(null);
      } else {
        const err = await res.json();
        setPaymentRecordError(err.error || 'Failed to record payment');
      }
    } catch (err: any) {
      setPaymentRecordError(err.message || 'Network error recording payment');
    } finally {
      setIsRecordingPayment(false);
    }
  };

  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (trimmed) {
      if (!categories.includes(trimmed)) {
        setCategories((prev) => [...prev, trimmed]);
      }
      setNewInventory((prev) => ({ ...prev, category: trimmed }));
      setNewCategoryName('');
      setShowAddCategoryInput(false);
    }
  };

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newInventory),
      });
      if (res.ok) {
        const created = await res.json();
        setInventory([created.item, ...inventory]);
        setShowAddInventoryModal(false);
        setNewInventory({
          name: '',
          item_code: '',
          sku: '',
          brand: '',
          hsn_sac: '998311',
          category: categories[0] || 'Solar Panels',
          unit: 'PCS',
          purchase_price: 0,
          purchase_tax_type: 'Without Tax',
          sale_price: 0,
          sale_tax_type: 'Without Tax',
          tax_slab: 'GST@18%',
          tax_rate: 18,
          stock: 10,
          min_stock: 5,
          is_service: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtractBillFromDocument = async (fileName: string, billContent?: string) => {
    if (!token) return;
    setIsExtractingBill(true);
    try {
      const res = await fetch('/api/inventory/extract-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileName, billContent }),
      });
      if (res.ok) {
        const data = await res.json();
        const extracted = data.extractedItem || {};
        setScannedBillForm({
          name: extracted.name || '',
          item_code: extracted.item_code || extracted.sku || '',
          brand: extracted.brand || '',
          category: extracted.category || 'General',
          hsn_sac: extracted.hsn_sac || '',
          unit: extracted.unit || 'PCS',
          purchase_price: Number(extracted.purchase_price) || 0,
          purchase_tax_type: extracted.purchase_tax_type || 'Without Tax',
          sale_price: Number(extracted.sale_price) || 0,
          sale_tax_type: extracted.sale_tax_type || 'Without Tax',
          tax_slab: extracted.tax_slab || 'GST@18%',
          tax_rate: Number(extracted.tax_rate !== undefined ? extracted.tax_rate : 18),
          stock: Number(extracted.stock) || 10,
          min_stock: Number(extracted.min_stock) || 5,
          supplier_name: extracted.supplier_name || '',
          invoice_no: extracted.invoice_no || '',
          notes: extracted.notes || `Extracted from ${fileName}`,
        });
        setScannedBillMeta({
          fileName,
          supplier_name: extracted.supplier_name,
          invoice_no: extracted.invoice_no,
          invoice_date: extracted.invoice_date,
          confidenceScore: data.confidenceScore || 92,
        });
        setScannedBillMissingFields(data.missingFields || []);
        // Step 2: User MUST review, verify and confirm before adding
        setScanBillStep('verify');
      } else {
        const err = await res.json().catch(() => ({}));
        setAuthError(err.message || 'Failed to extract bill data');
        setTimeout(() => setAuthError(null), 4000);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError('Network error while extracting bill');
      setTimeout(() => setAuthError(null), 4000);
    } finally {
      setIsExtractingBill(false);
    }
  };

  const handleAddNewScanCategory = () => {
    const trimmed = scanNewCategoryName.trim();
    if (trimmed) {
      if (!categories.includes(trimmed)) {
        setCategories((prev) => [...prev, trimmed]);
      }
      setScannedBillForm((prev) => ({ ...prev, category: trimmed }));
      setScanNewCategoryName('');
      setShowScanCategoryInput(false);
    }
  };

  const handleConfirmAddScannedItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!scannedBillForm.name.trim()) {
      setAuthError('Product Name is required before adding to inventory.');
      setTimeout(() => setAuthError(null), 4000);
      return;
    }
    if (Number(scannedBillForm.sale_price) <= 0) {
      setAuthError('Please specify a valid Sale Price greater than ₹0.');
      setTimeout(() => setAuthError(null), 4000);
      return;
    }

    setIsConfirmingBillAdd(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: scannedBillForm.name.trim(),
          sku: scannedBillForm.item_code.trim() || undefined,
          item_code: scannedBillForm.item_code.trim() || undefined,
          brand: scannedBillForm.brand.trim() || undefined,
          hsn_sac: scannedBillForm.hsn_sac.trim() || undefined,
          category: scannedBillForm.category.trim() || 'General',
          unit: scannedBillForm.unit,
          purchase_price: Number(scannedBillForm.purchase_price) || 0,
          purchase_tax_type: scannedBillForm.purchase_tax_type,
          sale_price: Number(scannedBillForm.sale_price) || 0,
          sale_tax_type: scannedBillForm.sale_tax_type,
          tax_slab: scannedBillForm.tax_slab,
          tax_rate: Number(scannedBillForm.tax_rate) || 18,
          stock: Math.max(0, Number(scannedBillForm.stock) || 0),
          min_stock: Math.max(0, Number(scannedBillForm.min_stock) || 5),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newItem = data.item;
        setInventory((prev) => [newItem, ...prev]);
        setShowScanBillModal(false);
        setScanBillStep('upload');
        setAuthSuccess(`🎉 "${newItem.name}" verified & added to Inventory with ${newItem.stock} ${newItem.unit || 'units'}!`);
        setTimeout(() => setAuthSuccess(null), 4000);
      } else {
        const err = await res.json().catch(() => ({}));
        setAuthError(err.message || 'Failed to add item to inventory');
        setTimeout(() => setAuthError(null), 4000);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError('Network error while saving inventory item');
      setTimeout(() => setAuthError(null), 4000);
    } finally {
      setIsConfirmingBillAdd(false);
    }
  };

  const handleOpenAdjustModal = (item: InventoryItem) => {
    setAdjustModalItem(item);
    setAdjustForm({
      type: 'inward',
      quantity: 10,
      inward_price: Number(item.purchase_price) || 0,
      inward_tax_type: item.purchase_tax_type || 'Without Tax',
      valuation_method: 'weighted_avg',
      sale_price: Number(item.sale_price) || 0,
      sale_tax_type: item.sale_tax_type || 'Without Tax',
      reason: 'Supplier Inward / New Batch Stock',
    });
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setEditInventoryForm({
      name: item.name || '',
      item_code: item.item_code || item.sku || '',
      sku: item.sku || item.item_code || '',
      brand: item.brand || '',
      hsn_sac: item.hsn_sac || '998311',
      category: item.category || 'General',
      unit: item.unit || 'PCS',
      purchase_price: Number(item.purchase_price) || 0,
      purchase_tax_type: item.purchase_tax_type || 'Without Tax',
      sale_price: Number(item.sale_price) || 0,
      sale_tax_type: item.sale_tax_type || 'Without Tax',
      tax_slab: item.tax_slab || 'GST@18%',
      tax_rate: item.tax_rate !== undefined ? item.tax_rate : 18,
      stock: Number(item.stock) || 0,
      min_stock: Number(item.min_stock !== undefined ? item.min_stock : 5),
    });
  };

  const handleOpenLabelModal = (item: InventoryItem) => {
    setLabelModalItem(item);
    setLabelCopies(1);
    setLabelFormat('shelf');
  };

  const handleAddNewEditCategory = () => {
    const trimmed = editCategoryName.trim();
    if (trimmed) {
      if (!categories.includes(trimmed)) {
        setCategories((prev) => [...prev, trimmed]);
      }
      setEditInventoryForm((prev) => ({ ...prev, category: trimmed }));
      setEditCategoryName('');
      setShowEditCategoryInput(false);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !adjustModalItem) return;

    // Calculate Indian Standard purchase price according to Ind AS 2 / AS 2 (Valuation of Inventories)
    let targetPurchasePrice = Number(adjustModalItem.purchase_price || 0);
    const currStock = Number(adjustModalItem.stock || 0);
    const addQty = Number(adjustForm.quantity || 0);
    const inwardRate = Number(adjustForm.inward_price || 0);

    if (adjustForm.type === 'inward') {
      if (adjustForm.valuation_method === 'weighted_avg') {
        const totalUnits = currStock + addQty;
        if (totalUnits > 0) {
          const totalCost = (currStock * targetPurchasePrice) + (addQty * inwardRate);
          targetPurchasePrice = Number((totalCost / totalUnits).toFixed(2));
        } else {
          targetPurchasePrice = inwardRate;
        }
      } else if (adjustForm.valuation_method === 'latest') {
        targetPurchasePrice = inwardRate;
      }
    }

    try {
      const res = await fetch(`/api/inventory/${adjustModalItem.id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: adjustForm.type,
          quantity: adjustForm.quantity,
          inward_price: adjustForm.inward_price,
          purchase_price: targetPurchasePrice,
          use_weighted_avg: adjustForm.valuation_method === 'weighted_avg',
          sale_price: adjustForm.sale_price,
          purchase_tax_type: adjustForm.inward_tax_type,
          sale_tax_type: adjustForm.sale_tax_type,
          reason: adjustForm.reason,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInventory((prev) => prev.map((it) => (it.id === adjustModalItem.id ? data.item : it)));
        setAdjustModalItem(null);
        setAuthSuccess(`Stock adjusted successfully for "${adjustModalItem.name}"!`);
        setTimeout(() => setAuthSuccess(null), 4000);
      } else {
        const err = await res.json();
        setAuthError(err.message || 'Failed to adjust stock');
        setTimeout(() => setAuthError(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingItem) return;
    try {
      const res = await fetch(`/api/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editInventoryForm),
      });

      if (res.ok) {
        const data = await res.json();
        setInventory((prev) => prev.map((it) => (it.id === editingItem.id ? data.item : it)));
        setEditingItem(null);
        setAuthSuccess(`Product "${editInventoryForm.name}" updated successfully!`);
        setTimeout(() => setAuthSuccess(null), 4000);
      } else {
        const err = await res.json();
        setAuthError(err.message || 'Failed to update product');
        setTimeout(() => setAuthError(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInventoryItem = (id: number, name: string) => {
    const existing = inventory.find((it) => it.id === id);
    if (existing) {
      setItemToDelete(existing);
    } else {
      setItemToDelete({ id, name, sku: '', sale_price: 0, stock: 0 } as any);
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete || !token) return;
    setIsDeletingItem(true);
    try {
      const res = await fetch(`/api/inventory/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInventory((prev) => prev.filter((it) => it.id !== itemToDelete.id));
        setAuthSuccess(`"${itemToDelete.name}" successfully removed from inventory.`);
        setTimeout(() => setAuthSuccess(null), 3000);
        setItemToDelete(null);
      } else {
        const err = await res.json().catch(() => ({}));
        setAuthError(err.message || 'Failed to delete inventory item');
        setTimeout(() => setAuthError(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setAuthError('Network error while deleting item');
      setTimeout(() => setAuthError(null), 4000);
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleConfirmDeleteSalesDoc = async () => {
    if (!salesDocToDelete || !token) return;
    setIsDeletingSalesDoc(true);
    try {
      const res = await fetch(`/api/sales/${salesDocToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSalesDocs((prev) => prev.filter((d) => d.id !== salesDocToDelete.id));
        setAdminActionSuccess(`✓ ${salesDocToDelete.doc_type} #${salesDocToDelete.doc_number} deleted successfully.`);
        setTimeout(() => setAdminActionSuccess(null), 4000);
        setSalesDocToDelete(null);
      } else {
        const err = await res.json().catch(() => ({}));
        setAdminActionError(err.error || err.message || 'Failed to delete sales document');
        setTimeout(() => setAdminActionError(null), 4000);
      }
    } catch (err: any) {
      setAdminActionError(err.message || 'Network error deleting sales document');
      setTimeout(() => setAdminActionError(null), 4000);
    } finally {
      setIsDeletingSalesDoc(false);
    }
  };

  // SALE SUB-OPTIONS (Organized logically according to B2B Sales Lifecycle)
  const saleOptions = [
    'Quotation',
    'Sale Order',
    'Proforma Invoice',
    'Payment In',
    'Delivery Challan',
    'Invoices',
    'Recurring Invoices',
    'Sale return/Credit Note',
  ];

  // RECEIPT SUB-OPTIONS
  const receiptOptions = [
    'Record Expense : Debit',
    'Record Advance Payment : Credit',
    'Purchase Return/ Dr.Note',
  ];

  // INVENTORY SUB-OPTIONS
  const inventoryOptions = ['Manual', 'Import or scan bill'];

  // Overdue Invoices Detection & Aggregation for Payment Reminders
  const overdueInvoicesList = (salesDocs || []).filter((d) => {
    const isInv = (d?.doc_type || '').toLowerCase() === 'invoices' || (d?.doc_number || '').startsWith('INV');
    if (!isInv) return false;
    const tot = Number(d.amount || 0);
    const pd = Number(d.paid_amount !== undefined ? d.paid_amount : (d.status === 'Paid' ? tot : 0));
    const rem = d.remaining_amount !== undefined ? Number(d.remaining_amount) : (d.status === 'Paid' ? 0 : Math.max(0, tot - pd));
    if (d.status === 'Paid' || rem <= 0) return false;
    if (!d.due_date) return false;
    return new Date(d.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  });
  const totalOverdueAmount = overdueInvoicesList.reduce((acc, d) => {
    const tot = Number(d.amount || 0);
    const pd = Number(d.paid_amount !== undefined ? d.paid_amount : 0);
    const rem = d.remaining_amount !== undefined ? Number(d.remaining_amount) : Math.max(0, tot - pd);
    return acc + rem;
  }, 0);

  // FILTERED LISTS
  const currentSalesDocs = (salesDocs || []).filter((d) => {
    const isDocMatch = (d?.doc_type || '').toLowerCase() === (activeSaleSub || '').toLowerCase();
    if (!isDocMatch) return false;
    if (activeSaleSub === 'Invoices' && showOverdueOnly) {
      const tot = Number(d.amount || 0);
      const pd = Number(d.paid_amount !== undefined ? d.paid_amount : (d.status === 'Paid' ? tot : 0));
      const rem = d.remaining_amount !== undefined ? Number(d.remaining_amount) : (d.status === 'Paid' ? 0 : Math.max(0, tot - pd));
      const isPaid = d.status === 'Paid' || rem <= 0;
      const isOverdue = !isPaid && rem > 0 && d.due_date && new Date(d.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
      return isOverdue;
    }
    return true;
  });

  const currentReceipts = (receipts || []).filter(
    (r) => (r?.receipt_type || (r as any)?.expense_type || '').toLowerCase() === (activeReceiptSub || '').toLowerCase()
  );

  // INVENTORY METRICS & FILTERED LIST
  const allExistingCategories = Array.from(
    new Set([...categories, ...inventory.map((i) => i.category).filter(Boolean)])
  );

  const filteredInventory = inventory.filter((item) => {
    // 1. Search mechanism based on Item Name, Category, Item code, HSN/SAC, Brand
    const query = inventorySearchQuery.trim().toLowerCase();
    if (query) {
      const matchName = (item.name || '').toLowerCase().includes(query);
      const matchCategory = (item.category || '').toLowerCase().includes(query);
      const matchItemCode = (item.item_code || item.sku || '').toLowerCase().includes(query);
      const matchHsn = (item.hsn_sac || '').toLowerCase().includes(query);
      const matchBrand = (item.brand || '').toLowerCase().includes(query);
      if (!matchName && !matchCategory && !matchItemCode && !matchHsn && !matchBrand) {
        return false;
      }
    }

    // 2. Category filter
    if (inventoryCategoryFilter !== 'All' && item.category !== inventoryCategoryFilter) {
      return false;
    }

    // 3. Stock status filter
    const stockVal = Number(item.stock || 0);
    const minStockVal = Number(item.min_stock !== undefined ? item.min_stock : 5);
    if (inventoryStockFilter === 'low_stock') {
      if (stockVal > minStockVal) return false;
    } else if (inventoryStockFilter === 'in_stock') {
      if (stockVal <= minStockVal) return false;
    } else if (inventoryStockFilter === 'out_of_stock') {
      if (stockVal > 0) return false;
    }

    return true;
  });

  // Metric 1: Catalog items & total stock units
  const totalStockUnits = inventory.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);

  // Metric 2: Inventory Cost Value (Ind AS 2 Valuation)
  const totalCostValue = inventory.reduce(
    (sum, item) => sum + ((Number(item.stock) || 0) * (Number(item.purchase_price) || 0)),
    0
  );

  // Metric 3: Retail Sales Value
  const totalRetailValue = inventory.reduce(
    (sum, item) => sum + ((Number(item.stock) || 0) * (Number(item.sale_price) || 0)),
    0
  );

  // Metric 4: Low Stock Alerts Count
  const lowStockCount = inventory.filter(
    (item) => Number(item.stock || 0) <= Number(item.min_stock !== undefined ? item.min_stock : 5)
  ).length;

  const potentialMarginPercent = totalCostValue > 0
    ? (((totalRetailValue - totalCostValue) / totalCostValue) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Company Logo at top: OmniBill */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <span className="font-extrabold text-lg tracking-tighter">OB</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  OmniBill
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  ERP &bull; GST
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                {businessProfile.business_name || 'Enterprise Billing & Financial Analytics'}
              </p>
            </div>
          </div>

          {/* Top Right: Profile Option & Business Setup */}
          {currentUser ? (
            <div className="flex items-center space-x-2.5">
              {/* Business & GST Setup Quick Indicator */}
              <button
                onClick={() => {
                  setActiveSetupTab('business');
                  setShowSetupModal(true);
                }}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer"
                title="Business Details & GST Setup"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-white truncate max-w-[130px]">
                  {businessProfile.business_name || 'Business Setup'}
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-semibold">
                  {businessProfile.gst_number ? 'GST Registered' : 'Setup GST'}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('admin');
                  fetchAdminData();
                }}
                className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  activeNav === 'admin'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Public Schema & Tenant Administration"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>DB Administration</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl hover:bg-slate-800 border border-slate-800 transition text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {currentUser.username.substring(0, 2)}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-tight">
                      @{currentUser.username}
                    </div>
                    <div className="text-[10px] text-indigo-400 truncate max-w-[130px]">
                      {currentUser.designation || 'Business Owner'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <div className="font-bold text-white text-sm">
                        @{currentUser.username}
                      </div>
                      <div className="text-xs text-indigo-300 font-medium">
                        {currentUser.designation || 'Business Owner'}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.contact_email || currentUser.email}</div>
                      <div className="mt-2 text-[11px] bg-slate-950 p-2 rounded-lg text-slate-300">
                        <span className="text-slate-500 block">Business:</span>
                        <strong className="text-indigo-300">{businessProfile.business_name}</strong>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveSetupTab('business');
                          setShowSetupModal(true);
                        }}
                        className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2.5 text-left transition"
                      >
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="font-medium">Business Setup &amp; GST</div>
                          <div className="text-[10px] text-slate-400">Logo, GSTIN, Address, State &amp; Code</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveSetupTab('bank');
                          setShowSetupModal(true);
                        }}
                        className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2.5 text-left transition"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-medium">Bank &amp; Payment Accounts</div>
                          <div className="text-[10px] text-slate-400">Account No, IFSC, UPI ID, Bank QR</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveSetupTab('profile');
                          setShowSetupModal(true);
                        }}
                        className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2.5 text-left transition"
                      >
                        <UserIcon className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="font-medium">User Profile</div>
                          <div className="text-[10px] text-slate-400">UserName, Designation, Emails, Phone</div>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 text-left transition font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAuthMode('login')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Container */}
      {!currentUser ? (
        /* LOGIN / REGISTRATION PORTAL */
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600"></div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {authMode === 'forgot-password'
                  ? 'Reset Password'
                  : authMode === 'login'
                  ? 'Sign in to OmniBill'
                  : 'Register for OmniBill'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'forgot-password'
                  ? 'Verify your account and securely create a new password.'
                  : authMode === 'login'
                  ? 'Access financial analytics, invoicing, and tax engine.'
                  : 'Get started with encrypted credentials & PostgreSQL.'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {authMode === 'forgot-password' ? (
              forgotStep === 1 ? (
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username or Registered Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. teenadev or user@omnibill.com"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-sm transition"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Enter the account username or email to verify against PostgreSQL.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Reset Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  {resetCode && (
                    <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs space-y-1">
                      <div className="text-indigo-300 font-semibold flex items-center justify-between">
                        <span>Verification Code Generated</span>
                        <span className="font-mono bg-indigo-600/40 border border-indigo-500/50 px-2 py-0.5 rounded text-white font-bold tracking-wider">
                          {resetCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Account verified for <strong className="text-white">{forgotIdentifier}</strong>. Set your new password below.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 chars (letters & numbers)"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl pl-3.5 pr-10 py-2.5 text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm New Password <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-sm transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Update Password &amp; Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      &larr; Change User/Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )
            ) : authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. teenadev or user@omnibill.com"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-sm transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot-password');
                        setForgotStep(1);
                        setForgotIdentifier(username || '');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl pl-3.5 pr-10 py-2.5 text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. teenadev"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teena@omnibill.com"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Teena Sharma"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-3 py-2 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-3 py-2 text-sm transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* AUTHENTICATED OMNIBILL WORKSPACE */
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 space-y-1">
              {/* Financial Analytics (Home) */}
              <button
                onClick={() => setActiveNav('analytics')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeNav === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Financial Analytics</span>
              </button>

              {/* Parties or clients */}
              <button
                onClick={() => setActiveNav('parties')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeNav === 'parties'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Parties or clients</span>
                <span className="ml-auto bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {parties.length}
                </span>
              </button>

              {/* Sale (Accordion with sub-options) */}
              <div>
                <button
                  onClick={() => {
                    setActiveNav('sale');
                    setSalesExpanded(!salesExpanded);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'sale'
                      ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-4 h-4 text-violet-400" />
                    <span>Sale</span>
                  </div>
                  {salesExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>

                {salesExpanded && (
                  <div className="ml-5 pl-2 border-l border-slate-800 my-1 space-y-0.5">
                    {saleOptions.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setActiveNav('sale');
                          setActiveSaleSub(sub);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                          activeNav === 'sale' && activeSaleSub === sub
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Receipt (Accordion with sub-options) */}
              <div>
                <button
                  onClick={() => {
                    setActiveNav('receipt');
                    setReceiptsExpanded(!receiptsExpanded);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'receipt'
                      ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ReceiptText className="w-4 h-4 text-amber-400" />
                    <span>Receipt</span>
                  </div>
                  {receiptsExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>

                {receiptsExpanded && (
                  <div className="ml-5 pl-2 border-l border-slate-800 my-1 space-y-0.5">
                    {receiptOptions.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setActiveNav('receipt');
                          setActiveReceiptSub(sub);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                          activeNav === 'receipt' && activeReceiptSub === sub
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Inventory */}
              <button
                onClick={() => setActiveNav('inventory')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeNav === 'inventory'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span>Inventory</span>
                </div>
                {lowStockCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                    {lowStockCount}
                  </span>
                )}
              </button>

              {/* Template Studio */}
              <button
                onClick={() => setActiveNav('templates')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeNav === 'templates'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4 text-pink-400" />
                <span>Template Studio</span>
              </button>

              {/* Tax Engine set up */}
              <button
                onClick={() => setActiveNav('tax')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeNav === 'tax'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calculator className="w-4 h-4 text-yellow-400" />
                <span>Tax Engine set up</span>
              </button>

              {/* Database & Multi-Tenant Administration */}
              <div className="pt-2.5 mt-2 border-t border-slate-800">
                <div className="px-3.5 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Database &amp; Tenants
                </div>
                <button
                  onClick={() => {
                    setActiveNav('admin');
                    fetchAdminData();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeNav === 'admin'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Tenants &amp; Schemas</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                    {adminTenants.length || 5} Schemas
                  </span>
                </button>
              </div>
            </div>

            {/* Sidebar Footer info */}
            <div className="mt-auto p-4 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
              <div className="font-semibold text-white">OmniBill ERP v2.0</div>
              <div className="text-[10px] text-slate-400">GST Compliance Engine</div>
            </div>
          </aside>

          {/* MAIN WORKSPACE CONTENT */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
            {/* 1. FINANCIAL ANALYTICS (DEFAULT HOME PAGE) */}
            {activeNav === 'analytics' && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Welcome Hero */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Financial Analytics</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time revenue, cashflow, GST collection, and transaction metrics.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => {
                        setActiveNav('sale');
                        setActiveSaleSub('Invoices');
                        setShowAddSaleModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Invoice</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveNav('receipt');
                        setActiveReceiptSub('Record Expense : Debit');
                        setShowAddReceiptModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Expense</span>
                    </button>
                  </div>
                </div>

                {/* Multi-Tenant PostgreSQL Schema Architecture Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Multi-Tenant PostgreSQL Architecture
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Schema: {currentUser.schema_name || `tenant_${currentUser.id}`}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            7 Dedicated Tables
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Tenant data boundary: isolated inside PostgreSQL schema <code className="text-emerald-300 font-mono font-semibold">{currentUser.schema_name || `tenant_${currentUser.id}`}</code> with private tables for parties, sales documents, receipts, inventory, templates, and tax engine.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveSetupTab('business');
                        setShowSetupModal(true);
                      }}
                      className="shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center space-x-1.5 transition self-start md:self-auto cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Business &amp; GST Setup</span>
                    </button>
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Total Revenue</span>
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      ₹{analyticsData?.totalRevenue?.toLocaleString('en-IN') || '2,38,730'}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      +18.4% vs previous month
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Outstanding Receivables</span>
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-300 mt-2">
                      ₹{analyticsData?.receivables?.toLocaleString('en-IN') || '1,47,500'}
                    </div>
                    <span className="text-[10px] text-amber-400/80 font-medium">
                      Awaiting payment collection
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Total Expenses (Debit)</span>
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                        <ArrowDownRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-rose-300 mt-2">
                      ₹{analyticsData?.totalExpenses?.toLocaleString('en-IN') || '77,000'}
                    </div>
                    <span className="text-[10px] text-slate-400">Operational &amp; procurement</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Net Profit Margin</span>
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-indigo-300 mt-2">
                      {analyticsData?.profitMargin || '67.7%'}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Net: ₹{analyticsData?.netProfit?.toLocaleString('en-IN') || '1,61,730'}
                    </span>
                  </div>
                </div>

                {/* Second Row: Monthly Trends & GST Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue vs Expenses Visualization */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">Monthly Cash Flow Breakdown</div>
                      <span className="text-xs text-slate-400 font-mono">FY 2026-27</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Q1 Sales (Invoiced)</span>
                          <span className="text-white font-mono font-semibold">₹2,38,730</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-500 w-3/4"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Operating Expenses (Debit)</span>
                          <span className="text-rose-300 font-mono font-semibold">₹77,000</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                          <div className="h-full bg-rose-500 w-1/4"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">GST Collected (Output Tax)</span>
                          <span className="text-cyan-300 font-mono font-semibold">₹31,230</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                          <div className="h-full bg-cyan-500 w-1/5"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Current Inventory Asset Value</span>
                          <span className="text-indigo-300 font-mono font-semibold">₹8,54,000</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                          <div className="h-full bg-indigo-500 w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GST & Tax Engine Status */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>GST Compliance Overview</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                        Active
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Registered GSTIN</span>
                        <span className="font-mono text-indigo-300 font-bold">
                          {businessProfile.gst_number || '27AABCO1234F1Z5'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Output GST Collected</span>
                        <span className="font-mono text-emerald-300 font-bold">
                          ₹{analyticsData?.taxCollected?.toLocaleString('en-IN') || '31,230'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Filing Frequency</span>
                        <span className="text-slate-200 font-medium">Monthly (GSTR-1 &amp; GSTR-3B)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Invoices Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">Recent Invoices &amp; Billing Documents</div>
                    <button
                      onClick={() => {
                        setActiveNav('sale');
                        setActiveSaleSub('Invoices');
                      }}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      View All Sales &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3">Doc #</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Client / Party</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {salesDocs.slice(0, 5).map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-mono font-medium text-indigo-300">{doc.doc_number}</td>
                            <td className="p-3 text-slate-300">{doc.doc_type}</td>
                            <td className="p-3 font-semibold text-white">{doc.party_name}</td>
                            <td className="p-3 text-slate-400">
                              {new Date(doc.date).toLocaleDateString()}
                            </td>
                            <td className="p-3 font-mono font-bold text-white">
                              ₹{Number(doc.amount).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  doc.status === 'Paid'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}
                              >
                                {doc.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PARTIES OR CLIENTS */}
            {activeNav === 'parties' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Parties or clients</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Manage customers, suppliers, GSTIN identification, and ledger balances.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddPartyModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Party</span>
                  </button>
                </div>

                {/* Parties Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Client / Company Name</th>
                          <th className="p-3.5">Status &amp; Tier</th>
                          <th className="p-3.5">Tax ID / GSTIN</th>
                          <th className="p-3.5">Contact &amp; Phone</th>
                          <th className="p-3.5">Billing Address</th>
                          <th className="p-3.5">Ledger / Credit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {parties.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/40">
                            <td className="p-3.5">
                              <div className="font-bold text-white">{p.name}</div>
                              {p.contact_person && (
                                <div className="text-[11px] text-slate-400 font-normal">
                                  {p.contact_person}
                                  {p.contact_title ? ` • ${p.contact_title}` : ''}
                                </div>
                              )}
                              {p.industry && (
                                <div className="text-[10px] text-indigo-400/80 font-normal mt-0.5">
                                  {p.industry}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="flex flex-col space-y-1">
                                <span
                                  className={`inline-block w-fit px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    p.type === 'Active Client' || p.type === 'VIP Partner'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : p.type === 'Prospective Lead'
                                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                      : p.type === 'Customer'
                                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}
                                >
                                  {p.type || 'Active Client'}
                                </span>
                                <span
                                  className={`inline-flex items-center space-x-1 w-fit px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase border ${
                                    p.customer_type === 'B2C' || (!p.gstin && p.customer_type !== 'B2B')
                                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                                  }`}
                                >
                                  <span>{p.customer_type || (p.gstin ? 'B2B' : 'B2C')}</span>
                                  <span className="text-[8px] font-normal lowercase opacity-80">
                                    {p.customer_type === 'B2C' || (!p.gstin && p.customer_type !== 'B2B') ? 'consumer' : 'business'}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-slate-300">
                              {p.gstin ? (
                                <div className="text-white font-semibold flex items-center space-x-1">
                                  <span>{p.gstin}</span>
                                </div>
                              ) : (
                                <div className="text-slate-500 italic text-[11px] font-sans">
                                  Not specified (B2C)
                                </div>
                              )}
                              {p.currency && (
                                <div className="text-[10px] text-slate-500">{p.currency.split('–')[0]}</div>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-300">
                              <div className="font-mono text-xs">{p.phone || '-'}</div>
                              <div className="text-[11px] text-slate-400">{p.email || '-'}</div>
                              {p.mobile_urgent && (
                                <div className="text-[10px] text-slate-500">Urgent: {p.mobile_urgent}</div>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-400">
                              <div>{p.city ? `${p.city}, ${p.state_region || ''} ${p.country || ''}` : p.address || '-'}</div>
                              {p.address_line1 && p.city && (
                                <div className="text-[10px] text-slate-500 truncate max-w-xs">{p.address_line1}</div>
                              )}
                            </td>
                            <td className="p-3.5 font-mono">
                              <div className={`font-bold ${p.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                ₹{Number(p.balance).toLocaleString('en-IN')}
                              </div>
                              {p.credit_limit ? (
                                <div className="text-[10px] text-slate-500">
                                  Limit: ₹{Number(p.credit_limit).toLocaleString('en-IN')}
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SALE (QUOTATION, INVOICES, PROFORMA, PAYMENT IN, SALE ORDER, DELIVERY CHALLAN, CREDIT NOTE) */}
            {activeNav === 'sale' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      Sale &bull; {activeSaleSub}
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{activeSaleSub}</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Create and manage sales documents, dispatch records, and credit notes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        activeSaleSub === 'Quotation' ||
                        activeSaleSub === 'Sale Order' ||
                        activeSaleSub === 'Proforma Invoice' ||
                        activeSaleSub === 'Delivery Challan'
                      ) {
                        handleOpenCreateSalesDoc(activeSaleSub);
                      } else if (activeSaleSub === 'Invoices') {
                        handleOpenCreateSalesDoc('Invoices');
                      } else if (activeSaleSub === 'Recurring Invoices') {
                        setShowRecurringModal(true);
                      } else {
                        setShowAddSaleModal(true);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create {activeSaleSub}</span>
                  </button>
                </div>

                {/* Sub-tabs pills */}
                <div className="flex flex-wrap gap-2 pb-2">
                  {saleOptions.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveSaleSub(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeSaleSub === sub
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                {/* Payment Reminders Alert Banner (for Invoices past due date) */}
                {activeSaleSub === 'Invoices' && overdueInvoicesList.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>Payment Reminders Active</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                            {overdueInvoicesList.length} Overdue {overdueInvoicesList.length === 1 ? 'Invoice' : 'Invoices'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Total past-due receivables: <strong className="font-mono text-amber-300">₹{totalOverdueAmount.toLocaleString('en-IN')}</strong>. Use the <span className="text-emerald-400 font-semibold">"Send Reminder"</span> button on any overdue row to dispatch instant WhatsApp payment notifications to clients.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center space-x-1.5 ${
                          showOverdueOnly
                            ? 'bg-rose-600 text-white border-rose-500 shadow'
                            : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                        }`}
                      >
                        <Filter className="w-3.5 h-3.5" />
                        <span>{showOverdueOnly ? 'Show All Invoices' : `Filter Overdue Only (${overdueInvoicesList.length})`}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Sales Docs List */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    {activeSaleSub === 'Quotation' ? (
                      /* 1. QUOTATION LIST: Document #, Client, Issue date, Valid Untill, Total Amount, Status, Review & Workflow Actions */
                      <table className="w-full text-left text-xs table-fixed min-w-[980px]">
                        <colgroup>
                          <col className="w-[150px]" /> {/* Document # */}
                          <col className="w-[230px]" /> {/* Client */}
                          <col className="w-[120px]" /> {/* Issue date */}
                          <col className="w-[120px]" /> {/* Valid Untill */}
                          <col className="w-[130px]" /> {/* Total Amount */}
                          <col className="w-[110px]" /> {/* Status */}
                          <col className="w-[180px]" /> {/* Review & Workflow Actions */}
                        </colgroup>
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3.5">Document #</th>
                            <th className="p-3.5">Client</th>
                            <th className="p-3.5">Issue date</th>
                            <th className="p-3.5">Valid Untill</th>
                            <th className="p-3.5">Total Amount</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Review &amp; Workflow Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {currentSalesDocs.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-slate-500">
                                No quotations found. Click "Create Quotation" to generate a price offer.
                              </td>
                            </tr>
                          ) : (
                            currentSalesDocs.map((doc) => {
                              const total = Number(doc.amount || 0);
                              const isConverted = doc.status === 'Converted' || doc.status === 'Invoiced';

                              return (
                                <tr key={doc.id} className="hover:bg-slate-800/40">
                                  {/* 1. Document # (Clickable to View/Print) */}
                                  <td className="p-3.5 font-mono overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={() => setViewingQuotation(doc)}
                                      title={`Click Document ID #${doc.doc_number} to view and print Quotation`}
                                      className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center space-x-1.5 group cursor-pointer transition text-left truncate w-full"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-indigo-400/80 group-hover:text-indigo-200 shrink-0" />
                                      <span className="truncate">{doc.doc_number}</span>
                                    </button>
                                  </td>
                                  {/* 2. Client */}
                                  <td className="p-3.5 font-semibold text-white overflow-hidden">
                                    <span className="truncate block" title={doc.party_name}>
                                      {doc.party_name}
                                    </span>
                                  </td>
                                  {/* 3. Issue date */}
                                  <td className="p-3.5 text-slate-400 overflow-hidden whitespace-nowrap">
                                    {doc.date ? new Date(doc.date).toLocaleDateString() : '-'}
                                  </td>
                                  {/* 4. Valid Untill */}
                                  <td className="p-3.5 text-slate-400 overflow-hidden whitespace-nowrap">
                                    {doc.due_date ? new Date(doc.due_date).toLocaleDateString() : '15 Days'}
                                  </td>
                                  {/* 5. Total Amount */}
                                  <td className="p-3.5 font-mono font-bold text-white overflow-hidden whitespace-nowrap">
                                    ₹{total.toLocaleString('en-IN')}
                                  </td>
                                  {/* 6. Status */}
                                  <td className="p-3.5 overflow-hidden whitespace-nowrap">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                        isConverted
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          : doc.status === 'Sent'
                                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                      }`}
                                    >
                                      {isConverted && <CheckCircle2 className="w-2.5 h-2.5 inline mr-1" />}
                                      {isConverted ? 'Converted' : doc.status || 'Draft'}
                                    </span>
                                  </td>
                                  {/* 7. Review & Workflow Actions: Converted invoice should not be editable and Edit should not be shown at all, just show Invoiced */}
                                  <td className="p-3.5 text-right whitespace-nowrap overflow-hidden">
                                    <div className="flex items-center justify-end space-x-2">
                                      {isConverted ? (
                                        <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold select-none">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                          <span>Invoiced</span>
                                        </span>
                                      ) : (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEditQuotation(doc)}
                                            title="Edit Quotation"
                                            className="px-2.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-800/60 text-[11px] font-semibold flex items-center space-x-1 transition shadow-sm cursor-pointer shrink-0"
                                          >
                                            <Edit2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                            <span>Edit</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setConvertingQuotation(doc)}
                                            title="Convert Quotation to Invoice & sync inventory"
                                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 text-[11px] font-semibold flex items-center space-x-1 transition shadow-sm cursor-pointer shrink-0"
                                          >
                                            <ArrowRightCircle className="w-3.5 h-3.5 shrink-0" />
                                            <span>Convert</span>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    ) : activeSaleSub === 'Invoices' ? (
                      /* 2. INVOICES LIST: Document #, Client, Issue Date, Due Date, Total Amount, Balance Due, Status, Actions */
                      <table className="w-full text-left text-xs table-fixed min-w-[1020px]">
                        <colgroup>
                          <col className="w-[140px]" /> {/* Document # */}
                          <col className="w-[200px]" /> {/* Client */}
                          <col className="w-[110px]" /> {/* Issue Date */}
                          <col className="w-[130px]" /> {/* Due Date */}
                          <col className="w-[120px]" /> {/* Total Amount */}
                          <col className="w-[120px]" /> {/* Balance Due */}
                          <col className="w-[110px]" /> {/* Status */}
                          <col className="w-[210px]" /> {/* Actions */}
                        </colgroup>
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3.5">Document #</th>
                            <th className="p-3.5">Client</th>
                            <th className="p-3.5">Issue Date</th>
                            <th className="p-3.5">Due Date</th>
                            <th className="p-3.5">Total Amount</th>
                            <th className="p-3.5">Balance Due</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {currentSalesDocs.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-500">
                                {showOverdueOnly
                                  ? 'No overdue invoices found. All client receivables are within payment terms!'
                                  : 'No invoices found. Click "Create Invoices" to issue an official GST invoice.'}
                              </td>
                            </tr>
                          ) : (
                            currentSalesDocs.map((doc) => {
                              const total = Number(doc.amount || 0);
                              const paid = Number(doc.paid_amount !== undefined ? doc.paid_amount : (doc.status === 'Paid' ? total : 0));
                              const remaining = doc.remaining_amount !== undefined ? Number(doc.remaining_amount) : (doc.status === 'Paid' ? 0 : Math.max(0, total - paid));
                              const isPaid = doc.status === 'Paid' || remaining <= 0;
                              const isSentUnpaid = !isPaid && (doc.status === 'Sent' || doc.status === 'Unpaid' || doc.status === 'Draft' || remaining === total);

                              // Detect if invoice is past due date with outstanding balance
                              const isOverdue = Boolean(
                                !isPaid &&
                                remaining > 0 &&
                                doc.due_date &&
                                new Date(doc.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                              );
                              const overdueDays = isOverdue && doc.due_date
                                ? Math.max(1, Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(doc.due_date).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)))
                                : 0;

                              return (
                                <tr key={doc.id} className="hover:bg-slate-800/40">
                                  {/* 1. Document # (Clickable to View/Print) */}
                                  <td className="p-3.5 font-mono overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={() => setViewingQuotation(doc)}
                                      title={`Click Document ID #${doc.doc_number} to view and print Invoice`}
                                      className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center space-x-1.5 group cursor-pointer transition text-left truncate w-full"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-indigo-400/80 group-hover:text-indigo-200 shrink-0" />
                                      <span className="truncate">{doc.doc_number}</span>
                                    </button>
                                  </td>
                                  {/* 2. Client */}
                                  <td className="p-3.5 font-semibold text-white overflow-hidden">
                                    <span className="truncate block" title={doc.party_name}>
                                      {doc.party_name}
                                    </span>
                                  </td>
                                  {/* 3. Issue Date */}
                                  <td className="p-3.5 text-slate-400 overflow-hidden whitespace-nowrap">
                                    {doc.date ? new Date(doc.date).toLocaleDateString() : '-'}
                                  </td>
                                  {/* 4. Due Date with Overdue Indicator */}
                                  <td className="p-3.5 text-slate-400 overflow-hidden whitespace-nowrap">
                                    {doc.due_date ? (
                                      <div>
                                        <div className={isOverdue ? 'text-rose-300 font-semibold' : 'text-slate-300'}>
                                          {new Date(doc.due_date).toLocaleDateString()}
                                        </div>
                                        {isOverdue && (
                                          <span className="inline-flex items-center text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 mt-0.5">
                                            ⚠ {overdueDays}d overdue
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-slate-500">Immediate</span>
                                    )}
                                  </td>
                                  {/* 5. Total Amount */}
                                  <td className="p-3.5 font-mono font-bold text-white overflow-hidden whitespace-nowrap">
                                    ₹{total.toLocaleString('en-IN')}
                                  </td>
                                  {/* 6. Balance Due */}
                                  <td className="p-3.5 font-mono overflow-hidden whitespace-nowrap">
                                    {isPaid ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                        ✓ ₹0 (Cleared)
                                      </span>
                                    ) : (
                                      <span className="font-bold text-amber-400">
                                        ₹{remaining.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </td>
                                  {/* 7. Status */}
                                  <td className="p-3.5 overflow-hidden whitespace-nowrap">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                        isPaid
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          : isOverdue
                                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-bold'
                                          : paid > 0 && remaining > 0
                                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                          : doc.status === 'Sent'
                                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                      }`}
                                    >
                                      {isPaid ? 'Paid' : isOverdue ? 'Overdue' : (paid > 0 && remaining > 0 ? 'Partially Paid' : doc.status || 'Sent')}
                                    </span>
                                  </td>
                                  {/* 8. Actions: Send Reminder (for Overdue Invoices) | View | Delete icon (Only for Sent Unpaid) */}
                                  <td className="p-3.5 text-right whitespace-nowrap overflow-hidden">
                                    <div className="flex items-center justify-end space-x-1.5">
                                      {isOverdue && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenWhatsAppReminder(doc)}
                                          title={`Send WhatsApp Payment Reminder to ${doc.party_name} (${overdueDays} days overdue)`}
                                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-700/60 text-[11px] font-semibold flex items-center space-x-1.5 transition shadow-sm cursor-pointer shrink-0"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>Send Reminder</span>
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => setViewingQuotation(doc)}
                                        title="View Invoice"
                                        className="px-2.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-800/60 text-[11px] font-semibold flex items-center space-x-1 transition shadow-sm cursor-pointer shrink-0"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>View</span>
                                      </button>
                                      {isSentUnpaid && (
                                        <button
                                          type="button"
                                          onClick={() => setSalesDocToDelete(doc)}
                                          title="Delete Unpaid Invoice"
                                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 hover:text-white transition shadow-sm cursor-pointer shrink-0"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    ) : activeSaleSub === 'Recurring Invoices' ? (
                      /* 3. RECURRING INVOICES LIST */
                      <table className="w-full text-left text-xs table-fixed min-w-[980px]">
                        <colgroup>
                          <col className="w-[180px]" /> {/* Profile Name */}
                          <col className="w-[200px]" /> {/* Client */}
                          <col className="w-[110px]" /> {/* Frequency */}
                          <col className="w-[110px]" /> {/* Start Date */}
                          <col className="w-[120px]" /> {/* Next Issue Date */}
                          <col className="w-[130px]" /> {/* Total Amount */}
                          <col className="w-[110px]" /> {/* Status */}
                          <col className="w-[150px]" /> {/* Actions */}
                        </colgroup>
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3.5">Subscription Profile</th>
                            <th className="p-3.5">Client</th>
                            <th className="p-3.5">Frequency</th>
                            <th className="p-3.5">Start Date</th>
                            <th className="p-3.5">Next Issue</th>
                            <th className="p-3.5">Amount</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {recurringInvoices.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-500">
                                No recurring invoice schedules active.
                              </td>
                            </tr>
                          ) : (
                            recurringInvoices.map((rec) => (
                              <tr key={rec.id} className="hover:bg-slate-800/40">
                                <td className="p-3.5 font-semibold text-white truncate" title={rec.profile_name}>
                                  {rec.profile_name}
                                </td>
                                <td className="p-3.5 text-slate-300 truncate" title={rec.party_name}>
                                  {rec.party_name}
                                </td>
                                <td className="p-3.5 text-slate-400">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                    {rec.frequency}
                                  </span>
                                </td>
                                <td className="p-3.5 text-slate-400">
                                  {rec.start_date ? new Date(rec.start_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="p-3.5 font-medium text-indigo-400">
                                  {rec.next_issue_date ? new Date(rec.next_issue_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="p-3.5 font-mono font-bold text-white">
                                  ₹{Number(rec.amount || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                    {rec.status || 'Active'}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (!token) return;
                                      try {
                                        const res = await fetch(`/api/recurring-invoices/${rec.id}/generate`, {
                                          method: 'POST',
                                          headers: { Authorization: `Bearer ${token}` },
                                        });
                                        if (res.ok) {
                                          const data = await res.json();
                                          if (data.invoice) {
                                            setSalesDocs((prev) => [data.invoice, ...prev]);
                                            setAdminActionSuccess(`✓ Invoice ${data.invoice.doc_number} generated for ${rec.party_name}!`);
                                            setTimeout(() => setAdminActionSuccess(null), 4000);
                                          }
                                        }
                                      } catch (err: any) {
                                        setAdminActionError('Failed to generate recurring invoice');
                                        setTimeout(() => setAdminActionError(null), 4000);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition shadow-sm cursor-pointer"
                                  >
                                    Generate Now
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    ) : (
                      /* 4. OTHER SALES DOCS (Sale Order, Proforma Invoice, Payment In, Delivery Challan, Credit Note) */
                      <table className="w-full text-left text-xs table-fixed min-w-[1120px]">
                        <colgroup>
                          <col className="w-[140px]" /> {/* Document # */}
                          <col className="w-[180px]" /> {/* Client */}
                          <col className="w-[100px]" /> {/* Date */}
                          <col className="w-[115px]" /> {/* Total Amount */}
                          <col className="w-[115px]" /> {/* Received (Paid) */}
                          <col className="w-[115px]" /> {/* Remaining Due */}
                          <col className="w-[115px]" /> {/* Status */}
                          <col className="w-[180px]" /> {/* Notes */}
                          <col className="w-[230px]" /> {/* Actions */}
                        </colgroup>
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3.5">Document #</th>
                            <th className="p-3.5">Client</th>
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5">Total Amount</th>
                            <th className="p-3.5">Received (Paid)</th>
                            <th className="p-3.5">Remaining Due</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Notes</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {currentSalesDocs.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="p-8 text-center text-slate-500">
                                No records found for {activeSaleSub}. Click "Create {activeSaleSub}" to record one.
                              </td>
                            </tr>
                          ) : (
                            currentSalesDocs.map((doc) => {
                              const total = Number(doc.amount || 0);
                              const paid = Number(doc.paid_amount !== undefined ? doc.paid_amount : (doc.status === 'Paid' ? total : 0));
                              const remaining = doc.remaining_amount !== undefined ? Number(doc.remaining_amount) : (doc.status === 'Paid' ? 0 : Math.max(0, total - paid));
                              const isPaid = doc.status === 'Paid' || remaining <= 0;

                              // Check if Sale Order has already been migrated to Proforma Invoice
                              const isPiGenerated =
                                doc.doc_type === 'Sale Order' && (
                                  doc.status === 'PI Generated' ||
                                  doc.status === 'Converted' ||
                                  Boolean((doc as any).is_pi_generated) ||
                                  salesDocs.some(
                                    (d) =>
                                      (d.doc_type === 'Proforma Invoice' || (d.doc_number && d.doc_number.startsWith('PI-'))) &&
                                      (d.po_number === doc.doc_number ||
                                       d.ref_quote_number === doc.doc_number ||
                                       Number(d.linked_doc_id) === Number(doc.id) ||
                                       (d.notes && d.notes.toLowerCase().includes(doc.doc_number.toLowerCase())))
                                  )
                                );

                              // Check if Proforma or Delivery Challan has already been converted to Invoice
                              const isInvoiceGenerated =
                                (doc.doc_type === 'Proforma Invoice' || doc.doc_type === 'Delivery Challan') && (
                                  doc.status === 'Invoiced' ||
                                  doc.status === 'Converted' ||
                                  salesDocs.some(
                                    (d) =>
                                      d.doc_type === 'Invoices' &&
                                      (d.ref_quote_number === doc.doc_number ||
                                       d.po_number === doc.doc_number ||
                                       d.linked_doc_id === doc.id ||
                                       (d.notes && d.notes.includes(doc.doc_number)))
                                  )
                                );

                              return (
                                <tr key={doc.id} className="hover:bg-slate-800/40">
                                  {/* Clickable Document ID to View and Print */}
                                  <td className="p-3.5 font-mono overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={() => setViewingQuotation(doc)}
                                      title={`Click Document ID #${doc.doc_number} to view and print ${doc.doc_type}`}
                                      className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center space-x-1.5 group cursor-pointer transition text-left truncate w-full"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-indigo-400/80 group-hover:text-indigo-200 shrink-0" />
                                      <span className="truncate">{doc.doc_number}</span>
                                    </button>
                                  </td>
                                  <td className="p-3.5 font-semibold text-white overflow-hidden">
                                    <span className="truncate block" title={doc.party_name}>
                                      {doc.party_name}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-slate-400 overflow-hidden whitespace-nowrap">
                                    {new Date(doc.date).toLocaleDateString()}
                                  </td>
                                  <td className="p-3.5 font-mono font-bold text-white overflow-hidden whitespace-nowrap">
                                    ₹{total.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3.5 font-mono overflow-hidden whitespace-nowrap">
                                    <span className="font-semibold text-emerald-400">
                                      ₹{paid.toLocaleString('en-IN')}
                                    </span>
                                  </td>
                                  <td className="p-3.5 font-mono overflow-hidden whitespace-nowrap">
                                    {isPaid ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                        ✓ Cleared
                                      </span>
                                    ) : (
                                      <span className="font-bold text-amber-400">
                                        ₹{remaining.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3.5 overflow-hidden whitespace-nowrap">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                        doc.doc_type === 'Sale Order' && isPiGenerated
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          : isInvoiceGenerated || doc.status === 'Converted'
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          : isPaid
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          : doc.status === 'Partially Paid' || paid > 0
                                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                          : doc.status === 'Sent'
                                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                      }`}
                                    >
                                      {doc.doc_type === 'Sale Order' && isPiGenerated ? (
                                        <>
                                          <CheckCircle2 className="w-2.5 h-2.5 inline mr-1 text-emerald-400" />
                                          PI Generated
                                        </>
                                      ) : doc.doc_type === 'Proforma Invoice' && isInvoiceGenerated ? (
                                        <>
                                          <CheckCircle2 className="w-2.5 h-2.5 inline mr-1 text-emerald-400" />
                                          Invoiced
                                        </>
                                      ) : isInvoiceGenerated || doc.status === 'Converted' ? (
                                        <>
                                          <CheckCircle2 className="w-2.5 h-2.5 inline mr-1 text-emerald-400" />
                                          Converted
                                        </>
                                      ) : isPaid ? (
                                        'Paid'
                                      ) : paid > 0 && remaining > 0 ? (
                                        'Partially Paid'
                                      ) : (
                                        doc.status
                                      )}
                                    </span>
                                  </td>
                                  {/* Notes Column */}
                                  <td className="p-3.5 text-slate-400 overflow-hidden" title={doc.notes || ''}>
                                    <span className="truncate block" title={doc.notes || ''}>
                                      {doc.notes || '-'}
                                    </span>
                                  </td>
                                  {/* Actions Column */}
                                  <td className="p-3.5 text-right whitespace-nowrap overflow-hidden">
                                    <div className="flex items-center justify-end space-x-2">
                                      {/* Edit Button */}
                                      {!(
                                        (doc.doc_type === 'Sale Order' && isPiGenerated) ||
                                        (doc.doc_type === 'Proforma Invoice' && isInvoiceGenerated)
                                      ) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleOpenEditSalesDoc(doc);
                                          }}
                                          title={`Edit ${doc.doc_type}`}
                                          className="w-[72px] py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-800/60 text-[11px] font-semibold flex items-center justify-center space-x-1 transition shadow-sm cursor-pointer shrink-0"
                                        >
                                          <Edit2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                          <span>Edit</span>
                                        </button>
                                      )}

                                      {/* Logical Workflow Progression Buttons */}
                                      {doc.doc_type === 'Sale Order' && (
                                        isPiGenerated ? (
                                          <span
                                            title="Proforma Invoice has already been generated from this Sale Order"
                                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold select-none shrink-0"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <span>PI Generated</span>
                                          </span>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => setMigratingSaleOrder(doc)}
                                            title="Generate Proforma Invoice from Sale Order"
                                            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-[11px] font-semibold flex items-center space-x-1 transition shadow-sm cursor-pointer shrink-0"
                                          >
                                            <ArrowRightCircle className="w-3.5 h-3.5" />
                                            <span>To Proforma</span>
                                          </button>
                                        )
                                      )}

                                      {doc.doc_type === 'Proforma Invoice' && (
                                        isInvoiceGenerated ? (
                                          <span
                                            title="Tax Invoice has already been generated from this Proforma Invoice"
                                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold select-none shrink-0"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <span>Invoiced</span>
                                          </span>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setConvertingQuotation(doc);
                                            }}
                                            title="Convert Proforma to Official Tax Invoice"
                                            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 text-[11px] font-semibold flex items-center space-x-1 transition shadow-sm cursor-pointer shrink-0"
                                          >
                                            <ArrowRightCircle className="w-3.5 h-3.5" />
                                            <span>To Invoice</span>
                                          </button>
                                        )
                                      )}

                                      {doc.doc_type === 'Delivery Challan' && (
                                        isInvoiceGenerated ? (
                                          <span
                                            title="Tax Invoice has already been generated for this Delivery Challan"
                                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold select-none shrink-0"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <span>Invoiced</span>
                                          </span>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setConvertingQuotation(doc);
                                            }}
                                            title="Generate Tax Invoice for delivered goods"
                                            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 text-[11px] font-semibold flex items-center space-x-1 transition shadow-sm cursor-pointer shrink-0"
                                          >
                                            <ArrowRightCircle className="w-3.5 h-3.5" />
                                            <span>To Invoice</span>
                                          </button>
                                        )
                                      )}


                                      {/* Record Payment Button */}
                                      {doc.doc_type === 'Invoices' && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenRecordPayment(doc)}
                                          title={isPaid ? 'View Payment History (Fully Paid)' : 'Record payment & sync remaining balance'}
                                          className={`w-[136px] py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition shadow-sm cursor-pointer shrink-0 ${
                                            isPaid
                                              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                                              : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 shadow-emerald-950/30'
                                          }`}
                                        >
                                          <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                                          <span className="truncate">{isPaid ? 'Payments' : 'Record Payment'}</span>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. RECEIPT (EXPENSE DEBIT, ADVANCE PAYMENT CREDIT, PURCHASE RETURN DR NOTE) */}
            {activeNav === 'receipt' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      Receipt &bull; {activeReceiptSub}
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{activeReceiptSub}</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Log debits, advances, and supplier debit notes.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddReceiptModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Entry</span>
                  </button>
                </div>

                {/* Sub-tabs pills */}
                <div className="flex flex-wrap gap-2 pb-2">
                  {receiptOptions.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveReceiptSub(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeReceiptSub === sub
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                {/* Receipts Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Reference #</th>
                          <th className="p-3.5">Party / Beneficiary</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Payment Mode</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {currentReceipts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500">
                              No records found for {activeReceiptSub}.
                            </td>
                          </tr>
                        ) : (
                          currentReceipts.map((rec) => (
                            <tr key={rec.id} className="hover:bg-slate-800/40">
                              <td className="p-3.5 font-mono font-bold text-amber-300">
                                {rec.ref_number}
                              </td>
                              <td className="p-3.5 font-semibold text-white">{rec.party_name}</td>
                              <td className="p-3.5 text-slate-300">{rec.category}</td>
                              <td className="p-3.5 text-slate-400">
                                {new Date(rec.date).toLocaleDateString()}
                              </td>
                              <td className="p-3.5 text-slate-300">{rec.payment_mode}</td>
                              <td className="p-3.5 font-mono font-bold text-rose-300">
                                ₹{Number(rec.amount).toLocaleString('en-IN')}
                              </td>
                              <td className="p-3.5 text-slate-400">{rec.notes || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. INVENTORY & STOCK CATALOG */}
            {activeNav === 'inventory' && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with Top Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>Inventory &bull; Real-Time Catalog</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Inventory &amp; Stock Catalog</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Stock valuation (Ind AS 2), multi-category SKU tracking, HSN/SAC codes, barcode labeling, and stock adjustments.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowAddInventoryModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Item Manually</span>
                    </button>
                    <button
                      onClick={() => setShowScanBillModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-cyan-600/30 transition"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Scan / Import Bill</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Metric Cards: Catalog Items, Inventory Cost Value, Retail Sales Value, Low Stock Alerts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Catalog Items */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Catalog Items</span>
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white tracking-tight">{inventory.length}</span>
                      <span className="text-xs text-slate-400 font-medium">SKUs</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Total Holding: <span className="text-slate-300 font-semibold">{totalStockUnits.toLocaleString('en-IN')} units</span>
                    </div>
                  </div>

                  {/* 2. Inventory Cost Value */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Inventory Cost Value</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Wallet className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-emerald-400 tracking-tight">₹{totalCostValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Valuation: <span className="text-emerald-300/80 font-medium">Ind AS 2 Weighted Inward Cost</span>
                    </div>
                  </div>

                  {/* 3. Retail Sales Value */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Retail Sales Value</span>
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-cyan-400 tracking-tight">₹{totalRetailValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Potential Margin: <span className="text-cyan-300/80 font-semibold">{potentialMarginPercent}% (₹{(totalRetailValue - totalCostValue).toLocaleString('en-IN')})</span>
                    </div>
                  </div>

                  {/* 4. Low Stock Alerts */}
                  <div
                    onClick={() => setInventoryStockFilter(inventoryStockFilter === 'low_stock' ? 'all' : 'low_stock')}
                    className={`bg-slate-900 border rounded-2xl p-4 relative overflow-hidden shadow-sm cursor-pointer transition ${
                      lowStockCount > 0
                        ? 'border-rose-500/40 hover:border-rose-500/70 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Low Stock Alerts</span>
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          lowStockCount > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className={`text-2xl font-bold tracking-tight ${lowStockCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {lowStockCount}
                      </span>
                      <span className="text-xs text-slate-400">items below minimum</span>
                    </div>
                    <div className="mt-1 text-[11px] flex items-center justify-between">
                      <span className="text-slate-500">
                        {lowStockCount > 0 ? 'Action required' : 'All stock levels healthy'}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-semibold underline">
                        {inventoryStockFilter === 'low_stock' ? 'Show All Items' : 'Filter Alert Items'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search & Filter Bar: Item Name, Category, Item Code, HSN/SAC */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inventorySearchQuery}
                      onChange={(e) => setInventorySearchQuery(e.target.value)}
                      placeholder="Search by Item Name, Category, Item Code, HSN/SAC, Brand..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-10 pr-9 py-2 text-xs placeholder:text-slate-500 transition"
                    />
                    {inventorySearchQuery && (
                      <button
                        onClick={() => setInventorySearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category Filter */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>Category:</span>
                      <select
                        value={inventoryCategoryFilter}
                        onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:border-indigo-500"
                      >
                        <option value="All">All Categories ({inventory.length})</option>
                        {allExistingCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Stock Status Filter */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>Stock:</span>
                      <select
                        value={inventoryStockFilter}
                        onChange={(e) => setInventoryStockFilter(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:border-indigo-500"
                      >
                        <option value="all">All Items</option>
                        <option value="low_stock">⚠️ Low Stock ({lowStockCount})</option>
                        <option value="in_stock">In Stock ({inventory.filter((i) => (i.stock || 0) > (i.min_stock !== undefined ? i.min_stock : 5)).length})</option>
                        <option value="out_of_stock">Out of Stock ({inventory.filter((i) => (i.stock || 0) <= 0).length})</option>
                      </select>
                    </div>

                    {(inventorySearchQuery || inventoryCategoryFilter !== 'All' || inventoryStockFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setInventorySearchQuery('');
                          setInventoryCategoryFilter('All');
                          setInventoryStockFilter('all');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Results Counter */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <div>
                    Showing <span className="font-semibold text-white">{filteredInventory.length}</span> of{' '}
                    <span className="font-semibold text-white">{inventory.length}</span> products
                  </div>
                  {inventorySearchQuery && (
                    <div className="text-[11px] text-cyan-400">
                      Search results for &ldquo;{inventorySearchQuery}&rdquo;
                    </div>
                  )}
                </div>

                {/* Inventory Items Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Item Name</th>
                          <th className="p-3.5">Item Code</th>
                          <th className="p-3.5">HSN/SAC</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Stock</th>
                          <th className="p-3.5">Purchase Price</th>
                          <th className="p-3.5">Sale Price</th>
                          <th className="p-3.5">Tax Slab</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredInventory.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400">
                              <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                              <div className="font-semibold text-white">No inventory items found</div>
                              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                {inventorySearchQuery || inventoryCategoryFilter !== 'All' || inventoryStockFilter !== 'all'
                                  ? 'Try broadening your search keywords or resetting active filters.'
                                  : 'No items currently in catalog. Click "+ Add Item Manually" or "Scan / Import Bill" to get started.'}
                              </p>
                              {(inventorySearchQuery || inventoryCategoryFilter !== 'All' || inventoryStockFilter !== 'all') && (
                                <button
                                  onClick={() => {
                                    setInventorySearchQuery('');
                                    setInventoryCategoryFilter('All');
                                    setInventoryStockFilter('all');
                                  }}
                                  className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                                >
                                  <RefreshCw className="w-3 h-3" /> Reset Filters
                                </button>
                              )}
                            </td>
                          </tr>
                        ) : (
                          filteredInventory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-800/40 transition">
                              <td className="p-3.5">
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                </div>
                                {item.brand && (
                                  <div className="text-[11px] text-slate-400 font-normal">Brand: {item.brand}</div>
                                )}
                              </td>
                              <td className="p-3.5 font-mono text-slate-300 font-medium">
                                {item.item_code || item.sku || '-'}
                              </td>
                              <td className="p-3.5 font-mono text-indigo-300">{item.hsn_sac}</td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
                                  {item.category}
                                </span>
                              </td>
                              <td className="p-3.5 font-mono font-semibold">
                                {item.is_service ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                                    <Wrench className="w-3 h-3 text-amber-400" />
                                    <span>Service / Labour</span>
                                  </span>
                                ) : (
                                  <span
                                    className={`px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 ${
                                      item.stock <= (item.min_stock !== undefined ? item.min_stock : 5)
                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    }`}
                                  >
                                    {item.stock <= (item.min_stock !== undefined ? item.min_stock : 5) && (
                                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                                    )}
                                    <span>
                                      {item.stock} {item.unit || 'PCS'}
                                    </span>
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 font-mono text-slate-300">
                                <div>₹{Number(item.purchase_price).toLocaleString('en-IN')}</div>
                                <div className="text-[10px] text-slate-500">{item.purchase_tax_type || 'Without Tax'}</div>
                              </td>
                              <td className="p-3.5 font-mono font-bold text-white">
                                <div>₹{Number(item.sale_price).toLocaleString('en-IN')}</div>
                                <div className="text-[10px] text-indigo-400 font-normal">{item.sale_tax_type || 'Without Tax'}</div>
                              </td>
                              <td className="p-3.5 font-mono text-cyan-300">
                                <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-[11px] text-cyan-300">
                                  {item.tax_slab || `${item.tax_rate}%`}
                                </span>
                              </td>
                              <td className="p-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-1.5">
                                  {/* 1. ADJUST BUTTON */}
                                  <button
                                    onClick={() => handleOpenAdjustModal(item)}
                                    title="Adjust Stock & Price (Ind AS 2 Valuation)"
                                    className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 hover:text-white text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                                  >
                                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Adjust</span>
                                  </button>

                                  {/* 2. EDIT BUTTON */}
                                  <button
                                    onClick={() => handleOpenEditModal(item)}
                                    title="Edit Product Details"
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Edit</span>
                                  </button>

                                   {/* 3. LABEL BUTTON */}
                                  <button
                                    onClick={() => handleOpenLabelModal(item)}
                                    title="Print Barcode & Shelf Label"
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-700/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                                  >
                                    <Barcode className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Label</span>
                                  </button>

                                  {/* 4. DELETE BUTTON */}
                                  <button
                                    onClick={() => setItemToDelete(item)}
                                    title="Delete Inventory Item"
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 hover:text-white text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. TEMPLATE STUDIO */}
            {activeNav === 'templates' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="pb-4 border-b border-slate-800">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Template Studio</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize invoice headers, GST layouts, color themes, and print formats.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Settings Panel */}
                  <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Invoice Template Theme
                      </label>
                      <select
                        value={templates.theme}
                        onChange={(e) => setTemplates({ ...templates, theme: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs"
                      >
                        <option value="Modern Pro">Modern Pro (Clean, Corporate)</option>
                        <option value="Classic GST">Classic GST (Standard Tax Format)</option>
                        <option value="Minimalist Blue">Minimalist Blue (Tech &amp; Freelance)</option>
                        <option value="Executive Ledger">Executive Ledger (Formal Audit)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Theme Primary Color
                      </label>
                      <div className="flex space-x-3">
                        {['#4f46e5', '#059669', '#d97706', '#dc2626', '#0284c7', '#7c3aed'].map(
                          (c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setTemplates({ ...templates, primary_color: c })}
                              style={{ backgroundColor: c }}
                              className={`w-7 h-7 rounded-full border-2 transition ${
                                templates.primary_color === c ? 'border-white scale-110' : 'border-transparent'
                              }`}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={templates.show_logo}
                          onChange={(e) => setTemplates({ ...templates, show_logo: e.target.checked })}
                          className="rounded border-slate-700 text-indigo-600"
                        />
                        <span>Display OmniBill Header Logo</span>
                      </label>

                      <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={templates.show_qr}
                          onChange={(e) => setTemplates({ ...templates, show_qr: e.target.checked })}
                          className="rounded border-slate-700 text-indigo-600"
                        />
                        <span>Include UPI QR Code on Printed Invoice</span>
                      </label>

                      <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={templates.show_bank_details}
                          onChange={(e) =>
                            setTemplates({ ...templates, show_bank_details: e.target.checked })
                          }
                          className="rounded border-slate-700 text-indigo-600"
                        />
                        <span>Print Bank Account &amp; IFSC Details</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Terms &amp; Conditions / Payment Policy
                      </label>
                      <textarea
                        rows={3}
                        value={templates.terms_conditions}
                        onChange={(e) =>
                          setTemplates({ ...templates, terms_conditions: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs"
                      />
                    </div>
                  </div>

                  {/* Live Template Preview */}
                  <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-6">
                      <div>
                        {templates.show_logo && (
                          <div className="flex items-center space-x-2.5 mb-2">
                            {businessProfile.logo_url ? (
                              <img
                                src={businessProfile.logo_url}
                                alt="Logo"
                                className="h-10 max-w-[130px] object-contain rounded"
                              />
                            ) : (
                              <div
                                style={{ backgroundColor: templates.primary_color }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                              >
                                OB
                              </div>
                            )}
                            <span className="font-extrabold text-lg text-slate-900">
                              {businessProfile.business_name || 'OmniBill'}
                            </span>
                          </div>
                        )}
                        <h2 className="text-xl font-bold">{businessProfile.business_name}</h2>
                        <div className="text-xs text-slate-600">{businessProfile.address}</div>
                        <div className="text-xs text-slate-600 font-mono">
                          GSTIN: {businessProfile.gst_number}
                        </div>
                      </div>

                      <div className="text-right">
                        <h3 className="text-2xl font-black uppercase tracking-wider text-slate-800">
                          TAX INVOICE
                        </h3>
                        <div className="text-xs text-slate-600 font-mono mt-1"># INV-2026-0042</div>
                        <div className="text-xs text-slate-600">Date: {new Date().toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Bill To */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">
                          Billed To:
                        </span>
                        <div className="font-bold text-slate-900 text-sm">Zenith Logistics LLP</div>
                        <div className="text-slate-600">Whitefield Tech Park, Bangalore</div>
                        <div className="text-slate-600 font-mono">GSTIN: 29BBBCB2222B2Z2</div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">
                          Payment Due:
                        </span>
                        <div className="font-semibold text-slate-900">Within 15 Days</div>
                        <div className="text-slate-600">State: Karnataka (29)</div>
                      </div>
                    </div>

                    {/* Items table */}
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr
                          style={{ backgroundColor: templates.primary_color }}
                          className="text-white"
                        >
                          <th className="p-2 rounded-l">Item Description</th>
                          <th className="p-2">HSN/SAC</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Rate</th>
                          <th className="p-2">GST</th>
                          <th className="p-2 text-right rounded-r">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-800">
                        <tr>
                          <td className="p-2 font-medium">Cloud Infrastructure Billing Q1</td>
                          <td className="p-2 font-mono">997331</td>
                          <td className="p-2">1</td>
                          <td className="p-2 font-mono">₹1,25,000</td>
                          <td className="p-2 font-mono">18%</td>
                          <td className="p-2 text-right font-mono font-bold">₹1,25,000</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Enterprise Security &amp; Backup</td>
                          <td className="p-2 font-mono">998313</td>
                          <td className="p-2">1</td>
                          <td className="p-2 font-mono">₹22,500</td>
                          <td className="p-2 font-mono">18%</td>
                          <td className="p-2 text-right font-mono font-bold">₹22,500</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Summary */}
                    <div className="border-t pt-4 flex justify-between items-start text-xs">
                      <div className="max-w-xs space-y-2">
                        {templates.show_bank_details && (
                          <div className="p-2.5 bg-slate-50 rounded border text-[11px] space-y-1">
                            <span className="font-bold block text-slate-800">Bank Transfer &amp; UPI:</span>
                            <div>Bank: {businessProfile.bank_name}</div>
                            <div>A/C: {businessProfile.bank_account}</div>
                            <div>IFSC: {businessProfile.bank_ifsc}</div>
                            {businessProfile.upi_id && (
                              <div>UPI ID: <span className="font-mono text-indigo-700 font-semibold">{businessProfile.upi_id}</span></div>
                            )}
                          </div>
                        )}
                        {templates.show_qr && (businessProfile.payment_qr_url || businessProfile.upi_id) && (
                          <div className="p-2 bg-slate-50 rounded border flex items-center space-x-2 text-[10px]">
                            {businessProfile.payment_qr_url ? (
                              <img
                                src={businessProfile.payment_qr_url}
                                alt="Payment QR"
                                className="w-12 h-12 object-contain rounded border bg-white"
                              />
                            ) : (
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${businessProfile.upi_id}&pn=${encodeURIComponent(businessProfile.business_name || 'Merchant')}&cu=INR`)}`}
                                alt="UPI QR"
                                className="w-12 h-12 object-contain rounded border bg-white"
                              />
                            )}
                            <div>
                              <div className="font-bold text-slate-800">Scan &amp; Pay via UPI</div>
                              <div className="text-slate-500 font-mono text-[9px]">
                                {businessProfile.upi_id || 'Bank QR'}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 italic">
                          {templates.terms_conditions}
                        </div>
                      </div>

                      <div className="text-right space-y-1 font-mono">
                        <div className="text-slate-600">Subtotal: ₹1,47,500</div>
                        <div className="text-slate-600">CGST (9%): ₹13,275</div>
                        <div className="text-slate-600">SGST (9%): ₹13,275</div>
                        <div
                          style={{ color: templates.primary_color }}
                          className="text-base font-extrabold pt-2 border-t"
                        >
                          Total Due: ₹1,74,050
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. TAX ENGINE SET UP & GST FILING REPORT */}
            {activeNav === 'tax' && (() => {
              // --- GST FILING REPORT (GSTR-1 PREPARATION) AGGREGATION LOGIC ---
              const sellerGstin = (businessProfile.gst_number || '27AABCO1234F1Z5').trim();
              const sellerStateCode =
                sellerGstin.length >= 2 && !isNaN(Number(sellerGstin.slice(0, 2)))
                  ? sellerGstin.slice(0, 2)
                  : businessProfile.state?.match(/\((\d{2})\)/)?.[1] || '27';

              const partyMap = new Map<string, Party>();
              for (const p of parties) {
                if (p.name) partyMap.set(p.name.toLowerCase().trim(), p);
              }

              // Date period filter
              const matchesPeriod = (dateStr?: string) => {
                if (!dateStr || gstFilingPeriod === 'all') return true;
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return true;
                const now = new Date();
                const curYear = now.getFullYear();
                const curMonth = now.getMonth();
                if (gstFilingPeriod === 'current_month') {
                  return d.getFullYear() === curYear && d.getMonth() === curMonth;
                }
                if (gstFilingPeriod === 'prev_month') {
                  const prevM = curMonth === 0 ? 11 : curMonth - 1;
                  const prevY = curMonth === 0 ? curYear - 1 : curYear;
                  return d.getFullYear() === prevY && d.getMonth() === prevM;
                }
                if (gstFilingPeriod === 'q3') {
                  return d.getFullYear() === curYear && d.getMonth() >= 9 && d.getMonth() <= 11;
                }
                if (gstFilingPeriod === 'q2') {
                  return d.getFullYear() === curYear && d.getMonth() >= 6 && d.getMonth() <= 8;
                }
                if (gstFilingPeriod === 'fy26') {
                  return d >= new Date(2026, 3, 1) && d <= new Date(2027, 2, 31, 23, 59, 59);
                }
                return true;
              };

              const statutoryRates = [0, 5, 12, 18, 28];

              interface SlabMetric {
                rate: number;
                label: string;
                description: string;
                outward_count: number;
                outward_taxable: number;
                cgst: number;
                sgst: number;
                igst: number;
                total_outward_tax: number;
                total_outward_gross: number;
                inward_count: number;
                inward_taxable: number;
                inward_itc: number;
                total_inward_gross: number;
                net_liability: number;
              }

              const slabMap = new Map<number, SlabMetric>();
              for (const r of statutoryRates) {
                let desc = 'Standard Goods & Services';
                if (r === 0) desc = 'Exempt / Nil-Rated Goods & Services';
                else if (r === 5) desc = 'Transport, Basic Necessities, Solar Components';
                else if (r === 12) desc = 'Standard Goods, Process Work, Hardware';
                else if (r === 18) desc = 'IT, Software, Electronics, Professional Services';
                else if (r === 28) desc = 'Luxury Goods, High-End Equipment';

                slabMap.set(r, {
                  rate: r,
                  label: `GST@${r}%`,
                  description: desc,
                  outward_count: 0,
                  outward_taxable: 0,
                  cgst: 0,
                  sgst: 0,
                  igst: 0,
                  total_outward_tax: 0,
                  total_outward_gross: 0,
                  inward_count: 0,
                  inward_taxable: 0,
                  inward_itc: 0,
                  total_inward_gross: 0,
                  net_liability: 0,
                });
              }

              const b2bInvoices: any[] = [];
              const b2cLargeInvoices: any[] = [];
              const b2cSmallInvoices: any[] = [];
              const hsnMap = new Map<string, {
                hsn_sac: string;
                desc: string;
                uqc: string;
                qty: number;
                taxable: number;
                rate: number;
                igst: number;
                cgst: number;
                sgst: number;
                total_tax: number;
              }>();

              const drilldownInvoices: any[] = [];

              // Aggregate Outward Sales Invoices
              const invoiceDocs = salesDocs.filter(
                (d) => d.doc_type === 'Invoices' || activeSaleSub === 'Invoices' || d.doc_number.startsWith('INV')
              );

              for (const inv of invoiceDocs) {
                if (!matchesPeriod(inv.date)) continue;

                const party = inv.party_name ? partyMap.get(inv.party_name.toLowerCase().trim()) : null;
                const clientGstin = party?.gstin ? party.gstin.trim() : null;
                const isB2B = Boolean(clientGstin && clientGstin.length === 15);

                if (gstFilterType === 'b2b' && !isB2B) continue;
                if (gstFilterType === 'b2c' && isB2B) continue;

                const clientStateCode =
                  clientGstin && clientGstin.length >= 2 && !isNaN(Number(clientGstin.slice(0, 2)))
                    ? clientGstin.slice(0, 2)
                    : party?.state_region?.match(/\((\d{2})\)/)?.[1] || sellerStateCode;

                const isIntrastate = clientStateCode === sellerStateCode;
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
                    : statutoryRates.reduce((prev, curr) => (Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev));

                  const itemTaxable = Number(it.taxable_value ?? Number(it.qty || 1) * Number(it.rate || 0));
                  const itemTax = Number(it.tax_amount ?? itemTaxable * (snapRate / 100));

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
                  slab.outward_taxable += itemTaxable;
                  slab.cgst += itemCgst;
                  slab.sgst += itemSgst;
                  slab.igst += itemIgst;
                  slab.total_outward_tax += itemTax;
                  slab.total_outward_gross += itemTaxable + itemTax;

                  // Update HSN summary
                  const hsnKey = `${it.hsn_sac || '998311'}_${snapRate}`;
                  const existHsn = hsnMap.get(hsnKey);
                  if (existHsn) {
                    existHsn.qty += Number(it.qty || 1);
                    existHsn.taxable += itemTaxable;
                    existHsn.igst += itemIgst;
                    existHsn.cgst += itemCgst;
                    existHsn.sgst += itemSgst;
                    existHsn.total_tax += itemTax;
                  } else {
                    hsnMap.set(hsnKey, {
                      hsn_sac: it.hsn_sac || '998311',
                      desc: it.name || 'Outward Supply',
                      uqc: it.unit || 'PCS',
                      qty: Number(it.qty || 1),
                      taxable: itemTaxable,
                      rate: snapRate,
                      igst: itemIgst,
                      cgst: itemCgst,
                      sgst: itemSgst,
                      total_tax: itemTax,
                    });
                  }
                }

                const primaryRate = items[0]
                  ? statutoryRates.includes(Number(items[0].tax_rate))
                    ? Number(items[0].tax_rate)
                    : 18
                  : 18;
                slabMap.get(primaryRate)!.outward_count += 1;

                const invRow = {
                  id: inv.id,
                  doc_number: inv.doc_number,
                  date: inv.date,
                  party_name: inv.party_name,
                  client_gstin: clientGstin,
                  place_of_supply: clientStateCode,
                  supply_type: isIntrastate ? 'Intra-State' : 'Inter-State',
                  tax_slab: `GST@${primaryRate}%`,
                  taxable_value: Math.round(invTaxable * 100) / 100,
                  cgst: Math.round(invCgst * 100) / 100,
                  sgst: Math.round(invSgst * 100) / 100,
                  igst: Math.round(invIgst * 100) / 100,
                  total_tax: Math.round(invTax * 100) / 100,
                  gross_amount: Math.round(invoiceTotal * 100) / 100,
                  status: inv.status,
                  gstr1_table: isB2B
                    ? 'Table 4A (B2B)'
                    : !isIntrastate && invoiceTotal > 250000
                    ? 'Table 5A (B2C Large)'
                    : 'Table 7 (B2C Small)',
                };

                drilldownInvoices.push(invRow);

                if (isB2B) {
                  b2bInvoices.push(invRow);
                } else if (!isIntrastate && invoiceTotal > 250000) {
                  b2cLargeInvoices.push(invRow);
                } else {
                  b2cSmallInvoices.push(invRow);
                }
              }

              // Aggregate Inward Expense Receipts
              const drilldownExpenses: any[] = [];
              for (const exp of receipts) {
                if (!matchesPeriod(exp.date)) continue;
                if (gstFilterType === 'b2c') continue;

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
                slab.inward_count += 1;
                slab.inward_taxable += taxable;
                slab.inward_itc += itc;
                slab.total_inward_gross += amt;

                drilldownExpenses.push({
                  id: exp.id,
                  ref_number: exp.ref_number || `EXP-${exp.id}`,
                  date: exp.date,
                  party_name: exp.party_name,
                  category: exp.category,
                  tax_rate: rate,
                  tax_slab: `GST@${rate}%`,
                  taxable_value: taxable,
                  itc_amount: itc,
                  gross_amount: amt,
                  payment_mode: exp.payment_mode,
                  notes: exp.notes,
                });
              }

              // Compute Totals
              let totalOutwardTaxable = 0;
              let totalOutwardTax = 0;
              let totalCgst = 0;
              let totalSgst = 0;
              let totalIgst = 0;
              let totalOutwardGross = 0;
              let totalInwardTaxable = 0;
              let totalInwardItc = 0;
              let totalInwardGross = 0;
              let totalInvoicesCount = 0;
              let totalExpensesCount = 0;

              const slabRows: SlabMetric[] = [];
              for (const r of statutoryRates) {
                const s = slabMap.get(r)!;
                s.outward_taxable = Math.round(s.outward_taxable * 100) / 100;
                s.cgst = Math.round(s.cgst * 100) / 100;
                s.sgst = Math.round(s.sgst * 100) / 100;
                s.igst = Math.round(s.igst * 100) / 100;
                s.total_outward_tax = Math.round(s.total_outward_tax * 100) / 100;
                s.total_outward_gross = Math.round(s.total_outward_gross * 100) / 100;
                s.inward_taxable = Math.round(s.inward_taxable * 100) / 100;
                s.inward_itc = Math.round(s.inward_itc * 100) / 100;
                s.total_inward_gross = Math.round(s.total_inward_gross * 100) / 100;
                s.net_liability = Math.round((s.total_outward_tax - s.inward_itc) * 100) / 100;

                totalOutwardTaxable += s.outward_taxable;
                totalOutwardTax += s.total_outward_tax;
                totalCgst += s.cgst;
                totalSgst += s.sgst;
                totalIgst += s.igst;
                totalOutwardGross += s.total_outward_gross;
                totalInwardTaxable += s.inward_taxable;
                totalInwardItc += s.inward_itc;
                totalInwardGross += s.total_inward_gross;
                totalInvoicesCount += s.outward_count;
                totalExpensesCount += s.inward_count;

                slabRows.push(s);
              }

              const netGstPayable = Math.round((totalOutwardTax - totalInwardItc) * 100) / 100;

              // Filtered drilldown items matching search query
              const filteredDrilldownInvoices = drilldownInvoices.filter((d) => {
                if (!gstSearchQuery.trim()) return true;
                const q = gstSearchQuery.toLowerCase().trim();
                return (
                  d.doc_number.toLowerCase().includes(q) ||
                  d.party_name.toLowerCase().includes(q) ||
                  (d.client_gstin && d.client_gstin.toLowerCase().includes(q)) ||
                  d.tax_slab.toLowerCase().includes(q) ||
                  d.gstr1_table.toLowerCase().includes(q)
                );
              });

              // Export GSTR-1 JSON Handler
              const handleExportGstr1Json = () => {
                const now = new Date();
                const fp = `${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}`;
                const gstr1Payload = {
                  gstin: sellerGstin,
                  fp,
                  cur_gt: Math.round(totalOutwardGross),
                  b2b: b2bInvoices.map((inv) => ({
                    ctin: inv.client_gstin,
                    inv: [
                      {
                        inum: inv.doc_number,
                        idt: inv.date ? inv.date.split('T')[0].split('-').reverse().join('-') : '14-10-2026',
                        val: inv.gross_amount,
                        pos: inv.place_of_supply,
                        rchrg: 'N',
                        inv_typ: 'R',
                        itms: [
                          {
                            num: 1,
                            itm_det: {
                              rt: 18,
                              txval: inv.taxable_value,
                              iamt: inv.igst,
                              camt: inv.cgst,
                              samt: inv.sgst,
                              csamt: 0,
                            },
                          },
                        ],
                      },
                    ],
                  })),
                  b2cl: b2cLargeInvoices.map((inv) => ({
                    pos: inv.place_of_supply,
                    inv: [
                      {
                        inum: inv.doc_number,
                        idt: inv.date ? inv.date.split('T')[0].split('-').reverse().join('-') : '14-10-2026',
                        val: inv.gross_amount,
                        itms: [
                          {
                            num: 1,
                            itm_det: {
                              rt: 18,
                              txval: inv.taxable_value,
                              iamt: inv.igst,
                              csamt: 0,
                            },
                          },
                        ],
                      },
                    ],
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
                    data: Array.from(hsnMap.values()).map((h, i) => ({
                      num: i + 1,
                      hsn_sc: h.hsn_sac,
                      desc: h.desc,
                      uqc: h.uqc,
                      qty: h.qty,
                      val: Math.round((h.taxable + h.total_tax) * 100) / 100,
                      txval: Math.round(h.taxable * 100) / 100,
                      iamt: Math.round(h.igst * 100) / 100,
                      camt: Math.round(h.cgst * 100) / 100,
                      samt: Math.round(h.sgst * 100) / 100,
                      csamt: 0,
                    })),
                  },
                };

                const blob = new Blob([JSON.stringify(gstr1Payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `GSTR1_${sellerGstin}_${gstFilingPeriod}_${fp}.json`;
                a.click();
                URL.revokeObjectURL(url);
                setAdminActionSuccess(`✓ Official GSTR-1 JSON generated and downloaded for GSTIN ${sellerGstin}!`);
                setTimeout(() => setAdminActionSuccess(null), 5000);
              };

              // Export CSV Handler
              const handleExportCsv = () => {
                let csvContent = 'data:text/csv;charset=utf-8,';
                csvContent += 'GST FILING REPORT - GSTR-1 TAX SLAB AGGREGATION\\n';
                csvContent += `Business: ${businessProfile.business_name},GSTIN: ${sellerGstin},State: ${businessProfile.state}\\n`;
                csvContent += `Period: ${gstFilingPeriod},Filter: ${gstFilterType}\\n\\n`;

                csvContent += 'STATUTORY TAX SLAB AGGREGATION\\n';
                csvContent += 'Tax Slab,Invoices Count,Taxable Value (INR),CGST (INR),SGST (INR),IGST (INR),Total Outward Tax (INR),Gross Sales (INR),Expense Receipts Count,Expense Taxable (INR),Input Tax Credit (ITC INR),Total Expense Gross (INR),Net GST Liability (INR)\\n';

                for (const s of slabRows) {
                  csvContent += `"${s.label}",${s.outward_count},${s.outward_taxable},${s.cgst},${s.sgst},${s.igst},${s.total_outward_tax},${s.total_outward_gross},${s.inward_count},${s.inward_taxable},${s.inward_itc},${s.total_inward_gross},${s.net_liability}\\n`;
                }

                csvContent += `TOTAL,${totalInvoicesCount},${totalOutwardTaxable},${totalCgst},${totalSgst},${totalIgst},${totalOutwardTax},${totalOutwardGross},${totalExpensesCount},${totalInwardTaxable},${totalInwardItc},${totalInwardGross},${netGstPayable}\\n\\n`;

                csvContent += 'GSTR-1 SALES INVOICE REGISTER\\n';
                csvContent += 'Date,Invoice No,Party Name,Client GSTIN,Place of Supply,Supply Type,GSTR-1 Table,Tax Slab,Taxable Value (INR),CGST (INR),SGST (INR),IGST (INR),Total Tax (INR),Gross Total (INR)\\n';

                for (const inv of drilldownInvoices) {
                  csvContent += `"${inv.date ? inv.date.split('T')[0] : ''}","${inv.doc_number}","${inv.party_name}","${inv.client_gstin || 'Unregistered'}","${inv.place_of_supply}","${inv.supply_type}","${inv.gstr1_table}","${inv.tax_slab}",${inv.taxable_value},${inv.cgst},${inv.sgst},${inv.igst},${inv.total_tax},${inv.gross_amount}\\n`;
                }

                const encodedUri = encodeURI(csvContent);
                const a = document.createElement('a');
                a.href = encodedUri;
                a.download = `GSTR1_Filing_Report_${sellerGstin}_${gstFilingPeriod}.csv`;
                a.click();
                setAdminActionSuccess(`✓ Tax Slab Aggregation and Invoice register exported to CSV!`);
                setTimeout(() => setAdminActionSuccess(null), 5000);
              };

              // GSTR-3B Calculated Metrics
              const itcCgst = Math.round((totalInwardItc / 2) * 100) / 100;
              const itcSgst = Math.round((totalInwardItc / 2) * 100) / 100;
              const gstr3bIgstPayable = totalIgst;
              const gstr3bCgstPayable = Math.max(0, totalCgst - itcCgst);
              const gstr3bSgstPayable = Math.max(0, totalSgst - itcSgst);
              const gstr3bNetPayableCash = Math.round(Math.max(0, totalOutwardTax - totalInwardItc) * 100) / 100;
              const gstr3bItcSurplus = Math.round(Math.max(0, totalInwardItc - totalOutwardTax) * 100) / 100;
              const itcUtilizationRate = totalOutwardTax > 0 ? Math.min(100, Math.round((totalInwardItc / totalOutwardTax) * 100)) : (totalInwardItc > 0 ? 100 : 0);

              // GSTR-3B JSON Download Handler
              const handleDownloadGstr3bJson = () => {
                const fp = `${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getFullYear()}`;
                const gstr3bPayload = {
                  gstin: sellerGstin,
                  ret_period: fp,
                  filing_type: 'GSTR-3B',
                  period_scope: gstFilingPeriod,
                  sup_details: {
                    osup_det: {
                      txval: totalOutwardTaxable,
                      iamt: totalIgst,
                      camt: totalCgst,
                      samt: totalSgst,
                      csamt: 0,
                    },
                    osup_zero: { txval: slabMap.get(0)?.outward_taxable || 0, iamt: 0, csamt: 0 },
                    osup_nil_exmp: { txval: 0 },
                    isup_rev: { txval: 0, iamt: 0, camt: 0, samt: 0, csamt: 0 },
                    osup_nongst: { txval: 0 },
                  },
                  itc_elg: {
                    itc_avl: [
                      { ty: 'OTH', iamt: 0, camt: itcCgst, samt: itcSgst, csamt: 0 },
                    ],
                    itc_net: {
                      iamt: 0,
                      camt: itcCgst,
                      samt: itcSgst,
                      csamt: 0,
                    },
                  },
                  tax_pmt: {
                    tx_py: [
                      {
                        trans_typ: 1,
                        iamt: gstr3bIgstPayable,
                        camt: gstr3bCgstPayable,
                        samt: gstr3bSgstPayable,
                        csamt: 0,
                      },
                    ],
                  },
                  statutory_slabs: slabRows.map((s) => ({
                    slab: s.label,
                    rate: s.rate,
                    description: s.description,
                    outward_taxable: s.outward_taxable,
                    outward_tax: s.total_outward_tax,
                    inward_taxable: s.inward_taxable,
                    inward_itc: s.inward_itc,
                    net_tax_payable: Math.max(0, s.total_outward_tax - s.inward_itc),
                    itc_surplus: Math.max(0, s.inward_itc - s.total_outward_tax),
                  })),
                };

                const blob = new Blob([JSON.stringify(gstr3bPayload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `GSTR3B_${sellerGstin}_${gstFilingPeriod}_${fp}.json`;
                a.click();
                URL.revokeObjectURL(url);
                setAdminActionSuccess(`✓ Official GSTR-3B JSON generated and downloaded for GSTIN ${sellerGstin}!`);
                setTimeout(() => setAdminActionSuccess(null), 5000);
              };

              // GSTR-3B CSV Export Handler
              const handleExportGstr3bCsv = () => {
                let csvContent = 'data:text/csv;charset=utf-8,';
                csvContent += 'STATUTORY GSTR-3B RETURN FILING SUMMARY\\n';
                csvContent += `Business: ${businessProfile.business_name},GSTIN: ${sellerGstin},State: ${businessProfile.state}\\n`;
                csvContent += `Period: ${gstFilingPeriod}\\n\\n`;
                csvContent += '1. STATUTORY TAX SLABS AGGREGATION & NET TAX PAYABLE\\n';
                csvContent += 'Tax Slab,Description,Outward Taxable (INR),Outward CGST (INR),Outward SGST (INR),Outward IGST (INR),Total Outward Tax (INR),Inward Expense Taxable (INR),Eligible ITC (INR),Net Tax Payable in Cash (INR),ITC Carry Forward (INR),Filing Status\\n';
                for (const s of slabRows) {
                  const netP = Math.max(0, s.total_outward_tax - s.inward_itc);
                  const surp = Math.max(0, s.inward_itc - s.total_outward_tax);
                  const st = netP > 0 ? 'Net Payable' : (surp > 0 ? 'ITC Surplus' : (s.total_outward_tax === 0 ? 'Nil Supply' : 'Balanced'));
                  csvContent += `"${s.label}","${s.description}",${s.outward_taxable},${s.cgst},${s.sgst},${s.igst},${s.total_outward_tax},${s.inward_taxable},${s.inward_itc},${netP},${surp},"${st}"\\n`;
                }
                csvContent += `TOTAL,"All Slabs",${totalOutwardTaxable},${totalCgst},${totalSgst},${totalIgst},${totalOutwardTax},${totalInwardTaxable},${totalInwardItc},${gstr3bNetPayableCash},${gstr3bItcSurplus},"${gstr3bNetPayableCash > 0 ? 'Cash Payable' : 'ITC Surplus'}"\\n\\n`;

                csvContent += '2. GSTR-3B TABLE 6.1 - PAYMENT OF TAX\\n';
                csvContent += 'Tax Head,Tax Payable (INR),Paid Through ITC (INR),Tax Paid in Cash (INR),Interest (INR),Late Fee (INR)\\n';
                csvContent += `Integrated Tax (IGST),${totalIgst},0,${totalIgst},0,0\\n`;
                csvContent += `Central Tax (CGST),${totalCgst},${Math.min(totalCgst, itcCgst)},${Math.max(0, totalCgst - itcCgst)},0,0\\n`;
                csvContent += `State/UT Tax (SGST),${totalSgst},${Math.min(totalSgst, itcSgst)},${Math.max(0, totalSgst - itcSgst)},0,0\\n`;
                csvContent += `TOTAL,${totalOutwardTax},${Math.min(totalOutwardTax, totalInwardItc)},${gstr3bNetPayableCash},0,0\\n`;

                const encodedUri = encodeURI(csvContent);
                const a = document.createElement('a');
                a.href = encodedUri;
                a.download = `GSTR3B_Filing_Summary_${sellerGstin}_${gstFilingPeriod}.csv`;
                a.click();
                setAdminActionSuccess(`✓ Statutory GSTR-3B summary and Tax Slabs exported to CSV!`);
                setTimeout(() => setAdminActionSuccess(null), 5000);
              };

              return (
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Top View Selector Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                          Tax Compliance Engine
                        </span>
                        <span className="text-[10px] text-slate-500">&bull;</span>
                        <span className="text-[11px] font-mono text-emerald-400">
                          GSTIN: {sellerGstin}
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold text-white tracking-tight">Tax Engine &amp; GST Filing</h1>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Statutory Tax Slab aggregation, GSTR-3B outward liability vs Input Tax Credit (ITC), and GSTR-1 preparation.
                      </p>
                    </div>

                    {/* View Switcher Pills */}
                    <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setTaxViewTab('gstr3b')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                          taxViewTab === 'gstr3b'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>GSTR-3B Filing Summary</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxViewTab('report')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                          taxViewTab === 'report'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>GST Filing Report (GSTR-1)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxViewTab('settings')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                          taxViewTab === 'settings'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>GST Slabs &amp; Rules</span>
                      </button>
                    </div>
                  </div>

                  {taxViewTab === 'gstr3b' ? (
                    /* ============================================================== */
                    /* GSTR-3B STATUTORY FILING SUMMARY & NET TAX PAYABLE VIEW        */
                    /* ============================================================== */
                    <div className="space-y-6">
                      {/* Filter & Action Toolbar */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <label className="text-xs font-semibold text-slate-300">Filing Period:</label>
                            <select
                              value={gstFilingPeriod}
                              onChange={(e) => setGstFilingPeriod(e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                            >
                              <option value="all">All Filing Periods (Cumulative)</option>
                              <option value="current_month">Current Month (October 2026)</option>
                              <option value="prev_month">Previous Month (September 2026)</option>
                              <option value="q3">Q3 (Oct &ndash; Dec 2026)</option>
                              <option value="q2">Q2 (Jul &ndash; Sep 2026)</option>
                              <option value="fy26">Financial Year (FY 2026-27)</option>
                            </select>
                          </div>

                          <div className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                            <span>Form GSTR-3B (Monthly Return)</span>
                          </div>
                        </div>

                        {/* Export & Print Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleDownloadGstr3bJson}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
                            title="Download official JSON file for GST Portal return filing"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download GSTR-3B JSON</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleExportGstr3bCsv}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer"
                            title="Export full GSTR-3B tax slab breakdown to CSV"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Export CSV</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer"
                            title="Print GSTR-3B summary statement"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-300" />
                            <span>Print</span>
                          </button>
                        </div>
                      </div>

                      {/* 4 Key Statutory Metric Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Outward Tax Liability */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-400">Total Outward Tax Liability</span>
                            <span className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                              <ArrowUpRight className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="text-2xl font-bold font-mono text-white">
                            ₹{totalOutwardTax.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400 flex flex-wrap gap-1.5 pt-1 border-t border-slate-800">
                            <span className="text-indigo-300 font-mono">CGST: ₹{totalCgst.toLocaleString('en-IN')}</span>
                            <span>&bull;</span>
                            <span className="text-indigo-300 font-mono">SGST: ₹{totalSgst.toLocaleString('en-IN')}</span>
                            {totalIgst > 0 && (
                              <>
                                <span>&bull;</span>
                                <span className="text-purple-300 font-mono">IGST: ₹{totalIgst.toLocaleString('en-IN')}</span>
                              </>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            From ₹{totalOutwardTaxable.toLocaleString('en-IN')} taxable sales across {totalInvoicesCount} invoices
                          </div>
                        </div>

                        {/* 2. Eligible ITC Available */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-400">Eligible Input Tax Credit (ITC)</span>
                            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                              <ArrowDownRight className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="text-2xl font-bold font-mono text-emerald-400">
                            ₹{totalInwardItc.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400 flex flex-wrap gap-1.5 pt-1 border-t border-slate-800">
                            <span className="text-emerald-300 font-mono">CGST: ₹{itcCgst.toLocaleString('en-IN')}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-300 font-mono">SGST: ₹{itcSgst.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            From ₹{totalInwardTaxable.toLocaleString('en-IN')} verified expense receipts ({totalExpensesCount} vouchers)
                          </div>
                        </div>

                        {/* 3. Final Net Tax Payable */}
                        <div className={`border rounded-2xl p-4 space-y-2 relative overflow-hidden ${
                          gstr3bNetPayableCash > 0
                            ? 'bg-rose-950/20 border-rose-500/30'
                            : 'bg-emerald-950/20 border-emerald-500/30'
                        }`}>
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-300">Final Net Tax Payable in Cash</span>
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              gstr3bNetPayableCash > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              <IndianRupee className="w-4 h-4" />
                            </span>
                          </div>
                          <div className={`text-2xl font-bold font-mono ${
                            gstr3bNetPayableCash > 0 ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            ₹{gstr3bNetPayableCash.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] font-medium pt-1 border-t border-slate-800/80">
                            {gstr3bNetPayableCash > 0 ? (
                              <span className="text-rose-300 flex items-center space-x-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Net cash outflow to GST Portal</span>
                              </span>
                            ) : (
                              <span className="text-emerald-300 flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>100% covered by Input Tax Credit (ITC)</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Outward Liability minus Input Tax Credit (Rule 88A)
                          </div>
                        </div>

                        {/* 4. ITC Surplus / Carryforward */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-slate-400">ITC Surplus / Carry Forward</span>
                            <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                              <RefreshCw className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="text-2xl font-bold font-mono text-cyan-400">
                            ₹{gstr3bItcSurplus.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                            <span>ITC Utilization:</span>
                            <span className="font-mono font-bold text-white">{itcUtilizationRate}%</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Available in Electronic Credit Ledger for next period
                          </div>
                        </div>
                      </div>

                      {/* GSTR-3B Sub-view Navigation */}
                      <div className="flex border-b border-slate-800 space-x-2">
                        <button
                          type="button"
                          onClick={() => setGstr3bActiveTab('overview')}
                          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 cursor-pointer ${
                            gstr3bActiveTab === 'overview'
                              ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                              : 'border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Statutory Tax Slabs Summary</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGstr3bActiveTab('tables')}
                          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 cursor-pointer ${
                            gstr3bActiveTab === 'tables'
                              ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                              : 'border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Statutory GSTR-3B Tables (3.1, 4, 6.1)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGstr3bActiveTab('drilldown')}
                          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 cursor-pointer ${
                            gstr3bActiveTab === 'drilldown'
                              ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                              : 'border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Audit Drilldown (Invoices &amp; Expenses)</span>
                        </button>
                      </div>

                      {/* SUB-VIEW 1: STATUTORY TAX SLABS SUMMARY ACROSS ALL SLABS */}
                      {gstr3bActiveTab === 'overview' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                                <span>Statutory Tax Slab Summary &amp; Net Tax Calculation</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                  All 5 Slabs (0%, 5%, 12%, 18%, 28%)
                                </span>
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Aggregated outward tax liability from sales invoices matched against available input tax credit (ITC) from business expenses per slab.
                              </p>
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                <tr>
                                  <th className="p-3">GST Slab</th>
                                  <th className="p-3 min-w-[180px]">Category &amp; Goods / Services</th>
                                  <th className="p-3 text-right">Outward Taxable (₹)</th>
                                  <th className="p-3 text-right">Outward Tax (₹)</th>
                                  <th className="p-3 text-right">Expense Taxable (₹)</th>
                                  <th className="p-3 text-right text-emerald-400">ITC Available (₹)</th>
                                  <th className="p-3 text-right text-rose-300 font-bold">Net Tax Payable (₹)</th>
                                  <th className="p-3 text-right text-cyan-300">ITC Surplus (₹)</th>
                                  <th className="p-3 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                {slabRows.map((s) => {
                                  const netPayable = Math.max(0, s.total_outward_tax - s.inward_itc);
                                  const itcSurplus = Math.max(0, s.inward_itc - s.total_outward_tax);
                                  const status =
                                    netPayable > 0
                                      ? 'Net Payable'
                                      : itcSurplus > 0
                                      ? 'ITC Surplus'
                                      : s.total_outward_tax === 0
                                      ? 'Nil Supply'
                                      : 'Balanced';

                                  return (
                                    <tr key={s.rate} className="hover:bg-slate-800/40">
                                      <td className="p-3">
                                        <div className="font-mono font-bold text-indigo-400">{s.label}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">{s.rate}% Statutory</div>
                                      </td>
                                      <td className="p-3 text-slate-300 max-w-xs">
                                        <div className="font-medium text-white">{s.description}</div>
                                        <div className="text-[10px] text-slate-500">
                                          {s.outward_count} sales invoices &bull; {s.inward_count} expense vouchers
                                        </div>
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-200">
                                        ₹{s.outward_taxable.toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono font-bold text-white">
                                        <div>₹{s.total_outward_tax.toLocaleString('en-IN')}</div>
                                        <div className="text-[9px] text-slate-500 font-normal">
                                          C: {s.cgst} | S: {s.sgst} | I: {s.igst}
                                        </div>
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-300">
                                        ₹{s.inward_taxable.toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                                        ₹{s.inward_itc.toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono font-bold">
                                        <span className={netPayable > 0 ? 'text-rose-400' : 'text-slate-500'}>
                                          ₹{netPayable.toLocaleString('en-IN')}
                                        </span>
                                      </td>
                                      <td className="p-3 text-right font-mono">
                                        <span className={itcSurplus > 0 ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                                          ₹{itcSurplus.toLocaleString('en-IN')}
                                        </span>
                                      </td>
                                      <td className="p-3 text-center">
                                        <span
                                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                            status === 'Net Payable'
                                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                              : status === 'ITC Surplus'
                                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                              : status === 'Balanced'
                                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                              : 'bg-slate-800 text-slate-400 border-slate-700'
                                          }`}
                                        >
                                          {status}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              {/* Summary Footer Row */}
                              <tfoot className="bg-slate-950 font-semibold border-t-2 border-slate-700">
                                <tr>
                                  <td colSpan={2} className="p-3 text-white uppercase text-[11px] tracking-wider">
                                    Total Across All Slabs
                                  </td>
                                  <td className="p-3 text-right font-mono text-slate-200">
                                    ₹{totalOutwardTaxable.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold text-white">
                                    ₹{totalOutwardTax.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono text-slate-300">
                                    ₹{totalInwardTaxable.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                                    ₹{totalInwardItc.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono font-black text-rose-400 text-sm">
                                    ₹{gstr3bNetPayableCash.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold text-cyan-400">
                                    ₹{gstr3bItcSurplus.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="text-[10px] font-bold text-indigo-300">
                                      {gstr3bNetPayableCash > 0 ? 'Cash Payable' : 'ITC Surplus'}
                                    </span>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 2: STATUTORY GSTR-3B RETURN TABLES */}
                      {gstr3bActiveTab === 'tables' && (
                        <div className="space-y-6">
                          {/* Table 3.1: Details of Outward Supplies and Inward Supplies Liable to Reverse Charge */}
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm p-5 space-y-3">
                            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                                3.1
                              </span>
                              <h3 className="text-sm font-bold text-white">
                                Details of Outward Supplies and Inward Supplies liable to reverse charge
                              </h3>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-800">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                  <tr>
                                    <th className="p-3 min-w-[280px]">Nature of Supplies</th>
                                    <th className="p-3 text-right">Total Taxable Value (₹)</th>
                                    <th className="p-3 text-right">Integrated Tax (₹)</th>
                                    <th className="p-3 text-right">Central Tax (₹)</th>
                                    <th className="p-3 text-right">State / UT Tax (₹)</th>
                                    <th className="p-3 text-right">Cess (₹)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-white font-medium">
                                      (a) Outward taxable supplies (other than zero rated, nil rated and exempted)
                                    </td>
                                    <td className="p-3 text-right font-mono text-white">
                                      ₹{totalOutwardTaxable.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-300">
                                      ₹{totalIgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-300">
                                      ₹{totalCgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-300">
                                      ₹{totalSgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-slate-300">
                                      (b) Outward taxable supplies (zero rated / exports)
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-400">
                                      ₹{(slabMap.get(0)?.outward_taxable || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-slate-300">
                                      (c) Other outward supplies (Nil rated, exempted)
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-slate-300">
                                      (d) Inward supplies (liable to reverse charge)
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-slate-300">
                                      (e) Non-GST outward supplies
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                </tbody>
                                <tfoot className="bg-slate-950 font-bold border-t border-slate-700">
                                  <tr>
                                    <td className="p-3 text-white uppercase text-[11px]">Total Outward Liability</td>
                                    <td className="p-3 text-right font-mono text-white">
                                      ₹{totalOutwardTaxable.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-purple-300">
                                      ₹{totalIgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-indigo-300">
                                      ₹{totalCgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-indigo-300">
                                      ₹{totalSgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>

                          {/* Table 4: Eligible Input Tax Credit (ITC) */}
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm p-5 space-y-3">
                            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                4
                              </span>
                              <h3 className="text-sm font-bold text-white">
                                Eligible Input Tax Credit (ITC) Available from Business Expenses
                              </h3>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-800">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                  <tr>
                                    <th className="p-3 min-w-[280px]">Details of ITC</th>
                                    <th className="p-3 text-right">Integrated Tax (₹)</th>
                                    <th className="p-3 text-right">Central Tax (₹)</th>
                                    <th className="p-3 text-right">State / UT Tax (₹)</th>
                                    <th className="p-3 text-right">Cess (₹)</th>
                                    <th className="p-3 text-right text-emerald-400">Total ITC (₹)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                  <tr className="bg-slate-950/40 font-semibold text-slate-300">
                                    <td colSpan={6} className="p-2.5 text-[11px] uppercase tracking-wider text-indigo-400">
                                      (A) ITC Available (whether in full or part)
                                    </td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 pl-6 text-slate-300">(1) Import of goods</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 pl-6 text-slate-300">(2) Import of services</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 pl-6 text-slate-300">(3) Inward supplies liable to reverse charge</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 pl-6 text-slate-300">(4) Inward supplies from ISD</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40 bg-emerald-950/10">
                                    <td className="p-3 pl-6 text-white font-medium">
                                      (5) All other ITC (From verified business expenses &amp; inventory purchases)
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-400">₹0</td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                      ₹{itcCgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                      ₹{itcSgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                                      ₹{totalInwardItc.toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                  <tr className="bg-slate-950 font-bold border-t border-slate-700">
                                    <td className="p-3 text-white uppercase text-[11px]">(C) Net ITC Available (A - B)</td>
                                    <td className="p-3 text-right font-mono text-slate-400">₹0</td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                      ₹{itcCgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                      ₹{itcSgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono font-black text-emerald-400">
                                      ₹{totalInwardItc.toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Table 6.1: Payment of Tax (Cash & ITC offset) */}
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm p-5 space-y-3">
                            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                                6.1
                              </span>
                              <h3 className="text-sm font-bold text-white">
                                Payment of Tax (Tax Payable, Paid through ITC, and Net Tax Paid in Cash)
                              </h3>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-800">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                  <tr>
                                    <th className="p-3 min-w-[200px]">Description</th>
                                    <th className="p-3 text-right">Tax Payable (₹)</th>
                                    <th className="p-3 text-right text-emerald-400">Paid Through ITC (₹)</th>
                                    <th className="p-3 text-right text-rose-300 font-bold">Tax Paid in Cash (₹)</th>
                                    <th className="p-3 text-right">Interest (₹)</th>
                                    <th className="p-3 text-right">Late Fee (₹)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-white font-medium">Integrated Tax (IGST)</td>
                                    <td className="p-3 text-right font-mono text-white">
                                      ₹{totalIgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-emerald-400">₹0</td>
                                    <td className="p-3 text-right font-mono font-bold text-rose-400">
                                      ₹{gstr3bIgstPayable.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-white font-medium">Central Tax (CGST)</td>
                                    <td className="p-3 text-right font-mono text-white">
                                      ₹{totalCgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                      ₹{Math.min(totalCgst, itcCgst).toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono font-bold text-rose-400">
                                      ₹{gstr3bCgstPayable.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                  <tr className="hover:bg-slate-800/40">
                                    <td className="p-3 text-white font-medium">State / UT Tax (SGST)</td>
                                    <td className="p-3 text-right font-mono text-white">
                                      ₹{totalSgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                      ₹{Math.min(totalSgst, itcSgst).toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono font-bold text-rose-400">
                                      ₹{gstr3bSgstPayable.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                </tbody>
                                <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-700">
                                  <tr>
                                    <td className="p-3 text-white uppercase text-[11px]">Total Net Cash Tax Payable</td>
                                    <td className="p-3 text-right font-mono text-white">
                                      ₹{totalOutwardTax.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                      ₹{Math.min(totalOutwardTax, totalInwardItc).toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono font-black text-rose-400 text-sm">
                                      ₹{gstr3bNetPayableCash.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                    <td className="p-3 text-right font-mono text-slate-500">₹0</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 3: AUDIT DRILLDOWN (INVOICES VS EXPENSE RECEIPTS) */}
                      {gstr3bActiveTab === 'drilldown' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left: Invoices (Outward Tax Sources) */}
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                  Outward Tax Sources ({drilldownInvoices.length} Invoices)
                                </h4>
                                <p className="text-[11px] text-slate-400">Sales generating outward tax liability</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-rose-400">
                                ₹{totalOutwardTax.toLocaleString('en-IN')} Tax
                              </span>
                            </div>

                            <div className="max-h-96 overflow-y-auto divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/40">
                              {drilldownInvoices.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-xs">No invoices in this period.</div>
                              ) : (
                                drilldownInvoices.map((inv) => (
                                  <div key={inv.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-900/50">
                                    <div>
                                      <div className="font-semibold text-white flex items-center space-x-1.5">
                                        <span className="font-mono text-indigo-400">{inv.doc_number}</span>
                                        <span>&bull;</span>
                                        <span className="truncate max-w-[140px]">{inv.party_name}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                                        <span>{inv.date ? new Date(inv.date).toLocaleDateString() : '-'}</span>
                                        <span>&bull;</span>
                                        <span className="font-mono text-slate-400">{inv.tax_slab}</span>
                                      </div>
                                    </div>
                                    <div className="text-right font-mono">
                                      <div className="font-bold text-rose-400">₹{inv.total_tax.toLocaleString('en-IN')}</div>
                                      <div className="text-[10px] text-slate-400">Val: ₹{inv.taxable_value.toLocaleString('en-IN')}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Right: Expense Receipts (ITC Sources) */}
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                  ITC Sources ({drilldownExpenses.length} Expense Vouchers)
                                </h4>
                                <p className="text-[11px] text-slate-400">Purchases &amp; business expenses generating ITC</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-emerald-400">
                                ₹{totalInwardItc.toLocaleString('en-IN')} ITC
                              </span>
                            </div>

                            <div className="max-h-96 overflow-y-auto divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/40">
                              {drilldownExpenses.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-xs">No expense receipts in this period.</div>
                              ) : (
                                drilldownExpenses.map((exp) => (
                                  <div key={exp.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-900/50">
                                    <div>
                                      <div className="font-semibold text-white flex items-center space-x-1.5">
                                        <span className="font-mono text-emerald-400">{exp.ref_number}</span>
                                        <span>&bull;</span>
                                        <span className="truncate max-w-[140px]">{exp.party_name}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                                        <span className="capitalize">{exp.category}</span>
                                        <span>&bull;</span>
                                        <span>{exp.date ? new Date(exp.date).toLocaleDateString() : '-'}</span>
                                        <span>&bull;</span>
                                        <span className="font-mono text-slate-400">{exp.tax_slab}</span>
                                      </div>
                                    </div>
                                    <div className="text-right font-mono">
                                      <div className="font-bold text-emerald-400">₹{exp.itc_amount.toLocaleString('en-IN')}</div>
                                      <div className="text-[10px] text-slate-400">Exp: ₹{exp.taxable_value.toLocaleString('en-IN')}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : taxViewTab === 'report' ? (
                    <div className="space-y-6">
                      {/* Filter & Export Toolbar */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Period Selector */}
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <label className="text-xs font-semibold text-slate-300">Period:</label>
                            <select
                              value={gstFilingPeriod}
                              onChange={(e) => setGstFilingPeriod(e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                            >
                              <option value="all">All Filing Periods (Cumulative)</option>
                              <option value="current_month">Current Month (October 2026)</option>
                              <option value="prev_month">Previous Month (September 2026)</option>
                              <option value="q3">Q3 (Oct &ndash; Dec 2026)</option>
                              <option value="q2">Q2 (Jul &ndash; Sep 2026)</option>
                              <option value="fy26">Financial Year (FY 2026-27)</option>
                            </select>
                          </div>

                          {/* Client Supply Filter */}
                          <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <label className="text-xs font-semibold text-slate-300">Client:</label>
                            <select
                              value={gstFilterType}
                              onChange={(e) => setGstFilterType(e.target.value as any)}
                              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                            >
                              <option value="all">All Clients (B2B + B2C)</option>
                              <option value="b2b">B2B Only (With Registered GSTIN)</option>
                              <option value="b2c">B2C Only (Unregistered Customers)</option>
                            </select>
                          </div>
                        </div>

                        {/* Export & Print Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={handleExportGstr1Json}
                            title="Export official JSON for GST Portal upload"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export GSTR-1 JSON</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleExportCsv}
                            title="Export spreadsheet of tax slab aggregation and invoice register"
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Export CSV</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            title="Print this GST Filing Report"
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
                          >
                            <Printer className="w-3.5 h-3.5 text-sky-400" />
                            <span>Print</span>
                          </button>
                        </div>
                      </div>

                      {/* 4 Executive GST Summary KPI Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Outward Taxable Value */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
                          <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider text-[10px]">
                              Total Outward Sales
                            </span>
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-xl font-bold font-mono text-white">
                            ₹{totalOutwardTaxable.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                            <span>{totalInvoicesCount} Invoices</span>
                            <span>&bull;</span>
                            <span className="text-indigo-300 font-mono">Gross: ₹{totalOutwardGross.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* 2. Outward GST Liability */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
                          <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider text-[10px]">
                              Outward GST Liability
                            </span>
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-xl font-bold font-mono text-emerald-400">
                            ₹{totalOutwardTax.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            IGST: ₹{totalIgst.toLocaleString('en-IN')} &bull; CGST+SGST: ₹{(totalCgst + totalSgst).toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* 3. Inward Expenses & ITC */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
                          <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider text-[10px]">
                              Input Tax Credit (ITC)
                            </span>
                            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                              <ArrowDownRight className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-xl font-bold font-mono text-sky-400">
                            ₹{totalInwardItc.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                            <span>{totalExpensesCount} Expense Receipts</span>
                            <span>&bull;</span>
                            <span className="text-sky-300 font-mono">Taxable: ₹{totalInwardTaxable.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* 4. Net GST Payable */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
                          <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider text-[10px]">
                              Net GST Payable
                            </span>
                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                              <Calculator className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-xl font-bold font-mono text-amber-400">
                            ₹{netGstPayable.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Outward GST (&minus;) Inward ITC Claimed
                          </div>
                        </div>
                      </div>

                      {/* Sub-Tabs Navigation for Report Views */}
                      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
                        <button
                          type="button"
                          onClick={() => setGstActiveSubTab('slabs')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                            gstActiveSubTab === 'slabs'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          Tax Slab Aggregation (Statutory Breakdown)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGstActiveSubTab('gstr1_tables')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                            gstActiveSubTab === 'gstr1_tables'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          GSTR-1 Portal Tables (4A B2B &bull; 5A B2CL &bull; 7 B2CS)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGstActiveSubTab('hsn')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                            gstActiveSubTab === 'hsn'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          HSN/SAC Summary (Table 12)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGstActiveSubTab('drilldown')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                            gstActiveSubTab === 'drilldown'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          Detailed Transaction Drilldown ({drilldownInvoices.length + drilldownExpenses.length})
                        </button>
                      </div>

                      {/* SUB-VIEW 1: STATUTORY TAX SLAB AGGREGATION TABLE */}
                      {gstActiveSubTab === 'slabs' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-white">
                                Statutory GST Slab Aggregation (GSTR-1 Preparation)
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Aggregates outward sales invoices and inward expense receipts by statutory tax rate (0%, 5%, 12%, 18%, 28%).
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-indigo-300">
                              Place of Supply Origin: {businessProfile.state}
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                <tr>
                                  <th className="p-3">Tax Slab</th>
                                  <th className="p-3 text-center">Inv Count</th>
                                  <th className="p-3 text-right">Taxable Sales (₹)</th>
                                  <th className="p-3 text-right">CGST (₹)</th>
                                  <th className="p-3 text-right">SGST (₹)</th>
                                  <th className="p-3 text-right">IGST (₹)</th>
                                  <th className="p-3 text-right">Outward GST (₹)</th>
                                  <th className="p-3 text-center">Exp Count</th>
                                  <th className="p-3 text-right">Expense Taxable (₹)</th>
                                  <th className="p-3 text-right">Inward ITC (₹)</th>
                                  <th className="p-3 text-right">Net GST Due (₹)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                {slabRows.map((s) => (
                                  <tr key={s.rate} className="hover:bg-slate-800/40">
                                    <td className="p-3">
                                      <div className="font-bold text-white flex items-center space-x-1.5">
                                        <span>{s.label}</span>
                                        <span className="text-[10px] text-slate-400 font-normal">
                                          ({s.rate}%)
                                        </span>
                                      </div>
                                      <div className="text-[10px] text-slate-500">
                                        {s.description}
                                      </div>
                                    </td>
                                    <td className="p-3 text-center font-mono text-slate-300">
                                      {s.outward_count}
                                    </td>
                                    <td className="p-3 text-right font-mono text-white font-semibold">
                                      ₹{s.outward_taxable.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-300">
                                      ₹{s.cgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-300">
                                      ₹{s.sgst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-300">
                                      ₹{s.igst.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                                      ₹{s.total_outward_tax.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-center font-mono text-slate-300">
                                      {s.inward_count}
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-300">
                                      ₹{s.inward_taxable.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono font-bold text-sky-400">
                                      ₹{s.inward_itc.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-mono font-bold">
                                      <span className={s.net_liability > 0 ? 'text-amber-400' : 'text-slate-400'}>
                                        ₹{s.net_liability.toLocaleString('en-IN')}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-700 text-xs">
                                <tr>
                                  <td className="p-3 text-white uppercase tracking-wider text-[11px]">
                                    TOTAL SUMMARY
                                  </td>
                                  <td className="p-3 text-center font-mono text-indigo-300">
                                    {totalInvoicesCount}
                                  </td>
                                  <td className="p-3 text-right font-mono text-white">
                                    ₹{totalOutwardTaxable.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono text-slate-300">
                                    ₹{totalCgst.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono text-slate-300">
                                    ₹{totalSgst.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono text-slate-300">
                                    ₹{totalIgst.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono text-emerald-400">
                                    ₹{totalOutwardTax.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-center font-mono text-indigo-300">
                                    {totalExpensesCount}
                                  </td>
                                  <td className="p-3 text-right font-mono text-slate-300">
                                    ₹{totalInwardTaxable.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono text-sky-400">
                                    ₹{totalInwardItc.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-mono text-amber-400 text-sm">
                                    ₹{netGstPayable.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 2: GSTR-1 OFFICIAL PORTAL TABLES */}
                      {gstActiveSubTab === 'gstr1_tables' && (
                        <div className="space-y-6">
                          {/* Table 4A - B2B Invoices */}
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                                  <span>Table 4A &bull; B2B Regular Invoices</span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {b2bInvoices.length} Registered Counterparties
                                  </span>
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Taxable outward supplies made to registered persons having valid GSTIN.
                                </p>
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                  <tr>
                                    <th className="p-3">Client GSTIN</th>
                                    <th className="p-3">Party Name</th>
                                    <th className="p-3">Invoice #</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">POS</th>
                                    <th className="p-3 text-right">Taxable Value (₹)</th>
                                    <th className="p-3 text-right">CGST (₹)</th>
                                    <th className="p-3 text-right">SGST (₹)</th>
                                    <th className="p-3 text-right">IGST (₹)</th>
                                    <th className="p-3 text-right">Invoice Total (₹)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                  {b2bInvoices.length === 0 ? (
                                    <tr>
                                      <td colSpan={10} className="p-6 text-center text-slate-500">
                                        No B2B invoices found for the selected period.
                                      </td>
                                    </tr>
                                  ) : (
                                    b2bInvoices.map((inv) => (
                                      <tr key={inv.id} className="hover:bg-slate-800/40">
                                        <td className="p-3 font-mono text-indigo-300 font-semibold">
                                          {inv.client_gstin}
                                        </td>
                                        <td className="p-3 font-semibold text-white">{inv.party_name}</td>
                                        <td className="p-3 font-mono text-slate-300">{inv.doc_number}</td>
                                        <td className="p-3 text-slate-400">
                                          {inv.date ? new Date(inv.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-3 font-mono text-slate-400">{inv.place_of_supply}</td>
                                        <td className="p-3 text-right font-mono text-white">
                                          ₹{Number(inv.taxable_value).toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-3 text-right font-mono text-slate-300">
                                          ₹{Number(inv.cgst).toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-3 text-right font-mono text-slate-300">
                                          ₹{Number(inv.sgst).toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-3 text-right font-mono text-slate-300">
                                          ₹{Number(inv.igst).toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-3 text-right font-mono font-bold text-white">
                                          ₹{Number(inv.gross_amount).toLocaleString('en-IN')}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Table 5A (B2C Large) & Table 7 (B2C Small) */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Table 5A */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                              <div className="p-4 bg-slate-950/60 border-b border-slate-800">
                                <h4 className="text-sm font-bold text-white">
                                  Table 5A &bull; B2C Large Supplies ({b2cLargeInvoices.length})
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Inter-state supplies to unregistered persons exceeding ₹2.5 Lakhs invoice value.
                                </p>
                              </div>
                              <div className="overflow-x-auto max-h-60 overflow-y-auto">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                      <th className="p-2.5">Invoice #</th>
                                      <th className="p-2.5">Party</th>
                                      <th className="p-2.5">POS</th>
                                      <th className="p-2.5 text-right">Taxable (₹)</th>
                                      <th className="p-2.5 text-right">IGST (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800">
                                    {b2cLargeInvoices.length === 0 ? (
                                      <tr>
                                        <td colSpan={5} className="p-4 text-center text-slate-500">
                                          No B2C Large invoices for this period.
                                        </td>
                                      </tr>
                                    ) : (
                                      b2cLargeInvoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-800/40">
                                          <td className="p-2.5 font-mono text-indigo-300">{inv.doc_number}</td>
                                          <td className="p-2.5 text-white">{inv.party_name}</td>
                                          <td className="p-2.5 font-mono">{inv.place_of_supply}</td>
                                          <td className="p-2.5 text-right font-mono">
                                            ₹{Number(inv.taxable_value).toLocaleString('en-IN')}
                                          </td>
                                          <td className="p-2.5 text-right font-mono text-emerald-400">
                                            ₹{Number(inv.igst).toLocaleString('en-IN')}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Table 7 */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                              <div className="p-4 bg-slate-950/60 border-b border-slate-800">
                                <h4 className="text-sm font-bold text-white">
                                  Table 7 &bull; B2C Small Supplies ({b2cSmallInvoices.length})
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Supplies made to unregistered retail consumers (intra-state and &le; ₹2.5L inter-state).
                                </p>
                              </div>
                              <div className="overflow-x-auto max-h-60 overflow-y-auto">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                      <th className="p-2.5">Invoice #</th>
                                      <th className="p-2.5">Party</th>
                                      <th className="p-2.5 text-right">Taxable (₹)</th>
                                      <th className="p-2.5 text-right">Tax (₹)</th>
                                      <th className="p-2.5 text-right">Total (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800">
                                    {b2cSmallInvoices.length === 0 ? (
                                      <tr>
                                        <td colSpan={5} className="p-4 text-center text-slate-500">
                                          No B2C Small invoices for this period.
                                        </td>
                                      </tr>
                                    ) : (
                                      b2cSmallInvoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-800/40">
                                          <td className="p-2.5 font-mono text-indigo-300">{inv.doc_number}</td>
                                          <td className="p-2.5 text-white">{inv.party_name}</td>
                                          <td className="p-2.5 text-right font-mono">
                                            ₹{Number(inv.taxable_value).toLocaleString('en-IN')}
                                          </td>
                                          <td className="p-2.5 text-right font-mono text-emerald-400">
                                            ₹{Number(inv.total_tax).toLocaleString('en-IN')}
                                          </td>
                                          <td className="p-2.5 text-right font-mono font-bold text-white">
                                            ₹{Number(inv.gross_amount).toLocaleString('en-IN')}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 3: HSN/SAC SUMMARY TABLE (TABLE 12) */}
                      {gstActiveSubTab === 'hsn' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-white">
                                Table 12 &bull; HSN/SAC Summary of Outward Supplies
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Harmonized System Nomenclature (HSN) &amp; Services Accounting Code (SAC) breakdown.
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                              {hsnMap.size} Distinct HSN Slabs
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                <tr>
                                  <th className="p-3">HSN/SAC</th>
                                  <th className="p-3">Description</th>
                                  <th className="p-3">UQC</th>
                                  <th className="p-3 text-right">Total Qty</th>
                                  <th className="p-3 text-center">Rate (%)</th>
                                  <th className="p-3 text-right">Taxable Value (₹)</th>
                                  <th className="p-3 text-right">CGST (₹)</th>
                                  <th className="p-3 text-right">SGST (₹)</th>
                                  <th className="p-3 text-right">IGST (₹)</th>
                                  <th className="p-3 text-right">Total Tax (₹)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                {Array.from(hsnMap.values()).length === 0 ? (
                                  <tr>
                                    <td colSpan={10} className="p-6 text-center text-slate-500">
                                      No HSN summary data available for this period.
                                    </td>
                                  </tr>
                                ) : (
                                  Array.from(hsnMap.values()).map((h) => (
                                    <tr key={`${h.hsn_sac}_${h.rate}`} className="hover:bg-slate-800/40">
                                      <td className="p-3 font-mono font-bold text-indigo-300">
                                        {h.hsn_sac}
                                      </td>
                                      <td className="p-3 text-white max-w-xs truncate">{h.desc}</td>
                                      <td className="p-3 font-mono text-slate-400">{h.uqc}</td>
                                      <td className="p-3 text-right font-mono text-slate-200">{h.qty}</td>
                                      <td className="p-3 text-center font-mono font-semibold text-emerald-400">
                                        {h.rate}%
                                      </td>
                                      <td className="p-3 text-right font-mono text-white">
                                        ₹{Number(h.taxable).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-300">
                                        ₹{Number(h.cgst).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-300">
                                        ₹{Number(h.sgst).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-300">
                                        ₹{Number(h.igst).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                                        ₹{Number(h.total_tax).toLocaleString('en-IN')}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 4: DETAILED TRANSACTION DRILLDOWN */}
                      {gstActiveSubTab === 'drilldown' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-bold text-white">
                                Itemized Transaction Drilldown
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Searchable transaction register across all sales invoices and expense vouchers.
                              </p>
                            </div>
                            <div className="relative w-full sm:w-72">
                              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                              <input
                                type="text"
                                value={gstSearchQuery}
                                onChange={(e) => setGstSearchQuery(e.target.value)}
                                placeholder="Search doc #, client, GSTIN, slab..."
                                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                <tr>
                                  <th className="p-3">Doc #</th>
                                  <th className="p-3">Date</th>
                                  <th className="p-3">Party Name</th>
                                  <th className="p-3">Client GSTIN</th>
                                  <th className="p-3">GSTR-1 Section</th>
                                  <th className="p-3">Slab</th>
                                  <th className="p-3 text-right">Taxable (₹)</th>
                                  <th className="p-3 text-right">CGST (₹)</th>
                                  <th className="p-3 text-right">SGST (₹)</th>
                                  <th className="p-3 text-right">IGST (₹)</th>
                                  <th className="p-3 text-right">Total (₹)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                {filteredDrilldownInvoices.length === 0 ? (
                                  <tr>
                                    <td colSpan={11} className="p-6 text-center text-slate-500">
                                      No matching invoices found.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredDrilldownInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-800/40">
                                      <td className="p-3 font-mono font-bold text-indigo-300">{inv.doc_number}</td>
                                      <td className="p-3 text-slate-400">
                                        {inv.date ? new Date(inv.date).toLocaleDateString() : 'N/A'}
                                      </td>
                                      <td className="p-3 font-semibold text-white">{inv.party_name}</td>
                                      <td className="p-3 font-mono text-xs">
                                        {inv.client_gstin ? (
                                          <span className="text-emerald-400 font-medium">{inv.client_gstin}</span>
                                        ) : (
                                          <span className="text-slate-500">Unregistered</span>
                                        )}
                                      </td>
                                      <td className="p-3">
                                        <span className="text-[11px] text-slate-300">{inv.gstr1_table}</span>
                                      </td>
                                      <td className="p-3 font-mono text-emerald-400 font-semibold">{inv.tax_slab}</td>
                                      <td className="p-3 text-right font-mono text-white">
                                        ₹{Number(inv.taxable_value).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-300">
                                        ₹{Number(inv.cgst).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-300">
                                        ₹{Number(inv.sgst).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono text-slate-300">
                                        ₹{Number(inv.igst).toLocaleString('en-IN')}
                                      </td>
                                      <td className="p-3 text-right font-mono font-bold text-white">
                                        ₹{Number(inv.gross_amount).toLocaleString('en-IN')}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* TAX ENGINE RULES & LIVE SANDBOX SETUP (EXISTING VIEW) */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Tax Rules Form */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Sliders className="w-4 h-4 text-indigo-400" />
                          <h3 className="text-sm font-bold text-white">GST Slab Configuration</h3>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Default Billing GST Rate (%)
                          </label>
                          <select
                            value={taxSettings.default_gst_rate}
                            onChange={(e) =>
                              setTaxSettings({ ...taxSettings, default_gst_rate: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                          >
                            <option value={0}>0% - Exempted Goods &amp; Services</option>
                            <option value={5}>5% - Basic Necessities &amp; Transport</option>
                            <option value={12}>12% - Standard Goods &amp; Business Process</option>
                            <option value={18}>18% - IT, Software, Hardware, Services</option>
                            <option value={28}>28% - Luxury &amp; Sin Goods</option>
                          </select>
                        </div>

                        <div className="space-y-3 pt-2">
                          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={taxSettings.is_composition}
                              onChange={(e) =>
                                setTaxSettings({ ...taxSettings, is_composition: e.target.checked })
                              }
                              className="rounded border-slate-700 text-indigo-600"
                            />
                            <span>Enrolled in Composition Scheme (Section 10)</span>
                          </label>

                          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={taxSettings.rcm_enabled}
                              onChange={(e) =>
                                setTaxSettings({ ...taxSettings, rcm_enabled: e.target.checked })
                              }
                              className="rounded border-slate-700 text-indigo-600"
                            />
                            <span>Enable Reverse Charge Mechanism (RCM) checks</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            GST Return Filing Frequency
                          </label>
                          <select
                            value={taxSettings.filing_period}
                            onChange={(e) =>
                              setTaxSettings({ ...taxSettings, filing_period: e.target.value })
                            }
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                          >
                            <option value="Monthly">Monthly (Regular Taxpayer)</option>
                            <option value="Quarterly">Quarterly (QRMP Scheme)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            if (!token) return;
                            await fetch('/api/tax-engine', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify(taxSettings),
                            });
                            setAdminActionSuccess('Tax engine settings updated successfully!');
                            setTimeout(() => setAdminActionSuccess(null), 3000);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                        >
                          Save Tax Engine Settings
                        </button>
                      </div>

                      {/* GST Calculation Sandbox */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Calculator className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-bold text-white">Live GST Computation Engine</h3>
                        </div>
                        <p className="text-xs text-slate-400">
                          Standard formula: Intra-state split into equal CGST (50%) + SGST (50%). Inter-state routed to IGST (100%).
                        </p>

                        <div className="space-y-2 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <div className="flex justify-between py-1 border-b border-slate-800">
                            <span className="text-slate-400">Sample Taxable Value</span>
                            <span className="text-white font-bold">₹1,00,000</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-400">CGST ({taxSettings.default_gst_rate / 2}%)</span>
                            <span className="text-emerald-400">
                              ₹{(100000 * (taxSettings.default_gst_rate / 200)).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-400">SGST ({taxSettings.default_gst_rate / 2}%)</span>
                            <span className="text-emerald-400">
                              ₹{(100000 * (taxSettings.default_gst_rate / 200)).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5 border-t border-slate-800 text-sm">
                            <span className="text-white font-bold">Total Gross Invoice</span>
                            <span className="text-indigo-300 font-extrabold">
                              ₹{(100000 * (1 + taxSettings.default_gst_rate / 100)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ======================================================== */}
            {/* 7. MULTI-TENANT DATABASE & ADMIN SCHEMA MANAGEMENT */}
            {/* ======================================================== */}
            {activeNav === 'admin' && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-white tracking-tight">
                        Database &amp; Tenant Administration
                      </h1>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        PostgreSQL Multi-Tenancy
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      Public schema is strictly isolated to <code className="text-indigo-300 font-mono">tenants</code>, <code className="text-indigo-300 font-mono">users</code>, and Admin plan controls. Every business tenant has a dedicated PostgreSQL schema following <code className="text-emerald-400 font-mono">tenant_&lt;slug_name&gt;</code> nomenclature.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <button
                      type="button"
                      onClick={() => fetchAdminData()}
                      disabled={loadingAdminData}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingAdminData ? 'animate-spin' : ''}`} />
                      <span>{loadingAdminData ? 'Refreshing...' : 'Refresh Schemas'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSetupTab('business');
                        setShowSetupModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Business &amp; GST Setup</span>
                    </button>
                  </div>
                </div>

                {/* Success / Error Alerts */}
                {adminActionSuccess && (
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs rounded-2xl flex items-center space-x-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{adminActionSuccess}</span>
                  </div>
                )}
                {adminActionError && (
                  <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs rounded-2xl flex items-center space-x-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="font-medium">{adminActionError}</span>
                  </div>
                )}

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Public Schema Tables</span>
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Database className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">5 Tables</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      tenants, users, subscription_plans, tenant_subscriptions, tenant_plan_history
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Dedicated Tenant Schemas</span>
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Layers className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 mt-2">
                      {adminTenants.length || 5} Schemas
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Nomenclature: tenant_&lt;slug_name&gt;
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Subscription Tiers</span>
                      <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-violet-300 mt-2">
                      {subscriptionPlans.length || 4} Tiers
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Free Community &bull; Starter &bull; Pro &bull; Enterprise
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>Overdue / Demoted Status</span>
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-300 mt-2">
                      {(adminTenants || []).filter((t) => t.plan_status === 'demoted' || t.plan_status === 'past_due').length || 2} Tenants
                    </div>
                    <span className="text-[10px] text-amber-400 font-medium">
                      Managed via Auto-Demote Policy
                    </span>
                  </div>
                </div>

                {/* ARCHITECTURE BLUEPRINT: STRICT PUBLIC VS TENANT SCHEMA SEPARATION */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">
                          PostgreSQL Multi-Tenancy Architecture Blueprint
                        </h2>
                        <p className="text-[11px] text-slate-400">
                          Strict separation of public directory schema and isolated tenant business schemas.
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      RFC Multi-Tenant Standard
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Public Schema Box */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                          <span className="font-mono text-xs font-bold text-white">public Schema</span>
                        </div>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                          5 Core Admin Tables
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Public schema holds <strong className="text-slate-200">ONLY</strong> global tenant definitions, user credentials, and tenant lifecycle admin controls. Absolutely no invoices or party data are stored here.
                      </p>
                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-indigo-300 font-semibold">public.tenants</span>
                          <span className="text-[10px] text-slate-400">Slug, name, plan, dedicated schema</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-indigo-300 font-semibold">public.users</span>
                          <span className="text-[10px] text-slate-400">Credentials, bcrypt hash, tenant_id link</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-indigo-300 font-semibold">public.subscription_plans</span>
                          <span className="text-[10px] text-slate-400">Free, Starter, Pro, Enterprise tiers</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-indigo-300 font-semibold">public.tenant_subscriptions</span>
                          <span className="text-[10px] text-slate-400">Billing status, overdue tracking, demote</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-indigo-300 font-semibold">public.tenant_plan_history</span>
                          <span className="text-[10px] text-slate-400">Audit logs of plan migrations &amp; demotions</span>
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Tenant Schema Box */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                          <span className="font-mono text-xs font-bold text-white">tenant_&lt;slug_name&gt; Schemas</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                          8 Isolated Business Tables
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Dedicated schema created for each registered company/tenant. Queries set PostgreSQL <code className="text-indigo-300 font-mono">search_path</code>, ensuring strict physical data boundary with zero multi-tenant leakage.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          category_gst_rules
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          customers
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          expenses
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          invoices
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          products
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          quotations
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          business_profiles
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                          templates_config
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 pt-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Exact table nomenclature matching DBeaver database navigator image.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DBEAVER DATABASE NAVIGATOR TREE VIEW (MATCHING USER ATTACHED SCREENSHOT) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>DBeaver Database Navigator Tree</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-normal">
                            Live PostgreSQL Catalog
                          </span>
                        </h2>
                        <p className="text-[11px] text-slate-400">
                          Visual hierarchy of database schemas and tables identical to DBeaver IDE tree.
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Current DB: <span className="text-white font-bold">{adminPublicSchema?.schemaName || 'OmniBill (PostgreSQL)'}</span>
                    </div>
                  </div>

                  {/* DBeaver IDE Tree Widget */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto space-y-2">
                    {/* Database Root Node */}
                    <div className="flex items-center space-x-2 text-indigo-300 font-bold select-none">
                      <Database className="w-4 h-4 text-indigo-400" />
                      <span>OmniBill</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        (PostgreSQL 16.2 / {adminTenants.length + 1} Schemas)
                      </span>
                    </div>

                    <div className="ml-4 pl-3 border-l border-slate-800 space-y-2 mt-1">
                      {/* Schemas Root */}
                      <div className="flex items-center space-x-2 text-slate-300 font-semibold select-none">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Schemas</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                          {adminTenants.length + 1}
                        </span>
                      </div>

                      <div className="ml-4 pl-3 border-l border-slate-800 space-y-2 mt-1">
                        {/* 1. PUBLIC SCHEMA NODE */}
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedNavigatorSchema(
                                expandedNavigatorSchema === 'public' ? null : 'public'
                              )
                            }
                            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900 text-left transition cursor-pointer"
                          >
                            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
                              {expandedNavigatorSchema === 'public' ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-amber-400">📁</span>
                              <span>public</span>
                              <span className="text-[10px] text-indigo-400/80 font-normal">
                                (5 admin/identity tables only)
                              </span>
                            </div>
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                              5 Tables
                            </span>
                          </button>

                          {expandedNavigatorSchema === 'public' && (
                            <div className="ml-7 pl-3 border-l border-slate-800/80 space-y-1 py-1 text-[11px]">
                              {(adminPublicSchema?.tables || [
                                { tableName: 'tenants', rowCount: adminTenants.length || 6, role: 'Tenant Registry' },
                                { tableName: 'users', rowCount: 1, role: 'User Identity & Auth' },
                                { tableName: 'subscription_plans', rowCount: 4, role: 'Global Plan Tiers' },
                                { tableName: 'tenant_subscriptions', rowCount: adminTenants.length || 6, role: 'Billing Status & Demotion' },
                                { tableName: 'tenant_plan_history', rowCount: 2, role: 'Audit Log' },
                              ]).map((t: any) => (
                                <div
                                  key={t.tableName}
                                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-900/60 text-slate-300"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-slate-500">📄</span>
                                    <span className="text-indigo-200 font-semibold">{t.tableName}</span>
                                    <span className="text-[10px] text-slate-500 font-sans">
                                      &bull; {t.role || t.description}
                                    </span>
                                  </div>
                                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                    {t.rowCount} rows
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 2. DEDICATED TENANT SCHEMAS (tenant_<slug_name>) */}
                        {(adminTenants.length > 0
                          ? adminTenants
                          : [
                              { id: 1, name: 'Vectura US', slug: 'vectura_us', schema_name: 'tenant_vectura_us', plan: 'Enterprise', plan_status: 'active' },
                              { id: 2, name: 'Bharat Tech IN', slug: 'bharat_tech_in', schema_name: 'tenant_bharat_tech_in', plan: 'Pro', plan_status: 'active' },
                              { id: 3, name: 'NextGen Energies', slug: 'nextgen_energies', schema_name: 'tenant_nextgen_energies', plan: 'Starter', plan_status: 'active' },
                              { id: 4, name: 'Radhey Enterprises', slug: 'radhey', schema_name: 'tenant_radhey', plan: 'Free', plan_status: 'demoted' },
                              { id: 5, name: 'Aethelgard DE', slug: 'aethelgard_de', schema_name: 'tenant_aethelgard_de', plan: 'Pro', plan_status: 'past_due' },
                            ]
                        ).map((t: any) => {
                          const schemaName = t.schema_name || `tenant_${t.slug}`;
                          const isExpanded = expandedNavigatorSchema === schemaName;
                          const isCurrentActive = currentUser?.schema_name === schemaName;

                          return (
                            <div key={t.id} className="space-y-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedNavigatorSchema(isExpanded ? null : schemaName)
                                }
                                className={`w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900 text-left transition cursor-pointer ${
                                  isCurrentActive ? 'bg-emerald-950/30 border border-emerald-500/30' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-2 text-slate-200">
                                  {isExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                  <span className="text-emerald-400">📁</span>
                                  <span className="text-emerald-300 font-bold">{schemaName}</span>
                                  <span className="text-[10px] text-slate-400 font-sans">
                                    ({t.name})
                                  </span>
                                  {isCurrentActive && (
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-sans font-semibold">
                                      Active Session
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-semibold ${
                                    t.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                                    t.plan === 'Pro' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                                    t.plan === 'Starter' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                                    'bg-slate-800 text-slate-300'
                                  }`}>
                                    {t.plan || 'Starter'}
                                  </span>
                                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                    8 Tables
                                  </span>
                                </div>
                              </button>

                              {isExpanded && (
                                <div className="ml-7 pl-3 border-l border-slate-800/80 space-y-1 py-1 text-[11px]">
                                  {[
                                    'category_gst_rules',
                                    'customers',
                                    'expenses',
                                    'invoices',
                                    'products',
                                    'quotations',
                                    'business_profiles',
                                    'templates_config',
                                  ].map((tbl) => (
                                    <div
                                      key={tbl}
                                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-900/60 text-slate-300"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <span className="text-emerald-500/80">📄</span>
                                        <span className="text-slate-200">{tbl}</span>
                                        <span className="text-[10px] text-slate-500">
                                          ({schemaName}.{tbl})
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-emerald-400/80">
                                        Isolated Table
                                      </span>
                                    </div>
                                  ))}
                                  <div className="pt-2 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleSwitchTenant(t)}
                                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-sans font-semibold flex items-center space-x-1 transition cursor-pointer"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Switch Workspace Context to {t.name}</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* TENANT MANAGEMENT OPERATIONS TABLE */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>Tenant Subscriptions &amp; Plan Lifecycle Controls</span>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded font-mono">
                          Admin APIs
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Migrate tenant subscription tiers, enforce auto-demote on non-payment, or disable tenants.
                      </p>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Total Tenants: <strong className="text-white">{adminTenants.length}</strong>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/60 text-slate-400 text-[11px] font-semibold border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Tenant / Business</th>
                          <th className="px-4 py-3">Dedicated PostgreSQL Schema</th>
                          <th className="px-4 py-3">Current Plan</th>
                          <th className="px-4 py-3">Billing &amp; Payment Status</th>
                          <th className="px-4 py-3">Users</th>
                          <th className="px-4 py-3 text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {adminTenants.map((t) => {
                          const schemaName = t.schema_name || `tenant_${t.slug}`;
                          const isCurrent = currentUser?.schema_name === schemaName;

                          return (
                            <tr
                              key={t.id}
                              className={`hover:bg-slate-850/50 transition ${
                                isCurrent ? 'bg-indigo-950/20' : ''
                              }`}
                            >
                              {/* Tenant Name */}
                              <td className="px-4 py-3.5">
                                <div className="font-semibold text-white flex items-center space-x-1.5">
                                  <span>{t.name}</span>
                                  {isCurrent && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Context" />
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  slug: {t.slug} &bull; id: #{t.id}
                                </div>
                              </td>

                              {/* Schema */}
                              <td className="px-4 py-3.5">
                                <span className="font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">
                                  {schemaName}
                                </span>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  8 isolated tables
                                </div>
                              </td>

                              {/* Plan */}
                              <td className="px-4 py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  t.plan === 'Enterprise'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : t.plan === 'Pro'
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : t.plan === 'Starter'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                }`}>
                                  {t.plan || 'Starter'}
                                </span>
                              </td>

                              {/* Status & Payment */}
                              <td className="px-4 py-3.5">
                                <div className="flex items-center space-x-1.5">
                                  <span className={`w-2 h-2 rounded-full ${
                                    t.is_active === false
                                      ? 'bg-rose-500'
                                      : t.plan_status === 'demoted'
                                      ? 'bg-amber-400'
                                      : t.plan_status === 'past_due'
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-400'
                                  }`} />
                                  <span className={`capitalize font-semibold text-[11px] ${
                                    t.is_active === false
                                      ? 'text-rose-400'
                                      : t.plan_status === 'demoted'
                                      ? 'text-amber-300'
                                      : t.plan_status === 'past_due'
                                      ? 'text-amber-400'
                                      : 'text-emerald-400'
                                  }`}>
                                    {t.is_active === false
                                      ? 'Suspended'
                                      : t.plan_status === 'demoted'
                                      ? 'Demoted (Unpaid)'
                                      : t.plan_status === 'past_due'
                                      ? 'Past Due'
                                      : 'Active (Paid)'}
                                  </span>
                                </div>
                                {t.demote_reason && (
                                  <div className="text-[10px] text-amber-400/80 line-clamp-1 mt-0.5 max-w-xs" title={t.demote_reason}>
                                    Reason: {t.demote_reason}
                                  </div>
                                )}
                              </td>

                              {/* Users count */}
                              <td className="px-4 py-3.5 font-mono text-slate-300">
                                {t.user_count || 0}
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3.5 text-right space-x-1.5">
                                {/* Migrate Plan Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTenantForAction(t);
                                    setTargetMigrationPlan(t.plan === 'Enterprise' ? 'Pro' : 'Enterprise');
                                    setShowMigrateModal(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition cursor-pointer"
                                  title="Migrate Subscription Plan"
                                >
                                  Migrate Plan
                                </button>

                                {/* Demote on Non-Payment Button */}
                                {t.plan !== 'Free' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTenantForAction(t);
                                      setShowDemoteModal(true);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-medium text-[11px] transition cursor-pointer"
                                    title="Demote to lower tier when payment is not received"
                                  >
                                    Demote Unpaid
                                  </button>
                                )}

                                {/* Disable / Enable Toggle */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleTenantStatus(t)}
                                  className={`px-2 py-1 rounded-lg font-medium text-[11px] transition cursor-pointer ${
                                    t.is_active
                                      ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-950/70 border border-rose-500/20'
                                      : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70 border border-emerald-500/20'
                                  }`}
                                  title={t.is_active ? 'Disable Tenant' : 'Enable Tenant'}
                                >
                                  {t.is_active ? 'Disable' : 'Enable'}
                                </button>

                                {/* Switch Context Button */}
                                <button
                                  type="button"
                                  onClick={() => handleSwitchTenant(t)}
                                  disabled={isCurrent}
                                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                                    isCurrent
                                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                  }`}
                                  title="Switch session context to this tenant"
                                >
                                  Switch
                                </button>

                                {/* History Audit Button */}
                                <button
                                  type="button"
                                  onClick={() => handleViewTenantHistory(t)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer"
                                  title="View Plan Audit History"
                                >
                                  <History className="w-3 h-3 inline" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PUBLIC SCHEMA DATABASE RECORDS INSPECTOR */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                        <Database className="w-4 h-4 text-indigo-400" />
                        <span>Public Schema Internal Registry Tables</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Underlying physical tables in <code className="text-indigo-300 font-mono">public</code> schema managing multi-tenancy and subscription billing.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(adminPublicSchema?.tables || []).map((tbl: any) => (
                      <div
                        key={tbl.tableName}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-indigo-300 font-semibold text-xs">
                            public.{tbl.tableName}
                          </span>
                          <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-white font-bold">
                            {tbl.rowCount} rows
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {tbl.description}
                        </p>
                        <div className="pt-1 flex items-center space-x-1.5 text-[10px] text-indigo-400 font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{tbl.role || 'Admin Management Table'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ======================================================== */}
      {/* BUSINESS SETUP & PROFILE UPDATE MODAL */}
      {/* ======================================================== */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Business Setup &amp; Profile</h3>
                  <p className="text-xs text-slate-400">
                    Configure company name, GST registration, and bank details.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-800 px-6 bg-slate-950/60 text-xs">
              <button
                onClick={() => setActiveSetupTab('business')}
                className={`py-3 px-4 font-semibold border-b-2 transition ${
                  activeSetupTab === 'business'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Business Details &amp; GST
              </button>
              <button
                onClick={() => setActiveSetupTab('bank')}
                className={`py-3 px-4 font-semibold border-b-2 transition ${
                  activeSetupTab === 'bank'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Bank &amp; Payment Accounts
              </button>
              <button
                onClick={() => setActiveSetupTab('profile')}
                className={`py-3 px-4 font-semibold border-b-2 transition ${
                  activeSetupTab === 'profile'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                User Profile
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveBusinessSetup} className="p-6 overflow-y-auto space-y-4 text-xs">
              {activeSetupTab === 'business' && (
                <>
                  {/* Business Brand Logo Upload */}
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {businessProfile.logo_url ? (
                        <div className="relative group shrink-0">
                          <img
                            src={businessProfile.logo_url}
                            alt="Business Logo"
                            className="w-20 h-20 object-contain bg-white rounded-xl p-1.5 border border-slate-700 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => setBusinessProfile({ ...businessProfile, logo_url: '' })}
                            className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full shadow cursor-pointer"
                            title="Remove Logo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900 flex flex-col items-center justify-center text-slate-500 shrink-0">
                          <Building2 className="w-6 h-6 mb-1 text-slate-400" />
                          <span className="text-[9px]">No Logo</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-1.5 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-xs">Business Brand Logo</span>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded font-medium">
                            Prints on Invoices
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Upload company brand logo (PNG, JPG, SVG). Displayed in invoice headers, quotations, and official receipts.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <label className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{businessProfile.logo_url ? 'Replace Logo' : 'Upload Business Logo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setBusinessProfile({
                                      ...businessProfile,
                                      logo_url: ev.target?.result as string,
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {businessProfile.logo_url && (
                            <button
                              type="button"
                              onClick={() => setBusinessProfile({ ...businessProfile, logo_url: '' })}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-medium transition cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Business Name</label>
                      <input
                        type="text"
                        required
                        value={businessProfile.business_name}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, business_name: e.target.value })
                        }
                        placeholder="e.g. OmniBill Enterprises"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Trade Name</label>
                      <input
                        type="text"
                        value={businessProfile.trade_name}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, trade_name: e.target.value })
                        }
                        placeholder="e.g. OmniBill Tech Solutions"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        required
                        value={businessProfile.gst_number}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, gst_number: e.target.value })
                        }
                        placeholder="27AABCO1234F1Z5"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">PAN Number</label>
                      <input
                        type="text"
                        value={businessProfile.pan}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, pan: e.target.value })
                        }
                        placeholder="AABCO1234F"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Business Address</label>
                    <textarea
                      rows={2}
                      value={businessProfile.address}
                      onChange={(e) =>
                        setBusinessProfile({ ...businessProfile, address: e.target.value })
                      }
                      placeholder="Street, City, PIN code"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">State &amp; Code</label>
                      <select
                        value={businessProfile.state}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBusinessProfile((prev) => {
                            const match = val.match(/\((\d{2})\)/);
                            const updatedGst = match && prev.gst_number && prev.gst_number.length >= 2
                              ? `${match[1]}${prev.gst_number.slice(2)}`
                              : prev.gst_number;
                            return { ...prev, state: val, gst_number: updatedGst };
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="">Select State &amp; GST Code</option>
                        {GST_STATES.map((s) => (
                          <option key={s.code} value={`${s.name} (${s.code})`}>
                            {s.code} - {s.name}
                          </option>
                        ))}
                        {!GST_STATES.some((s) => `${s.name} (${s.code})` === businessProfile.state) && businessProfile.state && (
                          <option value={businessProfile.state}>{businessProfile.state}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Business Phone</label>
                      <input
                        type="text"
                        value={businessProfile.phone}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Billing Email</label>
                      <input
                        type="email"
                        value={businessProfile.email}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, email: e.target.value })
                        }
                        placeholder="billing@omnibill.com"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSetupTab === 'bank' && (
                <>
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 rounded-xl">
                    These banking and UPI QR details are automatically printed on invoices and payment receipts.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={businessProfile.bank_name}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, bank_name: e.target.value })
                        }
                        placeholder="HDFC Bank Ltd"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Account Number</label>
                      <input
                        type="text"
                        value={businessProfile.bank_account}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, bank_account: e.target.value })
                        }
                        placeholder="50200012345678"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        value={businessProfile.upi_id || ''}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, upi_id: e.target.value })
                        }
                        placeholder="e.g. omnibill@okhdfcbank"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Used for instant customer scan-and-pay UPI QR codes
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={businessProfile.bank_ifsc}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, bank_ifsc: e.target.value })
                        }
                        placeholder="HDFC0001234"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        RTGS / NEFT transfer clearing code
                      </span>
                    </div>
                  </div>

                  {/* Bank Payment QR Code */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Bank Payment QR Code
                    </label>
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {businessProfile.payment_qr_url ? (
                          <div className="relative group shrink-0">
                            <img
                              src={businessProfile.payment_qr_url}
                              alt="Bank Payment QR"
                              className="w-24 h-24 object-contain bg-white rounded-lg p-1 border border-slate-700 shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => setBusinessProfile({ ...businessProfile, payment_qr_url: '' })}
                              className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full shadow cursor-pointer"
                              title="Remove custom QR"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : businessProfile.upi_id ? (
                          <div className="shrink-0 flex flex-col items-center p-2 bg-white rounded-lg border border-slate-700 text-slate-900 shadow-md">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${businessProfile.upi_id}&pn=${encodeURIComponent(businessProfile.business_name || 'Merchant')}&cu=INR`)}`}
                              alt="Auto UPI QR"
                              className="w-20 h-20"
                            />
                            <span className="text-[8px] font-bold text-indigo-700 mt-1 uppercase font-mono tracking-wider">UPI Auto QR</span>
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 shrink-0">
                            <Scan className="w-6 h-6 mb-1 text-slate-400" />
                            <span className="text-[9px]">No QR</span>
                          </div>
                        )}

                        <div className="flex-1 space-y-2 text-left">
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Upload your official bank UPI QR code sticker or payment QR image. Printed directly on tax invoices for quick scanning by customers.
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{businessProfile.payment_qr_url ? 'Replace QR Image' : 'Upload Bank QR Image'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setBusinessProfile({
                                        ...businessProfile,
                                        payment_qr_url: ev.target?.result as string,
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {businessProfile.payment_qr_url && (
                              <button
                                type="button"
                                onClick={() => setBusinessProfile({ ...businessProfile, payment_qr_url: '' })}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold transition cursor-pointer"
                              >
                                Remove QR
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSetupTab === 'profile' && (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 rounded-xl text-[11px] leading-relaxed">
                    Update your account UserName, professional designation, and contact emails. These credentials identify your account across sessions and customer communication.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        UserName <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={profileUsername}
                        onChange={(e) => setProfileUsername(e.target.value)}
                        placeholder="e.g. teenadev"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Unique user login identifier
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Designation <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={profileDesignation}
                        onChange={(e) => setProfileDesignation(e.target.value)}
                        placeholder="e.g. Founder & CEO, Senior Accountant, Manager"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Official position in the business
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Account Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="user@omnibill.com"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Primary email for login and password recovery
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={profileContactEmail}
                        onChange={(e) => setProfileContactEmail(e.target.value)}
                        placeholder="contact@omnibill.com"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Displayed on invoices and business correspondence
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Direct user mobile/phone contact number
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      User ID: <span className="text-indigo-300 font-mono">#{currentUser?.id}</span> &bull; Current User: <span className="text-white font-mono">@{currentUser?.username}</span> &bull; Role: <span className="text-emerald-400 font-semibold uppercase">{currentUser?.role || 'admin'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileUpdating}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                >
                  {profileUpdating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>
                      {activeSetupTab === 'profile' ? 'Save Profile Changes' : 'Save Configuration'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER NEW CRM CLIENT / ADD PARTY MODAL */}
      {showAddPartyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Title & Namespace */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Register New CRM Client</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assigned to PostgreSQL schema namespace:{' '}
                  <span className="font-mono text-indigo-400 font-medium">
                    {currentUser?.schema_name || 'tenant_nextgen_energies'}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPartyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateParty} className="space-y-6 text-xs">
              {/* Form Validation Error Banner */}
              {partyModalError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-2.5 text-rose-300 text-xs shadow-sm">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{partyModalError}</p>
                  </div>
                </div>
              )}

              {/* CUSTOMER TYPE SELECTION: B2B vs B2C */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold uppercase text-[11px] tracking-wider flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Customer Classification Type <span className="text-rose-400">*</span></span>
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      newParty.customer_type === 'B2B'
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {newParty.customer_type === 'B2B' ? 'B2B • GSTIN Mandatory' : 'B2C • GSTIN Optional'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: B2B */}
                  <div
                    onClick={() => {
                      setNewParty({ ...newParty, customer_type: 'B2B' });
                      setPartyModalError(null);
                    }}
                    className={`cursor-pointer rounded-xl p-3.5 border transition flex flex-col justify-between ${
                      newParty.customer_type === 'B2B'
                        ? 'bg-indigo-950/50 border-indigo-500/80 shadow-md shadow-indigo-950/60 ring-1 ring-indigo-500/50'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2.5 mb-1.5">
                        <div className={`p-2 rounded-lg ${newParty.customer_type === 'B2B' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                            <span>B2B (Business-to-Business)</span>
                            <span className="text-[10px] text-rose-400 font-bold">*Mandatory GST</span>
                          </div>
                          <div className="text-[11px] text-slate-400">Companies, Commercial Firms, Wholesalers</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 pl-0.5 border-t border-slate-800/80 pt-1.5 leading-relaxed">
                        Registered business entity. A valid <strong className="text-white">15-digit GSTIN is required</strong> for tax invoices &amp; ITC credit pass-through.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: B2C */}
                  <div
                    onClick={() => {
                      setNewParty({ ...newParty, customer_type: 'B2C' });
                      setPartyModalError(null);
                    }}
                    className={`cursor-pointer rounded-xl p-3.5 border transition flex flex-col justify-between ${
                      newParty.customer_type === 'B2C'
                        ? 'bg-emerald-950/50 border-emerald-500/80 shadow-md shadow-emerald-950/60 ring-1 ring-emerald-500/50'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2.5 mb-1.5">
                        <div className={`p-2 rounded-lg ${newParty.customer_type === 'B2C' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                            <span>B2C (Business-to-Consumer)</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">(GST Optional)</span>
                          </div>
                          <div className="text-[11px] text-slate-400">Retail End-Consumers, Walk-ins, Individuals</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 pl-0.5 border-t border-slate-800/80 pt-1.5 leading-relaxed">
                        Retail consumer. GSTIN is <strong className="text-emerald-300">not mandatory</strong>, but can still be specified if the buyer has a provisional tax ID or UIN.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: COMPANY & CONTACT REPRESENTATIVE */}
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2 text-slate-200 font-bold uppercase text-[11px] tracking-wider border-b border-slate-800/80 pb-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>{newParty.customer_type === 'B2B' ? 'Company & Commercial Entity' : 'Customer & Individual Details'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {newParty.customer_type === 'B2B' ? 'Company / Business Name' : 'Client / Customer Name'} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newParty.name}
                      onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                      placeholder="Apex Data Networks Inc."
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Account Status &amp; Tier</label>
                    <select
                      value={newParty.type}
                      onChange={(e) => setNewParty({ ...newParty, type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    >
                      <option value="Active Client">Active Client</option>
                      <option value="Customer">Customer</option>
                      <option value="Prospective Lead">Prospective Lead</option>
                      <option value="VIP Partner">VIP Partner</option>
                      <option value="Supplier / Vendor">Supplier / Vendor</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Primary Contact Person <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newParty.contact_person}
                      onChange={(e) => setNewParty({ ...newParty, contact_person: e.target.value })}
                      placeholder="Sarah Jenkins"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Professional Title / Role</label>
                    <input
                      type="text"
                      value={newParty.contact_title}
                      onChange={(e) => setNewParty({ ...newParty, contact_title: e.target.value })}
                      placeholder="VP of Global Infrastructure"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newParty.email}
                      onChange={(e) => setNewParty({ ...newParty, email: e.target.value })}
                      placeholder="sjenkins@apexdata.net"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Primary Telephone <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newParty.phone}
                      onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })}
                      placeholder="+1 (408) 555-0192"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Direct Mobile / Urgent Line</label>
                    <input
                      type="text"
                      value={newParty.mobile_urgent}
                      onChange={(e) => setNewParty({ ...newParty, mobile_urgent: e.target.value })}
                      placeholder="+1 (408) 555-8819"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Industry / Sector</label>
                    <input
                      type="text"
                      value={newParty.industry}
                      onChange={(e) => setNewParty({ ...newParty, industry: e.target.value })}
                      placeholder="Telecommunications, Robotics, Logistics"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: COMMERCIAL BILLING ADDRESS */}
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2 text-slate-200 font-bold uppercase text-[11px] tracking-wider border-b border-slate-800/80 pb-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Commercial Billing Address</span>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Address Line 1 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newParty.address_line1}
                    onChange={(e) => setNewParty({ ...newParty, address_line1: e.target.value })}
                    placeholder="3200 North First St"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Address Line 2 (Suite, Floor, Building)</label>
                  <input
                    type="text"
                    value={newParty.address_line2}
                    onChange={(e) => setNewParty({ ...newParty, address_line2: e.target.value })}
                    placeholder="Building B, Suite 400"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      City <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newParty.city}
                      onChange={(e) => setNewParty({ ...newParty, city: e.target.value })}
                      placeholder="San Jose"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      State / Region <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newParty.state_region}
                      onChange={(e) => setNewParty({ ...newParty, state_region: e.target.value })}
                      placeholder="CA"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Postal Code <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newParty.postal_code}
                      onChange={(e) => setNewParty({ ...newParty, postal_code: e.target.value })}
                      placeholder="95134"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Country (ISO-2) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newParty.country}
                      onChange={(e) => setNewParty({ ...newParty, country: e.target.value.toUpperCase() })}
                      placeholder="IN"
                      maxLength={2}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono uppercase focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: INVOICING, CREDIT LIMIT & TAX IDENTIFICATION */}
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2 text-slate-200 font-bold uppercase text-[11px] tracking-wider border-b border-slate-800/80 pb-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Invoicing, Credit Limit &amp; Tax Identification</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-300 font-semibold">
                        GSTIN / Tax ID {newParty.customer_type === 'B2B' ? <span className="text-rose-400 font-bold">* (Mandatory)</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
                      </label>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${newParty.customer_type === 'B2B' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'}`}>
                        {newParty.customer_type === 'B2B' ? 'Mandatory' : 'Optional'}
                      </span>
                    </div>
                    <input
                      type="text"
                      required={newParty.customer_type === 'B2B'}
                      value={newParty.gstin}
                      onChange={(e) => {
                        setNewParty({ ...newParty, gstin: e.target.value.toUpperCase() });
                        if (partyModalError) setPartyModalError(null);
                      }}
                      placeholder={newParty.customer_type === 'B2B' ? 'e.g. 27AABCS1429B1ZB (15 chars)' : 'Optional: e.g. 27AABCS1429B1ZB or Consumer UIN'}
                      className={`w-full bg-slate-950 border text-white rounded-xl p-2.5 font-mono uppercase focus:outline-none transition ${
                        newParty.customer_type === 'B2B' && !newParty.gstin.trim()
                          ? 'border-rose-500/70 focus:border-rose-400 placeholder-rose-400/30'
                          : 'border-slate-700 focus:border-emerald-500'
                      }`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      {newParty.customer_type === 'B2B'
                        ? '15-digit GSTIN is mandatory for B2B input tax credit and e-invoicing.'
                        : 'GST is optional for B2C consumers. Can still be specified if consumer has a GSTIN/UIN.'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Default Currency (Destination)</label>
                    <select
                      value={newParty.currency}
                      onChange={(e) => setNewParty({ ...newParty, currency: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none transition"
                    >
                      <option value="INR (₹) – India">INR (₹) – India</option>
                      <option value="USD ($) – United States">USD ($) – United States</option>
                      <option value="EUR (€) – European Union">EUR (€) – European Union</option>
                      <option value="GBP (£) – United Kingdom">GBP (£) – United Kingdom</option>
                      <option value="AED (د.إ) – UAE">AED (د.إ) – UAE</option>
                      <option value="SGD (S$) – Singapore">SGD (S$) – Singapore</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Payment Terms (Days)</label>
                    <select
                      value={newParty.payment_terms}
                      onChange={(e) => setNewParty({ ...newParty, payment_terms: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none transition"
                    >
                      <option value="Net 30 Days">Net 30 Days</option>
                      <option value="Net 15 Days">Net 15 Days</option>
                      <option value="Net 45 Days">Net 45 Days</option>
                      <option value="Net 60 Days">Net 60 Days</option>
                      <option value="Net 90 Days">Net 90 Days</option>
                      <option value="Due on Receipt">Due on Receipt (Immediate)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Credit Limit ($ / ₹)</label>
                    <input
                      type="number"
                      value={newParty.credit_limit}
                      onChange={(e) => setNewParty({ ...newParty, credit_limit: Number(e.target.value) })}
                      placeholder="25000"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-5">
                    <input
                      type="checkbox"
                      id="tax_exempt_checkbox"
                      checked={newParty.is_tax_exempt}
                      onChange={(e) => setNewParty({ ...newParty, is_tax_exempt: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 focus:outline-none cursor-pointer"
                    />
                    <label htmlFor="tax_exempt_checkbox" className="text-slate-300 text-xs cursor-pointer select-none">
                      Tax Exempt Client (Government, Non-Profit, or Reseller)
                    </label>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-slate-400 font-medium mb-1">Opening Balance Ledger (₹)</label>
                  <input
                    type="number"
                    value={newParty.balance}
                    onChange={(e) => setNewParty({ ...newParty, balance: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* SECTION 4: ACCOUNT MANAGER & RELATIONSHIP NOTES */}
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2 text-slate-200 font-bold uppercase text-[11px] tracking-wider border-b border-slate-800/80 pb-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Account Manager &amp; Relationship Notes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Assigned Account Manager</label>
                    <input
                      type="text"
                      value={newParty.account_manager}
                      onChange={(e) => setNewParty({ ...newParty, account_manager: e.target.value })}
                      placeholder={currentUser?.full_name || currentUser?.username || 'Teena Jain'}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={newParty.tags}
                      onChange={(e) => setNewParty({ ...newParty, tags: e.target.value })}
                      placeholder="Tier-1 Enterprise, High Volume, Fast-Pay"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Internal Account Notes &amp; Instructions</label>
                  <textarea
                    rows={3}
                    value={newParty.notes}
                    onChange={(e) => setNewParty({ ...newParty, notes: e.target.value })}
                    placeholder="Include special PO requirements, delivery gates, or corporate billing contacts..."
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-amber-500 focus:outline-none transition resize-y"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="pt-4 flex justify-end items-center space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPartyModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:bg-slate-900 text-white font-semibold shadow-lg shadow-black/50 transition flex items-center space-x-2"
                >
                  <span>Register Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. CREATE / EDIT QUOTATION MODAL WITH LIVE IN-STOCK RESTRICTION */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl my-auto max-h-[94vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                      {activeSalesDocType === 'Sale Order'
                        ? 'Sales Order • Order Confirmation'
                        : activeSalesDocType === 'Proforma Invoice'
                        ? 'Proforma Invoice • Advance Demand'
                        : activeSalesDocType === 'Delivery Challan'
                        ? 'Delivery Challan • Goods Movement'
                        : activeSalesDocType === 'Invoices'
                        ? 'Tax Invoice • GST Invoice'
                        : 'Sales Quotation • GST Estimate'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {quoteFormNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {editingQuotationId
                      ? `Edit ${activeSalesDocType} #${quoteFormNumber}`
                      : `Create New ${activeSalesDocType}`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeSalesDocType === 'Sale Order'
                      ? 'Internal sale order confirms customer order and reserves inventory items for fulfillment.'
                      : activeSalesDocType === 'Proforma Invoice'
                      ? 'Preliminary invoice issued to customer requesting advance payment prior to final tax invoice.'
                      : activeSalesDocType === 'Delivery Challan'
                      ? 'Official delivery document accompanying goods during transport from warehouse to customer.'
                      : 'Only in-stock items can be added. Stock quantities are validated and enforced in real time.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuotationModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveQuotation} className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* Error Notice */}
              {quoteSaveError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{quoteSaveError}</div>
                  <button
                    type="button"
                    onClick={() => setQuoteSaveError(null)}
                    className="text-rose-400 hover:text-rose-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 1. Header Details Grid */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {activeSalesDocType} # <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteFormNumber}
                      onChange={(e) => setQuoteFormNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      placeholder={`e.g. ${activeSalesDocType === 'Sale Order' ? 'SO-2026-001' : activeSalesDocType === 'Proforma Invoice' ? 'PI-2026-001' : 'QT-2026-001'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {activeSalesDocType} Date <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={quoteFormDate}
                      onChange={(e) => setQuoteFormDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {activeSalesDocType === 'Sale Order'
                        ? 'Expected Delivery Date'
                        : activeSalesDocType === 'Delivery Challan'
                        ? 'Dispatch Date'
                        : 'Valid Until / Due Date'}
                    </label>
                    <input
                      type="date"
                      value={quoteFormValidUntil}
                      onChange={(e) => setQuoteFormValidUntil(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Place of Supply (State)
                    </label>
                    <select
                      value={quoteFormPlaceOfSupply}
                      onChange={(e) => setQuoteFormPlaceOfSupply(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      {GST_STATES.map((st) => (
                        <option key={st.code} value={`${st.name} (${st.code})`}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional PO fields for Sale Order */}
                {activeSalesDocType === 'Sale Order' && (
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Buyer's Purchase Order (PO) #
                      </label>
                      <input
                        type="text"
                        value={quoteFormPoNumber}
                        onChange={(e) => setQuoteFormPoNumber(e.target.value)}
                        placeholder="e.g. PO-EXT-2026-984"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Buyer's PO Date
                      </label>
                      <input
                        type="date"
                        value={quoteFormPoDate}
                        onChange={(e) => setQuoteFormPoDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Additional Transit fields for Delivery Challan */}
                {activeSalesDocType === 'Delivery Challan' && (
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Vehicle / Truck #
                      </label>
                      <input
                        type="text"
                        value={quoteFormVehicle}
                        onChange={(e) => setQuoteFormVehicle(e.target.value)}
                        placeholder="e.g. MH-12-AB-1234"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Transporter Name
                      </label>
                      <input
                        type="text"
                        value={quoteFormTransporter}
                        onChange={(e) => setQuoteFormTransporter(e.target.value)}
                        placeholder="e.g. Blue Dart Logistics"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        E-Way Bill # (Mandatory if &gt; ₹50,000)
                      </label>
                      <input
                        type="text"
                        value={quoteFormEwayBill}
                        onChange={(e) => setQuoteFormEwayBill(e.target.value)}
                        placeholder="e.g. 281098234512"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Client / Party Selection */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wide">Client / Customer Details</span>
                  </div>
                  {quoteFormPartyGstin && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      ✓ GSTIN: {quoteFormPartyGstin}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Searchable Client Field */}
                  <div className="relative">
                    <label className="block text-slate-300 font-semibold mb-1">
                      Client / Party Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={quoteFormPartyName}
                        onChange={(e) => {
                          setQuoteFormPartyName(e.target.value);
                          setShowQuotePartyDropdown(true);
                        }}
                        onFocus={() => setShowQuotePartyDropdown(true)}
                        placeholder="Search existing clients by name, phone or GSTIN..."
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-8 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      {quoteFormPartyName && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuoteFormPartyName('');
                            setQuoteFormPartyPhone('');
                            setQuoteFormBillingAddress('');
                            setQuoteFormPartyGstin('');
                            setShowQuotePartyDropdown(true);
                          }}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Searchable Client Dropdown */}
                    {showQuotePartyDropdown && (
                      <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-800">
                        {parties.filter((p) => {
                          const query = (quoteFormPartyName || '').toLowerCase().trim();
                          if (!query) return true;
                          return (
                            p.name.toLowerCase().includes(query) ||
                            (p.phone && p.phone.toLowerCase().includes(query)) ||
                            (p.gstin && p.gstin.toLowerCase().includes(query)) ||
                            (p.city && p.city.toLowerCase().includes(query))
                          );
                        }).length === 0 ? (
                          <div className="p-3 text-slate-400 text-center">
                            No existing clients matching. Using "<strong>{quoteFormPartyName}</strong>" as client.
                            <div className="mt-1">
                              <button
                                type="button"
                                onClick={() => setShowQuotePartyDropdown(false)}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                              >
                                Continue with this party name &rarr;
                              </button>
                            </div>
                          </div>
                        ) : (
                          parties
                            .filter((p) => {
                              const query = (quoteFormPartyName || '').toLowerCase().trim();
                              if (!query) return true;
                              return (
                                p.name.toLowerCase().includes(query) ||
                                (p.phone && p.phone.toLowerCase().includes(query)) ||
                                (p.gstin && p.gstin.toLowerCase().includes(query)) ||
                                (p.city && p.city.toLowerCase().includes(query))
                              );
                            })
                            .map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setQuoteFormPartyName(p.name);
                                  setQuoteFormPartyGstin(p.gstin || '');
                                  setQuoteFormPartyPhone(p.phone || '');
                                  setQuoteFormBillingAddress(p.address || p.address_line1 || '');
                                  if (p.state_region) setQuoteFormPlaceOfSupply(p.state_region);
                                  setShowQuotePartyDropdown(false);
                                }}
                                className="w-full text-left p-2.5 hover:bg-slate-800 transition flex items-center justify-between text-xs"
                              >
                                <div>
                                  <div className="font-semibold text-white flex items-center space-x-1.5">
                                    <span>{p.name}</span>
                                    {p.gstin && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                        {p.gstin}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {p.phone ? `📞 ${p.phone} ` : ''}
                                    {p.city || p.state_region ? `📍 ${p.city || ''} ${p.state_region || ''}` : ''}
                                  </div>
                                </div>
                                <span className="text-[10px] text-indigo-400 font-semibold uppercase bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/50">
                                  Select
                                </span>
                              </button>
                            ))
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Contact Phone / Mobile
                    </label>
                    <input
                      type="text"
                      value={quoteFormPartyPhone}
                      onChange={(e) => setQuoteFormPartyPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Billing / Shipping Address
                  </label>
                  <input
                    type="text"
                    value={quoteFormBillingAddress}
                    onChange={(e) => setQuoteFormBillingAddress(e.target.value)}
                    placeholder="e.g. Plot 42, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra - 400093"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Items & Live In-Stock Table */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wide">
                      {activeSalesDocType || 'Quotation'} Line Items
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    {/* ADD LABOUR / SERVICE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleAddLabourServiceRow('Labour Charges', '998719', 0)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
                      title="Add Labour cost or Service charges with 18% GST (no inventory stock required)"
                    >
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Add Labour / Service (18% GST)</span>
                    </button>
                    {/* ADD REGULAR INVENTORY ITEM BUTTON */}
                    <button
                      type="button"
                      onClick={handleAddQuoteItemRow}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Inventory Item</span>
                    </button>
                  </div>
                </div>

                {/* Helpful Tip for Labour Cost & GST */}
                <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-950/30 px-3 py-2 rounded-xl border border-amber-500/20">
                  <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>Labour cost in quotation:</strong> Click <strong>"+ Add Labour / Service"</strong> to add labour or service charges with SAC code 998719 and standard 18% GST without needing inventory stock count.
                  </span>
                </div>

                {quoteFormItems.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50 space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Boxes className="w-7 h-7 text-indigo-400" />
                      <Wrench className="w-7 h-7 text-amber-400" />
                    </div>
                    <p className="text-slate-300 font-semibold text-sm">No items added to this {activeSalesDocType || 'quotation'} yet.</p>
                    <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                      Add physical goods from your inventory, or add Labour charges / service costs directly with 18% GST.
                    </p>
                    <div className="flex items-center justify-center space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAddLabourServiceRow('Labour Charges', '998719', 0)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold inline-flex items-center space-x-1.5 transition"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        <span>+ Add Labour Cost (18% GST)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAddQuoteItemRow}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center space-x-1.5 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add In-Stock Product</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-2.5 w-8">#</th>
                          <th className="p-2.5 min-w-[220px]">Item Description</th>
                          <th className="p-2.5 min-w-[90px]">HSN/SAC</th>
                          <th className="p-2.5 min-w-[110px]">Stock Status</th>
                          <th className="p-2.5 min-w-[95px]">Qty</th>
                          <th className="p-2.5 min-w-[70px]">Unit</th>
                          <th className="p-2.5 min-w-[100px]">Rate (₹)</th>
                          <th className="p-2.5 min-w-[75px]">Disc %</th>
                          <th className="p-2.5 min-w-[110px]">GST Slab</th>
                          <th className="p-2.5 min-w-[105px]">Total (₹)</th>
                          <th className="p-2.5 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                        {quoteFormItems.map((item, idx) => {
                          const isOverStock = !item.is_service && item.qty > item.available_stock;
                          return (
                            <tr key={item.id} className="hover:bg-slate-900/30">
                              <td className="p-2.5 text-slate-500 text-center font-mono">{idx + 1}</td>
                              <td className="p-2.5">
                                <div className="space-y-1 relative">
                                  {/* Searchable input for product or labour description */}
                                  <div className="relative">
                                    <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                                    <input
                                      type="text"
                                      value={itemSearchQueries[item.id] !== undefined ? itemSearchQueries[item.id] : item.name}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setItemSearchQueries((prev) => ({ ...prev, [item.id]: val }));
                                        setActiveItemSearchId(item.id);
                                        handleQuoteItemChange(item.id, 'name', val);
                                      }}
                                      onFocus={() => {
                                        setActiveItemSearchId(item.id);
                                        if (itemSearchQueries[item.id] === undefined) {
                                          setItemSearchQueries((prev) => ({ ...prev, [item.id]: '' }));
                                        }
                                      }}
                                      placeholder="Search inventory or type Labour charges..."
                                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-7 pr-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                                    />
                                  </div>

                                  {/* Item Search dropdown list */}
                                  {activeItemSearchId === item.id && (
                                    <div className="absolute z-40 left-0 top-full mt-1 w-80 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-800">
                                      {/* Quick action to set current query as Labour / Service */}
                                      <div className="p-2 bg-slate-950 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400">Non-inventory cost:</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const q = (itemSearchQueries[item.id] || item.name || 'Labour Charges').trim();
                                            handleQuoteItemChange(item.id, 'name', q);
                                            handleQuoteItemChange(item.id, 'is_service', true);
                                            handleQuoteItemChange(item.id, 'hsn_sac', '998719');
                                            handleQuoteItemChange(item.id, 'unit', 'JOB');
                                            handleQuoteItemChange(item.id, 'available_stock', 999999);
                                            handleQuoteItemChange(item.id, 'tax_slab', 'GST@18%');
                                            handleQuoteItemChange(item.id, 'tax_rate', 18);
                                            setItemSearchQueries((prev) => {
                                              const copy = { ...prev };
                                              delete copy[item.id];
                                              return copy;
                                            });
                                            setActiveItemSearchId(null);
                                          }}
                                          className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center space-x-1"
                                        >
                                          <Wrench className="w-3 h-3 text-amber-400" />
                                          <span>Use as Labour / Service (18% GST)</span>
                                        </button>
                                      </div>

                                      {inventory.filter((inv) => {
                                        const q = (itemSearchQueries[item.id] ?? '').toLowerCase().trim();
                                        if (!q) return true;
                                        return (
                                          inv.name.toLowerCase().includes(q) ||
                                          (inv.sku && inv.sku.toLowerCase().includes(q)) ||
                                          (inv.item_code && inv.item_code.toLowerCase().includes(q)) ||
                                          (inv.brand && inv.brand.toLowerCase().includes(q)) ||
                                          (inv.category && inv.category.toLowerCase().includes(q)) ||
                                          (inv.hsn_sac && inv.hsn_sac.toLowerCase().includes(q))
                                        );
                                      }).length === 0 ? (
                                        <div className="p-3 text-slate-400 text-center text-[11px]">
                                          No matching inventory products found.
                                        </div>
                                      ) : (
                                        inventory
                                          .filter((inv) => {
                                            const q = (itemSearchQueries[item.id] ?? '').toLowerCase().trim();
                                            if (!q) return true;
                                            return (
                                              inv.name.toLowerCase().includes(q) ||
                                              (inv.sku && inv.sku.toLowerCase().includes(q)) ||
                                              (inv.item_code && inv.item_code.toLowerCase().includes(q)) ||
                                              (inv.brand && inv.brand.toLowerCase().includes(q)) ||
                                              (inv.category && inv.category.toLowerCase().includes(q)) ||
                                              (inv.hsn_sac && inv.hsn_sac.toLowerCase().includes(q))
                                            );
                                          })
                                          .map((inv) => {
                                            const isSrv = Boolean(
                                              inv.is_service ||
                                              inv.category === 'Services' ||
                                              inv.category === 'Labour' ||
                                              inv.unit === 'JOB' ||
                                              inv.unit === 'HRS'
                                            );
                                            const stockNum = Number(inv.stock || 0);
                                            const isOut = !isSrv && stockNum <= 0;
                                            return (
                                              <button
                                                key={inv.id}
                                                type="button"
                                                disabled={isOut}
                                                onClick={() => {
                                                  handleQuoteItemChange(item.id, 'itemId', inv.id);
                                                  setItemSearchQueries((prev) => {
                                                    const copy = { ...prev };
                                                    delete copy[item.id];
                                                    return copy;
                                                  });
                                                  setActiveItemSearchId(null);
                                                }}
                                                className={`w-full text-left p-2.5 transition flex items-center justify-between text-xs ${
                                                  isOut ? 'opacity-40 bg-slate-950 cursor-not-allowed' : 'hover:bg-slate-800'
                                                }`}
                                              >
                                                <div>
                                                  <div className="font-semibold text-white flex items-center space-x-1.5">
                                                    <span>{inv.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                      ({inv.item_code || inv.sku || 'SKU'})
                                                    </span>
                                                  </div>
                                                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-2">
                                                    <span>₹{Number(inv.sale_price).toLocaleString('en-IN')}</span>
                                                    <span>&bull;</span>
                                                    <span className="text-indigo-300">{inv.tax_slab || 'GST@18%'}</span>
                                                  </div>
                                                </div>
                                                {isSrv ? (
                                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-amber-500/15 text-amber-300 border-amber-500/30">
                                                    Service (No Stock)
                                                  </span>
                                                ) : (
                                                  <span
                                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                      isOut
                                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                                    }`}
                                                  >
                                                    {isOut ? '0 Stock' : `${stockNum} ${inv.unit || 'PCS'}`}
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          })
                                      )}
                                    </div>
                                  )}

                                  {item.sku && (
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      Code: {item.sku}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="text"
                                  value={item.hsn_sac || ''}
                                  onChange={(e) => handleQuoteItemChange(item.id, 'hsn_sac', e.target.value)}
                                  placeholder="HSN/SAC"
                                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5 font-mono text-xs focus:outline-none"
                                />
                              </td>
                              <td className="p-2.5">
                                {item.is_service ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                                    <Wrench className="w-2.5 h-2.5 mr-1 text-amber-400" />
                                    Labour / Service
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                      item.available_stock > 0
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                    }`}
                                  >
                                    {item.available_stock} {item.unit}
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5">
                                <div>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.is_service ? undefined : item.available_stock}
                                    value={item.qty}
                                    onChange={(e) => handleQuoteItemChange(item.id, 'qty', e.target.value)}
                                    className={`w-full bg-slate-900 border rounded-lg p-1.5 font-mono text-xs focus:outline-none ${
                                      isOverStock
                                        ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                                        : 'border-slate-700 text-white focus:border-indigo-500'
                                    }`}
                                  />
                                  {isOverStock && (
                                    <span className="text-[10px] text-rose-400 block mt-0.5 font-medium">
                                      Max {item.available_stock}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="text"
                                  value={item.unit}
                                  onChange={(e) => handleQuoteItemChange(item.id, 'unit', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-1.5 text-xs text-center focus:outline-none"
                                />
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.rate}
                                  onChange={(e) => handleQuoteItemChange(item.id, 'rate', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5 font-mono text-xs focus:outline-none"
                                />
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={item.discount_percent}
                                  onChange={(e) => handleQuoteItemChange(item.id, 'discount_percent', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5 font-mono text-xs text-center focus:outline-none"
                                />
                              </td>
                              <td className="p-2.5">
                                <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-center space-y-0.5 min-w-[110px]">
                                  <div className="flex items-center justify-center space-x-1 text-[11px] font-semibold text-slate-200">
                                    <span title="Tax rate is locked to Inventory specification" className="inline-flex items-center">
                                      <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                                    </span>
                                    <span>{item.tax_slab || 'GST@18%'}</span>
                                  </div>
                                  <div className="text-[10px] font-mono text-indigo-300 font-bold">
                                    ({item.tax_rate}%)
                                  </div>
                                </div>
                              </td>
                              <td className="p-2.5 font-mono font-bold text-white">
                                ₹{Number(item.total).toLocaleString('en-IN')}
                              </td>
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQuoteItemRow(item.id)}
                                  className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 4. Terms, Notes & Financial Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Terms and Status */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Terms & Conditions / Quotation Validity
                    </label>
                    <textarea
                      rows={3}
                      value={quoteFormTerms}
                      onChange={(e) => setQuoteFormTerms(e.target.value)}
                      placeholder="Specify validity period, advance requirements, etc."
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Quotation Status
                      </label>
                      <select
                        value={quoteFormStatus}
                        onChange={(e) => setQuoteFormStatus(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Draft">Draft</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Client Notes / Remarks
                      </label>
                      <input
                        type="text"
                        value={quoteFormNotes}
                        onChange={(e) => setQuoteFormNotes(e.target.value)}
                        placeholder="e.g. Scope of supply as discussed"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Tax & Valuation Summary Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-900 border border-indigo-500/20 space-y-2.5">
                  <div className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800 flex justify-between items-center">
                    <span>Tax & Valuation Summary</span>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      {isQuoteIntraState ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono text-white font-semibold">
                      ₹{currentQuoteSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {currentQuoteDiscount > 0 && (
                    <div className="flex justify-between items-center text-xs text-emerald-400">
                      <span>Total Item Discount:</span>
                      <span className="font-mono">
                        -₹{currentQuoteDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  {isQuoteIntraState ? (
                    <>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Central GST (CGST):</span>
                        <span className="font-mono text-slate-300">
                          ₹{(currentQuoteTax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>State GST (SGST):</span>
                        <span className="font-mono text-slate-300">
                          ₹{(currentQuoteTax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Integrated GST (IGST):</span>
                      <span className="font-mono text-slate-300">
                        ₹{currentQuoteTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Total GST Tax:</span>
                    <span className="font-mono text-indigo-300 font-semibold">
                      ₹{currentQuoteTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {currentQuoteRoundOff !== 0 && (
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Round Off:</span>
                      <span className="font-mono text-slate-300">
                        {currentQuoteRoundOff > 0 ? `+₹${currentQuoteRoundOff}` : `-₹${Math.abs(currentQuoteRoundOff)}`}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-bold text-white">Grand Quotation Total:</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      ₹{currentQuoteGrandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-0.5 italic">
                    {numberToIndianWords(currentQuoteGrandTotal)}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs text-slate-400">
                  {quoteFormItems.some((it) => it.qty > it.available_stock) ? (
                    <span className="text-rose-400 font-medium flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 inline" />
                      <span>One or more items exceed in-stock limits. Adjust quantities to proceed.</span>
                    </span>
                  ) : quoteFormItems.length === 0 ? (
                    <span className="text-amber-400">Add at least 1 in-stock line item.</span>
                  ) : (
                    <span className="text-emerald-400 font-medium">✓ Ready to generate {activeSalesDocType || 'document'}. All items within stock limits.</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowQuotationModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteFormItems.length === 0 || quoteFormItems.some((it) => it.qty > it.available_stock || it.qty <= 0)}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {activeSalesDocType === 'Sale Order'
                        ? 'Save & Generate Sale Order'
                        : editingQuotationId
                        ? `Update ${activeSalesDocType || 'Document'}`
                        : `Save & Generate ${activeSalesDocType || 'Document'}`}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW QUOTATION MODAL (PRINT-READY PREVIEW) */}
      {viewingQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl my-auto max-h-[94vh] flex flex-col overflow-hidden">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  {viewingQuotation.doc_number}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                    viewingQuotation.status === 'Converted'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : viewingQuotation.status === 'Accepted'
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {viewingQuotation.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                {!(
                  (viewingQuotation.doc_type === 'Sale Order' ||
                    viewingQuotation.doc_type === 'Proforma Invoice') &&
                  isDocMovedToNextStage(viewingQuotation)
                ) && (
                  <button
                    onClick={() => {
                      const doc = viewingQuotation;
                      setViewingQuotation(null);
                      if (
                        doc.doc_type === 'Quotation' ||
                        doc.doc_type === 'Sale Order' ||
                        doc.doc_type === 'Proforma Invoice' ||
                        doc.doc_type === 'Delivery Challan' ||
                        doc.doc_type === 'Invoices'
                      ) {
                        handleOpenEditSalesDoc(doc);
                      } else {
                        setNewSaleDoc({
                          party_name: doc.party_name,
                          amount: doc.amount,
                          tax_amount: doc.tax_amount,
                          status: doc.status,
                          notes: doc.notes || '',
                        });
                        setShowAddSaleModal(true);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 border border-indigo-800/60 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}
                {/* Convert to Invoice: STRICTLY for Quotation documents only, NEVER for Invoices */}
                {viewingQuotation.doc_type === 'Quotation' && viewingQuotation.status !== 'Converted' && (
                  <button
                    onClick={() => {
                      const doc = viewingQuotation;
                      setViewingQuotation(null);
                      setConvertingQuotation(doc);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                  >
                    <ArrowRightCircle className="w-3.5 h-3.5" />
                    <span>Convert to Invoice</span>
                  </button>
                )}
                {/* Record Payment shortcut when viewing an Invoice */}
                {viewingQuotation.doc_type === 'Invoices' && (
                  <button
                    onClick={() => {
                      const doc = viewingQuotation;
                      setViewingQuotation(null);
                      handleOpenRecordPayment(doc);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                )}
                <button
                  onClick={() => setViewingQuotation(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content (Rendered on High Contrast Paper Card) */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-900 text-slate-900">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 text-slate-900 space-y-6 max-w-3xl mx-auto">
                {/* Letterhead */}
                <div className="flex justify-between items-start pb-5 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {businessProfile.business_name}
                    </h2>
                    {businessProfile.trade_name && (
                      <p className="text-xs text-slate-500 font-medium">{businessProfile.trade_name}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-1 max-w-sm">{businessProfile.address}</p>
                    <p className="text-xs text-slate-600">State: {businessProfile.state}</p>
                    <p className="text-xs text-slate-600">Phone: {businessProfile.phone} &bull; Email: {businessProfile.email}</p>
                    <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">GSTIN: {businessProfile.gst_number}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                      TAX ESTIMATE / QUOTATION
                    </span>
                    <div className="mt-3 space-y-1 text-xs">
                      <p className="text-slate-500">
                        Quotation #: <strong className="font-mono text-slate-900">{viewingQuotation.doc_number}</strong>
                      </p>
                      <p className="text-slate-500">
                        Date: <strong className="text-slate-800">{new Date(viewingQuotation.date).toLocaleDateString('en-IN')}</strong>
                      </p>
                      {viewingQuotation.due_date && (
                        <p className="text-slate-500">
                          Valid Until: <strong className="text-slate-800">{new Date(viewingQuotation.due_date).toLocaleDateString('en-IN')}</strong>
                        </p>
                      )}
                      <p className="text-slate-500">
                        Place of Supply: <strong className="text-slate-800">{viewingQuotation.place_of_supply || businessProfile.state}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Quotation Prepared For
                  </div>
                  <div className="text-sm font-bold text-slate-900">{viewingQuotation.party_name}</div>
                  {viewingQuotation.notes && (
                    <div className="text-xs text-slate-600 mt-0.5">Subject / Note: {viewingQuotation.notes}</div>
                  )}
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-8">#</th>
                        <th className="p-3">Item Description</th>
                        <th className="p-3">HSN/SAC</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Rate</th>
                        <th className="p-3 text-right">Disc %</th>
                        <th className="p-3 text-right">Tax %</th>
                        <th className="p-3 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        let parsedItems: any[] = [];
                        try {
                          if (typeof viewingQuotation.items === 'string') {
                            parsedItems = JSON.parse(viewingQuotation.items);
                          } else if (Array.isArray(viewingQuotation.items)) {
                            parsedItems = viewingQuotation.items;
                          }
                        } catch {
                          parsedItems = [];
                        }

                        if (parsedItems.length === 0) {
                          return (
                            <tr>
                              <td className="p-3 text-center">1</td>
                              <td className="p-3 font-medium">Standard Quotation Package</td>
                              <td className="p-3 font-mono text-slate-500">998311</td>
                              <td className="p-3 text-right font-mono">1 PCS</td>
                              <td className="p-3 text-right font-mono">₹{Number(viewingQuotation.amount - viewingQuotation.tax_amount).toLocaleString('en-IN')}</td>
                              <td className="p-3 text-right font-mono">0%</td>
                              <td className="p-3 text-right font-mono">18%</td>
                              <td className="p-3 text-right font-mono font-bold">₹{Number(viewingQuotation.amount).toLocaleString('en-IN')}</td>
                            </tr>
                          );
                        }

                        return parsedItems.map((it: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-3 text-slate-500 text-center font-mono">{i + 1}</td>
                            <td className="p-3 font-semibold text-slate-900">
                              {it.name}
                              {it.sku && <span className="block text-[10px] text-slate-500 font-mono font-normal">Code: {it.sku}</span>}
                            </td>
                            <td className="p-3 font-mono text-slate-600">{it.hsn_sac || '-'}</td>
                            <td className="p-3 text-right font-mono font-medium">
                              {it.qty} {it.unit || 'PCS'}
                            </td>
                            <td className="p-3 text-right font-mono">₹{Number(it.rate || 0).toLocaleString('en-IN')}</td>
                            <td className="p-3 text-right font-mono">{it.discount_percent || 0}%</td>
                            <td className="p-3 text-right font-mono">{it.tax_rate ?? 18}%</td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900">
                              ₹{Number(it.total || 0).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Tax Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                        Payment & Bank Details
                      </span>
                      <p className="text-slate-600">Bank: <strong className="text-slate-800">{businessProfile.bank_name}</strong></p>
                      <p className="text-slate-600 font-mono">Account: <strong className="text-slate-800">{businessProfile.bank_account}</strong></p>
                      <p className="text-slate-600 font-mono">IFSC: <strong className="text-slate-800">{businessProfile.bank_ifsc}</strong></p>
                      {businessProfile.upi_id && (
                        <p className="text-slate-600 font-mono">UPI ID: <strong className="text-slate-800">{businessProfile.upi_id}</strong></p>
                      )}
                    </div>
                    {viewingQuotation.terms_conditions && (
                      <div className="text-[11px] text-slate-600">
                        <strong className="block text-slate-800 text-xs mb-0.5">Terms & Conditions:</strong>
                        <p className="whitespace-pre-line font-mono">{viewingQuotation.terms_conditions}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal (Taxable):</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ₹{Number(viewingQuotation.subtotal || (viewingQuotation.amount - viewingQuotation.tax_amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total GST Tax:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ₹{Number(viewingQuotation.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-300 text-slate-900">
                      <span>Grand Total:</span>
                      <span className="font-mono text-base text-indigo-700">
                        ₹{Number(viewingQuotation.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 italic pt-1 text-right">
                      {numberToIndianWords(Number(viewingQuotation.amount))}
                    </div>
                  </div>
                </div>

                {/* Signatory */}
                <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                  <div>
                    This is a computer-generated quotation estimate. No signature required.
                  </div>
                  <div className="text-right">
                    <div className="h-10"></div>
                    <p className="font-bold text-slate-800">For {businessProfile.business_name}</p>
                    <p className="text-[11px]">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONVERT TO INVOICE MODAL (WITH REAL-TIME INVENTORY SYNCHRONIZATION) */}
      {convertingQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ArrowRightCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Convert Quotation to Invoice</h3>
                  <p className="text-xs text-slate-400">
                    Generates an official Tax Invoice and automatically synchronizes inventory stock.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConvertingQuotation(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quotation Info Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Quotation #</span>
                <span className="font-mono font-bold text-indigo-300">{convertingQuotation.doc_number}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Customer</span>
                <span className="font-semibold text-white truncate block">{convertingQuotation.party_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Amount</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{Number(convertingQuotation.amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Inventory Synchronization Impact Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inventory Stock Deduction Preview</span>
                </span>
                <span className="text-[10px] text-slate-400">Stock will be decremented</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 max-h-48 overflow-y-auto space-y-2 text-xs">
                {(() => {
                  let itemsList: any[] = [];
                  try {
                    if (typeof convertingQuotation.items === 'string') {
                      itemsList = JSON.parse(convertingQuotation.items);
                    } else if (Array.isArray(convertingQuotation.items)) {
                      itemsList = convertingQuotation.items;
                    }
                  } catch {
                    itemsList = [];
                  }

                  if (itemsList.length === 0) {
                    return (
                      <p className="text-slate-500 text-center py-2 text-xs">
                        Legacy quotation without itemized inventory lines. Converting will create the invoice without stock deduction.
                      </p>
                    );
                  }

                  return itemsList.map((it: any, idx: number) => {
                    const invProd = inventory.find(
                      (p) => p.id === it.itemId || p.name.toLowerCase() === (it.name || '').toLowerCase()
                    );
                    const currentStock = invProd ? Number(invProd.stock || 0) : 0;
                    const deductQty = Number(it.qty || 1);
                    const remaining = Math.max(0, currentStock - deductQty);

                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-white">{it.name}</div>
                          <div className="text-[11px] text-slate-400">
                            Quotation Qty: <strong className="text-indigo-300 font-mono">-{deductQty} {it.unit || 'PCS'}</strong>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">
                            Current: <span className="font-mono text-slate-300">{currentStock}</span> &rarr; After: <span className="font-mono font-bold text-emerald-400">{remaining}</span>
                          </div>
                          {currentStock < deductQty ? (
                            <span className="text-[10px] text-amber-400 font-medium">⚠️ Low stock (reaches 0)</span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-medium">✓ Sufficient stock</span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setConvertingQuotation(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConvertQuotationToInvoice}
                disabled={isConvertingQuote}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition"
              >
                {isConvertingQuote ? (
                  <span>Converting & Updating Stock...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Convert to Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MIGRATE SALE ORDER TO PROFORMA MODAL */}
      {migratingSaleOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ArrowRightCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Generate Proforma Invoice</h3>
                  <p className="text-xs text-slate-400">
                    Migrate confirmed Sale Order into an advance commercial Proforma Invoice.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMigratingSaleOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sale Order Details */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sale Order #</span>
                <span className="font-mono font-bold text-indigo-300">{migratingSaleOrder.doc_number}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Client</span>
                <span className="font-semibold text-white truncate block">{migratingSaleOrder.party_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Amount</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{Number(migratingSaleOrder.amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-950/25 border border-cyan-800/40 text-xs space-y-1.5 text-cyan-300">
              <div className="font-semibold flex items-center space-x-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Single-Generation Workflow Lock</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Generating this Proforma Invoice will permanently transition Sale Order <strong>#{migratingSaleOrder.doc_number}</strong> to <span className="text-emerald-400 font-bold">PI Generated</span> status, disabling duplicate migration.
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => {
                  const doc = migratingSaleOrder;
                  setMigratingSaleOrder(null);
                  handleMigrateSaleOrderToProforma(doc);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center space-x-1"
              >
                <span>Edit items in editor &rarr;</span>
              </button>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setMigratingSaleOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMigrateSaleOrderToProforma}
                  disabled={isMigratingSo}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-cyan-600/30 transition cursor-pointer"
                >
                  {isMigratingSo ? (
                    <span>Generating Proforma...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Generate PI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SEND WHATSAPP PAYMENT REMINDER MODAL */}
      {reminderInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl my-auto space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      WhatsApp Notification
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{reminderInvoice.doc_number}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">Send Payment Reminder</h3>
                  <p className="text-xs text-slate-400">
                    Notify {reminderInvoice.party_name} of past-due balance via direct WhatsApp message.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReminderInvoice(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
              {/* Overdue Snapshot Summary */}
              {(() => {
                const total = Number(reminderInvoice.amount || 0);
                const paid = Number(reminderInvoice.paid_amount !== undefined ? reminderInvoice.paid_amount : (reminderInvoice.status === 'Paid' ? total : 0));
                const remaining = reminderInvoice.remaining_amount !== undefined ? Number(reminderInvoice.remaining_amount) : Math.max(0, total - paid);
                const dueDateObj = reminderInvoice.due_date ? new Date(reminderInvoice.due_date) : null;
                const todayObj = new Date();
                todayObj.setHours(0, 0, 0, 0);
                const daysOverdue = dueDateObj ? Math.max(1, Math.ceil((todayObj.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24))) : 0;

                return (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Due Date</span>
                      <span className="font-semibold text-white">
                        {reminderInvoice.due_date ? new Date(reminderInvoice.due_date).toLocaleDateString() : 'Immediate'}
                      </span>
                      <div className="mt-0.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          ⚠ {daysOverdue} days overdue
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Invoice Total</span>
                      <span className="font-mono font-bold text-slate-300">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-emerald-400 font-medium">
                        Paid: ₹{paid.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400 uppercase tracking-wider font-bold block">Balance Due</span>
                      <span className="font-mono text-base font-extrabold text-amber-400 block">
                        ₹{remaining.toLocaleString('en-IN')}
                      </span>
                      {(reminderInvoice as any).reminder_count ? (
                        <span className="text-[10px] text-slate-400">
                          {(reminderInvoice as any).reminder_count} reminder(s) sent
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })()}

              {/* Client WhatsApp Number Field */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold flex items-center justify-between">
                  <span>Client WhatsApp Mobile Number <span className="text-emerald-400">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">Include country code if outside India</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">+</span>
                  <input
                    type="text"
                    value={reminderRecipientPhone}
                    onChange={(e) => {
                      setReminderRecipientPhone(e.target.value);
                    }}
                    placeholder="919876543210"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-7 pr-3 p-2.5 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Auto-populated from Client directory. Notification triggers client WhatsApp conversation.
                </p>
              </div>

              {/* Message Preview Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                    <span>Message Preview</span>
                    <span className="text-[10px] font-normal text-slate-400">(Editable)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyReminderMessage}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{reminderCopied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                  </button>
                </div>
                <div className="relative rounded-2xl bg-[#0b141a] border border-[#202c33] p-3.5 font-sans shadow-inner">
                  <div className="text-[10px] text-emerald-400 font-mono mb-1 font-semibold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    <span>WhatsApp Chat Message Preview</span>
                  </div>
                  <textarea
                    rows={8}
                    value={reminderCustomMessage}
                    onChange={(e) => setReminderCustomMessage(e.target.value)}
                    className="w-full bg-transparent text-slate-200 text-xs font-mono border-0 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs shrink-0">
              <button
                type="button"
                onClick={() => setReminderInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyReminderMessage}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{reminderCopied ? 'Copied!' : 'Copy Text'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSendWhatsAppNotification}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Notification</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SALE MODAL (FOR INVOICES / PROFORMA / DELIVERY CHALLAN) */}
      {showAddSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create {activeSaleSub}</h3>
              <button onClick={() => setShowAddSaleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSale} className="space-y-3 text-xs">
              {/* Searchable Client Party Name Field */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-semibold">
                    Client / Party Name <span className="text-rose-400">*</span>
                  </label>
                  {(() => {
                    const matchedParty = parties.find(
                      (p) => p.name.toLowerCase() === (newSaleDoc.party_name || '').toLowerCase().trim()
                    );
                    if (matchedParty?.gstin) {
                      return (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          ✓ GSTIN: {matchedParty.gstin}
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={newSaleDoc.party_name}
                    onChange={(e) => {
                      setNewSaleDoc({ ...newSaleDoc, party_name: e.target.value });
                      setShowSalePartyDropdown(true);
                    }}
                    onFocus={() => setShowSalePartyDropdown(true)}
                    placeholder="Search existing clients by name, phone or GSTIN..."
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-8 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  {newSaleDoc.party_name && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewSaleDoc({ ...newSaleDoc, party_name: '' });
                        setShowSalePartyDropdown(true);
                      }}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdown list of matching existing clients */}
                {showSalePartyDropdown && (
                  <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl divide-y divide-slate-800">
                    {parties.filter((p) => {
                      const query = (newSaleDoc.party_name || '').toLowerCase().trim();
                      if (!query) return true;
                      return (
                        p.name.toLowerCase().includes(query) ||
                        (p.phone && p.phone.toLowerCase().includes(query)) ||
                        (p.gstin && p.gstin.toLowerCase().includes(query)) ||
                        (p.city && p.city.toLowerCase().includes(query))
                      );
                    }).length === 0 ? (
                      <div className="p-3 text-slate-400 text-center">
                        No clients matching. Using "<strong>{newSaleDoc.party_name}</strong>" as client.
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() => setShowSalePartyDropdown(false)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                          >
                            Continue with this name &rarr;
                          </button>
                        </div>
                      </div>
                    ) : (
                      parties
                        .filter((p) => {
                          const query = (newSaleDoc.party_name || '').toLowerCase().trim();
                          if (!query) return true;
                          return (
                            p.name.toLowerCase().includes(query) ||
                            (p.phone && p.phone.toLowerCase().includes(query)) ||
                            (p.gstin && p.gstin.toLowerCase().includes(query)) ||
                            (p.city && p.city.toLowerCase().includes(query))
                          );
                        })
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setNewSaleDoc({ ...newSaleDoc, party_name: p.name });
                              setShowSalePartyDropdown(false);
                            }}
                            className="w-full text-left p-2.5 hover:bg-slate-800 transition flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-white flex items-center space-x-1.5">
                                <span>{p.name}</span>
                                {p.gstin && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {p.gstin}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {p.phone ? `📞 ${p.phone} ` : ''}
                                {p.city || p.state_region ? `📍 ${p.city || ''} ${p.state_region || ''}` : ''}
                              </div>
                            </div>
                            <span className="text-[10px] text-indigo-400 font-semibold uppercase bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/50">
                              Select
                            </span>
                          </button>
                        ))
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newSaleDoc.amount}
                    onChange={(e) =>
                      setNewSaleDoc({
                        ...newSaleDoc,
                        amount: Number(e.target.value),
                        tax_amount: Math.round(Number(e.target.value) * 0.18),
                      })
                    }
                    placeholder="50000"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GST Tax Amount (₹)</label>
                  <input
                    type="number"
                    value={newSaleDoc.tax_amount}
                    onChange={(e) => setNewSaleDoc({ ...newSaleDoc, tax_amount: Number(e.target.value) })}
                    placeholder="9000"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={newSaleDoc.status}
                  onChange={(e) => setNewSaleDoc({ ...newSaleDoc, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={newSaleDoc.notes}
                  onChange={(e) => setNewSaleDoc({ ...newSaleDoc, notes: e.target.value })}
                  placeholder="e.g. Monthly maintenance contract"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSaleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Generate {activeSaleSub}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL (FOR INVOICES) */}
      {recordingPaymentDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      Record Payment
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {recordingPaymentDoc.doc_number}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Invoice Payment &bull; {recordingPaymentDoc.party_name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRecordingPaymentDoc(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleRecordPayment} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {paymentRecordError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{paymentRecordError}</div>
                  <button
                    type="button"
                    onClick={() => setPaymentRecordError(null)}
                    className="text-rose-400 hover:text-rose-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Financial Status Summary */}
              {(() => {
                const total = Number(recordingPaymentDoc.amount || 0);
                const paid = Number(
                  recordingPaymentDoc.paid_amount !== undefined
                    ? recordingPaymentDoc.paid_amount
                    : recordingPaymentDoc.status === 'Paid'
                    ? total
                    : 0
                );
                const remaining =
                  recordingPaymentDoc.remaining_amount !== undefined
                    ? Number(recordingPaymentDoc.remaining_amount)
                    : Math.max(0, total - paid);
                const isFullyPaid = remaining <= 0;

                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                          Total Invoice
                        </div>
                        <div className="text-sm font-bold font-mono text-white mt-1">
                          ₹{total.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center">
                        <div className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                          Received (Paid)
                        </div>
                        <div className="text-sm font-bold font-mono text-emerald-300 mt-1">
                          ₹{paid.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-center">
                        <div className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                          Remaining Due
                        </div>
                        <div className="text-sm font-bold font-mono text-amber-300 mt-1">
                          ₹{remaining.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {isFullyPaid && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span className="font-semibold text-xs">
                          This invoice is already fully settled and paid! You can review recorded payments below.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Payment Details Form */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-semibold">
                    Payment Amount to Record (₹) <span className="text-rose-400">*</span>
                  </label>
                  {(() => {
                    const total = Number(recordingPaymentDoc.amount || 0);
                    const paid = Number(recordingPaymentDoc.paid_amount || 0);
                    const remaining =
                      recordingPaymentDoc.remaining_amount !== undefined
                        ? Number(recordingPaymentDoc.remaining_amount)
                        : Math.max(0, total - paid);
                    if (remaining > 0 && paymentFormAmount !== remaining) {
                      return (
                        <button
                          type="button"
                          onClick={() => setPaymentFormAmount(remaining)}
                          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
                        >
                          Pay Full Balance (₹{remaining.toLocaleString('en-IN')})
                        </button>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={paymentFormAmount || ''}
                    onChange={(e) => setPaymentFormAmount(Number(e.target.value))}
                    placeholder="Enter received amount"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 p-2.5 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Payment Date <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentFormDate}
                      onChange={(e) => setPaymentFormDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Payment Mode <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={paymentFormMode}
                      onChange={(e) => setPaymentFormMode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                      <option value="UPI / QR">UPI / QR Payment</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Other">Other Mode</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Reference / UTR / Cheque #
                  </label>
                  <input
                    type="text"
                    value={paymentFormRef}
                    onChange={(e) => setPaymentFormRef(e.target.value)}
                    placeholder="e.g. UTR-HDFC9021948 or UPI Ref 41092873"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Payment Notes / Remarks
                  </label>
                  <input
                    type="text"
                    value={paymentFormNotes}
                    onChange={(e) => setPaymentFormNotes(e.target.value)}
                    placeholder="e.g. Received via NEFT on invoice milestone #1"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Past Payment History */}
              {(() => {
                let pastPayments: any[] = [];
                try {
                  if (typeof recordingPaymentDoc.payments === 'string') {
                    pastPayments = JSON.parse(recordingPaymentDoc.payments);
                  } else if (Array.isArray(recordingPaymentDoc.payments)) {
                    pastPayments = recordingPaymentDoc.payments;
                  }
                } catch {
                  pastPayments = [];
                }

                if (pastPayments.length === 0) return null;

                return (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                      <History className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Payment Transactions History ({pastPayments.length})</span>
                    </div>
                    <div className="divide-y divide-slate-800/80 rounded-xl overflow-hidden border border-slate-800 max-h-48 overflow-y-auto">
                      {pastPayments.map((p, pIdx) => (
                        <div
                          key={p.id || pIdx}
                          className="p-2.5 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-white flex items-center space-x-2">
                              <span>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                                {p.payment_mode}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {p.date ? new Date(p.date).toLocaleDateString() : 'N/A'}
                              {p.ref_number ? ` • Ref: ${p.ref_number}` : ''}
                              {p.notes ? ` • ${p.notes}` : ''}
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">
                            ✓ Recorded
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRecordingPaymentDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isRecordingPayment || paymentFormAmount <= 0}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition"
                >
                  {isRecordingPayment ? (
                    <span>Syncing Payment...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Record &amp; Sync Payment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE RECEIPT MODAL */}
      {showAddReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Record Entry: {activeReceiptSub}</h3>
              <button onClick={() => setShowAddReceiptModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateReceipt} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Party / Vendor</label>
                <input
                  type="text"
                  required
                  value={newReceipt.party_name}
                  onChange={(e) => setNewReceipt({ ...newReceipt, party_name: e.target.value })}
                  placeholder="e.g. CloudScale Hardware"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newReceipt.category}
                    onChange={(e) => setNewReceipt({ ...newReceipt, category: e.target.value })}
                    placeholder="Operations / Rent / Advance"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newReceipt.amount}
                    onChange={(e) => setNewReceipt({ ...newReceipt, amount: Number(e.target.value) })}
                    placeholder="15000"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Mode</label>
                <select
                  value={newReceipt.payment_mode}
                  onChange={(e) => setNewReceipt({ ...newReceipt, payment_mode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddReceiptModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INVENTORY MODAL */}
      {showAddInventoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Add Stock Item</h3>
                <p className="text-[11px] text-slate-400">Enter product pricing, tax slab, and stock details</p>
              </div>
              <button onClick={() => setShowAddInventoryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateInventory} className="space-y-3.5 text-xs">
              {/* Item Type: Physical Goods vs Service / Labour */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">Item Classification</label>
                <div className="flex items-center space-x-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setNewInventory({
                        ...newInventory,
                        is_service: false,
                        unit: 'PCS',
                        category: categories[0] || 'General',
                        hsn_sac: '844332',
                        stock: 10,
                        min_stock: 5,
                      });
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      !newInventory.is_service
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Physical Product / Goods</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewInventory({
                        ...newInventory,
                        is_service: true,
                        unit: 'JOB',
                        category: 'Services',
                        hsn_sac: '998719',
                        tax_slab: 'GST@18%',
                        tax_rate: 18,
                        stock: 999999,
                        min_stock: 0,
                      });
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      newInventory.is_service
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Service / Labour Cost (No Stock)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {newInventory.is_service ? 'Service / Labour Name *' : 'Item Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newInventory.name}
                  onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
                  placeholder={newInventory.is_service ? "e.g. Labour Charges, Installation & Commissioning, Maintenance" : "e.g. Solar Panel 540W Mono PERC"}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              {/* 2. Item Code & 3. Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {newInventory.is_service ? 'Service Code' : 'Item Code'}
                  </label>
                  <input
                    type="text"
                    value={newInventory.item_code}
                    onChange={(e) => setNewInventory({ ...newInventory, item_code: e.target.value, sku: e.target.value })}
                    placeholder={newInventory.is_service ? "e.g. SRV-LABOUR-01" : "e.g. ITEM-001"}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {newInventory.is_service ? 'Service Provider / Division' : 'Brand'}
                  </label>
                  <input
                    type="text"
                    value={newInventory.brand}
                    onChange={(e) => setNewInventory({ ...newInventory, brand: e.target.value })}
                    placeholder={newInventory.is_service ? "e.g. In-house Technical Team" : "e.g. Tata Solar / Luminous"}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* 1. Category & HSN/SAC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Category</label>
                    {!showAddCategoryInput && (
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryInput(true)}
                        className="text-indigo-400 hover:text-indigo-300 text-[11px] font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Category
                      </button>
                    )}
                  </div>
                  {showAddCategoryInput ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 bg-slate-950 border border-indigo-500 text-white rounded-xl p-2 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-2.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCategoryInput(false);
                          setNewCategoryName('');
                        }}
                        className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <select
                      value={newInventory.category}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setShowAddCategoryInput(true);
                        } else {
                          setNewInventory({ ...newInventory, category: e.target.value });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__add_new__">+ Add New Category...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {newInventory.is_service ? 'SAC Code (Services)' : 'HSN / SAC Code'}
                  </label>
                  <input
                    type="text"
                    value={newInventory.hsn_sac}
                    onChange={(e) => setNewInventory({ ...newInventory, hsn_sac: e.target.value })}
                    placeholder={newInventory.is_service ? "998719 or 998311" : "844332"}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* 4. Sales Price and with/without tax */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {newInventory.is_service ? 'Service Rate (₹) *' : 'Sales Price (₹) *'}
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    <input
                      type="number"
                      required
                      value={newInventory.sale_price}
                      onChange={(e) => setNewInventory({ ...newInventory, sale_price: Number(e.target.value) })}
                      placeholder="0.00"
                      className="col-span-3 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    />
                    <select
                      value={newInventory.sale_tax_type}
                      onChange={(e) => setNewInventory({ ...newInventory, sale_tax_type: e.target.value })}
                      className="col-span-2 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-[11px]"
                    >
                      <option value="Without Tax">Without Tax</option>
                      <option value="With Tax">With Tax</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {newInventory.is_service ? 'Direct Cost (₹)' : 'Purchase Price (₹)'}
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    <input
                      type="number"
                      value={newInventory.purchase_price}
                      onChange={(e) => setNewInventory({ ...newInventory, purchase_price: Number(e.target.value) })}
                      placeholder="0.00"
                      className="col-span-3 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    />
                    <select
                      value={newInventory.purchase_tax_type}
                      onChange={(e) => setNewInventory({ ...newInventory, purchase_tax_type: e.target.value })}
                      className="col-span-2 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-[11px]"
                    >
                      <option value="Without Tax">Without Tax</option>
                      <option value="With Tax">With Tax</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax Slab & Measuring Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Tax Slab</label>
                    <span className="text-[11px] font-mono text-cyan-400">
                      Rate: {newInventory.tax_rate}%
                    </span>
                  </div>
                  <select
                    value={newInventory.tax_slab}
                    onChange={(e) => {
                      const selected = TAX_SLABS.find((s) => s.label === e.target.value);
                      setNewInventory({
                        ...newInventory,
                        tax_slab: e.target.value,
                        tax_rate: selected ? selected.rate : 18,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono"
                  >
                    {TAX_SLABS.map((slab) => (
                      <option key={slab.label} value={slab.label}>
                        {slab.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Measuring Unit</label>
                  <select
                    value={newInventory.unit}
                    onChange={(e) => setNewInventory({ ...newInventory, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  >
                    <option value="JOB">JOB (Job Work / Contract)</option>
                    <option value="HRS">HRS (Hours)</option>
                    <option value="DAYS">DAYS (Days)</option>
                    <option value="LSUM">LSUM (Lump sum)</option>
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="NOS">NOS (Numbers)</option>
                    <option value="KGS">KGS (Kilograms)</option>
                    <option value="MTR">MTR (Meters)</option>
                    <option value="BOX">BOX (Boxes)</option>
                    <option value="SET">SET (Sets)</option>
                    <option value="PKT">PKT (Packets)</option>
                    <option value="LTR">LTR (Liters)</option>
                    <option value="SQFT">SQFT (Square Feet)</option>
                  </select>
                </div>
              </div>

              {/* Stock Details vs Service Stock Exemption */}
              {newInventory.is_service ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>Stock tracking exempt:</strong> Labour and service costs do not require physical stock and can be added to any Quotation or Invoice anytime with 18% GST.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Opening Stock</label>
                    <input
                      type="number"
                      value={newInventory.stock}
                      onChange={(e) => setNewInventory({ ...newInventory, stock: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Low Stock Warning Limit</label>
                    <input
                      type="number"
                      value={newInventory.min_stock}
                      onChange={(e) => setNewInventory({ ...newInventory, min_stock: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddInventoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMART INVOICE & BILL SCANNER MODAL WITH MANDATORY VERIFICATION */}
      {showScanBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Smart Invoice &amp; Bill Scanner</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                      {scanBillStep === 'upload' ? 'Step 1 of 2: Upload / Choose Bill' : 'Step 2 of 2: Verify & Confirm Fields'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {scanBillStep === 'upload'
                      ? 'Upload supplier GST invoice or choose a sample bill to extract inventory fields'
                      : 'Review and verify extracted fields before confirming addition to your inventory'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowScanBillModal(false);
                  setScanBillStep('upload');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: UPLOAD / CHOOSE BILL */}
            {scanBillStep === 'upload' && (
              <div className="space-y-4 text-xs">
                {isExtractingBill ? (
                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center animate-spin">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Analyzing Bill Document...</div>
                      <p className="text-slate-400 text-xs mt-1">
                        Extracting item name, HSN/SAC code, GST tax slab, rates, and stock units...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* File Upload Zone */}
                    <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center space-y-3 bg-slate-950/50 transition">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Upload Supplier Purchase Bill / GST Invoice</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Supports PDF invoices, PNG/JPG receipt photos, or scanned supplier documents
                        </p>
                      </div>
                      <input
                        type="file"
                        id="scanBillFileInput"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            await handleExtractBillFromDocument(file.name);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('scanBillFileInput')?.click()}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition"
                      >
                        Choose Bill Document
                      </button>
                    </div>

                    {/* Pre-configured Realistic GST Bills for Quick Extraction & Verification */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Or select a sample bill to test extraction &amp; verification:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          {
                            title: 'Canon Laser Shot LBP2900B Printer',
                            supplier: 'Canon India Partner',
                            doc: 'Tax_Invoice_Canon_Printers.pdf',
                            category: 'Electronics & IT',
                            rate: '₹11,450',
                            tax: 'GST@18%',
                          },
                          {
                            title: 'Dell Latitude 3420 Core i5 Laptop',
                            supplier: 'Apex Infotech Solutions',
                            doc: 'Purchase_Bill_Dell_Laptops.pdf',
                            category: 'Computers & Laptops',
                            rate: '₹46,500',
                            tax: 'GST@18%',
                          },
                          {
                            title: 'JK Copier A4 Paper 75 GSM (500 Sheets)',
                            supplier: 'Shree Krishna Paper Mart',
                            doc: 'GST_Invoice_JK_Paper.pdf',
                            category: 'Office Supplies',
                            rate: '₹240',
                            tax: 'GST@12%',
                          },
                          {
                            title: 'Polycab 2.5 Sq mm Copper Wire (90M)',
                            supplier: 'National Electrical Distributors',
                            doc: 'Electrical_Invoice_Polycab.pdf',
                            category: 'Electricals',
                            rate: '₹1,850',
                            tax: 'GST@18%',
                          },
                        ].map((sample, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleExtractBillFromDocument(sample.doc)}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 cursor-pointer transition flex flex-col justify-between space-y-1.5 group"
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-semibold text-white group-hover:text-cyan-300 transition text-xs line-clamp-1">
                                {sample.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono shrink-0 ml-1">
                                {sample.tax}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>{sample.supplier}</span>
                              <span className="font-mono text-cyan-400">{sample.rate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-2 flex justify-end border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowScanBillModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW, VERIFY & CONFIRM EXTRACTED BILL DATA */}
            {scanBillStep === 'verify' && (
              <form onSubmit={handleConfirmAddScannedItem} className="space-y-4 text-xs">
                {/* Extraction Meta Banner */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-bold text-white text-xs">Extracted from: {scannedBillMeta.fileName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 font-mono">
                      {scannedBillMeta.confidenceScore || 92}% Extraction Accuracy
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-300 flex-wrap">
                    {scannedBillMeta.supplier_name && (
                      <div>
                        Supplier: <strong className="text-white">{scannedBillMeta.supplier_name}</strong>
                      </div>
                    )}
                    {scannedBillMeta.invoice_no && (
                      <div>
                        Bill #: <strong className="font-mono text-cyan-300">{scannedBillMeta.invoice_no}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Please verify and complete all fields below before confirming. Nothing is added to inventory until you click &quot;Confirm &amp; Add&quot;.
                  </span>
                </div>

                {/* Form Fields: Editable & Verified */}
                <div className="space-y-3">
                  {/* Row 1: Item Name & Item Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Item / Product Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={scannedBillForm.name}
                        onChange={(e) => setScannedBillForm({ ...scannedBillForm, name: e.target.value })}
                        placeholder="e.g. Canon Laser Shot LBP2900B"
                        className={`w-full bg-slate-950 border rounded-xl p-2.5 text-white ${
                          !scannedBillForm.name.trim() ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Item Code / SKU</label>
                      <input
                        type="text"
                        value={scannedBillForm.item_code}
                        onChange={(e) => setScannedBillForm({ ...scannedBillForm, item_code: e.target.value })}
                        placeholder="e.g. CAN-LBP-2900"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 2: Brand & HSN/SAC Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={scannedBillForm.brand}
                        onChange={(e) => setScannedBillForm({ ...scannedBillForm, brand: e.target.value })}
                        placeholder="e.g. Canon / Dell / Havells"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">HSN / SAC Code</label>
                      <input
                        type="text"
                        value={scannedBillForm.hsn_sac}
                        onChange={(e) => setScannedBillForm({ ...scannedBillForm, hsn_sac: e.target.value })}
                        placeholder="e.g. 844332 or 847130"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 3: Category & Measuring Unit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-semibold">Category</label>
                        {!showScanCategoryInput && (
                          <button
                            type="button"
                            onClick={() => setShowScanCategoryInput(true)}
                            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                          >
                            <Plus className="w-3 h-3" /> Add Category
                          </button>
                        )}
                      </div>
                      {showScanCategoryInput ? (
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="text"
                            placeholder="New Category Name"
                            value={scanNewCategoryName}
                            onChange={(e) => setScanNewCategoryName(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl p-2 text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddNewScanCategory();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddNewScanCategory}
                            className="px-2.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowScanCategoryInput(false);
                              setScanNewCategoryName('');
                            }}
                            className="p-2 text-slate-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <select
                          value={scannedBillForm.category}
                          onChange={(e) => setScannedBillForm({ ...scannedBillForm, category: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Measuring Unit</label>
                      <select
                        value={scannedBillForm.unit}
                        onChange={(e) => setScannedBillForm({ ...scannedBillForm, unit: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                      >
                        <option value="PCS">PCS (Pieces)</option>
                        <option value="NOS">NOS (Numbers)</option>
                        <option value="BOX">BOX (Boxes)</option>
                        <option value="REAM">REAM (Reams)</option>
                        <option value="ROLL">ROLL (Rolls)</option>
                        <option value="SET">SET (Sets)</option>
                        <option value="PKT">PKT (Packets)</option>
                        <option value="KGS">KGS (Kilograms)</option>
                        <option value="MTR">MTR (Meters)</option>
                        <option value="LTR">LTR (Liters)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Pricing & Taxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Purchase Price (₹)</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        <input
                          type="number"
                          value={scannedBillForm.purchase_price}
                          onChange={(e) => setScannedBillForm({ ...scannedBillForm, purchase_price: Number(e.target.value) })}
                          placeholder="0.00"
                          className="col-span-3 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                        />
                        <select
                          value={scannedBillForm.purchase_tax_type}
                          onChange={(e) => setScannedBillForm({ ...scannedBillForm, purchase_tax_type: e.target.value as any })}
                          className="col-span-2 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-[11px]"
                        >
                          <option value="Without Tax">Without Tax</option>
                          <option value="With Tax">With Tax</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Sale Price (₹) <span className="text-rose-400">*</span>
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        <input
                          type="number"
                          required
                          value={scannedBillForm.sale_price}
                          onChange={(e) => setScannedBillForm({ ...scannedBillForm, sale_price: Number(e.target.value) })}
                          placeholder="0.00"
                          className={`col-span-3 bg-slate-950 border rounded-xl p-2.5 font-mono text-white ${
                            scannedBillForm.sale_price <= 0 ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                          }`}
                        />
                        <select
                          value={scannedBillForm.sale_tax_type}
                          onChange={(e) => setScannedBillForm({ ...scannedBillForm, sale_tax_type: e.target.value as any })}
                          className="col-span-2 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-[11px]"
                        >
                          <option value="Without Tax">Without Tax</option>
                          <option value="With Tax">With Tax</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 5: GST Tax Slab & Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-semibold">Tax Slab</label>
                        <span className="text-[11px] font-mono text-cyan-400">Rate: {scannedBillForm.tax_rate}%</span>
                      </div>
                      <select
                        value={scannedBillForm.tax_slab}
                        onChange={(e) => {
                          const selected = TAX_SLABS.find((s) => s.label === e.target.value);
                          setScannedBillForm({
                            ...scannedBillForm,
                            tax_slab: e.target.value,
                            tax_rate: selected ? selected.rate : 18,
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono"
                      >
                        {TAX_SLABS.map((slab) => (
                          <option key={slab.label} value={slab.label}>
                            {slab.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Inward Stock Qty</label>
                      <input
                        type="number"
                        min="0"
                        value={scannedBillForm.stock}
                        onChange={(e) => setScannedBillForm({ ...scannedBillForm, stock: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Low Stock Alert Limit</label>
                      <input
                        type="number"
                        min="0"
                        value={scannedBillForm.min_stock}
                        onChange={(e) => setScannedBillForm({ ...scannedBillForm, min_stock: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Financial Valuation Card */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Inward Total Cost</span>
                    <div className="font-mono font-bold text-white text-xs mt-0.5">
                      ₹{(Number(scannedBillForm.purchase_price || 0) * Number(scannedBillForm.stock || 0)).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Retail Sale Value</span>
                    <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">
                      ₹{(Number(scannedBillForm.sale_price || 0) * Number(scannedBillForm.stock || 0)).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Projected Margin</span>
                    <div className="font-mono font-bold text-cyan-300 text-xs mt-0.5">
                      {scannedBillForm.sale_price > 0 && scannedBillForm.purchase_price > 0
                        ? `${Math.round(((scannedBillForm.sale_price - scannedBillForm.purchase_price) / scannedBillForm.sale_price) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                </div>

                {/* Verification Confirmation Buttons */}
                <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setScanBillStep('upload')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    &larr; Choose Different Bill
                  </button>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowScanBillModal(false);
                        setScanBillStep('upload');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isConfirmingBillAdd || !scannedBillForm.name.trim() || scannedBillForm.sale_price <= 0}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-cyan-600/30 transition disabled:opacity-50"
                    >
                      {isConfirmingBillAdd ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Inventory...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirm &amp; Add to Inventory</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DEDICATED PRODUCT DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Delete Inventory Item?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently remove this product from your inventory catalog? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Product Name:</span>
                <span className="font-bold text-white max-w-[200px] truncate">{itemToDelete.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Item Code / SKU:</span>
                <span className="font-mono text-slate-300">{itemToDelete.item_code || itemToDelete.sku || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Stock:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {itemToDelete.stock} {itemToDelete.unit || 'PCS'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sale Price:</span>
                <span className="font-mono font-bold text-white">
                  ₹{Number(itemToDelete.sale_price).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2.5 border-t border-slate-800">
              <button
                type="button"
                disabled={isDeletingItem}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingItem}
                onClick={handleConfirmDeleteItem}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/30 transition disabled:opacity-50"
              >
                {isDeletingItem ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SALES DOCUMENT DELETE CONFIRMATION MODAL (ONLY FOR SENT UNPAID INVOICES) */}
      {salesDocToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Delete Unpaid Invoice?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently delete this unpaid invoice? This will restore any reserved stock and remove the invoice record.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Document #:</span>
                <span className="font-mono font-bold text-white">{salesDocToDelete.doc_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Client / Party:</span>
                <span className="font-bold text-white max-w-[200px] truncate">{salesDocToDelete.party_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Invoice Amount:</span>
                <span className="font-mono font-bold text-white">
                  ₹{Number(salesDocToDelete.amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-rose-400">{salesDocToDelete.status || 'Sent (Unpaid)'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2.5 border-t border-slate-800">
              <button
                type="button"
                disabled={isDeletingSalesDoc}
                onClick={() => setSalesDocToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingSalesDoc}
                onClick={handleConfirmDeleteSalesDoc}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/30 transition disabled:opacity-50"
              >
                {isDeletingSalesDoc ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STOCK & PRICE ADJUSTMENT MODAL (INDIAN STANDARD IND AS 2) */}
      {adjustModalItem && (() => {
        const currStock = Number(adjustModalItem.stock || 0);
        const currCost = Number(adjustModalItem.purchase_price || 0);
        const currSale = Number(adjustModalItem.sale_price || 0);
        const addedQty = Math.max(0, Number(adjustForm.quantity || 0));
        const inwardRate = Math.max(0, Number(adjustForm.inward_price || 0));
        const newTotalUnits = currStock + addedQty;
        const totalHoldingVal = currStock * currCost;
        const incomingVal = addedQty * inwardRate;
        const combinedVal = totalHoldingVal + incomingVal;
        const weightedAvgCost = newTotalUnits > 0 ? (combinedVal / newTotalUnits) : inwardRate;
        const currentMargin = currCost > 0 ? (((currSale - currCost) / currCost) * 100) : 25;
        const suggestedSalePrice = Math.round(weightedAvgCost * (1 + (currentMargin / 100)));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Stock &amp; Price Adjustment</h3>
                    <p className="text-[11px] text-slate-400">
                      Item: <strong className="text-white">{adjustModalItem.name}</strong> ({adjustModalItem.item_code || adjustModalItem.sku || 'No Code'})
                    </p>
                  </div>
                </div>
                <button onClick={() => setAdjustModalItem(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Status Pills */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Current Stock</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {currStock} {adjustModalItem.unit || 'PCS'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Old Purchase Price</div>
                  <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                    ₹{currCost.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-slate-500">{adjustModalItem.purchase_tax_type || 'Without Tax'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Current Sale Price</div>
                  <div className="text-sm font-bold text-indigo-400 font-mono mt-0.5">
                    ₹{currSale.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-indigo-300/70">{adjustModalItem.sale_tax_type || 'Without Tax'}</div>
                </div>
              </div>

              {/* Adjustment Mode Selector */}
              <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setAdjustForm({ ...adjustForm, type: 'inward' })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    adjustForm.type === 'inward'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ➕ Add New Stock (Inward)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustForm({ ...adjustForm, type: 'outward' })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    adjustForm.type === 'outward'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ➖ Reduce Stock (Outward)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustForm({ ...adjustForm, type: 'set' })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    adjustForm.type === 'set'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Physical Count
                </button>
              </div>

              <form onSubmit={handleAdjustStock} className="space-y-3.5 text-xs">
                {/* 1. INWARD STOCK MODE */}
                {adjustForm.type === 'inward' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Inward Quantity (+{adjustModalItem.unit || 'PCS'}) *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={adjustForm.quantity}
                          onChange={(e) => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          New Purchase Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={adjustForm.inward_price}
                          onChange={(e) => setAdjustForm({ ...adjustForm, inward_price: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Purchase Tax Option</label>
                        <select
                          value={adjustForm.inward_tax_type}
                          onChange={(e) => setAdjustForm({ ...adjustForm, inward_tax_type: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                        >
                          <option value="Without Tax">Without Tax</option>
                          <option value="With Tax">With Tax</option>
                        </select>
                      </div>
                    </div>

                    {/* Indian Accounting Standard Ind AS 2 / AS 2 Valuation Card */}
                    <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-700/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <span>🇮🇳 Indian Standard (Ind AS 2) Cost Valuation</span>
                        </span>
                        <span className="text-[11px] text-cyan-300 font-mono">
                          Total Stock: {newTotalUnits} {adjustModalItem.unit || 'PCS'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-indigo-800/30">
                        <div>
                          Existing: {currStock} @ ₹{currCost} = <strong className="text-white">₹{totalHoldingVal.toLocaleString('en-IN')}</strong>
                        </div>
                        <div>
                          Incoming: {addedQty} @ ₹{inwardRate} = <strong className="text-white">₹{incomingVal.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] text-slate-300 font-semibold block">Select Purchase Valuation Method:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <label className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2 transition ${
                            adjustForm.valuation_method === 'weighted_avg'
                              ? 'bg-indigo-900/60 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}>
                            <input
                              type="radio"
                              name="valuation_method"
                              checked={adjustForm.valuation_method === 'weighted_avg'}
                              onChange={() => setAdjustForm({ ...adjustForm, valuation_method: 'weighted_avg' })}
                              className="mt-0.5 text-indigo-600"
                            />
                            <div>
                              <div className="font-bold text-xs text-white">Weighted Average (Ind AS 2)</div>
                              <div className="text-[10px] text-indigo-300 font-mono font-semibold mt-0.5">
                                Set to ₹{weightedAvgCost.toFixed(2)} / {adjustModalItem.unit || 'PCS'}
                              </div>
                              <div className="text-[9px] text-slate-400">Blended cost per standard Indian accounting</div>
                            </div>
                          </label>

                          <label className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2 transition ${
                            adjustForm.valuation_method === 'latest'
                              ? 'bg-indigo-900/60 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}>
                            <input
                              type="radio"
                              name="valuation_method"
                              checked={adjustForm.valuation_method === 'latest'}
                              onChange={() => setAdjustForm({ ...adjustForm, valuation_method: 'latest' })}
                              className="mt-0.5 text-indigo-600"
                            />
                            <div>
                              <div className="font-bold text-xs text-white">Latest Inward Rate</div>
                              <div className="text-[10px] text-cyan-300 font-mono font-semibold mt-0.5">
                                Set to ₹{inwardRate.toFixed(2)} / {adjustModalItem.unit || 'PCS'}
                              </div>
                              <div className="text-[9px] text-slate-400">Replaces cost with newest supplier invoice rate</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Sale Price (Retail / MRP) Adjustment Section */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-semibold">Sale Price Adjustment (Retail / MRP)</label>
                        <button
                          type="button"
                          onClick={() => setAdjustForm({ ...adjustForm, sale_price: suggestedSalePrice })}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                        >
                          Maintain Margin ({currentMargin.toFixed(0)}%) &rarr; Set ₹{suggestedSalePrice}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">New Sale Price (₹)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={adjustForm.sale_price}
                            onChange={(e) => setAdjustForm({ ...adjustForm, sale_price: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Sale Tax Option</label>
                          <select
                            value={adjustForm.sale_tax_type}
                            onChange={(e) => setAdjustForm({ ...adjustForm, sale_tax_type: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
                          >
                            <option value="Without Tax">Without Tax</option>
                            <option value="With Tax">With Tax</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 2. OUTWARD / REDUCE STOCK MODE */}
                {adjustForm.type === 'outward' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Quantity to Deduct ({adjustModalItem.unit || 'PCS'}) *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max={currStock}
                          value={adjustForm.quantity}
                          onChange={(e) => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                        />
                        <div className="text-[10px] text-slate-400 mt-1">Available to reduce: {currStock} units</div>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Reduction Reason *</label>
                        <select
                          value={adjustForm.reason}
                          onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                        >
                          <option value="Damaged Goods / Scrap">Damaged Goods / Scrap</option>
                          <option value="Expired / Obsolete Stock">Expired / Obsolete Stock</option>
                          <option value="Stock Theft / Lost">Stock Theft / Lost</option>
                          <option value="Sample / Internal Consumption">Sample / Internal Consumption</option>
                          <option value="Customer Return to Vendor">Customer Return to Vendor</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-[11px] text-rose-300">
                      New stock after outward adjustment will be: <strong>{Math.max(0, currStock - adjustForm.quantity)} {adjustModalItem.unit || 'PCS'}</strong>
                    </div>
                  </div>
                )}

                {/* 3. PHYSICAL RECONCILIATION COUNT */}
                {adjustForm.type === 'set' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Actual Physical Count ({adjustModalItem.unit || 'PCS'}) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={adjustForm.quantity}
                          onChange={(e) => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Audit Reason</label>
                        <input
                          type="text"
                          value={adjustForm.reason}
                          onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                          placeholder="e.g. Annual physical inventory audit"
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                        />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-300">
                      Stock will be directly reconciled from {currStock} to <strong>{adjustForm.quantity} {adjustModalItem.unit || 'PCS'}</strong>
                    </div>
                  </div>
                )}

                {/* Reference Note */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reference / Invoice / Remark</label>
                  <input
                    type="text"
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    placeholder="e.g. GRN-2026-89 / Inward Bill #4892"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAdjustModalItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Adjustment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* EDIT INVENTORY PRODUCT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Product Details</h3>
                  <p className="text-[11px] text-slate-400">Update item pricing, category, HSN/SAC, and stock limits</p>
                </div>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateInventory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={editInventoryForm.name}
                  onChange={(e) => setEditInventoryForm({ ...editInventoryForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              {/* Item Code & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Item Code / SKU</label>
                  <input
                    type="text"
                    value={editInventoryForm.item_code}
                    onChange={(e) =>
                      setEditInventoryForm({
                        ...editInventoryForm,
                        item_code: e.target.value,
                        sku: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={editInventoryForm.brand}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* Category Dropdown (with + Add Category) & HSN/SAC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Category</label>
                    {!showEditCategoryInput && (
                      <button
                        type="button"
                        onClick={() => setShowEditCategoryInput(true)}
                        className="text-indigo-400 hover:text-indigo-300 text-[11px] font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Category
                      </button>
                    )}
                  </div>
                  {showEditCategoryInput ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        placeholder="New category"
                        className="flex-1 bg-slate-950 border border-indigo-500 text-white rounded-xl p-2 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewEditCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewEditCategory}
                        className="px-2.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditCategoryInput(false);
                          setEditCategoryName('');
                        }}
                        className="p-2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={editInventoryForm.category}
                      onChange={(e) => setEditInventoryForm({ ...editInventoryForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">HSN/SAC Code</label>
                  <input
                    type="text"
                    value={editInventoryForm.hsn_sac}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, hsn_sac: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* Purchase Price & Sale Price with Tax Option Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Purchase Price</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      value={editInventoryForm.purchase_price}
                      onChange={(e) => setEditInventoryForm({ ...editInventoryForm, purchase_price: Number(e.target.value) })}
                      className="col-span-3 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    />
                    <select
                      value={editInventoryForm.purchase_tax_type}
                      onChange={(e) => setEditInventoryForm({ ...editInventoryForm, purchase_tax_type: e.target.value })}
                      className="col-span-2 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-[11px]"
                    >
                      <option value="Without Tax">Without Tax</option>
                      <option value="With Tax">With Tax</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sales Price</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editInventoryForm.sale_price}
                      onChange={(e) => setEditInventoryForm({ ...editInventoryForm, sale_price: Number(e.target.value) })}
                      className="col-span-3 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono font-bold"
                    />
                    <select
                      value={editInventoryForm.sale_tax_type}
                      onChange={(e) => setEditInventoryForm({ ...editInventoryForm, sale_tax_type: e.target.value })}
                      className="col-span-2 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-[11px]"
                    >
                      <option value="Without Tax">Without Tax</option>
                      <option value="With Tax">With Tax</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax Slab & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Tax Slab</label>
                    <span className="text-[11px] font-mono text-cyan-400">Rate: {editInventoryForm.tax_rate}%</span>
                  </div>
                  <select
                    value={editInventoryForm.tax_slab}
                    onChange={(e) => {
                      const selected = TAX_SLABS.find((s) => s.label === e.target.value);
                      setEditInventoryForm({
                        ...editInventoryForm,
                        tax_slab: e.target.value,
                        tax_rate: selected ? selected.rate : 18,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono"
                  >
                    {TAX_SLABS.map((slab) => (
                      <option key={slab.label} value={slab.label}>
                        {slab.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Measuring Unit</label>
                  <select
                    value={editInventoryForm.unit}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="NOS">NOS (Numbers)</option>
                    <option value="KGS">KGS (Kilograms)</option>
                    <option value="MTR">MTR (Meters)</option>
                    <option value="BOX">BOX (Boxes)</option>
                    <option value="SET">SET (Sets)</option>
                    <option value="PKT">PKT (Packets)</option>
                    <option value="LTR">LTR (Liters)</option>
                    <option value="SQFT">SQFT (Square Feet)</option>
                  </select>
                </div>
              </div>

              {/* Stock and Low Stock Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={editInventoryForm.stock}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, stock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Low Stock Warning Limit</label>
                  <input
                    type="number"
                    value={editInventoryForm.min_stock}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, min_stock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteInventoryItem(editingItem.id, editingItem.name);
                    setEditingItem(null);
                  }}
                  className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE & SHELF LABEL PRINT MODAL */}
      {labelModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Barcode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Product Barcode &amp; Shelf Label</h3>
                  <p className="text-[11px] text-slate-400">Printable shelf tag for retail inventory &amp; POS billing</p>
                </div>
              </div>
              <button onClick={() => setLabelModalItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Print Format Options */}
            <div className="flex items-center justify-between text-xs bg-slate-950 border border-slate-800 rounded-xl p-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Format:</span>
                <select
                  value={labelFormat}
                  onChange={(e) => setLabelFormat(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="shelf">Shelf Tag (50mm x 30mm)</option>
                  <option value="barcode">Barcode Sticker (38mm x 25mm)</option>
                  <option value="sheet">A4 Sheet (24 per page)</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Copies:</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={labelCopies}
                  onChange={(e) => setLabelCopies(Math.max(1, Number(e.target.value)))}
                  className="w-14 bg-slate-900 border border-slate-700 text-white text-center rounded-lg px-1.5 py-1 text-xs font-mono"
                />
              </div>
            </div>

            {/* High-Fidelity Printable Retail Label Preview (Clean Thermal White) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-center">
              <div
                id="printableShelfLabel"
                className="w-80 bg-white text-slate-900 rounded-xl p-4 shadow-xl border-2 border-slate-800 space-y-2 select-none"
              >
                {/* Brand / Store Header */}
                <div className="flex justify-between items-center border-b border-dashed border-slate-300 pb-1.5 text-[10px] text-slate-600">
                  <span className="font-bold uppercase tracking-wider text-slate-900">
                    {businessProfile?.business_name || businessProfile?.trade_name || 'OMNIBILL RETAIL'}
                  </span>
                  <span className="font-mono">{businessProfile?.gst_number ? `GST: ${businessProfile.gst_number}` : 'TAX INVOICE'}</span>
                </div>

                {/* Product Name & Brand */}
                <div>
                  <div className="font-extrabold text-sm text-slate-950 leading-tight">
                    {labelModalItem.name}
                  </div>
                  {labelModalItem.brand && (
                    <div className="text-[11px] text-slate-600 font-semibold">
                      Brand: {labelModalItem.brand}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                    <span>Category: {labelModalItem.category}</span>
                    <span className="font-mono">HSN: {labelModalItem.hsn_sac}</span>
                  </div>
                </div>

                {/* High Density Barcode Representation */}
                <div className="py-1 text-center bg-slate-50 rounded-lg p-2 border border-slate-200">
                  <div className="flex justify-center items-center gap-0.5 h-10 px-2 overflow-hidden">
                    {Array.from({ length: 42 }).map((_, idx) => {
                      const isThick = [1, 3, 6, 8, 12, 15, 18, 22, 25, 29, 32, 36, 40].includes(idx);
                      const isThin = [2, 5, 9, 14, 19, 24, 30, 35, 38].includes(idx);
                      return (
                        <div
                          key={idx}
                          className={`h-full bg-slate-950 ${
                            isThick ? 'w-1' : isThin ? 'w-0.5' : 'w-[1.5px]'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-slate-700 mt-1 font-bold">
                    *{labelModalItem.item_code || labelModalItem.sku || `ITEM-${labelModalItem.id}`}*
                  </div>
                </div>

                {/* Price and Tax Info */}
                <div className="flex justify-between items-end border-t border-dashed border-slate-300 pt-1.5">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Maximum Retail Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-950 font-mono tracking-tight">
                        ₹{Number(labelModalItem.sale_price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600">
                        /{labelModalItem.unit || 'PCS'}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium block">
                      {labelModalItem.sale_tax_type === 'With Tax'
                        ? '(Incl. of all taxes)'
                        : `+ ${labelModalItem.tax_slab || 'GST'}`}
                    </span>
                  </div>
                  <div className="text-right text-[9px] text-slate-500">
                    <div>PKD: {new Date().toLocaleDateString('en-IN')}</div>
                    <div className="font-mono">STOCK: {labelModalItem.stock}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Ready to print {labelCopies} {labelCopies === 1 ? 'copy' : 'copies'}
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setLabelModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print {labelCopies} Labels</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MODALS: MIGRATE PLAN, DEMOTE UNPAID, AUDIT HISTORY */}
      {/* ======================================================== */}

      {/* 1. MIGRATE SUBSCRIPTION PLAN MODAL */}
      {showMigrateModal && selectedTenantForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Migrate Subscription Plan</h3>
                  <p className="text-[11px] text-slate-400">
                    Target Tenant: <strong className="text-white">{selectedTenantForAction.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMigrateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Active Tier</div>
                  <div className="text-white font-bold">{selectedTenantForAction.plan || 'Starter'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Dedicated Schema</div>
                  <div className="text-emerald-400 font-mono text-[11px]">
                    {selectedTenantForAction.schema_name || `tenant_${selectedTenantForAction.slug}`}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select New Subscription Tier</label>
                <select
                  value={targetMigrationPlan}
                  onChange={(e) => setTargetMigrationPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Free">Free Community (₹0/mo &bull; 25 invoices)</option>
                  <option value="Starter">Starter Pro (₹499/mo &bull; 150 invoices)</option>
                  <option value="Pro">Professional Enterprise (₹1,499/mo &bull; 1,000 invoices)</option>
                  <option value="Enterprise">Custom Unlimited (₹3,999/mo &bull; Unlimited)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Migration Reason / Audit Note</label>
                <input
                  type="text"
                  value={migrationReason}
                  onChange={(e) => setMigrationReason(e.target.value)}
                  placeholder="e.g. Upgraded to Pro for multi-user compliance"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 rounded-xl text-[11px] leading-relaxed">
                Plan update will be recorded in <code className="font-mono text-indigo-200">public.tenant_subscriptions</code> and logged into <code className="font-mono text-indigo-200">public.tenant_plan_history</code> audit trail.
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowMigrateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMigratePlan}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition cursor-pointer"
              >
                Confirm Migration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEMOTE ON NON-PAYMENT MODAL */}
      {showDemoteModal && selectedTenantForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Demote for Non-Payment</h3>
                  <p className="text-[11px] text-slate-400">
                    Tenant: <strong className="text-white">{selectedTenantForAction.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 text-amber-200 rounded-xl space-y-1">
                <div className="font-semibold text-amber-300">Payment Overdue Demotion Policy</div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  When subscription payment is not received, this tenant will be immediately demoted from <strong className="text-white font-mono">{selectedTenantForAction.plan}</strong> to <strong className="text-white font-mono">Free Community</strong> plan.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Overdue Demote Reason</label>
                <textarea
                  rows={2}
                  value={demoteReason}
                  onChange={(e) => setDemoteReason(e.target.value)}
                  placeholder="Specify non-payment duration or invoice invoice ID"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                Action will update status to <span className="text-rose-400 font-mono font-semibold">demoted / overdue</span> in <code className="text-indigo-300 font-mono">public.tenant_subscriptions</code>.
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDemoteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDemoteUnpaid}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition cursor-pointer"
              >
                Demote to Free Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PLAN AUDIT HISTORY MODAL */}
      {showHistoryModal && selectedTenantForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Subscription &amp; Plan History Audit Trail
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Tenant: {selectedTenantForAction.name} ({selectedTenantForAction.schema_name || `tenant_${selectedTenantForAction.slug}`})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {loadingHistory ? (
                <div className="py-8 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                  <span>Loading audit log from public.tenant_plan_history...</span>
                </div>
              ) : tenantHistory.length === 0 ? (
                <div className="py-8 text-center text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800 p-6">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                  <p className="text-slate-300 font-semibold">No plan migration actions recorded yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Migrations, overdue demotions, and suspensions are automatically logged into <code className="text-indigo-400 font-mono">public.tenant_plan_history</code>.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tenantHistory.map((h: any) => (
                    <div
                      key={h.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                          h.action === 'migrate_plan'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : h.action === 'demote_unpaid'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {h.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(h.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-400">Tier Transition:</span>
                        <span className="font-semibold text-white">{h.from_plan || 'N/A'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="font-bold text-emerald-400">{h.to_plan || 'N/A'}</span>
                      </div>
                      {h.reason && (
                        <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg">
                          <strong className="text-slate-300">Reason:</strong> {h.reason}
                        </p>
                      )}
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>Performed By: <strong className="text-slate-400">{h.performed_by || 'Admin'}</strong></span>
                        <span>Log ID: #{h.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/60">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
