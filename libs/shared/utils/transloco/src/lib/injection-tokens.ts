import { InjectionToken } from '@angular/core';

export const DEFAULT_LANGUAGE = new InjectionToken<string>('Default Language');
export const FALLBACK_LANGUAGE = new InjectionToken<string>(
  'Fallback Language'
);

export const I18N_CACHE_CHECKSUM = new InjectionToken<string>(
  'i18n cache checksum'
);

export const LANGUAGE_STORAGE_KEY = 'language';
