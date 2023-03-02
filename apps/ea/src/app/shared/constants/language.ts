import { LangDefinition } from '@ngneat/transloco/lib/types';

export const LANGUAGE_STORAGE_KEY = 'language';

export const AVAILABLE_LANGUAGE_EN: LangDefinition = {
  id: 'en',
  label: 'English',
};

export const AVAILABLE_LANGUAGE_DE: LangDefinition = {
  id: 'de',
  label: 'German',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  AVAILABLE_LANGUAGE_EN,
  AVAILABLE_LANGUAGE_DE,
];

export const FALLBACK_LANGUAGE: LangDefinition = AVAILABLE_LANGUAGE_EN;
