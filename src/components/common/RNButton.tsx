import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface RNButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'google' | 'danger' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const RNButton: React.FC<RNButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Size
    if (size === 'sm') list.push(styles.sizeSm);
    else if (size === 'lg') list.push(styles.sizeLg);
    else list.push(styles.sizeMd);

    // Variant
    switch (variant) {
      case 'primary':
        list.push(styles.primary);
        break;
      case 'google':
        list.push(styles.google);
        break;
      case 'danger':
        list.push(styles.danger);
        break;
      case 'outline':
        list.push(styles.outline);
        break;
      case 'subtle':
        list.push(styles.subtle);
        break;
      case 'secondary':
      default:
        list.push(styles.secondary);
        break;
    }

    if (disabled || loading) {
      list.push(styles.disabled);
    }

    if (style) {
      list.push(style);
    }

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.baseText];

    if (size === 'sm') list.push(styles.textSm);
    else if (size === 'lg') list.push(styles.textLg);
    else list.push(styles.textMd);

    switch (variant) {
      case 'primary':
      case 'danger':
        list.push(styles.textWhite);
        break;
      case 'google':
      case 'outline':
      case 'secondary':
        list.push(styles.textBlack);
        break;
      case 'subtle':
      default:
        list.push(styles.textMuted);
        break;
    }

    if (textStyle) {
      list.push(textStyle);
    }

    return list;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#000000'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sizeSm: {
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  sizeMd: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sizeLg: {
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: '#000000',
  },
  secondary: {
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  google: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D4D8',
  },
  danger: {
    backgroundColor: '#DC2626',
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D4D8',
  },
  subtle: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  sizeSmText: {
    fontSize: 13,
  },
  sizeLgText: {
    fontSize: 15,
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 15,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textBlack: {
    color: '#09090B',
  },
  textMuted: {
    color: '#71717A',
  },
});
