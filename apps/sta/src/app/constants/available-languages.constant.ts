import { KeyValue, Language } from '../shared/result/models';

export const AVAILABLE_LANGUAGES = [
  {
    userLang: Language.DE,
    languages: [
      new KeyValue(Language.DE, 'Deutsch'),
      new KeyValue(Language.EN, 'Englisch'),
    ],
  },
  {
    userLang: Language.EN,
    languages: [
      new KeyValue(Language.DE, 'German'),
      new KeyValue(Language.EN, 'English'),
    ],
  },
];
