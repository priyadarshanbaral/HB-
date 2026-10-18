import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, AuditLog, DomainPolicy } from '../types/auth';

export const SUPABASE_PROJECT_ID = 'zwmzzdcbxccfdqqyrvut';

function getSanitizedSupabaseUrl(): string {
  const fallback = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
  const raw = import.meta.env.VITE_SUPABASE_URL;
  if (!raw || typeof raw !== 'string') return fallback;

  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'MY_SUPABASE_URL' || trimmed === 'YOUR_SUPABASE_URL') {
    return fallback;
  }

  // If user or environment passed just the project id (e.g. "zwmzzdcbxccfdqqyrvut")
  if (/^[a-z0-9_-]{12,45}$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }

  // If passed domain like "xxx.supabase.co" without protocol
  if (trimmed.includes('supabase.co') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    try {
      const formatted = `https://${trimmed.replace(/^\/+/, '')}`;
      new URL(formatted);
      return formatted;
    } catch {
      return fallback;
    }
  }

  // If starts with https:// or http://, validate with URL parser
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return fallback;
    }
  }

  // Otherwise try prepending https://
  try {
    const formatted = `https://${trimmed}`;
    new URL(formatted);
    return formatted;
  } catch {
    return fallback;
  }
}

function getSanitizedAnonKey(): string {
  const fallback = 'sb_publishable_CGiqIUKKO4bYMjbxi9vUwA_f_TW8l6G';
  const raw = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!raw || typeof raw !== 'string') return fallback;

  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'YOUR_SUPABASE_ANON_KEY' || trimmed === 'MY_SUPABASE_KEY') {
    return fallback;
  }
  return trimmed;
}

export const SUPABASE_URL = getSanitizedSupabaseUrl();
export const SUPABASE_ANON_KEY = getSanitizedAnonKey();

function initSupabaseClient(): SupabaseClient {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err: any) {
    console.warn('Failed to initialize primary Supabase client:', err?.message);
    try {
      return createClient(`https://${SUPABASE_PROJECT_ID}.supabase.co`, 'sb_publishable_CGiqIUKKO4bYMjbxi9vUwA_f_TW8l6G', {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch {
      // Safe fallback proxy so UI never crashes even if network or client fails
      return new Proxy({} as SupabaseClient, {
        get: () => () => ({
          upsert: () => Promise.resolve({ error: { message: 'Offline mode' } }),
          insert: () => Promise.resolve({ error: { message: 'Offline mode' } }),
          select: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: null, error: { message: 'Offline mode' } }),
            }),
          }),
        }),
      });
    }
  }
}

export const supabase: SupabaseClient = initSupabaseClient();

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSyncAt: number | null;
  syncedTables: string[];
  error?: string;
}

class SupabaseService {
  private syncStatus: SupabaseSyncStatus = {
    connected: true,
    lastSyncAt: null,
    syncedTables: [],
  };

  getStatus(): SupabaseSyncStatus {
    return this.syncStatus;
  }

  /**
   * Sync a user to Supabase
   */
  async syncUser(user: User): Promise<boolean> {
    try {
      const { error } = await supabase.from('employees').upsert(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatarUrl,
          domain: user.domain,
          role: user.role,
          department: user.department,
          title: user.title,
          joined_at: user.joinedAt,
          last_login_at: user.lastLoginAt,
        },
        { onConflict: 'email' }
      );

      if (error) {
        console.warn('Supabase employees table sync note (tables may need SQL init):', error.message);
        this.syncStatus.error = error.message;
        return false;
      }

      this.syncStatus.connected = true;
      this.syncStatus.lastSyncAt = Date.now();
      if (!this.syncStatus.syncedTables.includes('employees')) {
        this.syncStatus.syncedTables.push('employees');
      }
      return true;
    } catch (err: any) {
      console.warn('Supabase syncUser caught:', err?.message);
      return false;
    }
  }

  /**
   * Sync an authentication audit log to Supabase
   */
  async syncAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'> & { id?: string; timestamp?: number }): Promise<boolean> {
    try {
      const { error } = await supabase.from('audit_logs').insert([
        {
          id: log.id || `log_${Date.now()}`,
          event: log.event,
          email: log.email,
          status: log.status,
          details: log.details,
          device: log.device || 'Web Browser',
          timestamp: log.timestamp || Date.now(),
        },
      ]);

      if (error) {
        console.warn('Supabase audit_logs sync note:', error.message);
        return false;
      }

      this.syncStatus.connected = true;
      this.syncStatus.lastSyncAt = Date.now();
      if (!this.syncStatus.syncedTables.includes('audit_logs')) {
        this.syncStatus.syncedTables.push('audit_logs');
      }
      return true;
    } catch (err: any) {
      console.warn('Supabase syncAuditLog caught:', err?.message);
      return false;
    }
  }

  /**
   * Fetch all users from Supabase if table exists
   */
  async fetchUsers(): Promise<User[] | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('joined_at', { ascending: false });

      if (error || !data) {
        return null;
      }

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        avatarUrl: d.avatar_url || '',
        domain: d.domain || 'hbplus.fit',
        role: d.role || 'user',
        department: d.department || 'Corporate Operations',
        title: d.title || 'Team Member',
        joinedAt: d.joined_at || new Date().toISOString().split('T')[0],
        lastLoginAt: d.last_login_at || new Date().toISOString(),
      }));
    } catch {
      return null;
    }
  }

  /**
   * Fetch audit logs from Supabase if table exists
   */
  async fetchAuditLogs(): Promise<AuditLog[] | null> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error || !data) {
        return null;
      }

      return data.map((d: any) => ({
        id: d.id,
        timestamp: d.timestamp || Date.now(),
        event: d.event,
        email: d.email,
        status: d.status,
        details: d.details,
        device: d.device,
        ipAddress: d.ip_address,
      }));
    } catch {
      return null;
    }
  }

  /**
   * Returns copyable SQL schema to set up tables in Supabase SQL editor if needed
   */
  getSqlSetupScript(): string {
    return `-- HBPlus Fit Supabase Schema
-- Run this in your Supabase SQL Editor (Project: ${SUPABASE_PROJECT_ID})

-- 1. Employees Table
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

-- 3. Enable Row Level Security (RLS) & Public Policies
alter table public.employees enable row level security;
alter table public.audit_logs enable row level security;

create policy "Public read and write for employees" on public.employees
  for all using (true) with check (true);

create policy "Public read and write for audit logs" on public.audit_logs
  for all using (true) with check (true);
`;
  }
}

export const supabaseService = new SupabaseService();
