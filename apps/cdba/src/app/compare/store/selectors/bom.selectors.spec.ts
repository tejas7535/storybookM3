import { BomItem } from '@cdba/shared/models';
import {
  BOM_ITEM_ODATA_MOCK,
  BOM_ODATA_MOCK,
  COMPARE_STATE_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
} from '@cdba/testing/mocks';

import { CompareState, initialState } from '../reducers/compare.reducer';
import {
  getBomError,
  getBomItems,
  getBomLoading,
  getChildrenOfSelectedBomItem,
  getCostComponentSplitError,
  getCostComponentSplitItems,
  getCostComponentSplitLoading,
  getCostComponentSplitSummary,
  getSelectedSplitType,
} from './bom.selectors';

describe('BoM Selectors', () => {
  const fakeState: { compare: CompareState } = { compare: COMPARE_STATE_MOCK };

  const initialCompareState: { compare: CompareState } = {
    compare: initialState,
  };

  let expected: any;
  let result: any;

  afterEach(() => {
    expected = undefined;
    result = undefined;
  });

  describe('getBomItems', () => {
    it('should return undefined for non existing index', () => {
      result = getBomItems(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getBomItems(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return bom items for provided index', () => {
      expected = BOM_ODATA_MOCK;
      result = getBomItems(fakeState, 0);

      expect(result).toEqual(expected);
    });
  });

  describe('getBomLoading', () => {
    it('should return undefined for non existing index', () => {
      result = getBomLoading(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getBomLoading(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return boolean for provided index', () => {
      result = getBomLoading(fakeState, 1);

      expect(result).toBeTruthy();
    });
  });

  describe('getBomError', () => {
    it('should return undefined for non existing index', () => {
      result = getBomError(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getBomError(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return error message for provided index', () => {
      expected = 'Service unavailable';
      result = getBomError(fakeState, 2);

      expect(result).toEqual(expected);
    });
  });

  describe('getChildrenOfSelectedBomItem', () => {
    it('should return undefined for non existing index', () => {
      result = getChildrenOfSelectedBomItem(99).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getChildrenOfSelectedBomItem(3).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });

    it('should return children of selected bom item', () => {
      expected = [];

      result = getChildrenOfSelectedBomItem(0).projector(fakeState.compare);

      expect(result).toEqual(expected);
    });
    it('should return only direct children of selected bom item', () => {
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
      const testCompareState = {
        ...fakeState.compare,
        '0': {
          ...fakeState.compare['0'],
          billOfMaterial: {
            ...fakeState.compare['0'].billOfMaterial,
            items: bomItems,
            selected: BOM_ITEM_ODATA_MOCK,
          },
        },
      };
      expected = [bomItems[1]];

      result = getChildrenOfSelectedBomItem(0).projector(testCompareState);

      expect(result).toEqual(expected);
    });
  });

  describe('getCostComponentSplitItems', () => {
    test('should return cost component split entries', () => {
      expect(
        getCostComponentSplitItems(0).projector(initialCompareState.compare)
      ).toBeUndefined();
      expect(
        getCostComponentSplitItems(0).projector(fakeState.compare)
      ).toEqual(COST_COMPONENT_SPLIT_ITEMS_MOCK);
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitItems(99).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });
  });

  describe('getCostComponentSplitLoading', () => {
    test('should return cost component split loading status', () => {
      expect(
        getCostComponentSplitLoading(0).projector(initialCompareState.compare)
      ).toBeFalsy();
      expect(
        getCostComponentSplitLoading(0).projector(fakeState.compare)
      ).toBeFalsy();
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitLoading(99).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });
  });

  describe('getCostComponentSplitError', () => {
    test('should return the cost component split error message', () => {
      expect(
        getCostComponentSplitError(0).projector(initialCompareState.compare)
      ).toBeUndefined();
      expect(
        getCostComponentSplitError(0).projector(fakeState.compare)
      ).toEqual('ERROOOOOR');
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitError(99).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });
  });

  describe('getCostComponentSplitSummary', () => {
    test('should return the cost component split summary item', () => {
      expect(
        getCostComponentSplitSummary(0).projector(initialCompareState.compare)
      ).toBeUndefined();

      expected = [
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
      expect(
        getCostComponentSplitSummary(0).projector(fakeState.compare)
      ).toEqual(expected);
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitSummary(99).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });
  });

  describe('getSelectedSplitType', () => {
    test('should return the split type', () => {
      expect(getSelectedSplitType(0).projector(fakeState.compare)).toEqual(
        'MAIN'
      );
    });

    it('should return undefined for non existing index', () => {
      result = getSelectedSplitType(99).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });
  });
});
