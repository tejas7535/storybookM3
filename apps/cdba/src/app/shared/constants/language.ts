import { Language } from '../models';

export const AVAILABLE_LANGUAGES: Language[] = [
  {
    id: 'de',
    label: 'Deutsch',
  },
  {
    id: 'en',
    label: 'English',
  },
];

export const FALLBACK_LANGUAGE: Language = AVAILABLE_LANGUAGES[1];
