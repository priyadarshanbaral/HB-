import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthToken, AuthError, AuditLog, DomainPolicy, UserRole } from '../types/auth';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  auditLogs: AuditLog[];
  domainPolicy: DomainPolicy;
  users: User[];
  loginWithGoogle: (email?: string, name?: string) => Promise<boolean>;
  loginWithGoogleCredential: (credentialToken: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  switchRole: (newRole: UserRole) => void;
  updateDomainPolicy: (policy: Partial<DomainPolicy>) => void;
  refreshUsers: () => void;
  clearAuditLogs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [domainPolicy, setDomainPolicy] = useState<DomainPolicy>(storageService.getDomainPolicy());
  const [users, setUsers] = useState<User[]>([]);

  // Initialize session on load
  useEffect(() => {
    try {
      const savedUser = storageService.getCurrentUser();
      const savedToken = storageService.getAuthToken();
      const savedLogs = storageService.getAuditLogs();
      const savedUsers = storageService.getUsers();
      const savedPolicy = storageService.getDomainPolicy();

      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
      setAuditLogs(savedLogs);
      setUsers(savedUsers);
      setDomainPolicy(savedPolicy);
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  const loginWithGoogle = async (emailOverride?: string, nameOverride?: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      // Simulate authentic network latency (400ms) for real OAuth experience
      await new Promise((resolve) => setTimeout(resolve, 450));

      const targetEmail = emailOverride || 'alex.morgan@hbplus.fit';
      const result = await authService.authenticateWithEmail(targetEmail, nameOverride);

      setUser(result.user);
      setToken(result.token);
      setAuditLogs(storageService.getAuditLogs());
      setUsers(storageService.getUsers());
      return true;
    } catch (err: any) {
      const authErr: AuthError = {
        code: err.code || 'AUTH_FAILED',
        message: err.message || 'Authentication failed. Please try again.',
        attemptedEmail: err.attemptedEmail || emailOverride,
        timestamp: Date.now(),
      };
      setError(authErr);
      setAuditLogs(storageService.getAuditLogs());
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogleCredential = async (credentialToken: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      const result = await authService.handleGoogleCredential(credentialToken);
      setUser(result.user);
      setToken(result.token);
      setAuditLogs(storageService.getAuditLogs());
      setUsers(storageService.getUsers());
      return true;
    } catch (err: any) {
      const authErr: AuthError = {
        code: err.code || 'AUTH_FAILED',
        message: err.message || 'Google authentication failed.',
        attemptedEmail: err.attemptedEmail,
        timestamp: Date.now(),
      };
      setError(authErr);
      setAuditLogs(storageService.getAuditLogs());
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      authService.logout(user.email);
    } else {
      authService.logout();
    }
    setUser(null);
    setToken(null);
    clearError();
    setAuditLogs(storageService.getAuditLogs());
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: User = { ...user, role: newRole };
    setUser(updated);
    storageService.setCurrentUser(updated);
    storageService.upsertUser(updated);

    storageService.addAuditLog({
      event: 'ROLE_CHANGED',
      email: user.email,
      status: 'info',
      details: `Role updated to ${newRole.toUpperCase()}`,
      device: 'Internal Session',
    });

    setAuditLogs(storageService.getAuditLogs());
    setUsers(storageService.getUsers());
  };

  const updateDomainPolicy = (partial: Partial<DomainPolicy>) => {
    const updated = { ...domainPolicy, ...partial };
    setDomainPolicy(updated);
    storageService.saveDomainPolicy(updated);

    storageService.addAuditLog({
      event: 'POLICY_UPDATED',
      email: user?.email || 'admin@hbplus.fit',
      status: 'info',
      details: `Domain policy updated: Allowed domain is now '${updated.allowedDomain}'`,
      device: 'Admin Console',
    });

    setAuditLogs(storageService.getAuditLogs());
  };

  const refreshUsers = () => {
    setUsers(storageService.getUsers());
  };

  const clearAuditLogs = () => {
    storageService.clearAuditLogs();
    setAuditLogs([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        auditLogs,
        domainPolicy,
        users,
        loginWithGoogle,
        loginWithGoogleCredential,
        logout,
        clearError,
        switchRole,
        updateDomainPolicy,
        refreshUsers,
        clearAuditLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
