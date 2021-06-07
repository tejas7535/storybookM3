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
    longLocale: 'de_DE',
  },
  en: {
    locale: localeEn,
    defaultSeparator: MMSeparator.Point,
    longLocale: 'en_US',
  },
  es: {
    locale: localeEs,
    defaultSeparator: MMSeparator.Comma,
    longLocale: 'es_ES',
  },
  fr: {
    locale: localeFr,
    defaultSeparator: MMSeparator.Comma,
    longLocale: 'fr_FR',
  },
  ru: {
    locale: localeRu,
    defaultSeparator: MMSeparator.Comma,
    longLocale: 'ru_RU',
  },
  zh: {
    locale: localeZh,
    defaultSeparator: MMSeparator.Point,
    longLocale: 'cn_CN',
  },
};
