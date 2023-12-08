import { LangDefinition } from '@ngneat/transloco/lib/types';

export const LANGUAGE_STORAGE_KEY = 'language';

export const LANGUAGE_DEUSTCH: LangDefinition = {
  id: 'de',
  label: 'Deutsch',
};

export const LANGUAGE_ENGLISH: LangDefinition = {
  id: 'en',
  label: 'English',
};

export const LANGUAGE_CHINESE: LangDefinition = {
  id: 'zh',
  label: '中文',
};

export const LANGUAGE_SPANISH: LangDefinition = {
  id: 'es',
  label: 'Español',
};

export const LANGUAGE_FRENCH: LangDefinition = {
  id: 'fr',
  label: 'Français',
};

export const LANGUAGE_JAPANESE: LangDefinition = {
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
  LANGUAGE_DEUSTCH,
  LANGUAGE_ENGLISH,
  LANGUAGE_CHINESE,
  LANGUAGE_SPANISH,
  LANGUAGE_FRENCH,
  LANGUAGE_JAPANESE,
  LANGUAGE_KOREAN,
  LANGUAGE_VIETNAMESE,
  LANGUAGE_INDONESIAN_BAHASA,
  LANGUAGE_THAI,
];

export const FALLBACK_LANGUAGE: LangDefinition = LANGUAGE_ENGLISH;
