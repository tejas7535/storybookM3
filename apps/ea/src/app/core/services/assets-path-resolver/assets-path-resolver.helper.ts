import { Capacitor } from '@capacitor/core';
import { environment } from '@ea/environments/environment';

export const getAssetsPath = () => {
  if (Capacitor.isNativePlatform()) {
    if (Capacitor.getPlatform() === 'ios') {
      return 'capacitor://localhost/assets';
    } else if (Capacitor.getPlatform() === 'android') {
      return 'https://localhost/assets';
    }
  }

  return environment.assetsPath;
};
