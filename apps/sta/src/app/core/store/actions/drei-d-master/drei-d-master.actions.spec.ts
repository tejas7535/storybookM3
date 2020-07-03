import {
  Classification,
  Language,
  TextInput,
} from '../../../../shared/result/models';
import {
  loadClassificationForText,
  loadClassificationForTextFailure,
  loadClassificationForTextSuccess,
} from './dreid-d-master.actions';

describe('ClassificationActions', () => {
  describe('load Classification for text action', () => {
    test('loadClassificationForText ', () => {
      const textInput: TextInput = {
        text: 'abcd',
        targetLang: Language.DE,
        textLang: Language.EN,
      };

      const action = loadClassificationForText({ textInput });

      expect(action).toEqual({
        textInput,
        type: '[Classification] Load Classification for Text',
      });
    });
  });
  describe('load Classification for text success action', () => {
    test('loadClassificationForTextSuccess ', () => {
      const classification: Classification = {
        categories: [[10, 15, 30]],
        probabilities: [[0.5, 0.2, 0.3]],
      };

      const action = loadClassificationForTextSuccess({ classification });

      expect(action).toEqual({
        classification: {
          categories: classification.categories,
          probabilities: classification.probabilities,
        },
        type: '[Classification] Load Classification for Text Success',
      });
    });
  });
  describe('load Classification for text failure Action', () => {
    test('loadClassificationForTextFailure ', () => {
      const action = loadClassificationForTextFailure();

      expect(action).toEqual({
        type: '[Classification] Load Classification for Text Failure',
      });
    });
  });
});
