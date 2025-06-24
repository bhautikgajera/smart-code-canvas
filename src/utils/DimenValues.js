import { Platform } from 'react-native';

export const DIMENVALUES = {
  paddingTop:
    Platform.OS === 'android'
      ? 15
      : Platform.Version > 15
      ? 65
      : 50,
  paddingTopFilter:
    Platform.OS === 'android'
      ? 15
      : Platform.Version > 15
      ? 35
      : 30,
  paddingBottom:
    Platform.OS === 'android'
      ? 15
      : Platform.Version > 15
      ? 30
      : 25,
};
