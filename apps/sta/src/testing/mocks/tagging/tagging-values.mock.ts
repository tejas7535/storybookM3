import { TaggingState } from '../../../app/core/store/reducers/tagging/tagging.reducer';

export const TAGGING_STATE_MOCK: TaggingState = {
  textInput: 'The Schaeffler Group is nice and fancy as well',
  fileInput: {
    name: 'testText.txt',
    type: 'text/plain',
    content: [84, 104, 101, 32, 83, 99],
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
      'the schaeffler group',
    ],
    showMoreTags: false,
    loading: false,
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
      'the schaeffler group',
    ],
    showMoreTags: false,
    loading: false,
    success: true,
  },
  selectedTabIndex: 1,
};
