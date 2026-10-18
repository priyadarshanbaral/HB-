import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface RNBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'admin';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const RNBadge: React.FC<RNBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  style,
}) => {
  const getBadgeStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];
    if (size === 'sm') list.push(styles.sizeSm);
    else list.push(styles.sizeMd);

    switch (variant) {
      case 'admin':
        list.push(styles.bgAdmin);
        break;
      case 'danger':
        list.push(styles.bgDanger);
        break;
      case 'success':
        list.push(styles.bgSuccess);
        break;
      case 'warning':
        list.push(styles.bgWarning);
        break;
      case 'info':
        list.push(styles.bgInfo);
        break;
      case 'neutral':
      default:
        list.push(styles.bgNeutral);
        break;
    }

    if (style) list.push(style);
    return list;
  };

  const getTextColor = () => {
    switch (variant) {
      case 'admin':
        return '#FFFFFF';
      case 'danger':
        return '#991B1B';
      case 'success':
        return '#065F46';
      case 'warning':
        return '#92400E';
      case 'info':
      case 'neutral':
      default:
        return '#18181B';
    }
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={[styles.text, { color: getTextColor() }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sizeSm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  sizeMd: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  text: {
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 10,
  },
  bgAdmin: {
    backgroundColor: '#09090B',
    borderColor: '#09090B',
  },
  bgDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  bgSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  bgWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  bgInfo: {
    backgroundColor: '#F4F4F5',
    borderColor: '#E4E4E7',
  },
  bgNeutral: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E4E4E7',
  },
});
