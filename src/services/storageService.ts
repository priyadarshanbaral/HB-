import { User, AuthToken, AuditLog, DomainPolicy } from '../types/auth';
import { supabaseService } from './supabaseClient';

const STORAGE_KEYS = {
  CURRENT_USER: 'hbplus_auth_user',
  AUTH_TOKEN: 'hbplus_auth_token',
  USER_DATABASE: 'hbplus_user_directory',
  AUDIT_LOGS: 'hbplus_audit_logs',
  DOMAIN_POLICY: 'hbplus_domain_policy',
  GOOGLE_CLIENT_ID: 'hbplus_google_client_id',
};

// Seed initial employee database for hbplus.fit
const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Alex Morgan',
    email: 'alex.morgan@hbplus.fit',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    domain: 'hbplus.fit',
    role: 'admin',
    department: 'Corporate IT & Security',
    title: 'Lead Systems Architect',
    joinedAt: '2023-01-15',
    lastLoginAt: '2026-10-17T10:15:00Z',
  },
  {
    id: 'usr_member_02',
    name: 'Sarah Chen',
    email: 'sarah.chen@hbplus.fit',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    domain: 'hbplus.fit',
    role: 'user',
    department: 'Health & Wellness Research',
    title: 'Senior Biometrics Analyst',
    joinedAt: '2023-06-20',
    lastLoginAt: '2026-10-16T14:40:00Z',
  },
  {
    id: 'usr_member_03',
    name: 'Marcus Vance',
    email: 'marcus.vance@hbplus.fit',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    domain: 'hbplus.fit',
    role: 'user',
    department: 'Product Operations',
    title: 'Fitness Tech Specialist',
    joinedAt: '2024-02-01',
    lastLoginAt: '2026-10-15T09:20:00Z',
  },
  {
    id: 'usr_admin_04',
    name: 'Elena Rostova',
    email: 'elena.rostova@hbplus.fit',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    domain: 'hbplus.fit',
    role: 'admin',
    department: 'Executive Operations',
    title: 'Director of HR & Compliance',
    joinedAt: '2022-11-10',
    lastLoginAt: '2026-10-17T08:00:00Z',
  },
];

const INITIAL_DOMAIN_POLICY: DomainPolicy = {
  allowedDomain: 'hbplus.fit',
  enforceExactDomain: true,
  allowSubdomains: false,
  organizationName: 'HBPlus Fitness & Health Technologies',
};

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_seed_01',
    timestamp: Date.now() - 3600000 * 2,
    event: 'LOGIN_SUCCESS',
    email: 'alex.morgan@hbplus.fit',
    status: 'allowed',
    details: 'Google OAuth login verified for verified corporate domain @hbplus.fit',
    ipAddress: '192.168.1.42',
    device: 'Web Client / Chrome 129',
  },
  {
    id: 'log_seed_02',
    timestamp: Date.now() - 3600000 * 5,
    event: 'LOGIN_REJECTED_DOMAIN',
    email: 'unauthorized_guest@gmail.com',
    status: 'restricted',
    details: 'Login blocked: Email domain @gmail.com is not allowed. Requires @hbplus.fit',
    ipAddress: '104.28.19.12',
    device: 'Mobile Web / Safari 18',
  },
];

class StorageService {
  private memoryStore: Map<string, string> = new Map();

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__hbplus_storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
    return this.memoryStore.get(key) || null;
  }

  private setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.setItem(key, value);
    } else {
      this.memoryStore.set(key, value);
    }
  }

  private removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
    } else {
      this.memoryStore.delete(key);
    }
  }

  // Session & Auth
  getCurrentUser(): User | null {
    const raw = this.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (!user) {
      this.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      this.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }

  getAuthToken(): AuthToken | null {
    const raw = this.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setAuthToken(token: AuthToken | null): void {
    if (!token) {
      this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } else {
      this.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(token));
    }
  }

  clearSession(): void {
    this.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // User Directory / Database
  getUsers(): User[] {
    const raw = this.getItem(STORAGE_KEYS.USER_DATABASE);
    if (!raw) {
      this.setItem(STORAGE_KEYS.USER_DATABASE, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USER_DATABASE, JSON.stringify(users));
  }

  findUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  upsertUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.unshift(user);
    }
    this.saveUsers(users);
    // Asynchronously sync with Supabase cloud database
    supabaseService.syncUser(user).catch(() => {});
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const raw = this.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      this.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const logs = this.getAuditLogs();
    const newEntry: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    logs.unshift(newEntry);
    // Keep last 50 logs
    const trimmed = logs.slice(0, 50);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(trimmed));
    // Asynchronously record in Supabase audit_logs table
    supabaseService.syncAuditLog(newEntry).catch(() => {});
    return newEntry;
  }

  clearAuditLogs(): void {
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }

  // Domain Policy
  getDomainPolicy(): DomainPolicy {
    const raw = this.getItem(STORAGE_KEYS.DOMAIN_POLICY);
    if (!raw) {
      this.setItem(STORAGE_KEYS.DOMAIN_POLICY, JSON.stringify(INITIAL_DOMAIN_POLICY));
      return INITIAL_DOMAIN_POLICY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DOMAIN_POLICY;
    }
  }

  saveDomainPolicy(policy: DomainPolicy): void {
    this.setItem(STORAGE_KEYS.DOMAIN_POLICY, JSON.stringify(policy));
  }

  // Google OAuth Config
  getGoogleClientId(): string {
    return this.getItem(STORAGE_KEYS.GOOGLE_CLIENT_ID) || '';
  }

  setGoogleClientId(clientId: string): void {
    this.setItem(STORAGE_KEYS.GOOGLE_CLIENT_ID, clientId.trim());
  }
}

export const storageService = new StorageService();
