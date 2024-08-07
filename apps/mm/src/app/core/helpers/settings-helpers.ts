import { AppDelivery } from '../../shared/models/app-delivery.model';

/**
 * Returns current app delivery status
 * Defaults to 'standalone'
 */
export const detectAppDelivery = () => {
  let appDelivery: `${AppDelivery}` = AppDelivery.Standalone;

  if (window.self !== window.top) {
    appDelivery = AppDelivery.Embedded;
  }

  return appDelivery;
};
