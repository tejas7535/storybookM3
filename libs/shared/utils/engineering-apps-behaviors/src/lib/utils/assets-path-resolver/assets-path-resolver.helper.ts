import { EMAPlatform } from '../delivery';

/**
 * @deprecated replaced by EaMobileService
 */
export const getAssetsPath = (
  defaultPath: string,
  nativePlatform?: EMAPlatform
) => {
  if (nativePlatform === EMAPlatform.IOS) {
    return 'capacitor://localhost/assets';
  } else if (nativePlatform === EMAPlatform.ANDROID) {
    return 'https://localhost/assets';
  }

  return defaultPath;
};
