import { AppDelivery, PartnerVersion } from '@ga/shared/models';

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

/**
 * Returns current partner version or undefined
 * Defaults to undefined
 */
export const detectPartnerVersion = () => {
  let partnerVersion: `${PartnerVersion}`;

  for (const partnerVersionPrefix of Object.values(PartnerVersion)) {
    if (window.origin.includes(`${partnerVersionPrefix}.greaseapp`)) {
      return partnerVersionPrefix;
    }
  }

  return partnerVersion;
};
