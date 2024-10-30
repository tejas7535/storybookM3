import { LangDefinition } from '@jsverse/transloco/lib/types';

export const AVAILABLE_LANGUAGE_DE: LangDefinition = {
  id: 'de',
  label: 'Deutsch',
};
export const AVAILABLE_LANGUAGE_EN: LangDefinition = {
  id: 'en',
  label: 'English',
};
export const AVAILABLE_LANGUAGE_ES: LangDefinition = {
  id: 'es',
  label: 'Spanish',
};
export const AVAILABLE_LANGUAGE_FR: LangDefinition = {
  id: 'fr',
  label: 'French',
};
export const AVAILABLE_LANGUAGE_IT: LangDefinition = {
  id: 'it',
  label: 'Italian',
};
export const AVAILABLE_LANGUAGE_PT: LangDefinition = {
  id: 'pt',
  label: 'Portuguese',
};
export const AVAILABLE_LANGUAGE_ZH: LangDefinition = {
  id: 'zh',
  label: 'Chinese',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  AVAILABLE_LANGUAGE_DE,
  AVAILABLE_LANGUAGE_EN,
  AVAILABLE_LANGUAGE_ES,
  AVAILABLE_LANGUAGE_FR,
  AVAILABLE_LANGUAGE_IT,
  AVAILABLE_LANGUAGE_PT,
  AVAILABLE_LANGUAGE_ZH,
];

export const FALLBACK_LANGUAGE: LangDefinition = AVAILABLE_LANGUAGE_EN;

export const LANGUAGE_STORAGE_KEY = 'language';
