import { Locale } from '@schaeffler/transloco/components';

export const AVAILABLE_LOCALES: Locale[] = [
  {
    id: 'de-DE',
    label: 'DD.MM.YYYY 2,5',
  },
  {
    id: 'en-US',
    label: 'MM/DD/YYYY 2.5',
  },
];

export const DEFAULT_LOCALE: Locale = AVAILABLE_LOCALES[0];
