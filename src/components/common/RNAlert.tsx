import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface RNAlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export const RNAlert: React.FC<RNAlertProps> = ({
  type = 'error',
  title,
  message,
  onDismiss,
  style,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];
    switch (type) {
      case 'success':
        list.push(styles.success);
        break;
      case 'warning':
        list.push(styles.warning);
        break;
      case 'info':
        list.push(styles.info);
        break;
      case 'error':
      default:
        list.push(styles.error);
        break;
    }
    if (style) list.push(style);
    return list;
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return '#065F46';
      case 'warning':
        return '#92400E';
      case 'info':
        return '#111827';
      case 'error':
      default:
        return '#991B1B';
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'success':
        return '#047857';
      case 'warning':
        return '#B45309';
      case 'info':
        return '#374151';
      case 'error':
      default:
        return '#B91C1C';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'error':
      default:
        return '✕';
    }
  };

  return (
    <View style={getContainerStyle()}>
      <View style={styles.iconCircle}>
        <Text style={[styles.iconText, { color: getTitleColor() }]}>{getIcon()}</Text>
      </View>
      <View style={styles.textContainer}>
        {title ? <Text style={[styles.title, { color: getTitleColor() }]}>{title}</Text> : null}
        <Text style={[styles.message, { color: getMessageColor() }]}>{message}</Text>
      </View>
      {onDismiss ? (
        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: getMessageColor() }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  success: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  warning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  info: {
    backgroundColor: '#F4F4F5',
    borderColor: '#E4E4E7',
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  iconText: {
    fontWeight: '700',
    fontSize: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  closeButton: {
    padding: 2,
    marginLeft: 6,
  },
  closeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
