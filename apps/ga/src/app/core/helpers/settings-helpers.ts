import { AppDelivery } from '@ga/shared/models';

/**
 * Returns current app delivery status
 * Defaults to 'standalone'
 */
export const detectAppDelivery = () => {
  let appDelivery: `${AppDelivery}` = AppDelivery.Standalone;

  if (
    window.origin.includes('capacitor://') ||
    window.origin === 'http://localhost'
  ) {
    appDelivery = AppDelivery.Native;
  } else if (window.self !== window.top) {
    appDelivery = AppDelivery.Embedded;
  }

  return appDelivery;
};
