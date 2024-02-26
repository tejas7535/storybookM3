import { RecommendationFormValue } from '@lsa/shared/models';
import {
  mockApplicationInput,
  mockLubricantInput,
  mockLubricationPointsInput,
} from '@lsa/testing/mocks/input.mock';

import { transformFormValue } from './form-helper';

describe('formHelper', () => {
  it('should transform the form value into a recommendationRequest', () => {
    const mockFormValue: RecommendationFormValue = {
      lubricationPoints: mockLubricationPointsInput,
      lubricant: mockLubricantInput,
      application: mockApplicationInput,
    };
    const result = transformFormValue(mockFormValue);

    expect(result).toMatchSnapshot();
  });
});
