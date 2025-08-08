import { BomItem, RawMaterialAnalysis } from '@cdba/shared/models';
import { UnitOfMeasure } from '@cdba/shared/models/unit-of-measure.model';
import {
  BOM_ITEM_MOCK,
  BOM_MOCK,
  COMPARE_STATE_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  RAW_MATERIAL_ANALYSIS_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';

import { CompareState, initialState } from '../../reducers/compare.reducer';
import {
  getAllChildrenOfSelectedBomItem,
  getBomError,
  getBomItems,
  getBomLoading,
  getCostComponentSplitError,
  getCostComponentSplitItems,
  getCostComponentSplitLoading,
  getCostComponentSplitSummary,
  getDirectChildrenOfSelectedBomItem,
  getRawMaterialAnalysisForSelectedBomItem,
  getRawMaterialAnalysisSummaryForSelectedBom,
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
      result = getBomItems({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getBomItems({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return bom items for provided index', () => {
      expected = BOM_MOCK;
      result = getBomItems({ index: 0 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getBomLoading', () => {
    it('should return undefined for non existing index', () => {
      result = getBomLoading({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getBomLoading({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return boolean for provided index', () => {
      result = getBomLoading({ index: 1 })(fakeState);

      expect(result).toBeTruthy();
    });
  });

  describe('getBomError', () => {
    it('should return undefined for non existing index', () => {
      result = getBomError({ index: 99 })(fakeState);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getBomError({ index: 3 })(fakeState);

      expect(result).toBeUndefined();
    });

    it('should return error message for provided index', () => {
      expected = '404 - Not Found';
      result = getBomError({ index: 1 })(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getDirectChildrenOfSelectedBomItem', () => {
    it('should return undefined for non existing index', () => {
      result = getDirectChildrenOfSelectedBomItem({ index: 99 }).projector(
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getDirectChildrenOfSelectedBomItem({ index: 3 }).projector(
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });

    it('should return children of selected bom item', () => {
      expected = [];

      result = getDirectChildrenOfSelectedBomItem({ index: 0 }).projector(
        fakeState.compare
      );

      expect(result).toEqual(expected);
    });
    it('should return only direct children of selected bom item', () => {
      const bomItems: BomItem[] = [
        { ...BOM_ITEM_MOCK },
        {
          ...BOM_ITEM_MOCK,
          level: 2,
          rowId: 2,
          materialDesignation: 'FE-2313',
          predecessorsInTree: ['FE-2313', 'FE-2313'],
          costShareOfParent: 1,
        },
        {
          ...BOM_ITEM_MOCK,
          level: 3,
          rowId: 3,
          materialDesignation: 'FE-2315',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2315'],
        },
        {
          ...BOM_ITEM_MOCK,
          level: 3,
          rowId: 4,
          materialDesignation: 'FE-2314',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2314'],
        },
        {
          ...BOM_ITEM_MOCK,
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
            selected: BOM_ITEM_MOCK,
          },
        },
      };
      expected = [bomItems[1]];

      result = getDirectChildrenOfSelectedBomItem({ index: 0 }).projector(
        testCompareState
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getAllChildrenOfSelectedBomItem', () => {
    it('should return undefined for non existing index', () => {
      result = getAllChildrenOfSelectedBomItem({ index: 99 }).projector(
        undefined,
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getAllChildrenOfSelectedBomItem({ index: 3 }).projector(
        undefined,
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined selectedBomItem', () => {
      result = getAllChildrenOfSelectedBomItem({ index: 0 }).projector(
        undefined,
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });

    it('should return all children of selected bom item', () => {
      const bomItems: BomItem[] = [
        BOM_ITEM_MOCK,
        {
          ...BOM_ITEM_MOCK,
          level: 2,
          rowId: 2,
          materialDesignation: 'FE-2313',
          predecessorsInTree: ['FE-2313', 'FE-2313'],
          costShareOfParent: 1,
        },
        {
          ...BOM_ITEM_MOCK,
          level: 3,
          rowId: 3,
          materialDesignation: 'FE-2315',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2315'],
        },
        {
          ...BOM_ITEM_MOCK,
          level: 3,
          rowId: 4,
          materialDesignation: 'FE-2314',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2314'],
        },
        {
          ...BOM_ITEM_MOCK,
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
            selected: BOM_ITEM_MOCK,
          },
        },
      };
      expected = bomItems.slice(1);

      result = getAllChildrenOfSelectedBomItem({ index: 0 }).projector(
        testCompareState[0].billOfMaterial.selected,
        testCompareState
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getRawMaterialAnalysisForSelectedBomItem', () => {
    it('should return undefined for non existing bom items', () => {
      result = getRawMaterialAnalysisForSelectedBomItem({
        index: 99,
      }).projector(REFERENCE_TYPE_MOCK as unknown as BomItem, undefined);

      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined selectedBomItem', () => {
      result = getRawMaterialAnalysisForSelectedBomItem({ index: 0 }).projector(
        undefined,
        []
      );

      expect(result).toBeUndefined();
    });

    it('should return raw material analysis of selected bom item', () => {
      const bomItems: BomItem[] = [
        BOM_ITEM_MOCK,
        {
          ...BOM_ITEM_MOCK,
          level: 2,
          rowId: 2,
          materialDesignation: 'FE-2313',
          predecessorsInTree: ['FE-2313', 'FE-2313'],
          costShareOfParent: 1,
        },
        {
          ...BOM_ITEM_MOCK,
          level: 3,
          rowId: 3,
          materialDesignation: 'FE-2315',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2315'],
        },
        {
          ...BOM_ITEM_MOCK,
          level: 3,
          rowId: 4,
          itemCategory: 'M',
          materialCharacteristics: {
            ...BOM_ITEM_MOCK.materialCharacteristics,
            type: 'ROH',
          },
          materialDesignation: 'FE-2314',
          predecessorsInTree: ['FE-2313', 'FE-2313', 'FE-2314'],
        },
        {
          ...BOM_ITEM_MOCK,
          level: 3,
          rowId: 5,
          itemCategory: 'M',
          materialCharacteristics: {
            ...BOM_ITEM_MOCK.materialCharacteristics,
            type: 'ROH',
          },
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
            selected: BOM_ITEM_MOCK,
          },
        },
      };
      expected = [
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2314',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 0,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          totalPrice: 1234.567,
          unitOfMeasure: UnitOfMeasure.UNRECOGNISED,
          unrecognisedUOM: 'mock-baseUnitOfMeasure',
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2311',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 0,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          totalPrice: 1234.567,
          unitOfMeasure: UnitOfMeasure.UNRECOGNISED,
          unrecognisedUOM: 'mock-baseUnitOfMeasure',
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
      ];

      result = getRawMaterialAnalysisForSelectedBomItem({ index: 0 }).projector(
        testCompareState[0].billOfMaterial.selected,
        bomItems
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getRawMaterialAnalysisSummary', () => {
    it('should return undefined for undefined raw material analysis input', () => {
      result = getRawMaterialAnalysisSummaryForSelectedBom({
        index: 0,
      }).projector(undefined);

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty raw material analysis input', () => {
      result = getRawMaterialAnalysisSummaryForSelectedBom({
        index: 0,
      }).projector([]);

      expect(result).toBeUndefined();
    });

    it('should return summary of raw material analysis', () => {
      const input = [RAW_MATERIAL_ANALYSIS_MOCK, RAW_MATERIAL_ANALYSIS_MOCK];

      result = getRawMaterialAnalysisSummaryForSelectedBom({
        index: 0,
      }).projector(input);

      expected = [
        {
          costShare: undefined,
          currency: 'EUR',
          materialDesignation: undefined,
          materialNumber: undefined,
          operatingWeight: undefined,
          price: undefined,
          supplier: undefined,
          totalCosts: 0.001_46,
          unitOfWeight: undefined,
        },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('getCostComponentSplitItems', () => {
    test('should return cost component split entries', () => {
      expect(
        getCostComponentSplitItems({ index: 99 }).projector(
          initialCompareState.compare
        )
      ).toBeUndefined();
      expect(
        getCostComponentSplitItems({ index: 0 }).projector(fakeState.compare)
      ).toEqual(COST_COMPONENT_SPLIT_ITEMS_MOCK);
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitItems({ index: 99 }).projector(
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getCostComponentSplitLoading', () => {
    test('should return cost component split loading status', () => {
      expect(
        getCostComponentSplitLoading({ index: 0 }).projector(
          initialCompareState.compare
        )
      ).toBeFalsy();
      expect(
        getCostComponentSplitLoading({ index: 0 }).projector(fakeState.compare)
      ).toBeFalsy();
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitLoading({ index: 99 }).projector(
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getCostComponentSplitError', () => {
    test('should return the cost component split error message', () => {
      expect(
        getCostComponentSplitError({ index: 0 }).projector(
          initialCompareState.compare
        )
      ).toBeUndefined();
      expect(
        getCostComponentSplitError({ index: 0 }).projector(fakeState.compare)
      ).toEqual('ERROOOOOR');
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitError({ index: 99 }).projector(
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getCostComponentSplitSummary', () => {
    test('should return the cost component split summary item', () => {
      expect(
        getCostComponentSplitSummary({ index: 0 }).projector(
          initialCompareState.compare
        )
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
        getCostComponentSplitSummary({ index: 0 }).projector(fakeState.compare)
      ).toEqual(expected);
    });

    it('should return undefined for non existing index', () => {
      result = getCostComponentSplitSummary({ index: 99 }).projector(
        fakeState.compare
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getSelectedSplitType', () => {
    test('should return the split type', () => {
      expect(
        getSelectedSplitType({ index: 0 }).projector(fakeState.compare)
      ).toEqual('MAIN');
    });

    it('should return undefined for non existing index', () => {
      result = getSelectedSplitType({ index: 99 }).projector(fakeState.compare);

      expect(result).toBeUndefined();
    });
  });
});
