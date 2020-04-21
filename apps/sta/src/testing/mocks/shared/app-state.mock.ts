import { Language } from '../../../app/shared/result/models/language.enum';

export const APP_STATE_MOCK = {
  router: {
    state: { url: '/tagging', params: {}, queryParams: {} },
    navigationId: 2
  },
  tagging: {
    textInput: 'The Schaeffler Group is nice and fancy as well',
    fileInput: {
      name: 'testText.txt',
      type: 'text/plain',
      content: [84, 104, 101, 32, 83, 99]
    },
    tagsForText: {
      tags: [
        'schaeffler',
        'nice',
        'group',
        'fancy',
        'be',
        'and',
        'as',
        'well',
        'the schaeffler group'
      ],
      showMoreTags: false,
      loading: false
    },
    tagsForFile: {
      tags: [
        'schaeffler',
        'nice',
        'group',
        'fancy',
        'be',
        'and',
        'as',
        'well',
        'the schaeffler group'
      ],
      showMoreTags: false,
      loading: false,
      success: true
    },
    selectedTabIndex: 1
  },
  translation: {
    translationTextInput: {
      text: 'The Schaeffler Group',
      textLang: Language.EN,
      targetLang: Language.DE
    },
    translationFileInput: {
      file: {
        name: 'testText.txt',
        type: ' text/plain',
        content: [84, 104, 101, 32]
      },
      textLang: Language.EN,
      targetLang: Language.DE
    },
    translationForText: {
      translation: 'abc',
      loading: false
    },
    translationForFile: {
      translation: 'xyz',
      loading: false,
      success: true
    },
    selectedTabIndex: 1
  }
};
