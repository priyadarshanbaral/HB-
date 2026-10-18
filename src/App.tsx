import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading HB+ Portal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.websiteRoot}>
      {isAuthenticated ? <DashboardScreen /> : <LoginScreen />}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  websiteRoot: {
    flex: 1,
    minHeight: '100vh' as any,
    width: '100%',
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    minHeight: '100vh' as any,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
});
