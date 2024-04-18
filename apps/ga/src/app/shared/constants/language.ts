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

export const LANGUAGE_POLISH: LangDefinition = {
  id: 'pl',
  label: 'Polski',
};

export const LANGUAGE_CZECH: LangDefinition = {
  id: 'cs',
  label: 'Čeština',
};

export const LANGUAGE_ITALIAN: LangDefinition = {
  id: 'it',
  label: 'Italiano',
};

export const LANGUAGE_PORTUGUESE: LangDefinition = {
  id: 'pt',
  label: 'Português',
};

export const LANGUAGE_RUSSIAN: LangDefinition = {
  id: 'ru',
  label: 'Русский',
};

export const LANGUAGE_TURKISH: LangDefinition = {
  id: 'tr',
  label: 'Türkçe',
};

export const LANGUAGE_CHINESE_TRADITIONAL: LangDefinition = {
  id: 'zh_TW',
  label: '繁體中文',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  LANGUAGE_DEUSTCH,
  LANGUAGE_ENGLISH,
  LANGUAGE_SPANISH,
  LANGUAGE_FRENCH,
  LANGUAGE_JAPANESE,
  LANGUAGE_KOREAN,
  LANGUAGE_VIETNAMESE,
  LANGUAGE_INDONESIAN_BAHASA,
  LANGUAGE_THAI,
  LANGUAGE_POLISH,
  LANGUAGE_CZECH,
  LANGUAGE_ITALIAN,
  LANGUAGE_PORTUGUESE,
  LANGUAGE_RUSSIAN,
  LANGUAGE_TURKISH,
  LANGUAGE_CHINESE,
  LANGUAGE_CHINESE_TRADITIONAL,
];

export const FALLBACK_LANGUAGE: LangDefinition = LANGUAGE_ENGLISH;
