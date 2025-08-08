import { ComparableItemIdentifier } from '@cdba/shared/models/comparison.model';
import { REFERENCE_TYPE_IDENTIFIER_MOCK } from '@cdba/testing/mocks';

import {
  CompareRootActions,
  loadComparisonFeatureData,
} from './compare-root.actions';

describe('CompareRoot Actions', () => {
  let action: CompareRootActions;
  let expectedType: string;

  const compareItems: ComparableItemIdentifier[] = [
    {
      referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
      selectedCalculationId: '0',
    },
  ];

  describe('CompareRoot Actions', () => {
    test('selectCompareItems', () => {
      action = loadComparisonFeatureData({ items: compareItems });
      expectedType = '[Compare] Load Comparison Feature Data';

      expect(action).toEqual({
        items: compareItems,
        type: expectedType,
      });
    });
  });
});
