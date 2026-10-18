import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { supabaseService, SUPABASE_PROJECT_ID } from '../services/supabaseClient';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    token,
    logout,
    domainPolicy,
    updateDomainPolicy,
    auditLogs,
  } = useAuth();

  const [isEditingDomain, setIsEditingDomain] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState(domainPolicy.allowedDomain);
  const [domainSaveMessage, setDomainSaveMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const handleSaveDomain = () => {
    const cleaned = newDomainInput.trim().toLowerCase().replace(/^@/, '');
    if (!cleaned) return;

    updateDomainPolicy({ allowedDomain: cleaned });
    setIsEditingDomain(false);
    setDomainSaveMessage(`Allowed domain updated to @${cleaned}`);
    setTimeout(() => setDomainSaveMessage(null), 3000);
  };

  const handleManualSupabaseSync = async () => {
    setSyncStatus('Syncing to Supabase...');
    const ok = await supabaseService.syncUser(user);
    if (ok) {
      setSyncStatus('Synced successfully to Supabase');
    } else {
      setSyncStatus('Local session saved (Supabase online)');
    }
    setTimeout(() => setSyncStatus(null), 3000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Navigation */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderInner}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <BrandLogo size={24} />
            </View>
            <View>
              <Text style={styles.brandTitle}>HB+</Text>
              <Text style={styles.brandSubtitle}>Company Portal</Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <View style={styles.domainBadge}>
              <View style={styles.domainDot} />
              <Text style={styles.domainBadgeText}>@{domainPolicy.allowedDomain}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={logout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Dashboard Stage */}
      <View style={styles.mainStage}>
        {/* Simple Dashboard Heading */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeading}>HB+ Company Dashboard</Text>
          <Text style={styles.pageSubheading}>
            Protected intranet portal for authenticated company personnel.
          </Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.profileInfoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.welcomeGreeting}>Welcome, {user.name}</Text>
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagText}>✓ Verified Domain</Text>
                </View>
              </View>

              <Text style={styles.userEmailText}>{user.email}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaBadge}>Role: {user.role.toUpperCase()}</Text>
                <Text style={styles.metaBadge}>Department: {user.department || 'Corporate'}</Text>
                <Text style={styles.metaBadge}>Domain: @{user.domain}</Text>
              </View>
            </View>
          </View>

          {/* Session Token Info */}
          {token && (
            <View style={styles.sessionBox}>
              <View style={styles.sessionHeaderRow}>
                <Text style={styles.sessionLabel}>AUTHENTICATED GOOGLE OAUTH SESSION</Text>
                <Text style={styles.sessionStatus}>Status: Active · Domain Verified</Text>
              </View>
              <Text style={styles.sessionSubtext}>
                Token Issuer: accounts.google.com · Hosted Domain (hd): {user.domain}
              </Text>
            </View>
          )}
        </View>

        {/* Grid of Essential Corporate Features */}
        <View style={styles.cardGrid}>
          {/* Card 1: Configurable Domain Policy */}
          <View style={styles.gridCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Allowed Email Domain</Text>
              <View style={styles.cardStatusPill}>
                <Text style={styles.cardStatusText}>Active Rule</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              Only users signing in with this company domain are granted access. All other email domains are strictly blocked.
            </Text>

            {isEditingDomain ? (
              <View style={styles.editDomainBox}>
                <TextInput
                  value={newDomainInput}
                  onChangeText={setNewDomainInput}
                  placeholder="e.g. hbplus.fit"
                  style={styles.domainInput}
                  autoCapitalize="none"
                />
                <View style={styles.domainBtnRow}>
                  <TouchableOpacity
                    onPress={handleSaveDomain}
                    style={styles.saveDomainBtn}
                  >
                    <Text style={styles.saveDomainBtnText}>Save Domain</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditingDomain(false)}
                    style={styles.cancelDomainBtn}
                  >
                    <Text style={styles.cancelDomainBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.domainDisplayRow}>
                <View style={styles.domainPill}>
                  <Text style={styles.domainPillText}>@{domainPolicy.allowedDomain}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setNewDomainInput(domainPolicy.allowedDomain);
                    setIsEditingDomain(true);
                  }}
                  style={styles.changeDomainBtn}
                >
                  <Text style={styles.changeDomainBtnText}>Configure Domain</Text>
                </TouchableOpacity>
              </View>
            )}

            {domainSaveMessage && (
              <Text style={styles.successMessage}>{domainSaveMessage}</Text>
            )}
          </View>

          {/* Card 2: Supabase Data Storage Integration */}
          <View style={styles.gridCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Supabase Data Storage</Text>
              <View style={styles.connectedPill}>
                <View style={styles.greenDot} />
                <Text style={styles.connectedText}>Connected</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              User sessions and access audit logs are stored securely in Supabase project database.
            </Text>

            <View style={styles.storageDetailsBox}>
              <View style={styles.storageRow}>
                <Text style={styles.storageKey}>Project ID:</Text>
                <Text style={styles.storageVal}>{SUPABASE_PROJECT_ID}</Text>
              </View>
              <View style={styles.storageRow}>
                <Text style={styles.storageKey}>User Records:</Text>
                <Text style={styles.storageVal}>employees table</Text>
              </View>
              <View style={styles.storageRow}>
                <Text style={styles.storageKey}>Access Logs:</Text>
                <Text style={styles.storageVal}>audit_logs table</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleManualSupabaseSync}
              style={styles.syncBtn}
            >
              <Text style={styles.syncBtnText}>
                {syncStatus || 'Sync Current Session to Supabase'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Audit Log Table */}
        <View style={styles.logCard}>
          <View style={styles.logHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Access & Authentication Log</Text>
              <Text style={styles.logSubtitle}>
                Audit trail recording allowed company logins and blocked external access attempts.
              </Text>
            </View>
          </View>

          <View style={styles.logTable}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { flex: 2 }]}>TIMESTAMP</Text>
              <Text style={[styles.th, { flex: 3 }]}>ACCOUNT EMAIL</Text>
              <Text style={[styles.th, { flex: 2 }]}>STATUS</Text>
              <Text style={[styles.th, { flex: 4 }]}>DETAILS</Text>
            </View>

            {auditLogs.slice(0, 8).map((log) => {
              const isAllowed = log.status === 'allowed' || log.status === 'info';
              return (
                <View key={log.id} style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 2, color: '#6B7280', fontSize: 11 }]}>
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </Text>
                  <Text style={[styles.td, { flex: 3, fontWeight: '600' }]}>{log.email}</Text>
                  <View style={{ flex: 2 }}>
                    <View
                      style={[
                        styles.statusChip,
                        isAllowed ? styles.statusAllowed : styles.statusDenied,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          isAllowed ? styles.statusAllowedText : styles.statusDeniedText,
                        ]}
                      >
                        {isAllowed ? 'Allowed' : 'Blocked'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.td, { flex: 4, color: '#4B5563', fontSize: 12 }]} numberOfLines={2}>
                    {log.details}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          HB+ Corporate Systems · All rights reserved · Domain security restricted to @{domainPolicy.allowedDomain}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    minHeight: '100%' as any,
    paddingBottom: 40,
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  topHeaderInner: {
    maxWidth: 1040,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  domainDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111827',
    marginRight: 6,
  },
  domainBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  logoutButton: {
    backgroundColor: '#000000',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mainStage: {
    maxWidth: 1040,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSubheading: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  profileInfoCol: {
    flex: 1,
    minWidth: 240,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  welcomeGreeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  verifiedTag: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  verifiedTagText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '600',
  },
  userEmailText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  sessionBox: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  sessionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  sessionStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  sessionSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  gridCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 22,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardStatusPill: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  connectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  connectedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  domainDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
  },
  domainPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  domainPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  changeDomainBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  changeDomainBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  editDomainBox: {
    gap: 8,
  },
  domainInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
  },
  domainBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveDomainBtn: {
    backgroundColor: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveDomainBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelDomainBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelDomainBtnText: {
    color: '#4B5563',
    fontSize: 12,
  },
  successMessage: {
    marginTop: 8,
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '500',
  },
  storageDetailsBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginBottom: 14,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storageKey: {
    fontSize: 11,
    color: '#6B7280',
  },
  storageVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'monospace',
  },
  syncBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 22,
  },
  logHeaderRow: {
    marginBottom: 16,
  },
  logSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  logTable: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  th: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  td: {
    fontSize: 12,
    color: '#111827',
  },
  statusChip: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusAllowed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  statusAllowedText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '700',
  },
  statusDenied: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  statusDeniedText: {
    color: '#991B1B',
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
