import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface RNCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat' | 'highlight';
}

export const RNCard: React.FC<RNCardProps> = ({
  children,
  style,
  variant = 'outlined',
}) => {
  const getCardStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    switch (variant) {
      case 'flat':
        list.push(styles.flat);
        break;
      case 'highlight':
        list.push(styles.highlight);
        break;
      case 'elevated':
        list.push(styles.elevated);
        break;
      case 'outlined':
      default:
        list.push(styles.outlined);
        break;
    }

    if (style) list.push(style);
    return list;
  };

  return <View style={getCardStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
  },
  elevated: {
    borderWidth: 1,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  flat: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  highlight: {
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#D4D4D8',
  },
});
