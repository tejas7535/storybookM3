// eslint-disable-next-line import/no-extraneous-dependencies
import { Capacitor } from '@capacitor/core';

import { AppDelivery } from '../../shared/models/app-delivery.model';

/**
 * Returns current app delivery status
 * Defaults to 'standalone'
 */
export const detectAppDelivery = () => {
  let appDelivery: `${AppDelivery}` = AppDelivery.Standalone;

  if (Capacitor.isNativePlatform()) {
    appDelivery = AppDelivery.Native;
  } else if (window.self !== window.top) {
    appDelivery = AppDelivery.Embedded;
  }

  return appDelivery;
};
