import { LangDefinition } from '@jsverse/transloco/lib/types';

export const LANGUAGE_STORAGE_KEY = 'language';

// Deustch is not supported yet, once it will be fully supported we will enable language setting.
// export const LANGUAGE_DEUSTCH: LangDefinition = {
//   id: 'de',
//   label: 'Deutsch',
// };

export const LANGUAGE_ENGLISH: LangDefinition = {
  id: 'en',
  label: 'English',
};

export const AVAILABLE_LANGUAGES: LangDefinition[] = [
  // LANGUAGE_DEUSTCH,
  LANGUAGE_ENGLISH,
];

export const FALLBACK_LANGUAGE: LangDefinition = LANGUAGE_ENGLISH;
