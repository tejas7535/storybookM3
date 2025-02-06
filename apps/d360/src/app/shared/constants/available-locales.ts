import { DateAdapter, MatDateFormats } from '@angular/material/core';

import { getBrowserCultureLang } from '@jsverse/transloco';
import {
  de,
  enAU,
  enGB,
  enUS,
  enZA,
  es,
  fr,
  frCA,
  frCH,
  it,
  itCH,
  Locale as LocaleFns,
  pt,
  ptBR,
  zhCN,
} from 'date-fns/locale';

import { Locale } from '@schaeffler/transloco/components';

import { ValidationHelper } from '../utils/validation/validation-helper';

export const LOCALE_DE = {
  id: 'de-DE',
  label: 'Deutsch (Deutschland)',
};
export const LOCALE_CH = {
  id: 'de-CH',
  label: 'Deutsch (Schweiz)',
};

export const LOCALE_EN = {
  id: 'en-US',
  label: 'English (United States)',
};
export const LOCALE_EN_AU = {
  id: 'en-AU',
  label: 'English (Australia)',
};
export const LOCALE_EN_BE = {
  id: 'en-BE',
  label: 'English (Belgium)',
};
export const LOCALE_EN_GB = {
  id: 'en-GB',
  label: 'English (United Kingdom)',
};
export const LOCALE_EN_JP = {
  id: 'en-JP',
  label: 'English (Japan)',
};
export const LOCALE_EN_ZA = {
  id: 'en-ZA',
  label: 'English (South Africa)',
};

export const LOCALE_ES = {
  id: 'es-ES',
  label: 'Spanish (Spain)',
};
export const LOCALE_MX = {
  id: 'es-MX',
  label: 'Spanish (Mexico)',
};
export const LOCALE_FR = {
  id: 'fr-FR',
  label: 'French (France)',
};
export const LOCALE_CA = {
  id: 'fr-CA',
  label: 'French (Canada)',
};
export const LOCALE_FR_CH = {
  id: 'fr-CH',
  label: 'French (Switzerland)',
};
export const LOCALE_FR_BE = {
  id: 'fr-BE',
  label: 'French (Belgium)',
};
export const LOCALE_IT = {
  id: 'it-IT',
  label: 'Italian (Italian)',
};
export const LOCALE_IT_CH = {
  id: 'it-CH',
  label: 'Italian (Switzerland)',
};
export const LOCALE_PT_PT = {
  id: 'pt-PT',
  label: 'Portuguese (Portugal)',
};
export const LOCALE_PT_BR = {
  id: 'pt-BR',
  label: 'Portuguese (Brazilian)',
};
export const LOCALE_ZH = {
  id: 'zh-CN',
  label: 'Chinese',
};

export const AVAILABLE_LOCALES: Locale[] = [
  LOCALE_EN,
  LOCALE_EN_AU,
  LOCALE_EN_BE,
  LOCALE_EN_GB,
  LOCALE_EN_JP,
  LOCALE_EN_ZA,
  LOCALE_DE,
  LOCALE_CH,
  LOCALE_ES,
  LOCALE_MX,
  LOCALE_FR,
  LOCALE_CA,
  LOCALE_FR_CH,
  LOCALE_FR_BE,
  LOCALE_IT,
  LOCALE_IT_CH,
  LOCALE_PT_PT,
  LOCALE_PT_BR,
  LOCALE_ZH,
];

export type LocaleType =
  | 'de-DE'
  | 'de-CH'
  | 'en-US'
  | 'en-AU'
  | 'en-BE'
  | 'en-GB'
  | 'en-JP'
  | 'en-ZA'
  | 'es-ES'
  | 'es-MX'
  | 'fr-FR'
  | 'fr-CA'
  | 'fr-CH'
  | 'fr-BE'
  | 'it-IT'
  | 'it-CH'
  | 'pt-PT'
  | 'pt-BR'
  | 'zh-CN';

export const DATE_FNS_LOOKUP: Record<LocaleType, LocaleFns> = {
  'de-DE': de,
  'de-CH': de,
  'en-US': enUS,
  'en-AU': enAU,
  'en-BE': enGB,
  'en-GB': enGB,
  'en-JP': enUS,
  'en-ZA': enZA,
  'es-ES': enGB,
  'es-MX': es,
  'fr-FR': fr,
  'fr-CA': frCA,
  'fr-CH': frCH,
  'fr-BE': fr,
  'it-IT': it,
  'it-CH': itCH,
  'pt-PT': pt,
  'pt-BR': ptBR,
  'zh-CN': zhCN,
};

export const DEFAULT_LOCALE: Locale = LOCALE_EN;

export const getDefaultLocale = (): Locale =>
  AVAILABLE_LOCALES.find((locale) => locale.id === getBrowserCultureLang()) ||
  DEFAULT_LOCALE;

export function dateFormatFactory(adapter: DateAdapter<Date>): MatDateFormats {
  const format = getMonthYearDateFormatByCode(adapter['locale'].code);
  const dateInput: string = ValidationHelper.getDateFormat();

  return {
    parse: { dateInput },
    display: { ...format.display, dateInput },
  };
}

export function monthYearDateFormatFactory(
  adapter: DateAdapter<Date>
): MatDateFormats {
  return getMonthYearDateFormatByCode(adapter['locale'].code);
}

export function getMonthYearDateFormatByCode(
  localeCode: LocaleType
): MatDateFormats {
  if (!localeCode.split('-')[1]) {
    // eslint-disable-next-line no-param-reassign
    localeCode = `${localeCode}-${localeCode}` as LocaleType;
  }

  const split = localeCode.split('-');
  // eslint-disable-next-line no-param-reassign
  localeCode = `${split[0]}-${split[1].toLocaleUpperCase()}` as LocaleType;

  switch (localeCode as any) {
    case 'de-DE':
    case 'de-CH':
    case 'fr-FR':
    case 'fr-CA':
    case 'fr-CH':
    case 'fr-BE':
    case 'it-IT':
    case 'it-CH': {
      return {
        parse: { dateInput: 'MM.yyyy' },
        display: {
          dateInput: 'MM.yyyy',
          monthYearLabel: 'MMMM yyyy',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      };
    }

    case 'zh-ZH':
    case 'cn-CN':
    case 'zh-CN': {
      return {
        parse: { dateInput: 'yyyy/MM' },
        display: {
          dateInput: 'yyyy/MM',
          monthYearLabel: 'yyyy年MM月',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'yyyy年MMMM',
        },
      };
    }

    default: {
      return {
        parse: { dateInput: 'MM/yyyy' },
        display: {
          dateInput: 'MM/yyyy',
          monthYearLabel: 'MMMM yyyy',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      };
    }
  }
}
