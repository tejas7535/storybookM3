import { TranslationState } from '../../../app/core/store/reducers/translation/translation.reducer';
import { Language } from '../../../app/shared/result/models/language.enum';

export const TRANSLATION_STATE_MOCK: TranslationState = {
  translationTextInput: {
    text: 'The Schaeffler Group',
    textLang: Language.EN,
    targetLang: Language.DE,
  },
  translationFileInput: {
    file: {
      name: 'testText.txt',
      type: ' text/plain',
      content: [84, 104, 101, 32],
    },
    textLang: Language.EN,
    targetLang: Language.DE,
  },
  translationForText: {
    translation: 'abc',
    loading: false,
  },
  translationForFile: {
    translation: 'xyz',
    loading: false,
    success: true,
  },
  selectedTabIndex: 1,
};
