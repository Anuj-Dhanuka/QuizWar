import { Platform } from 'react-native';

const fontMapping = {
  18: {
    Black: 'Inter_18pt-Black',
    BlackItalic: 'Inter_18pt-BlackItalic',
    Bold: 'Inter_18pt-Bold',
    BoldItalic: 'Inter_18pt-BoldItalic',
    ExtraBold: 'Inter_18pt-ExtraBold',
    ExtraBoldItalic: 'Inter_18pt-ExtraBoldItalic',
    ExtraLight: 'Inter_18pt-ExtraLight',
    ExtraLightItalic: 'Inter_18pt-ExtraLightItalic',
    Italic: 'Inter_18pt-Italic',
    Light: 'Inter_18pt-Light',
    LightItalic: 'Inter_18pt-LightItalic',
    Medium: 'Inter_18pt-Medium',
    MediumItalic: 'Inter_18pt-MediumItalic',
    Regular: 'Inter_18pt-Regular',
    SemiBold: 'Inter_18pt-SemiBold',
    SemiBoldItalic: 'Inter_18pt-SemiBoldItalic',
    Thin: 'Inter_18pt-Thin',
    ThinItalic: 'Inter_18pt-ThinItalic',
  },
};

export const getInterFont = (weight) => {
  // Default to 18pt
  const sizeMap = fontMapping[18]; 
  const fontName = sizeMap[weight] || sizeMap.Regular;

  return {
    fontFamily: Platform.select({
      ios: fontName,
      android: fontName,
      windows: `${fontName}.ttf`,
      macos: `${fontName}.ttf`,
    }),
  };
};
