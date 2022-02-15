import {
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
} from '@cdba/testing/mocks';

import { CompareState, initialState } from '../reducers/compare.reducer';
import {
  getAdditionalInformation,
  getBomError,
  getBomIdentifierForSelectedCalculation,
  getBomItems,
  getBomLoading,
  getCalculations,
  getCalculationsError,
  getCalculationsLoading,
  getChildrenOfSelectedBomItem,
  getDimensionAndWeightDetails,
  getMaterialDesignation,
  getObjectsAreEqual,
  getProductError,
  getSelectedCalculation,
  getSelectedCalculationNodeId,
  getSelectedReferenceTypeIdentifiers,
} from './compare.selectors';

describe('Compare Selectors', () => {
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

  describe('getSelectedReferenceTypeIdentifiers', () => {
    it('should return undefined for empty/initial state', () => {
      expected = [];
      result = getSelectedReferenceTypeIdentifiers(initialCompareState);

      expect(result).toEqual(expected);
    });

    it('should return an array of compare indices', () => {
      expected = [
        {
          materialNumber: '0943578620000',
          plant: '0074',
        },
        {
          materialNumber: '0943572680000',
          plant: '0060',
        },
        {
          materialNumber: '0943482680000',
          plant: '0060',
        },
        {
          materialNumber: '0943482680000',
          plant: '0076',
        },
      ];
      result = getSelectedReferenceTypeIdentifiers(fakeState);

      expect(result).toEqual(expected);
    });
  });

  describe('getProductError', () => {
    it('should return undefined for non existing index', () => {
      result = getProductError(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing product for provided index', () => {
      result = getProductError(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return error message for provided index', () => {
      expected = '404 - Not Found';
      result = getProductError(fakeState, 2);

      expect(result).toEqual(expected);
    });
  });

  describe('getDimensionAndWeightDetails', () => {
    it('should return undefined for non existing index', () => {
      result = getDimensionAndWeightDetails(fakeState, 99);

      expect(result).toBeUndefined();
    });

    it('should return dimension data for provided index', () => {
      result = getDimensionAndWeightDetails(fakeState, 0);
      expected = {
        height: 7,
        length: 10,
        unitOfDimension: 'mm',
        volumeCubic: 200,
        volumeUnit: 'mm^3',
        weight: 10,
        weightUnit: 'gramm',
        width: 10,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getAdditionalInformation', () => {
    it('should return undefined for non existing index', () => {
      result = getAdditionalInformation(fakeState, 99);

      expect(result).toBeUndefined();
    });

    it('should return dimension data for provided index', () => {
      result = getAdditionalInformation(fakeState, 0);
      expected = {
        actualQuantities: [250_000, 200_000, 44_444, 2_345_345],
        plannedQuantities: [30_000, 350_000, 400_000, 500_000],
        plant: 'IWS',
        procurementType: 'in-house',
        salesOrganization: '0060',
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getBomIdentifierForSelectedCalculation', () => {
    it('should return undefined if index is not existing', () => {
      const index = 99;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toBeUndefined();
    });

    it('should return undefined if calculation for provided index is not defined', () => {
      const index = 3;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toBeUndefined();
    });

    it('should return undefined if selected calculation of index is not defined', () => {
      const index = 1;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toBeUndefined();
    });

    it('should return bomIdentifier for provided index', () => {
      const index = 0;
      expected = BOM_IDENTIFIER_MOCK;

      result = getBomIdentifierForSelectedCalculation(fakeState, index);

      expect(result).toEqual(expected);
    });
  });

  describe('getCalculations', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculations(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculations(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return calc history for provided index', () => {
      expected = CALCULATIONS_MOCK;
      result = getCalculations(fakeState, 0);

      expect(result).toEqual(expected);
    });
  });

  describe('getCalculationsLoading', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculationsLoading(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculationsLoading(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return boolean for provided index', () => {
      result = getCalculationsLoading(fakeState, 1);

      expect(result).toBeTruthy();
    });
  });

  describe('getCalculationsError', () => {
    it('should return undefined for non existing index', () => {
      result = getCalculationsError(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getCalculationsError(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return error message for provided index', () => {
      expected = 'Service unavailable';
      result = getCalculationsError(fakeState, 2);

      expect(result).toEqual(expected);
    });
  });

  describe('getSelectedCalculationNodeId', () => {
    it('should return undefined for non existing index', () => {
      result = getSelectedCalculationNodeId(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getSelectedCalculationNodeId(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return node id of selected calculation for provided index', () => {
      expected = ['3'];
      result = getSelectedCalculationNodeId(fakeState, 0);

      expect(result).toEqual(expected);
    });
  });

  describe('getSelectedCalculation', () => {
    it('should return undefined for non existing index', () => {
      result = getSelectedCalculation(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing calculation for provided index', () => {
      result = getSelectedCalculation(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return calculation for provided index', () => {
      expected = CALCULATIONS_MOCK[2];
      result = getSelectedCalculation(fakeState, 0);

      expect(result).toEqual(expected);
    });
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
      expected = BOM_MOCK;
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
  });

  describe('getMaterialDesignation', () => {
    it('should return undefined for non existing index', () => {
      result = getMaterialDesignation(fakeState, 99);

      expect(result).toBeUndefined();
    });
    it('should return undefined for non existing bom for provided index', () => {
      result = getMaterialDesignation(fakeState, 3);

      expect(result).toBeUndefined();
    });

    it('should return material designation of first bom item', () => {
      expected = 'F-446509.SLH';

      result = getMaterialDesignation(fakeState, 0);

      expect(result).toEqual(expected);
    });
  });

  describe('getObjectsAreEqual', () => {
    it('should return false when compare items dont exist', () => {
      result = getObjectsAreEqual(initialCompareState);

      expect(result).toBeFalsy();
    });
    it('should return true if compare items have same material number', () => {
      const patchedState = {
        compare: {
          ...COMPARE_STATE_MOCK,
          0: { ...COMPARE_STATE_MOCK[0] },
          1: { ...COMPARE_STATE_MOCK[0] },
        },
      };
      result = getObjectsAreEqual(patchedState);

      expect(result).toBeTruthy();
    });

    it('should return false if compared items are different', () => {
      result = getObjectsAreEqual(fakeState);

      expect(result).toBeFalsy();
    });
  });
});
