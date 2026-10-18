# HB+ Company Authentication Application

A secure enterprise intranet web application for **HB+** with Google OAuth 2.0 authentication strictly restricted to approved corporate accounts ending in `@hbplus.fit`, featuring persistent cloud data storage powered by **Supabase**.

---

## 🚀 Overview

- **Configured Company Domain**: `hbplus.fit`
- **Supabase Project ID**: `zwmzzdcbxccfdqqyrvut`
- **Supabase API Key**: `sb_publishable_CGiqIUKKO4bYMjbxi9vUwA_f_TW8l6G`
- **Target URL**: `https://zwmzzdcbxccfdqqyrvut.supabase.co`

### Domain Enforcement Rules:
- `employee@hbplus.fit` ➔ **Access Allowed** (Session token issued, profile stored, user enters protected Dashboard).
- `employee@gmail.com` ➔ **Access Denied** (`"Access restricted. Please login using your official domain email."`).
- `employee@yahoo.com` ➔ **Access Denied**.
- `employee@hbplus.fit.example.com` ➔ **Access Denied** (Subdomain spoofing blocked).
- `employee@not-hbplus.fit` ➔ **Access Denied** (Typosquatting/lookalike blocked).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, React Native Web, TypeScript, Vite
- **Styling**: Vanilla CSS & Tailwind CSS styling primitives
- **Authentication**: Google OAuth 2.0 Identity Services + JWT Token verification
- **Database / Cloud Backend**: Supabase (PostgreSQL tables for `employees` and `audit_logs`)
- **Testing**: Node.js Test Runner with `tsx` (`npm test`)

---

## 📂 Project Structure

```text
HB-/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── GoogleLogo.tsx         # Google brand SVG icon
│   │   │   └── GoogleOAuthModal.tsx   # Google Account selector & identity dialog
│   │   ├── common/
│   │   │   └── BrandLogo.tsx          # HB+ corporate vector logo
│   │   └── layout/
│   │       └── DevicePreviewContainer.tsx
│   ├── context/
│   │   └── AuthContext.tsx            # Global centralized authentication provider
│   ├── screens/
│   │   ├── LoginScreen.tsx            # Corporate login page with domain test sandbox
│   │   └── DashboardScreen.tsx        # Protected dashboard with profile & audit logs
│   ├── services/
│   │   ├── authService.ts             # Domain validation and session token generator
│   │   ├── storageService.ts          # Session caching & Supabase synchronization
│   │   └── supabaseClient.ts          # Supabase client (`zwmzzdcbxccfdqqyrvut`)
│   ├── utils/
│   │   └── domainValidator.ts         # Strict domain validation engine
│   ├── types/
│   │   └── auth.ts                    # TypeScript types (User, AuthToken, AuditLog)
│   ├── App.tsx                        # Root application coordinator
│   └── main.tsx                       # Web mounting entrypoint
├── tests/
│   └── domainValidator.test.ts        # Comprehensive unit tests
├── .env                               # Active local environment variables
├── .env.example                       # Template for environment configuration
├── .gitignore                         # Git exclusion rules
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite bundler configuration
└── README.md                          # Documentation
```

---

## 🗄️ Supabase Cloud Database Setup

This application connects to Supabase project `zwmzzdcbxccfdqqyrvut`.

### 1. SQL Schema Execution
To create the necessary tables in Supabase:
1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/zwmzzdcbxccfdqqyrvut/sql).
2. Paste and run the following SQL script:

```sql
-- 1. Employees Directory Table
create table if not exists public.employees (
  id text primary key,
  name text not null,
  email text unique not null,
  avatar_url text,
  domain text default 'hbplus.fit',
  role text default 'user',
  department text default 'Corporate Health',
  title text default 'Team Member',
  joined_at text,
  last_login_at text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Audit Logs Table (Tracks Allowed & Blocked Logins)
create table if not exists public.audit_logs (
  id text primary key,
  event text not null,
  email text not null,
  status text not null,
  details text,
  device text,
  timestamp bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS) Policies
alter table public.employees enable row level security;
alter table public.audit_logs enable row level security;

create policy "Public read and write for employees" on public.employees
  for all using (true) with check (true);

create policy "Public read and write for audit logs" on public.audit_logs
  for all using (true) with check (true);
```

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Automated Unit Tests
```bash
npm test
```
*Validates 6 automated test scenarios:*
- Authorized `@hbplus.fit` emails are allowed
- Case normalization (`Employee@HBPLUS.FIT` ➔ allowed)
- Common external domains (`@gmail.com`, `@yahoo.com`) are denied
- Spoofed and lookalike domains (`@hbplus.fit.example.com`, `@not-hbplus.fit`) are denied
- Missing or malformed emails are rejected
- Google token payload verification

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
```
Generates production-optimized web assets in the `dist/` directory.

---

## 🌐 Netlify Deployment

1. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
2. **Environment Variables**:
   Configure these in Netlify site settings (**Site configuration** ➔ **Environment variables**):
   - `VITE_SUPABASE_URL`: `https://zwmzzdcbxccfdqqyrvut.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_CGiqIUKKO4bYMjbxi9vUwA_f_TW8l6G`
   - `VITE_ALLOWED_DOMAIN`: `hbplus.fit`
3. **Single Page Application Redirects**:
   A `_redirects` rule ensures client-side routing works:
   ```text
   /* /index.html 200
   ```

---

## 🔒 Security Best Practices

1. **Strict RFC-Compliant Domain Extraction**: The domain validator checks strictly the tokenized portion after the `@` symbol, eliminating false positives from string inclusion bugs like `email.includes("hbplus.fit")`.
2. **Cryptographic Token Verification**: Real Google OAuth JWTs contain the `hd: "hbplus.fit"` Hosted Domain claim signed by Google's private key.
3. **Audit Trails**: Every login, blocked attempt, and logout is stamped with timestamp and recorded in Supabase's `audit_logs` table for compliance.
4. **No Hardcoded Secrets**: Secrets and keys are managed via environment variables and standard public publishable key mechanics.
