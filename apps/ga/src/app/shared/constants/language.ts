import { LangDefinition } from '@ngneat/transloco/lib/types';

export const LANGUAGE_STORAGE_KEY = 'language';

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
  label: '中文',
};

export const AVAILABLE_LANGUAGE_ES: LangDefinition = {
  id: 'es',
  label: 'Español',
};

export const AVAILABLE_LANGUAGE_JA: LangDefinition = {
  id: 'ja',
  label: '日本語',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  AVAILABLE_LANGUAGE_DE,
  AVAILABLE_LANGUAGE_EN,
  AVAILABLE_LANGUAGE_ZH,
  AVAILABLE_LANGUAGE_ES,
  AVAILABLE_LANGUAGE_JA,
];

export const FALLBACK_LANGUAGE: LangDefinition = AVAILABLE_LANGUAGE_EN;
