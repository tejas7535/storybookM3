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

export const LANGUAGE_FRENCH: LangDefinition = {
  id: 'fr',
  label: 'Français',
};

export const AVAILABLE_LANGUAGE_JA: LangDefinition = {
  id: 'ja',
  label: '日本語',
};

export const LANGUAGE_KOREAN: LangDefinition = {
  id: 'ko',
  label: '한국인',
};

export const LANGUAGE_VIETNAMESE: LangDefinition = {
  id: 'vi',
  label: 'Tiếng Việt',
};

export const LANGUAGE_INDONESIAN_BAHASA: LangDefinition = {
  id: 'id',
  label: 'Bahasa Indonesia',
};

export const LANGUAGE_THAI: LangDefinition = {
  id: 'th',
  label: 'ไทย',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  AVAILABLE_LANGUAGE_DE,
  AVAILABLE_LANGUAGE_EN,
  AVAILABLE_LANGUAGE_ZH,
  AVAILABLE_LANGUAGE_ES,
  LANGUAGE_FRENCH,
  AVAILABLE_LANGUAGE_JA,
  LANGUAGE_KOREAN,
  LANGUAGE_VIETNAMESE,
  LANGUAGE_INDONESIAN_BAHASA,
  LANGUAGE_THAI,
];

export const FALLBACK_LANGUAGE: LangDefinition = AVAILABLE_LANGUAGE_EN;
