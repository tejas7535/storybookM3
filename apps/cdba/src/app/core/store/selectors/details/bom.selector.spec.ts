import { BomItem, CostComponentSplit } from '@cdba/shared/models';
import {
  BOM_ITEM_ODATA_MOCK,
  BOM_ODATA_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  DETAIL_STATE_MOCK,
} from '@cdba/testing/mocks';

import {
  DetailState,
  initialState,
} from '../../reducers/detail/detail.reducer';
import {
  getBomError,
  getBomIdentifierForSelectedCalculation,
  getBomItems,
  getBomLoading,
  getCostComponentSplitError,
  getCostComponentSplitItems,
  getCostComponentSplitLoading,
  getCostComponentSplitSummary,
  getDirectChildrenOfSelectedBomItem,
  getSelectedSplitType,
} from './bom.selector';

describe('Bom Selectors', () => {
  const fakeState: { detail: DetailState } = { detail: DETAIL_STATE_MOCK };

  const initialDetailState: { detail: DetailState } = {
    detail: initialState,
  };

  describe('getBomItems', () => {
    test('should return bom entries', () => {
      expect(getBomItems(initialDetailState)).toBeUndefined();
      expect(getBomItems(fakeState)).toEqual(BOM_ODATA_MOCK);
    });
  });

  describe('getBomLoading', () => {
    test('should return bom loading status', () => {
      expect(getBomLoading(initialDetailState)).toBeFalsy();
      expect(getBomLoading(fakeState)).toBeTruthy();
    });
  });

  describe('getBomError', () => {
    test('should return the bom error message', () => {
      expect(getBomError(initialDetailState)).toBeUndefined();
      expect(getBomError(fakeState)).toEqual('Error');
    });
  });

  describe('getDirectChildrenOfSelectedBomItem', () => {
    test('should return the direct children of the selected bom item', () => {
      expect(
        getDirectChildrenOfSelectedBomItem(initialDetailState)
      ).toBeUndefined();
      expect(getDirectChildrenOfSelectedBomItem(fakeState)).toEqual([
        BOM_ODATA_MOCK[1],
      ]);
    });

    test('should only select the direct children', () => {
      const bomItems: BomItem[] = [
        { ...BOM_ITEM_ODATA_MOCK },
        {
          ...BOM_ITEM_ODATA_MOCK,
          level: 2,
          rowId: 2,
          materialDesignation: 'FE-2313',
          predecessorsInTree: ['FE-2313', 'FE-2313'],
          costShareOfParent: 1,
        },
        {
          ...BOM_ITEM_ODATA_MOCK,
          level: 3,
          rowId: 3,
          materialDesignation: 'FE-2315',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2315'],
        },
        {
          ...BOM_ITEM_ODATA_MOCK,
          level: 3,
          rowId: 4,
          materialDesignation: 'FE-2314',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2314'],
        },
        {
          ...BOM_ITEM_ODATA_MOCK,
          level: 3,
          rowId: 5,
          materialDesignation: 'FE-2311',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2311'],
        },
      ];
      const testState = {
        ...fakeState,
        detail: {
          ...fakeState.detail,
          bom: { ...fakeState.detail.bom, items: bomItems },
        },
      };

      expect(getDirectChildrenOfSelectedBomItem(testState)).toEqual([
        bomItems[1],
      ]);
    });
  });

  describe('getCostComponentSplitItems', () => {
    test('should return cost component split entries', () => {
      expect(getCostComponentSplitItems(initialDetailState)).toBeUndefined();
      expect(getCostComponentSplitItems(fakeState)).toEqual(
        COST_COMPONENT_SPLIT_ITEMS_MOCK
      );
    });
  });

  describe('getCostComponentSplitLoading', () => {
    test('should return cost component split loading status', () => {
      expect(getCostComponentSplitLoading(initialDetailState)).toBeFalsy();
      expect(getCostComponentSplitLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getCostComponentSplitError', () => {
    test('should return the cost component split error message', () => {
      expect(getCostComponentSplitError(initialDetailState)).toBeUndefined();
      expect(getCostComponentSplitError(fakeState)).toEqual('ERROOOOOR');
    });
  });

  describe('getCostComponentSplitSummary', () => {
    test('should return the cost component split summary item', () => {
      expect(getCostComponentSplitSummary(initialDetailState)).toBeUndefined();

      const expected: CostComponentSplit[] = [
        {
          costComponent: undefined,
          currency: 'USD',
          description: undefined,
          fixedValue: 0.5616,
          splitType: 'TOTAL',
          totalValue: 1.4686,
          variableValue: 0.907,
        },
      ];
      expect(getCostComponentSplitSummary(fakeState)).toEqual(expected);
    });
  });

  describe('getSelectedSplitType', () => {
    test('should return the split type', () => {
      expect(getSelectedSplitType(initialDetailState)).toEqual('MAIN');
    });
  });

  describe('getBomIdentifierForSelectedCalculation', () => {
    test('should return undefined if selected is undefined', () => {
      expect(
        getBomIdentifierForSelectedCalculation(initialDetailState)
      ).toBeUndefined();
    });

    test('should return the BomIdentifier of the selected calculation', () => {
      const expectedIdentifier = {
        bomCostingDate: '20171101',
        bomCostingNumber: '145760472',
        bomCostingType: 'K1',
        bomCostingVersion: '61',
        bomEnteredManually: '',
        bomReferenceObject: '0',
        bomValuationVariant: 'SQB',
      };
      expect(getBomIdentifierForSelectedCalculation(fakeState)).toEqual(
        expectedIdentifier
      );
    });
  });
});
