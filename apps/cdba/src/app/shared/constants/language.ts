import { Language } from '../models';

export const AVAILABLE_LANGUAGE_DE: Language = {
  id: 'de',
  label: 'Deutsch',
};

export const AVAILABLE_LANGUAGE_EN = {
  id: 'en',
  label: 'English',
};

export const AVAILABLE_LANGUAGES: Language[] = [
  AVAILABLE_LANGUAGE_DE,
  AVAILABLE_LANGUAGE_EN,
];

export const FALLBACK_LANGUAGE: Language = AVAILABLE_LANGUAGE_EN;
