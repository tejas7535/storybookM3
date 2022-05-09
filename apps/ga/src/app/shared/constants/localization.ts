import { Locale } from '@schaeffler/transloco/components';

export const AVAILABLE_LOCALES: Locale[] = [
  {
    id: 'de-DE',
    label: 'Deutsch (Deutschland)',
  },
  {
    id: 'en-US',
    label: 'English (United States)',
  },
];

export const DEFAULT_LOCALE: Locale = AVAILABLE_LOCALES[0];
