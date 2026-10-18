import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { GoogleLogo } from '../components/auth/GoogleLogo';
import { GoogleOAuthModal } from '../components/auth/GoogleOAuthModal';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, isLoading, error, clearError, domainPolicy } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAccount = async (email: string, name?: string) => {
    await loginWithGoogle(email, name);
  };

  const handleQuickTest = async (testEmail: string, testName?: string) => {
    clearError();
    await loginWithGoogle(testEmail, testName);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
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
              <Text style={styles.errorTitle}>Authentication Error</Text>
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
            Test allowed domain (<Text style={{ fontWeight: '700' }}>@{domainPolicy.allowedDomain}</Text>) vs denied domains:
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
        </View>

        {/* Small Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            Only authorized company accounts can access this application.
          </Text>
        </View>
      </View>

      {/* Corporate Sub-footer */}
      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>
          HB+ Enterprise System · Allowed Domain: @{domainPolicy.allowedDomain}
        </Text>
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
});
