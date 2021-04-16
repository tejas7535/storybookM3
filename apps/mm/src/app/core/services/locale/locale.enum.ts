import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeRu from '@angular/common/locales/ru';
import localeZh from '@angular/common/locales/zh';

import { MMSeparator } from './separator.enum';

export enum MMLocales {
  de = 'de',
  en = 'en',
  es = 'es',
  fr = 'fr',
  ru = 'ru',
  zh = 'zh',
}

export const locales = {
  de: {
    locale: localeDe,
    defaultSeparator: MMSeparator.Comma,
  },
  en: {
    locale: localeEn,
    defaultSeparator: MMSeparator.Point,
  },
  es: {
    locale: localeEs,
    defaultSeparator: MMSeparator.Comma,
  },
  fr: {
    locale: localeFr,
    defaultSeparator: MMSeparator.Comma,
  },
  ru: {
    locale: localeRu,
    defaultSeparator: MMSeparator.Comma,
  },
  zh: {
    locale: localeZh,
    defaultSeparator: MMSeparator.Point,
  },
};
