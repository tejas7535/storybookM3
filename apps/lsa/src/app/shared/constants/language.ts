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

export const AVAILABLE_LANGUAGES: LangDefinition[] = [LANGUAGE_EN, LANGUAGE_DE];

export const FALLBACK_LANGUAGE: LangDefinition = LANGUAGE_EN;
