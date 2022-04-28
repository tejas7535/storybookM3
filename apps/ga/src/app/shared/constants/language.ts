import { LangDefinition } from '@ngneat/transloco/lib/types';

export const AVAILABLE_LANGUAGE_DE: LangDefinition = {
  id: 'de',
  label: 'Deutsch',
};

export const AVAILABLE_LANGUAGE_EN: LangDefinition = {
  id: 'en',
  label: 'English',
};

export const AVAILABLE_LANGUAGE_ZH: LangDefinition = {
  id: 'zh',
  label: '中国',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  AVAILABLE_LANGUAGE_DE,
  AVAILABLE_LANGUAGE_EN,
  AVAILABLE_LANGUAGE_ZH,
];

export const FALLBACK_LANGUAGE: LangDefinition = AVAILABLE_LANGUAGE_EN;
