import React from 'react';
import { Image, View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';

export const BRAND_LOGO_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_edjoyVXOIzBGFLCFUNBeKgdyufmCdt38_M8d9QhoTQ&s=10';

interface BrandLogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  rounded?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  style,
  imageStyle,
  rounded = true,
}) => {
  let dimension = 40;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'sm':
        dimension = 28;
        break;
      case 'md':
        dimension = 40;
        break;
      case 'lg':
        dimension = 56;
        break;
      case 'xl':
        dimension = 72;
        break;
    }
  }

  const borderRadius = rounded ? Math.round(dimension * 0.22) : 0;

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: borderRadius,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: BRAND_LOGO_URL }}
        style={[
          styles.image,
          {
            width: dimension,
            height: dimension,
            borderRadius: borderRadius,
          },
          imageStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    backgroundColor: '#FFFFFF',
  },
});
