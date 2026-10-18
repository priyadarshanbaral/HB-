import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';

export type DeviceMode = 'web' | 'ios' | 'android';

interface DevicePreviewContainerProps {
  children: React.ReactNode;
}

export const DevicePreviewContainer: React.FC<DevicePreviewContainerProps> = ({
  children,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('web');
  const { domainPolicy, user } = useAuth();

  return (
    <View style={styles.outerContainer}>
      {/* Top Corporate Navigation Bar */}
      <View style={styles.topControlBar}>
        <View style={styles.brandGroup}>
          <BrandLogo size={32} style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.topBarTitle}>HB+</Text>
            <Text style={styles.topBarSubtitle}>Company Portal</Text>
          </View>
        </View>

        {/* Device Switcher (Demonstrating Web & Mobile Dual Runtime) */}
        <View style={styles.deviceSwitcher}>
          <TouchableOpacity
            onPress={() => setDeviceMode('web')}
            style={[styles.devicePill, deviceMode === 'web' && styles.devicePillActive]}
          >
            <Text style={[styles.devicePillText, deviceMode === 'web' && styles.devicePillTextActive]}>
              Web Browser
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDeviceMode('ios')}
            style={[styles.devicePill, deviceMode === 'ios' && styles.devicePillActive]}
          >
            <Text style={[styles.devicePillText, deviceMode === 'ios' && styles.devicePillTextActive]}>
              iOS Mobile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDeviceMode('android')}
            style={[styles.devicePill, deviceMode === 'android' && styles.devicePillActive]}
          >
            <Text style={[styles.devicePillText, deviceMode === 'android' && styles.devicePillTextActive]}>
              Android Mobile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right Status Actions */}
        <View style={styles.rightActions}>
          <View style={styles.domainIndicator}>
            <View style={styles.domainDot} />
            <Text style={styles.domainIndicatorText}>@{domainPolicy.allowedDomain}</Text>
          </View>
        </View>
      </View>

      {/* Main Viewport Content */}
      <View style={styles.stageArea}>
        {deviceMode === 'web' ? (
          <View style={styles.webViewport}>{children}</View>
        ) : (
          <View style={styles.mobileSimulatorContainer}>
            <View
              style={[
                styles.deviceChassis,
                deviceMode === 'ios' ? styles.iosChassis : styles.androidChassis,
              ]}
            >
              {/* Status Bar */}
              <View style={styles.mobileStatusBar}>
                <Text style={styles.statusTime}>9:41</Text>
                {deviceMode === 'ios' && <View style={styles.dynamicIsland} />}
                {deviceMode === 'android' && <View style={styles.cameraPunch} />}
                <Text style={styles.statusIcons}>5G · 100%</Text>
              </View>

              {/* Mobile Screen Body */}
              <View style={styles.mobileScreenScroll}>{children}</View>

              {/* Home Indicator */}
              <View style={styles.mobileHomeBarArea}>
                {deviceMode === 'ios' ? (
                  <View style={styles.homeIndicator} />
                ) : (
                  <View style={styles.androidNavPill} />
                )}
              </View>
            </View>

            <View style={styles.simulatorFooterBadge}>
              <Text style={styles.simulatorFooterText}>
                {deviceMode === 'ios' ? 'Apple iOS Mobile View' : 'Google Android Mobile View'} · React Native Runtime
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    minHeight: '100vh' as any,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  topControlBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    flexWrap: 'wrap',
    gap: 12,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarTitle: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  topBarSubtitle: {
    color: '#6B7280',
    fontSize: 11,
  },
  deviceSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  devicePill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  devicePillActive: {
    backgroundColor: '#111827',
  },
  devicePillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  devicePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  domainDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111827',
    marginRight: 6,
  },
  domainIndicatorText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '600',
  },
  stageArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  webViewport: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    minHeight: 'calc(100vh - 61px)' as any,
  },
  mobileSimulatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: '#F4F4F5',
  },
  deviceChassis: {
    width: 390,
    height: 780,
    backgroundColor: '#FFFFFF',
    borderRadius: 44,
    borderWidth: 8,
    borderColor: '#18181B',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
    flexDirection: 'column',
  },
  iosChassis: {
    borderColor: '#27272A',
  },
  androidChassis: {
    borderRadius: 32,
    borderColor: '#27272A',
  },
  mobileStatusBar: {
    height: 44,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  statusIcons: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  dynamicIsland: {
    width: 80,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#18181B',
  },
  cameraPunch: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#18181B',
  },
  mobileScreenScroll: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  mobileHomeBarArea: {
    height: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  homeIndicator: {
    width: 110,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  androidNavPill: {
    width: 60,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
  },
  simulatorFooterBadge: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  simulatorFooterText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
  },
});
