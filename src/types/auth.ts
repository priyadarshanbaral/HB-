export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  domain: string;
  role: UserRole;
  department: string;
  title: string;
  joinedAt: string;
  lastLoginAt: string;
  token?: string;
}

export interface AuthToken {
  accessToken: string;
  idToken: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: number;
  jwtPayload?: {
    iss: string;
    sub: string;
    aud: string;
    email: string;
    email_verified: boolean;
    hd?: string; // Hosted Domain (Google Workspace claim)
    name: string;
    picture: string;
    iat: number;
    exp: number;
  };
}

export interface AuthError {
  code: string;
  message: string;
  attemptedEmail?: string;
  timestamp: number;
}

export interface DomainPolicy {
  allowedDomain: string; // e.g. "hbplus.fit"
  enforceExactDomain: boolean;
  allowSubdomains: boolean;
  organizationName: string;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  event: 'LOGIN_SUCCESS' | 'LOGIN_REJECTED_DOMAIN' | 'LOGOUT' | 'ROLE_CHANGED' | 'POLICY_UPDATED';
  email: string;
  status: 'allowed' | 'restricted' | 'info';
  details: string;
  ipAddress?: string;
  device?: string;
}
