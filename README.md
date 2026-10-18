# HBPlus Fit - Cross-Platform Domain-Restricted Google Authentication

<p align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_edjoyVXOIzBGFLCFUNBeKgdyufmCdt38_M8d9QhoTQ&s=10" alt="HBPlus Fit Official Logo" width="120" style="border-radius: 16px;" />
</p>

A secure cross-platform application built with **React Native (and React Native for Web)** supporting both **Mobile (iOS & Android)** and **Web** environments from a single unified codebase.

The application enforces strict **Google OAuth 2.0 authentication** restricted exclusively to corporate accounts ending in `@hbplus.fit`.

---

## 🌟 Key Highlights

- **Single Cross-Platform Codebase**: Pure React Native components (`View`, `Text`, `TouchableOpacity`, `StyleSheet`, `ActivityIndicator`) rendered seamlessly on web browsers and mobile emulators.
- **Strict Domain Verification**:
  - `user@hbplus.fit` ➔ **Access Granted** (JWT generated, session established, redirected to protected Dashboard).
  - `user@gmail.com` or other external domains ➔ **Access Blocked** with exact error message:  
    `"Access restricted. Please login using your official domain email."`
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to Organization Overview, Employee Directory Management, Domain Policy Whitelist Configuration, and Security Audit Logs.
  - **User**: Protected Employee Portal, Biometrics & Fitness Passes, and Corporate Directory.
- **Persistent Storage & Security Audit Logs**:
  - Tracks every successful login and denied access attempt with timestamps, IP/device agent, and domain reason.
- **Interactive Multi-Platform Preview**:
  - In-app toggle between **Full Web Browser View**, **Apple iPhone 16 Pro Simulator**, and **Google Pixel 8 Simulator**.
- **Interactive Domain Testing Suite**:
  - One-tap testing for authorized admin (`alex.morgan@hbplus.fit`), regular user (`sarah.chen@hbplus.fit`), rejected Gmail user (`priyadrshanbaral@gmail.com`), and customizable email tester.

---

## 🏗️ Architecture & Clean Folder Structure

```
├── README.md                      # Complete setup & architecture documentation
├── package.json                   # Dependencies & build scripts
├── index.html                     # Web entry point with Google Identity Services
├── metadata.json                  # AI Studio App configuration
├── vite.config.ts                 # Vite bundler with React Native for Web alias
├── tsconfig.json                  # Strict TypeScript configuration
└── src/
    ├── main.tsx                   # React 19 root bootstrap
    ├── App.tsx                    # Root coordinator & protected route guard
    ├── types/
    │   └── auth.ts                # TypeScript interfaces (User, AuthToken, DomainPolicy, AuditLog)
    ├── utils/
    │   └── domainValidator.ts     # Domain extraction & regex validation logic
    ├── services/
    │   ├── authService.ts         # Google OAuth handler, JWT parser, token minting
    │   └── storageService.ts      # Persistent session, user directory database & audit logs
    ├── context/
    │   └── AuthContext.tsx        # React Context for global auth state & actions
    ├── screens/
    │   ├── LoginScreen.tsx        # React Native Login Screen with Google OAuth & domain tester
    │   └── DashboardScreen.tsx    # Protected Dashboard with RBAC (Admin & User views)
    └── components/
        ├── auth/
        │   ├── GoogleLogo.tsx     # Vector Google brand icon
        │   └── GoogleOAuthModal.tsx # Google Account picker & email tester dialog
        ├── common/
        │   ├── RNButton.tsx       # React Native button primitive with variants & loading state
        │   ├── RNCard.tsx         # React Native card container
        │   ├── RNBadge.tsx        # Role & status badge indicators
        │   └── RNAlert.tsx        # Error banner with exact restriction messaging
        ├── layout/
        │   └── DevicePreviewContainer.tsx # Mobile / Web live viewport emulator
        └── docs/
            └── ReadmeModal.tsx    # In-app interactive documentation modal
```

---

## 🔒 Authentication & Domain Restriction Flow

```
+-------------------------------------------------------------+
|                     User clicks                             |
|              [ Sign in with Google ]                        |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|           Google OAuth 2.0 Identity Consent Flow            |
|       (Returns email, name, avatar, and JWT ID token)       |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              Domain Validation Inspection Point             |
|                targetDomain = "hbplus.fit"                  |
+-------------------------------------------------------------+
               /                               \
              /                                 \
  Matches @hbplus.fit?                 Does NOT match @hbplus.fit?
            /                                     \
           v                                       v
+-----------------------+              +-------------------------------+
|  STATUS: ALLOWED      |              |  STATUS: BLOCKED              |
|  - Mint Session Token |              |  - Log Security Audit Event   |
|  - Upsert in Database |              |  - Display Error Banner:      |
|  - Redirect to        |              |    "Access restricted. Please |
|    Protected Dashboard|              |     login using your official |
+-----------------------+              |     domain email."            |
                                       +-------------------------------+
```

### Detailed Validation Rules:
1. Normalizes email: `trim().toLowerCase()`.
2. Extracts domain part following `@`.
3. Verifies against configured allowed domain (default `hbplus.fit`).
4. Rejects all public email providers (`gmail.com`, `yahoo.com`, `outlook.com`, etc.) and mismatched corporate domains.
5. Emits an immutable audit log entry with timestamp and client device metadata.

---

## 🚀 Setup & Installation Instructions

### Web Execution (Vite + React Native for Web)
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

### React Native Mobile (Expo / Bare React Native)
Because the codebase uses pure React Native primitives (`View`, `Text`, `TouchableOpacity`, `StyleSheet`, `ActivityIndicator`, `ScrollView`, `TextInput`), the same screens drop directly into an Expo or bare React Native project:
```bash
# In an Expo project:
npx create-expo-app HBPlusMobile --template blank-typescript
cd HBPlusMobile
npm install @react-native-async-storage/async-storage

# Copy screens and components from /src
npx expo start
```

---

## 🛡️ Security Best Practices & Token Architecture

### 1. Raw ID Token Decomposition (RFC 7519)
The application handles authentic OpenID Connect (OIDC) ID tokens issued by Google Identity Services, composed of three Base64URL-encoded segments:
```
header.payload.signature
```

#### Example Valid Token (Authorized @hbplus.fit Domain):
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imdvb2dsZS1rZXktaWQtOTgxMiJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiJnb29nbGVfb2F1dGhfcHF6dzg2MGFldCIsImF6cCI6ImhicGx1cy1maXQtYXBwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiaGJwbHVzLWZpdC1hcHAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6ImFsZXgubW9yZ2FuQGhicGx1cy5maXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaGQiOiJoYnBsdXMuZml0IiwibmFtZSI6IkFsZXggTW9yZ2FuIiwicGljdHVyZSI6Imh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTM0NTI4NzQxNzc1LTUzOTk0YTY5ZGFlYj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTIwMCZoPTIwMCZxPTgwIiwiZ2l2ZW5fbmFtZSI6IkFsZXgiLCJmYW1pbHlfbmFtZSI6Ik1vcmdhbiIsImlhdCI6MTc5MjI2NjQ0MywiZXhwIjoxNzkyMjcwMDQzfQ==.dmVyaWZpZWRfcnNhX3NpZ25hdHVyZV9tb2NrXzE3OTIyNjY0NDM4NTI=
```

#### Decoded Structure:
1. **Header (JOSE)**:
   ```json
   {
     "alg": "RS256",
     "typ": "JWT",
     "kid": "google-key-id-9812"
   }
   ```
   Specifies RSASSA-PKCS1-v1_5 digital signature with SHA-256. Google's public certificates are retrieved from `https://www.googleapis.com/oauth2/v3/certs`.

2. **Payload Claims**:
   ```json
   {
     "iss": "https://accounts.google.com",
     "sub": "google_oauth_pqzw860aet",
     "azp": "hbplus-fit-app.apps.googleusercontent.com",
     "aud": "hbplus-fit-app.apps.googleusercontent.com",
     "email": "alex.morgan@hbplus.fit",
     "email_verified": true,
     "hd": "hbplus.fit",
     "name": "Alex Morgan",
     "picture": "https://images.unsplash.com/...",
     "given_name": "Alex",
     "family_name": "Morgan",
     "iat": 1792266443,
     "exp": 1792270043
   }
   ```
   - **`"hd": "hbplus.fit"`**: The **Hosted Domain claim**. Google Workspace accounts automatically embed this claim. Regular `@gmail.com` accounts do NOT have this claim, ensuring airtight domain rejection at the cryptographic boundary.
   - **`"email"`**: The user's corporate email address verified by Google.
   - **`"exp"`**: UNIX timestamp when the token expires (3600 seconds validity).

3. **Digital Signature**:
   ```
   RSASHA256(base64Url(header) + "." + base64Url(payload), google_private_key)
   ```
   Guarantees that no party can modify the email or claims without invalidating the cryptographic signature.

---

### 2. Stateless Route Protection Architecture
1. **Route Guard**: The router checks for an active session token before rendering protected views (`/dashboard`).
2. **Stateless Verification**: The client/backend validates the signature using Google's public keys without requiring continuous database roundtrips.
3. **Hosted Domain Check**: The validator confirms `token.payload.hd === "hbplus.fit"` and `email.endsWith("@hbplus.fit")`.
4. **Denial & Audit**: If any unauthorized domain attempts authentication:
   - Access is blocked.
   - An immutable audit entry (`LOGIN_REJECTED_DOMAIN`) is recorded.
   - The user sees: `"Access restricted. Please login using your official domain email."`

---

## ⚙️ Google Cloud Console OAuth 2.0 Setup

To connect live production Google OAuth 2.0 credentials:

1. **Open Google Cloud Console**:
   - Navigate to **APIs & Services** ➔ **Credentials**.
   - Click **Create Credentials** ➔ **OAuth Client ID**.
   - Select **Application type**: **Web application**.

2. **Configure Authorized Origins**:
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (Local testing)
     - `https://your-domain.run.app` (Cloud Run production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (for popup/GIS flows)

3. **Configure Scopes**:
   - `openid`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

4. **Google Workspace Domain Linking**:
   - In Google Workspace Admin, verify that `@hbplus.fit` is configured as a Primary or Secondary domain. All users created under this domain will automatically receive the `"hd": "hbplus.fit"` claim in their ID tokens.
