import { AVAILABLE_LANGUAGES } from '@ga/shared/constants/language';

/**
 * Returns true if given language is available
 */
export const isLanguageAvailable = (language: string) =>
  AVAILABLE_LANGUAGES.some(
    (availableLanguage) => availableLanguage.id === language
  );
