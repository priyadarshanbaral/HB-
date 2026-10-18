import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { GoogleLogo } from './GoogleLogo';
import { RNButton } from '../common/RNButton';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { validateEmailDomain } from '../../utils/domainValidator';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name?: string) => Promise<void>;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const { domainPolicy } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inlinePreviewError, setInlinePreviewError] = useState<string | null>(null);

  if (!isOpen) return null;

  const PRESET_ACCOUNTS = [
    {
      name: 'Corporate Employee',
      email: 'employee@hbplus.fit',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Allowed',
      isAllowed: true,
      hint: 'Authorized Domain (@hbplus.fit)',
    },
    {
      name: 'Alex Morgan',
      email: 'alex.morgan@hbplus.fit',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Allowed',
      isAllowed: true,
      hint: 'Lead Systems Architect (@hbplus.fit)',
    },
    {
      name: 'Google User',
      email: 'employee@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Denied',
      isAllowed: false,
      hint: 'Unauthorized Domain (@gmail.com)',
    },
    {
      name: 'Yahoo User',
      email: 'employee@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Denied',
      isAllowed: false,
      hint: 'Unauthorized Domain (@yahoo.com)',
    },
    {
      name: 'Subdomain Spoof',
      email: 'employee@hbplus.fit.example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Denied',
      isAllowed: false,
      hint: 'Spoofed Domain (@hbplus.fit.example.com)',
    },
    {
      name: 'Typosquat Attempt',
      email: 'employee@not-hbplus.fit',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Denied',
      isAllowed: false,
      hint: 'Mismatched Domain (@not-hbplus.fit)',
    },
  ];

  const handleAccountClick = async (email: string, name?: string) => {
    setIsSubmitting(true);
    try {
      await onSelectAccount(email, name);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async () => {
    if (!customEmail.trim()) return;

    const check = validateEmailDomain(customEmail, domainPolicy.allowedDomain);
    if (!check.isValid) {
      setInlinePreviewError(check.errorMessage || 'Access restricted.');
    } else {
      setInlinePreviewError(null);
    }

    setIsSubmitting(true);
    try {
      await onSelectAccount(customEmail.trim(), customName.trim() || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.googleIconRow}>
            <GoogleLogo size={20} />
            <Text style={styles.googleText}>Google Accounts</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <BrandLogo size={24} style={{ marginRight: 8 }} />
            <Text style={styles.appTitle}>Continue to HBPlus Fit</Text>
          </View>
          <Text style={styles.appDesc}>
            Access is restricted to verified accounts ending in{' '}
            <Text style={styles.highlightDomain}>@{domainPolicy.allowedDomain}</Text>.
          </Text>
        </View>

        {!isCustomMode ? (
          <ScrollView style={styles.accountList} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionHeading}>Choose an account</Text>

            {PRESET_ACCOUNTS.map((acc, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                disabled={isSubmitting}
                onPress={() => handleAccountClick(acc.email, acc.name)}
                style={styles.accountItem}
              >
                <Image source={{ uri: acc.avatar }} style={styles.avatar} />
                <View style={styles.accountMeta}>
                  <View style={styles.nameRow}>
                    <Text style={styles.accountName}>{acc.name}</Text>
                    <View
                      style={[
                        styles.accountBadge,
                        acc.isAllowed ? styles.badgeAllowed : styles.badgeBlocked,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          acc.isAllowed ? styles.badgeTextAllowed : styles.badgeTextBlocked,
                        ]}
                      >
                        {acc.badge}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.accountEmail}>{acc.email}</Text>
                  <Text style={styles.accountHint}>{acc.hint}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setIsCustomMode(true)}
              style={styles.useAnotherAccountBtn}
            >
              <Text style={styles.useAnotherText}>Use another email account</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.customForm}>
            <Text style={styles.sectionHeading}>Sign in with custom email</Text>
            <Text style={styles.customSubtext}>
              Enter any email to evaluate whether the @{domainPolicy.allowedDomain} validation policy allows or rejects it.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. employee@hbplus.fit or person@gmail.com"
                value={customEmail}
                onChangeText={(text: string) => {
                  setCustomEmail(text);
                  setInlinePreviewError(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Jane Doe"
                value={customName}
                onChangeText={setCustomName}
              />
            </View>

            {inlinePreviewError ? (
              <View style={styles.previewErrorBox}>
                <Text style={styles.previewErrorText}>{inlinePreviewError}</Text>
              </View>
            ) : null}

            <View style={styles.customActions}>
              <RNButton
                variant="subtle"
                size="md"
                title="Back"
                onPress={() => setIsCustomMode(false)}
                style={styles.flex1}
              />
              <View style={{ width: 8 }} />
              <RNButton
                variant="primary"
                size="md"
                title="Continue"
                loading={isSubmitting}
                onPress={handleCustomSubmit}
                style={styles.flex1}
              />
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            Mandatory domain: @{domainPolicy.allowedDomain}. Unauthorized accounts cannot proceed.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  googleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '700',
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  appDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  highlightDomain: {
    fontWeight: '700',
    color: '#111827',
  },
  accountList: {
    maxHeight: 320,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6B7280',
    marginBottom: 8,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: '#F3F4F6',
  },
  accountMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  accountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeAllowed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  badgeBlocked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  badgeTextAllowed: {
    color: '#166534',
  },
  badgeTextBlocked: {
    color: '#991B1B',
  },
  accountEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 1,
  },
  accountHint: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  useAnotherAccountBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 4,
    marginBottom: 8,
  },
  useAnotherText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  customForm: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  customSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 16,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  previewErrorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  previewErrorText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '500',
  },
  customActions: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 10,
  },
  flex1: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerNote: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
});
