import { BomItem, CostComponentSplit } from '@cdba/shared/models';
import {
  BOM_ITEM_ODATA_MOCK,
  BOM_ODATA_MOCK,
  CALCULATIONS_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  CUSTOMER_DETAILS_MOCK,
  DETAIL_STATE_MISSING_SALES_INFORMATION_MOCK,
  DETAIL_STATE_MOCK,
  DIMENSION_AND_WEIGHT_DETAILS_MOCK,
  PRICE_DETAILS_MOCK,
  PRODUCTION_DETAILS_MOCK,
  QUANTITIES_DETAILS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  SALES_DETAILS_MOCK,
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
  getCalculations,
  getCalculationsLoading,
  getChildrenOfSelectedBomItem,
  getCostComponentSplitError,
  getCostComponentSplitItems,
  getCostComponentSplitLoading,
  getCostComponentSplitSummary,
  getCustomerDetails,
  getDimensionAndWeightDetails,
  getDrawingsError,
  getMaterialDesignation,
  getNodeIdOfSelectedDrawing,
  getPriceDetails,
  getProductionDetails,
  getQuantitiesDetails,
  getReferenceType,
  getReferenceTypeError,
  getReferenceTypeLoading,
  getSalesDetails,
  getSelectedCalculation,
  getSelectedCalculationNodeId,
  getSelectedReferenceTypeIdentifier,
  getSelectedSplitType,
} from './detail.selector';

describe('Detail Selector', () => {
  const fakeState: { detail: DetailState } = { detail: DETAIL_STATE_MOCK };
  const fakeStateMissingSalesInformation: { detail: DetailState } = {
    detail: DETAIL_STATE_MISSING_SALES_INFORMATION_MOCK,
  };

  const initialDetailState: { detail: DetailState } = {
    detail: initialState,
  };

  describe('getReferenceType', () => {
    test('should return referenceType', () => {
      expect(getReferenceType(fakeState)).toEqual(
        fakeState.detail.detail.referenceType
      );
    });

    test('should return undefined', () => {
      expect(getReferenceType(initialDetailState)).toBeUndefined();
    });
  });

  describe('getReferenceTypeLoading', () => {
    test('should return true', () => {
      expect(getReferenceTypeLoading(fakeState)).toBeTruthy();
    });

    test('should return false', () => {
      expect(getReferenceTypeLoading(initialDetailState)).toBeFalsy();
    });
  });

  describe('getReferenceTypeError', () => {
    test('should return error message', () => {
      expect(getReferenceTypeError(fakeState)).toEqual('Error');
    });

    test('should return undefined', () => {
      expect(getReferenceTypeError(initialDetailState)).toBeUndefined();
    });
  });

  describe('getMaterialDesignation', () => {
    test('should return error message', () => {
      expect(getMaterialDesignation(fakeState)).toEqual('F-446509.SLH');
    });

    test('should return undefined', () => {
      expect(getMaterialDesignation(initialDetailState)).toBeUndefined();
    });
  });

  describe('getSalesDetails', () => {
    test('should return sales details', () => {
      expect(getSalesDetails(fakeState)).toEqual(SALES_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getSalesDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getPriceDetails', () => {
    test('should return price details', () => {
      expect(getPriceDetails(fakeState)).toEqual(PRICE_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getPriceDetails(initialDetailState)).toBeUndefined();
    });

    test('should return undefined for average price if user is not allow to see it', () => {
      expect(
        getPriceDetails(fakeStateMissingSalesInformation).averagePrice
      ).toBeUndefined();
    });
  });

  describe('getDimensionAndWeightDetails', () => {
    test('should return dimension and weight details', () => {
      expect(getDimensionAndWeightDetails(fakeState)).toEqual(
        DIMENSION_AND_WEIGHT_DETAILS_MOCK
      );
    });

    test('should return undefined', () => {
      expect(getDimensionAndWeightDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getCustomerDetails', () => {
    test('should return customer details', () => {
      expect(getCustomerDetails(fakeState)).toEqual(CUSTOMER_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getCustomerDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getQuantitiesDetails', () => {
    test('should return quantities details', () => {
      expect(getQuantitiesDetails(fakeState)).toEqual(QUANTITIES_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getQuantitiesDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getProductionDetails', () => {
    test('should return production details', () => {
      expect(getProductionDetails(fakeState)).toEqual(PRODUCTION_DETAILS_MOCK);
    });

    test('should return undefined', () => {
      expect(getProductionDetails(initialDetailState)).toBeUndefined();
    });
  });

  describe('getCalculations', () => {
    test('should return calculations', () => {
      expect(getCalculations(fakeState)).toEqual(CALCULATIONS_MOCK);
    });

    test('should return undefined', () => {
      expect(getCalculations(initialDetailState)).toBeUndefined();
    });
  });

  describe('getCalculationsLoading', () => {
    test('should return production details', () => {
      expect(getCalculationsLoading(fakeState)).toBeTruthy();
    });

    test('should return undefined', () => {
      expect(getCalculationsLoading(initialDetailState)).toBeFalsy();
    });
  });

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

  describe('getChildrenOfSelectedBomItem', () => {
    test('should return the direct children of the selected bom item', () => {
      expect(getChildrenOfSelectedBomItem(initialDetailState)).toBeUndefined();
      expect(getChildrenOfSelectedBomItem(fakeState)).toEqual([
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

      expect(getChildrenOfSelectedBomItem(testState)).toEqual([bomItems[1]]);
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

  describe('getSelectedReferenceTypeIdentifier', () => {
    test('should return currently selected refTypeIdentifier', () => {
      expect(getSelectedReferenceTypeIdentifier(fakeState)).toEqual(
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });
  });

  describe('getSelectedCalculationNodeId', () => {
    test('should return undefined if selected is undefined', () => {
      expect(getSelectedCalculationNodeId(initialDetailState)).toBeUndefined();
    });

    test('should return string of the node id', () => {
      expect(getSelectedCalculationNodeId(fakeState)).toEqual(['3']);
    });
  });

  describe('getSelectedCalculation', () => {
    test('should return undefined if selected is undefined', () => {
      expect(getSelectedCalculation(initialDetailState)).toBeUndefined();
    });

    test('should return selected calculation', () => {
      expect(getSelectedCalculation(fakeState)).toEqual(CALCULATIONS_MOCK[2]);
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

  describe('Drawings Selectors', () => {
    describe('getDrawings', () => {});

    describe('getDrawingsLoading', () => {});

    describe('getDrawingsError', () => {
      it('should return errorMessage if present', () => {
        expect(getDrawingsError(fakeState)).toEqual('404');
      });

      it('should return noDrawingsText if loading false and drawing items empty', () => {
        const notFoundState: { detail: DetailState } = {
          ...initialDetailState,
          detail: {
            ...initialDetailState.detail,
            drawings: {
              ...initialDetailState.detail.drawings,
              loading: false,
              items: [],
            },
          },
        };

        expect(getDrawingsError(notFoundState)).toEqual(
          'detail.drawings.noDrawingsText'
        );
      });

      it('should return undefined as fallback', () => {
        expect(getDrawingsError(initialDetailState)).toBeUndefined();
      });
    });

    describe('getNodeIdOfSelectedDrawing', () => {
      test('should return undefined if selected is undefined', () => {
        expect(getNodeIdOfSelectedDrawing(initialDetailState)).toBeUndefined();
      });

      test('should return string of the node id', () => {
        expect(getNodeIdOfSelectedDrawing(fakeState)).toEqual('3');
      });
    });
  });
});
