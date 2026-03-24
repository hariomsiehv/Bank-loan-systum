// ============================================
// auth.js — Authentication Module
// LoanFlow | Hariom Prajapati | 2025071131
// ============================================

const Auth = (() => {

  const USERS_KEY = 'loanflow_users';
  const SESSION_KEY = 'loanflow_session';

  // Default admin account
  const DEFAULT_ADMIN = {
    id: 'admin_001',
    name: 'Bank Admin',
    email: 'admin@bank.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  function _getUsers() {
    const data = localStorage.getItem(USERS_KEY);
    const users = data ? JSON.parse(data) : [];
    // Ensure admin always exists
    if (!users.find(u => u.email === DEFAULT_ADMIN.email)) {
      users.push(DEFAULT_ADMIN);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  }

  function _saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function register({ name, email, password, phone }) {
    const users = _getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Yeh email already registered hai.' };
    }
    const newUser = {
      id: 'user_' + Date.now(),
      name, email, password, phone,
      role: 'applicant',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    _saveUsers(users);
    return { success: true, message: 'Account successfully ban gaya!', user: newUser };
  }

  function login(email, password) {
    const users = _getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Email ya password galat hai.' };
    }
    // Save session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      id: user.id, name: user.name, email: user.email,
      role: user.role, loginAt: new Date().toISOString()
    }));
    return { success: true, user };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  function getSession() {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  function requireLogin(redirectTo = 'login.html') {
    const session = getSession();
    if (!session) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  }

  function requireAdmin() {
    const session = requireLogin();
    if (session && session.role !== 'admin') {
      alert('Admin access required!');
      window.location.href = 'index.html';
      return null;
    }
    return session;
  }

  function isLoggedIn() { return !!getSession(); }

  return { register, login, logout, getSession, requireLogin, requireAdmin, isLoggedIn };
})();
