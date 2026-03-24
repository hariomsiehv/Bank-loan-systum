# LoanFlow — Online Bank Loan System
**BIT-155 Design Thinking Project | MMMUT Gorakhpur**  
**Hariom Prajapati | Roll No: 2025071131 | Session 2025-26**

---

## 🚀 Project Files

| File | Kaam |
|------|------|
| `index.html` | Landing page — hero, loan types, how it works |
| `login.html` | Login & Register page (Applicant + Admin) |
| `apply.html` | Loan application — eligibility, EMI calc, doc upload |
| `tracker.html` | Application status tracking |
| `admin.html` | Admin dashboard — approve/reject applications |
| `style.css` | Global stylesheet |
| `app.js` | Core logic — EMI, eligibility, localStorage |
| `auth.js` | Authentication — login, register, session |
| `admin.js` | Admin dashboard JavaScript |

---

## ⚙️ Kaise Run Karein (Setup)

### Method 1 — Seedha Browser mein Open Karein
1. Saari files ek folder mein rakhein
2. `index.html` browser mein open karein
3. Done! ✅

### Method 2 — Local Server
```bash
npx serve .
# Ya
python -m http.server 8000
```

### Method 3 — GitHub Pages Deploy
1. GitHub pe nayi repo banao
2. Saari files upload karo
3. Settings → Pages → main branch select karo
4. 2 minute mein live! 🌐

---

## 🔑 Login Details

### Admin Login
- **Email:** `admin@bank.com`
- **Password:** `admin123`

### Applicant Login
- `login.html` pe "Register" tab se nayi account banao

---

## ✨ Features

1. **Eligibility Checker** — Income, age, CIBIL, employment se 0–100 score
2. **EMI Calculator** — Live formula: EMI = P·r·(1+r)^n / ((1+r)^n−1)
3. **Document Upload** — File type + size validation (max 2MB)
4. **Application Tracker** — Status pipeline with timeline
5. **Admin Dashboard** — Approve/reject with filters
6. **Auth System** — Role-based login (Applicant vs Admin)

---

## 🏦 Loan Types

| Type | Rate | Max Amount |
|------|------|-----------|
| Personal Loan | 10.5% | ₹15,00,000 |
| Home Loan | 8.5% | ₹1,00,00,000 |
| Vehicle Loan | 9.5% | ₹30,00,000 |
| Education Loan | 8.0% | ₹20,00,000 |
| Business Loan | 11.5% | ₹50,00,000 |
| Agriculture Loan | 7.0% | ₹10,00,000 |

---

## 🛠️ Technology Stack

- **HTML5** — Semantic markup
- **CSS3** — Flexbox, Grid, CSS Variables
- **Vanilla JavaScript ES6+** — No framework
- **localStorage API** — Data persistence
- **sessionStorage** — Login session

---

## 📱 Test Flow

### Applicant Flow:
1. `index.html` → `login.html` → Register karo
2. `apply.html` → Loan type chuneo → EMI dekho → Eligibility check karo → Submit karo
3. `tracker.html` → Apni application track karo

### Admin Flow:
1. `login.html` → `admin@bank.com` / `admin123`
2. `admin.html` → Saari applications dekho → Approve ya Reject karo

---

*MMMUT Gorakhpur | Dept. of IT & Computer Applications (ITCA) | Session 2025-26*
