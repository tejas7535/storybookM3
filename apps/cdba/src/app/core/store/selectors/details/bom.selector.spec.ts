import {
  BomItem,
  CostComponentSplit,
  RawMaterialAnalysis,
} from '@cdba/shared/models';
import { UnitOfMeasure } from '@cdba/shared/models/unit-of-measure.model';
import {
  BOM_ITEM_MOCK,
  BOM_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  DETAIL_STATE_MOCK,
  RAW_MATERIAL_ANALYSIS_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';

import {
  DetailState,
  initialState,
} from '../../reducers/detail/detail.reducer';
import {
  getAllChildrenOfSelectedBomItem,
  getBomError,
  getBomIdentifierForSelectedCalculation,
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
} from './bom.selector';

describe('Bom Selectors', () => {
  const fakeState: { detail: DetailState } = { detail: DETAIL_STATE_MOCK };

  const initialDetailState: { detail: DetailState } = {
    detail: initialState,
  };

  const LOCAL_BOM_ITEM_MOCK = BOM_ITEM_MOCK;

  const MOCK_BOM_ITEMS = [
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

  describe('getBomItems', () => {
    test('should return bom entries', () => {
      expect(getBomItems(initialDetailState)).toBeUndefined();
      expect(getBomItems(fakeState)).toEqual(BOM_MOCK);
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
        BOM_MOCK[1],
      ]);
    });

    test('should only select the direct children', () => {
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

  describe('getAllChildrenOfSelectedBomItem', () => {
    it('should return undefined for undefined selectedBomItem', () => {
      const result = getAllChildrenOfSelectedBomItem.projector(
        undefined,
        fakeState.detail
      );

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      const result = getAllChildrenOfSelectedBomItem.projector(
        undefined,
        initialDetailState.detail
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
      const testDetailState = {
        ...fakeState.detail,
        bom: {
          ...fakeState.detail.bom,
          items: bomItems,
          selected: BOM_ITEM_MOCK,
        },
      };
      const expected = bomItems.slice(1);

      const result = getAllChildrenOfSelectedBomItem.projector(
        testDetailState.bom.selected,
        testDetailState
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getRawMaterialAnalysisForSelectedBomItem', () => {
    let bomItems: BomItem[] = [];

    beforeEach(() => {
      bomItems = MOCK_BOM_ITEMS;
    });

    it('should return undefined for non existing bom items', () => {
      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        REFERENCE_TYPE_MOCK as unknown as BomItem,
        undefined
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined selectedBomItem', () => {
      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        undefined,
        []
      );

      expect(result).toBeUndefined();
    });

    it('should return raw material analysis of selected bom item with unspecified unit of measure', () => {
      const expected = [
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2314',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 0,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.UNRECOGNISED,
          unrecognisedUOM: 'mock-baseUnitOfMeasure',
          totalPrice: 1234.567,
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
          unitOfMeasure: UnitOfMeasure.UNRECOGNISED,
          unrecognisedUOM: 'mock-baseUnitOfMeasure',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
      ];

      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        LOCAL_BOM_ITEM_MOCK,
        bomItems
      );

      expect(result).toEqual(expected);
    });
    it('should return raw material analysis of selected bom item with zero as operating unit', () => {
      const preparedBomItems = bomItems.map((item) =>
        item.itemCategory === 'M' && item.materialCharacteristics.type === 'ROH'
          ? {
              ...item,
              quantities: {
                ...item.quantities,
                baseUnitOfMeasure: 'G',
                quantity: 0,
              },
            }
          : item
      );

      const expected = [
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2314',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 0,
          price: 0,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.G,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2311',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 0,
          price: 0,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.G,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
      ];

      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        LOCAL_BOM_ITEM_MOCK,
        preparedBomItems
      );

      expect(result).toEqual(expected);
    });
    it('should return raw material analysis of selected bom item with KG as unit of measure', () => {
      const preparedBomItems = bomItems.map((item) =>
        item.itemCategory === 'M' && item.materialCharacteristics.type === 'ROH'
          ? {
              ...item,
              quantities: {
                ...item.quantities,
                baseUnitOfMeasure: 'KG',
              },
            }
          : item
      );

      const expected = [
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2314',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.KG,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2311',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.KG,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
      ];

      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        BOM_ITEM_MOCK,
        preparedBomItems
      );

      expect(result).toEqual(expected);
    });
    it('should return raw material analysis of selected bom item with G as unit of measure', () => {
      const preparedBomItems = bomItems.map((item) =>
        item.itemCategory === 'M' && item.materialCharacteristics.type === 'ROH'
          ? {
              ...item,
              quantities: {
                ...item.quantities,
                baseUnitOfMeasure: 'G',
              },
            }
          : item
      );

      const expected = [
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2314',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1000,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.G,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2311',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1000,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.G,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
      ];

      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        BOM_ITEM_MOCK,
        preparedBomItems
      );

      expect(result).toEqual(expected);
    });
    it('should return raw material analysis of selected bom item with M as unit of measure', () => {
      const preparedBomItems = bomItems.map((item) =>
        item.itemCategory === 'M' && item.materialCharacteristics.type === 'ROH'
          ? {
              ...item,
              quantities: {
                ...item.quantities,
                baseUnitOfMeasure: 'M',
              },
            }
          : item
      );

      const expected = [
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2314',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1523.455_678,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.M,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2311',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1523.455_678,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.M,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
      ];

      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        BOM_ITEM_MOCK,
        preparedBomItems
      );

      expect(result).toEqual(expected);
    });
    it('should return raw material analysis of selected bom item with MM as unit of measure', () => {
      const preparedBomItems = bomItems.map((item) =>
        item.itemCategory === 'M' && item.materialCharacteristics.type === 'ROH'
          ? {
              ...item,
              quantities: {
                ...item.quantities,
                baseUnitOfMeasure: 'MM',
              },
            }
          : item
      );

      const expected = [
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2314',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1523.455_678,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.MM,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
        {
          costShare: 1,
          currency: 'mock-costAreaCurrency',
          materialDesignation: 'FE-2311',
          materialNumber: 'mock-materialNumber',
          operatingUnit: 1234.567,
          price: 1523.455_678,
          supplier: 'mock-vendorDescription',
          totalCosts: 1234.567,
          unitOfMeasure: UnitOfMeasure.MM,
          unrecognisedUOM: '',
          totalPrice: 1234.567,
          uomBaseToPriceFactor: 1.234,
        } as RawMaterialAnalysis,
      ];

      const result = getRawMaterialAnalysisForSelectedBomItem.projector(
        BOM_ITEM_MOCK,
        preparedBomItems
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getRawMaterialAnalysisSummary', () => {
    it('should return undefined for undefined raw material analysis input', () => {
      const result =
        getRawMaterialAnalysisSummaryForSelectedBom.projector(undefined);

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty raw material analysis input', () => {
      const result = getRawMaterialAnalysisSummaryForSelectedBom.projector([]);

      expect(result).toBeUndefined();
    });

    it('should return summary of raw material analysis', () => {
      const input = [RAW_MATERIAL_ANALYSIS_MOCK, RAW_MATERIAL_ANALYSIS_MOCK];

      const result =
        getRawMaterialAnalysisSummaryForSelectedBom.projector(input);

      const expected: RawMaterialAnalysis[] = [
        {
          costShare: undefined,
          currency: 'EUR',
          materialDesignation: undefined,
          materialNumber: undefined,
          operatingUnit: undefined,
          price: undefined,
          supplier: undefined,
          totalCosts: 0.001_46,
          unitOfMeasure: undefined,
          totalPrice: undefined,
          uomBaseToPriceFactor: undefined,
        },
      ];

      expect(result).toEqual(expected);
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
        costingDate: '20171101',
        costingNumber: '145760472',
        costingType: 'K1',
        version: '61',
        enteredManually: false,
        referenceObject: '0',
        valuationVariant: 'SQB',
      };
      expect(getBomIdentifierForSelectedCalculation(fakeState)).toEqual(
        expectedIdentifier
      );
    });
  });
});
