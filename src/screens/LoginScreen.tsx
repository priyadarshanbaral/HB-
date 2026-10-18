import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { GoogleLogo } from '../components/auth/GoogleLogo';
import { GoogleOAuthModal } from '../components/auth/GoogleOAuthModal';
import { SUPABASE_PROJECT_ID } from '../services/supabaseClient';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, isLoading, error, clearError, domainPolicy } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customEmailInput, setCustomEmailInput] = useState('');

  const handleSelectAccount = async (email: string, name?: string) => {
    await loginWithGoogle(email, name);
  };

  const handleQuickTest = async (testEmail: string, testName?: string) => {
    clearError();
    await loginWithGoogle(testEmail, testName);
  };

  const handleCustomTest = async () => {
    if (!customEmailInput.trim()) return;
    clearError();
    await loginWithGoogle(customEmailInput.trim());
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Corporate Navigation Bar */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderInner}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadgeSmall}>
              <BrandLogo size={22} />
            </View>
            <View>
              <Text style={styles.brandTitle}>HB+</Text>
              <Text style={styles.brandSubtitle}>Company Authentication Portal</Text>
            </View>
          </View>

          <View style={styles.headerRightBadges}>
            <View style={styles.domainBadge}>
              <View style={styles.domainDot} />
              <Text style={styles.domainBadgeText}>Allowed: @{domainPolicy.allowedDomain}</Text>
            </View>

            <View style={styles.supabaseBadge}>
              <View style={styles.supabaseDot} />
              <Text style={styles.supabaseBadgeText}>Supabase: {SUPABASE_PROJECT_ID}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mainWrapper}>
        <View style={styles.cardContainer}>
          {/* Company Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <BrandLogo size={36} />
            </View>
            <Text style={styles.companyName}>HB+</Text>
          </View>

          {/* Headings */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.heading}>Welcome to HB+</Text>
            <Text style={styles.subtitle}>Sign in with your official company account</Text>
          </View>

          {/* Clear Authentication Error Message */}
          {error && (
            <View style={styles.errorBanner}>
              <View style={styles.errorIconWrapper}>
                <Text style={styles.errorIcon}>✕</Text>
              </View>
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorTitle}>Access Denied</Text>
                <Text style={styles.errorMessage}>{error.message}</Text>
                {error.attemptedEmail && (
                  <Text style={styles.errorAttempt}>Attempted email: {error.attemptedEmail}</Text>
                )}
              </View>
              <TouchableOpacity onPress={clearError} style={styles.errorDismissBtn}>
                <Text style={styles.errorDismissText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Prominent Continue with Google Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsModalOpen(true)}
            disabled={isLoading}
            style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
          >
            {isLoading ? (
              <View style={styles.buttonInner}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={styles.googleButtonText}>Authenticating with Google...</Text>
              </View>
            ) : (
              <View style={styles.buttonInner}>
                <GoogleLogo size={20} />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Verification Helper / Quick Domain Testing */}
          <View style={styles.testingContainer}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>TEST DOMAIN RESTRICTION</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.testingDescription}>
              Quick test allowed domain (<Text style={{ fontWeight: '700' }}>@{domainPolicy.allowedDomain}</Text>) vs denied domains:
            </Text>

            <View style={styles.quickChipsContainer}>
              {/* Allowed Account */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickTest('employee@hbplus.fit', 'Authorized Employee')}
                style={[styles.quickChip, styles.quickChipAllowed]}
              >
                <Text style={styles.quickChipAllowedText}>✓ employee@hbplus.fit (Allow)</Text>
              </TouchableOpacity>

              {/* Denied Accounts */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickTest('employee@gmail.com', 'External User')}
                style={[styles.quickChip, styles.quickChipDenied]}
              >
                <Text style={styles.quickChipDeniedText}>✗ employee@gmail.com (Deny)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickTest('employee@yahoo.com', 'External User')}
                style={[styles.quickChip, styles.quickChipDenied]}
              >
                <Text style={styles.quickChipDeniedText}>✗ employee@yahoo.com (Deny)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickTest('employee@hbplus.fit.example.com', 'Spoofed User')}
                style={[styles.quickChip, styles.quickChipDenied]}
              >
                <Text style={styles.quickChipDeniedText}>✗ employee@hbplus.fit.example.com (Deny)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickTest('employee@not-hbplus.fit', 'Typosquat User')}
                style={[styles.quickChip, styles.quickChipDenied]}
              >
                <Text style={styles.quickChipDeniedText}>✗ employee@not-hbplus.fit (Deny)</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Email Input Test */}
            <View style={styles.customTestRow}>
              <TextInput
                style={styles.customEmailInput}
                placeholder="or enter custom email to test..."
                placeholderTextColor="#9CA3AF"
                value={customEmailInput}
                onChangeText={setCustomEmailInput}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={styles.customTestButton}
                onPress={handleCustomTest}
                disabled={isLoading || !customEmailInput.trim()}
              >
                <Text style={styles.customTestButtonText}>Test</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Small Notice */}
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeText}>
              Only authorized company accounts can access this application.
            </Text>
          </View>
        </View>

        {/* Enterprise System Highlights */}
        <View style={styles.systemInfoCard}>
          <Text style={styles.systemInfoTitle}>AUTHORIZED CORPORATE DIVISIONS (@{domainPolicy.allowedDomain})</Text>
          <View style={styles.divisionGrid}>
            <View style={styles.divisionItem}>
              <Text style={styles.divisionName}>🛡️ Corporate IT & Security</Text>
              <Text style={styles.divisionDesc}>Identity & Access Architecture</Text>
            </View>
            <View style={styles.divisionItem}>
              <Text style={styles.divisionName}>🔬 Health & Research</Text>
              <Text style={styles.divisionDesc}>Biometric Analysis & Performance</Text>
            </View>
            <View style={styles.divisionItem}>
              <Text style={styles.divisionName}>⚙️ Product Operations</Text>
              <Text style={styles.divisionDesc}>Fitness Tech & Hardware</Text>
            </View>
            <View style={styles.divisionItem}>
              <Text style={styles.divisionName}>👔 Executive Leadership</Text>
              <Text style={styles.divisionDesc}>Compliance & Governance</Text>
            </View>
          </View>
        </View>

        {/* Corporate Sub-footer */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            HB+ Enterprise System · Allowed Domain: @{domainPolicy.allowedDomain} · Supabase Storage: {SUPABASE_PROJECT_ID}
          </Text>
        </View>
      </View>

      {/* Google OAuth Account Picker Dialog */}
      <GoogleOAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAccount={handleSelectAccount}
      />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 36,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  headerTextBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  errorIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  errorIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  errorMessage: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  errorAttempt: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  errorDismissBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  errorDismissText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonDisabled: {
    opacity: 0.65,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  testingContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  testingDescription: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 10,
    lineHeight: 16,
  },
  quickChipsContainer: {
    gap: 6,
  },
  quickChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  quickChipAllowed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  quickChipAllowedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  quickChipDenied: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  quickChipDeniedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  noticeContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  noticeText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerNote: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: '100%',
  },
  topHeaderInner: {
    maxWidth: 1040,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadgeSmall: {
    width: 32,
    height: 32,
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
  headerRightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 5,
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
  supabaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  supabaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  supabaseBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  mainWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  customTestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  customEmailInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 12,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  customTestButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTestButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  systemInfoCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 16,
  },
  systemInfoTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginBottom: 10,
    textAlign: 'center',
  },
  divisionGrid: {
    gap: 8,
  },
  divisionItem: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 6,
    padding: 8,
  },
  divisionName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  divisionDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
});
