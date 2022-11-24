import { InjectionToken } from '@angular/core';

/**
 * injection token for providing default feature toggle config. Default value is
 *
 * `{ '*': true }`
 */
export const FEATURE_TOGGLE_DEFAULT_CONFIG: InjectionToken<any> =
  new InjectionToken<any>('featureToggleDefaultConfig', {
    providedIn: 'root',
    factory: () => ({ '*': true }),
  });
