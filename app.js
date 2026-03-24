// ============================================
// app.js — Core Logic Module
// LoanFlow | Hariom Prajapati | 2025071131
// ============================================

const App = (() => {

  const APPS_KEY = 'loanflow_applications';

  // ---- EMI Calculator ----
  function calcEMI(principal, annualRate, tenureMonths) {
    if (annualRate === 0) return principal / tenureMonths;
    const r = annualRate / 12 / 100;
    const n = tenureMonths;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi;
  }

  // ---- Eligibility Scorer ----
  function calcEligibilityScore({ income, age, cibil, employment, loanAmount, loanType }) {
    let score = 0;
    const reasons = [];

    // Income score (max 30)
    if (income >= 100000)      { score += 30; }
    else if (income >= 50000)  { score += 22; }
    else if (income >= 30000)  { score += 15; }
    else if (income >= 15000)  { score += 8;  reasons.push('Income thoda kam hai'); }
    else                       { score += 0;  reasons.push('Income bahut kam hai (min ₹15,000 chahiye)'); }

    // Age score (max 20)
    if (age >= 25 && age <= 45)    { score += 20; }
    else if (age >= 21 && age < 25){ score += 14; reasons.push('Umar thodi kam hai'); }
    else if (age > 45 && age <= 60){ score += 14; }
    else if (age > 60)             { score += 6;  reasons.push('Umar 60 se upar hai'); }
    else                           { score += 0;  reasons.push('Umar 21 se kam hai'); }

    // CIBIL score (max 30)
    if (cibil >= 750)      { score += 30; }
    else if (cibil >= 700) { score += 22; }
    else if (cibil >= 650) { score += 14; reasons.push('CIBIL score thoda kam hai'); }
    else if (cibil >= 600) { score += 6;  reasons.push('CIBIL score kam hai (700+ better hai)'); }
    else                   { score += 0;  reasons.push('CIBIL score bahut kam hai'); }

    // Employment type (max 10)
    const empMap = { 'sarkari': 10, 'private': 8, 'self': 6, 'business': 7, 'other': 4 };
    score += (empMap[employment] || 4);

    // Loan amount vs income ratio (max 10)
    const ratio = loanAmount / (income * 12);
    if (ratio <= 3)       { score += 10; }
    else if (ratio <= 5)  { score += 7;  }
    else if (ratio <= 8)  { score += 4;  reasons.push('Loan amount income ke hisaab se zyada hai'); }
    else                  { score += 0;  reasons.push('Loan amount bahut zyada hai income ke relative'); }

    let status = 'eligible';
    let band = 'green';
    if (score < 45)       { status = 'ineligible'; band = 'red'; }
    else if (score < 65)  { status = 'review';     band = 'yellow'; }

    return { score, status, band, reasons };
  }

  // ---- Applications CRUD ----
  function getApplications() {
    const data = localStorage.getItem(APPS_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveApplications(apps) {
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  }

  function submitApplication(data) {
    const apps = getApplications();
    const app = {
      id: 'APP' + Date.now(),
      ...data,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{ status: 'submitted', date: new Date().toISOString(), note: 'Application submitted' }]
    };
    apps.push(app);
    saveApplications(apps);
    return app;
  }

  function getApplicationsByUser(userId) {
    return getApplications().filter(a => a.userId === userId);
  }

  function getApplicationById(id) {
    return getApplications().find(a => a.id === id) || null;
  }

  function updateApplicationStatus(id, status, note = '') {
    const apps = getApplications();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return false;
    apps[idx].status = status;
    apps[idx].updatedAt = new Date().toISOString();
    apps[idx].history.push({ status, date: new Date().toISOString(), note });
    saveApplications(apps);
    return true;
  }

  // ---- Loan Types Config ----
  const LOAN_TYPES = [
    { id: 'personal', name: 'Personal Loan',   icon: '👤', rate: 10.5, maxAmount: 1500000, maxTenure: 60 },
    { id: 'home',     name: 'Home Loan',        icon: '🏠', rate: 8.5,  maxAmount: 10000000, maxTenure: 240 },
    { id: 'vehicle',  name: 'Vehicle Loan',     icon: '🚗', rate: 9.5,  maxAmount: 3000000,  maxTenure: 84 },
    { id: 'education',name: 'Education Loan',   icon: '🎓', rate: 8.0,  maxAmount: 2000000,  maxTenure: 120 },
    { id: 'business', name: 'Business Loan',    icon: '💼', rate: 11.5, maxAmount: 5000000,  maxTenure: 60 },
    { id: 'agri',     name: 'Agriculture Loan', icon: '🌾', rate: 7.0,  maxAmount: 1000000,  maxTenure: 60 },
  ];

  function getLoanTypes() { return LOAN_TYPES; }
  function getLoanType(id) { return LOAN_TYPES.find(l => l.id === id); }

  // ---- Utility ----
  function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function statusLabel(status) {
    const map = {
      submitted: { label: 'Submitted', class: 'badge-teal' },
      under_review: { label: 'Under Review', class: 'badge-gold' },
      approved: { label: 'Approved', class: 'badge-green' },
      rejected: { label: 'Rejected', class: 'badge-red' },
    };
    return map[status] || { label: status, class: 'badge-teal' };
  }

  return {
    calcEMI, calcEligibilityScore,
    getApplications, submitApplication, getApplicationsByUser,
    getApplicationById, updateApplicationStatus,
    getLoanTypes, getLoanType,
    formatCurrency, formatDate, statusLabel
  };
})();
