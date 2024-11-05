import { getBrowserCultureLang } from '@jsverse/transloco';

import { Locale } from '@schaeffler/transloco/components';

export const LOCALE_DE = {
  id: 'de-DE',
  label: 'Deutsch (Deutschland)',
};
export const LOCALE_CH = {
  id: 'de-CH',
  label: 'Deutsch (Schweiz)',
};

export const LOCALE_EN = {
  id: 'en-US',
  label: 'English (United States)',
};
export const LOCALE_EN_AU = {
  id: 'en-AU',
  label: 'English (Australia)',
};
export const LOCALE_EN_BE = {
  id: 'en-BE',
  label: 'English (Belgium)',
};
export const LOCALE_EN_GB = {
  id: 'en-GB',
  label: 'English (United Kingdom)',
};
export const LOCALE_EN_JP = {
  id: 'en-JP',
  label: 'English (Japan)',
};
export const LOCALE_EN_ZA = {
  id: 'en-ZA',
  label: 'English (South Africa)',
};

export const LOCALE_ES = {
  id: 'es-ES',
  label: 'Spanish (Spain)',
};
export const LOCALE_MX = {
  id: 'es-MX',
  label: 'Spanish (Mexico)',
};
export const LOCALE_FR = {
  id: 'fr-FR',
  label: 'French (France)',
};
export const LOCALE_CA = {
  id: 'fr-CA',
  label: 'French (Canada)',
};
export const LOCALE_FR_CH = {
  id: 'fr-CH',
  label: 'French (Switzerland)',
};
export const LOCALE_FR_BE = {
  id: 'fr-BE',
  label: 'French (Belgium)',
};
export const LOCALE_IT = {
  id: 'it-IT',
  label: 'Italian (Italian)',
};
export const LOCALE_IT_CH = {
  id: 'it-CH',
  label: 'Italian (Switzerland)',
};
export const LOCALE_PT_PT = {
  id: 'pt-PT',
  label: 'Portuguese (Portugal)',
};
export const LOCALE_PT_BR = {
  id: 'pt-BR',
  label: 'Portuguese (Brazilian)',
};
export const LOCALE_ZH = {
  id: 'zh-CN',
  label: 'Chinese',
};

export const AVAILABLE_LOCALES: Locale[] = [
  LOCALE_EN,
  LOCALE_EN_AU,
  LOCALE_EN_BE,
  LOCALE_EN_GB,
  LOCALE_EN_JP,
  LOCALE_EN_ZA,
  LOCALE_DE,
  LOCALE_CH,
  LOCALE_ES,
  LOCALE_MX,
  LOCALE_FR,
  LOCALE_CA,
  LOCALE_FR_CH,
  LOCALE_FR_BE,
  LOCALE_IT,
  LOCALE_IT_CH,
  LOCALE_PT_PT,
  LOCALE_PT_BR,
  LOCALE_ZH,
];

export const DEFAULT_LOCALE: Locale = LOCALE_EN;

export const getDefaultLocale = (): Locale =>
  AVAILABLE_LOCALES.find((locale) => locale.id === getBrowserCultureLang()) ||
  DEFAULT_LOCALE;
