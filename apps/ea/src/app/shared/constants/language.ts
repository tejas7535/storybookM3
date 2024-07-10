import { LangDefinition } from '@jsverse/transloco/lib/types';

export const LANGUAGE_STORAGE_KEY = 'language';

export const LANGUAGE_EN: LangDefinition = {
  id: 'en',
  label: 'English',
};

export const LANGUAGE_DE: LangDefinition = {
  id: 'de',
  label: 'Deutsch',
};

export const LANGUAGE_FR: LangDefinition = {
  id: 'fr',
  label: 'Français',
};

export const LANGUAGE_ES: LangDefinition = {
  id: 'es',
  label: 'Español',
};

export const LANGUAGE_IT: LangDefinition = {
  id: 'it',
  label: 'Italiano',
};

export const LANGUAGE_ZH: LangDefinition = {
  id: 'zh',
  label: '简体中文',
};

export const LANGUAGE_ZH_TW: LangDefinition = {
  id: 'zh_TW',
  label: '繁體中文',
};

export const LANGUAGE_TR: LangDefinition = {
  id: 'tr',
  label: 'Türkçe',
};

export const LANGUAGE_JA: LangDefinition = {
  id: 'ja',
  label: '日本語',
};

export const LANGUAGE_RU: LangDefinition = {
  id: 'ru',
  label: 'Русский',
};

export const LANGUAGE_PL: LangDefinition = {
  id: 'pl',
  label: 'Polski',
};

export const LANGUAGE_PT: LangDefinition = {
  id: 'pt',
  label: 'Português',
};

export const LANGUAGE_KO: LangDefinition = {
  id: 'ko',
  label: '한국인',
};

export const LANGUAGE_VI: LangDefinition = {
  id: 'vi',
  label: 'Tiếng Việt',
};

export const LANGUAGE_CS: LangDefinition = {
  id: 'cs',
  label: 'Čeština',
};

export const LANGUAGE_TH: LangDefinition = {
  id: 'th',
  label: 'ไทย',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  LANGUAGE_EN,
  LANGUAGE_DE,
  LANGUAGE_ES,
  LANGUAGE_FR,
  LANGUAGE_IT,
  LANGUAGE_ZH,
  LANGUAGE_ZH_TW,
  LANGUAGE_TR,
  LANGUAGE_JA,
  LANGUAGE_RU,
  LANGUAGE_PL,
  LANGUAGE_PT,
  LANGUAGE_KO,
  LANGUAGE_VI,
  LANGUAGE_CS,
  LANGUAGE_TH,
];

export const FALLBACK_LANGUAGE: LangDefinition = LANGUAGE_EN;

const GERMAN_LOCALE = {
  id: 'de-DE',
  label: 'Deutsch (Deutschland)',
};

const ENGLISH_LOCALE = {
  id: 'en-US',
  label: 'English (United States)',
};

export const AVAILABLE_LOCALES: LangDefinition[] = [
  GERMAN_LOCALE,
  ENGLISH_LOCALE,
];

export const DEFAULT_LOCALE: LangDefinition = ENGLISH_LOCALE;

export const getLocaleForLanguage = (code: string): LangDefinition =>
  ['en', 'en-US'].includes(code) ? ENGLISH_LOCALE : GERMAN_LOCALE;
