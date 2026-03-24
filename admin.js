// ============================================
// admin.js — Admin Dashboard Logic
// LoanFlow | Hariom Prajapati | 2025071131
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const session = Auth.requireAdmin();
  if (!session) return;

  document.getElementById('admin-name').textContent = session.name;

  let currentFilter = 'all';
  let currentSearch = '';

  function render() {
    let apps = App.getApplications();

    // Search filter
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      apps = apps.filter(a =>
        a.applicantName?.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.loanType?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (currentFilter !== 'all') {
      apps = apps.filter(a => a.status === currentFilter);
    }

    // Sort: newest first
    apps.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    renderStats();
    renderTable(apps);
  }

  function renderStats() {
    const all = App.getApplications();
    document.getElementById('stat-total').textContent = all.length;
    document.getElementById('stat-pending').textContent = all.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
    document.getElementById('stat-approved').textContent = all.filter(a => a.status === 'approved').length;
    document.getElementById('stat-rejected').textContent = all.filter(a => a.status === 'rejected').length;

    const totalAmt = all.filter(a => a.status === 'approved').reduce((s, a) => s + Number(a.loanAmount || 0), 0);
    document.getElementById('stat-disbursed').textContent = App.formatCurrency(totalAmt);
  }

  function renderTable(apps) {
    const tbody = document.getElementById('apps-tbody');
    if (!apps.length) {
      tbody.innerHTML = `<tr><td colspan="7">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>Koi application nahi mili</h3>
          <p>Filter change karein ya baad mein check karein.</p>
        </div>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = apps.map(app => {
      const st = App.statusLabel(app.status);
      const lt = App.getLoanType(app.loanType);
      return `
      <tr>
        <td><code style="font-size:0.8rem;color:var(--teal)">${app.id}</code></td>
        <td>
          <div style="font-weight:600">${app.applicantName || '—'}</div>
          <div style="font-size:0.78rem;color:var(--grey-500)">${app.email || ''}</div>
        </td>
        <td><span class="badge badge-purple">${lt ? lt.icon + ' ' + lt.name : app.loanType}</span></td>
        <td style="font-weight:700;color:var(--teal-dark)">${App.formatCurrency(app.loanAmount)}</td>
        <td>${App.formatDate(app.submittedAt)}</td>
        <td><span class="badge ${st.class}">${st.label}</span></td>
        <td>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            ${app.status === 'submitted' ? `<button class="btn btn-sm" style="background:var(--sky);color:white" onclick="setReview('${app.id}')">Review Mein Daalein</button>` : ''}
            ${app.status !== 'approved' ? `<button class="btn btn-sm btn-success" onclick="approveApp('${app.id}')">✓ Approve</button>` : ''}
            ${app.status !== 'rejected' ? `<button class="btn btn-sm btn-danger" onclick="rejectApp('${app.id}')">✗ Reject</button>` : ''}
            <button class="btn btn-sm" style="background:var(--grey-100);color:var(--text)" onclick="viewApp('${app.id}')">👁 Dekho</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  // Global action functions
  window.setReview = (id) => {
    App.updateApplicationStatus(id, 'under_review', 'Admin ne review mein daala');
    render();
    showToast('Application review mein daali gayi!', 'info');
  };

  window.approveApp = (id) => {
    if (!confirm('Kya aap is application ko approve karna chahte hain?')) return;
    App.updateApplicationStatus(id, 'approved', 'Admin ne approve kiya');
    render();
    showToast('Application approved! 🎉', 'success');
  };

  window.rejectApp = (id) => {
    const reason = prompt('Rejection ka reason likhein:');
    if (reason === null) return;
    App.updateApplicationStatus(id, 'rejected', reason || 'Admin ne reject kiya');
    render();
    showToast('Application reject kar di gayi.', 'error');
  };

  window.viewApp = (id) => {
    const app = App.getApplicationById(id);
    if (!app) return;
    const lt = App.getLoanType(app.loanType);
    document.getElementById('detail-content').innerHTML = `
      <div class="grid-2" style="gap:1rem">
        <div><label>Application ID</label><p><code>${app.id}</code></p></div>
        <div><label>Status</label><p><span class="badge ${App.statusLabel(app.status).class}">${App.statusLabel(app.status).label}</span></p></div>
        <div><label>Applicant Name</label><p>${app.applicantName}</p></div>
        <div><label>Email</label><p>${app.email}</p></div>
        <div><label>Phone</label><p>${app.phone}</p></div>
        <div><label>Age</label><p>${app.age} years</p></div>
        <div><label>Loan Type</label><p>${lt ? lt.icon + ' ' + lt.name : app.loanType}</p></div>
        <div><label>Loan Amount</label><p style="font-weight:700;color:var(--teal-dark)">${App.formatCurrency(app.loanAmount)}</p></div>
        <div><label>Tenure</label><p>${app.tenure} months</p></div>
        <div><label>Monthly EMI</label><p style="font-weight:700">${App.formatCurrency(app.emi)}</p></div>
        <div><label>Monthly Income</label><p>${App.formatCurrency(app.income)}</p></div>
        <div><label>Employment Type</label><p>${app.employment}</p></div>
        <div><label>CIBIL Score</label><p>${app.cibil}</p></div>
        <div><label>Eligibility Score</label><p style="font-weight:700;color:${app.eligibilityScore >= 65 ? 'green' : app.eligibilityScore >= 45 ? 'orange' : 'red'}">${app.eligibilityScore}/100</p></div>
        <div><label>Submitted On</label><p>${App.formatDate(app.submittedAt)}</p></div>
        <div><label>Documents</label><p>${app.docs ? app.docs.map(d => '📄 ' + d).join(', ') : '—'}</p></div>
      </div>
      <div style="margin-top:1.5rem">
        <label>History</label>
        ${app.history.map(h => `
          <div style="display:flex;gap:1rem;padding:0.5rem 0;border-bottom:1px solid var(--grey-300)">
            <span style="font-size:0.8rem;color:var(--grey-500);min-width:140px">${App.formatDate(h.date)}</span>
            <span class="badge ${App.statusLabel(h.status).class}">${App.statusLabel(h.status).label}</span>
            <span style="font-size:0.85rem">${h.note}</span>
          </div>
        `).join('')}
      </div>
    `;
    document.getElementById('detail-modal').classList.add('active');
  };

  // Search
  document.getElementById('search-input').addEventListener('input', e => {
    currentSearch = e.target.value;
    render();
  });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.status;
      render();
    });
  });

  // Close modal
  document.getElementById('close-detail').addEventListener('click', () => {
    document.getElementById('detail-modal').classList.remove('active');
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', Auth.logout);

  // Toast
  function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'alert alert-' + type;
    toast.style.display = 'flex';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
  }

  render();
});
