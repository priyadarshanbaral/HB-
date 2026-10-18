declare module 'react-native' {
  import * as React from 'react';

  export interface ViewStyle {
    [key: string]: any;
  }

  export interface TextStyle {
    [key: string]: any;
  }

  export interface ImageStyle {
    [key: string]: any;
  }

  export interface TouchableOpacityProps {
    onPress?: (event: any) => void;
    activeOpacity?: number;
    disabled?: boolean;
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const TouchableOpacity: React.FC<TouchableOpacityProps>;

  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const View: React.FC<ViewProps>;

  export interface TextProps {
    style?: any;
    numberOfLines?: number;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const Text: React.FC<TextProps>;

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    contentContainerStyle?: any;
    [key: string]: any;
  }

  export const ScrollView: React.FC<ScrollViewProps>;

  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    keyboardType?: string;
    autoCapitalize?: string;
    autoFocus?: boolean;
    style?: any;
    [key: string]: any;
  }

  export const TextInput: React.FC<TextInputProps>;

  export interface ImageProps {
    source: { uri: string } | number | any;
    style?: any;
    resizeMode?: string;
    [key: string]: any;
  }

  export const Image: React.FC<ImageProps>;

  export interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
    animating?: boolean;
    style?: any;
    [key: string]: any;
  }

  export const ActivityIndicator: React.FC<ActivityIndicatorProps>;

  export const StyleSheet: {
    create<T extends Record<string, any>>(styles: T): T;
    flatten<T>(style: any): T;
  };

  export const Platform: {
    OS: 'web' | 'ios' | 'android' | 'macos' | 'windows';
    select: <T>(obj: { [key: string]: T }) => T;
  };

  export const Dimensions: {
    get: (dim: 'window' | 'screen') => { width: number; height: number; scale: number; fontScale: number };
  };
}

declare module 'react-native-web' {
  export * from 'react-native';
}
