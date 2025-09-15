import { InjectionToken } from '@angular/core';

import { EaCapacitor } from './ea-delivery.interface';

export const EA_CAPACITOR = new InjectionToken<EaCapacitor>('Capacitor');
export const DEFAULT_ASSETS_PATH = new InjectionToken<string>(
  'Default path for assets',
  { factory: () => '/assets' }
);
