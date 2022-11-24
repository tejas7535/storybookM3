import { InjectionToken } from '@angular/core';
/**
 * injection token for the feature toggle config key within local storage.
 * default path is `config`
 */
export const FEATURE_TOGGLE_CONFIG_LOCAL_STORAGE_KEY: InjectionToken<string> =
  new InjectionToken<string>('featureToggleConfigLocalstorageKey', {
    providedIn: 'root',
    factory: () => 'config',
  });
