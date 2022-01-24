import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';

import {
  CompareActions,
  loadAllProductDetails,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
  selectBomItem,
  selectCalculation,
  selectCompareItems,
} from './compare.actions';

describe('Compare Actions', () => {
  let action: CompareActions;
  let expectedType: string;

  const compareItems: [
    nodeId: string,
    referenceTypeIdentifier: ReferenceTypeIdentifier
  ][] = [['1', REFERENCE_TYPE_IDENTIFIER_MOCK]];
  const materialNumber = 'Material-12345';
  const plant = '0061';
  const index = 1;
  const errorMessage = 'Please Help';
  const statusCode = 418;
  const referenceTypeIdentifier = REFERENCE_TYPE_IDENTIFIER_MOCK;
  const referenceType = REFERENCE_TYPE_MOCK;
  const calculationItems = CALCULATIONS_MOCK;
  const calculation = CALCULATIONS_MOCK[3];
  const nodeId = '4';
  const bomItems = BOM_MOCK;
  const bomItem = BOM_MOCK[3];

  afterEach(() => {
    action = undefined;
    expectedType = undefined;
  });

  describe('Reference Type Actions', () => {
    test('selectCompareItems', () => {
      action = selectCompareItems({ items: compareItems });
      expectedType = '[Compare] Select Compare Items';

      expect(action).toEqual({
        items: compareItems,
        type: expectedType,
      });
    });
  });

  describe('Product Actions', () => {
    test('loadAllProductDetails', () => {
      action = loadAllProductDetails();
      expectedType = '[Compare] Load All Product Details';

      expect(action).toEqual({
        type: expectedType,
      });
    });

    test('loadProductDetails', () => {
      action = loadProductDetails({ index, referenceTypeIdentifier });
      expectedType = '[Compare] Load Product Details';

      expect(action).toEqual({
        index,
        referenceTypeIdentifier,
        type: expectedType,
      });
    });

    test('loadProductDetailsSuccess', () => {
      action = loadProductDetailsSuccess({ index, item: referenceType });
      expectedType = '[Compare] Load Product Details Success';

      expect(action).toEqual({
        index,
        item: referenceType,
        type: expectedType,
      });
    });

    test('loadProductDetailsFailure', () => {
      action = loadProductDetailsFailure({ index, errorMessage, statusCode });
      expectedType = '[Compare] Load Product Details Failure';

      expect(action).toEqual({
        index,
        errorMessage,
        statusCode,
        type: expectedType,
      });
    });
  });

  describe('Calculation Actions', () => {
    test('loadCalculations', () => {
      action = loadCalculations();
      expectedType = '[Compare] Load Calculations';

      expect(action.type).toEqual(expectedType);
    });

    test('loadCalculationHistory', () => {
      action = loadCalculationHistory({ materialNumber, plant, index });
      expectedType = '[Compare] Load Calculation History';

      expect(action).toEqual({
        materialNumber,
        plant,
        index,
        type: expectedType,
      });
    });

    test('loadCalculationHistorySuccess', () => {
      action = loadCalculationHistorySuccess({
        index,
        items: calculationItems,
      });
      expectedType = '[Compare] Load Calculation History Success';

      expect(action).toEqual({
        index,
        items: calculationItems,
        type: expectedType,
      });
    });

    test('loadCalculationHistoryFailure', () => {
      action = loadCalculationHistoryFailure({
        index,
        errorMessage,
        statusCode,
      });
      expectedType = '[Compare] Load Calculation History Failure';

      expect(action).toEqual({
        errorMessage,
        statusCode,
        index,
        type: expectedType,
      });
    });

    test('selectCalculation', () => {
      action = selectCalculation({ nodeId, calculation, index });
      expectedType = '[Compare] Select Calculation';

      expect(action).toEqual({
        nodeId,
        calculation,
        index,
        type: expectedType,
      });
    });
  });

  describe('Bom Actions', () => {
    test('loadBom', () => {
      const bomIdentifier = BOM_IDENTIFIER_MOCK;
      action = loadBom({ index, bomIdentifier });
      expectedType = '[Compare] Load BOM';

      expect(action).toEqual({
        index,
        bomIdentifier,
        type: expectedType,
      });
    });
    test('loadBomSuccess', () => {
      action = loadBomSuccess({ index, items: bomItems });
      expectedType = '[Compare] Load BOM Success';

      expect(action).toEqual({
        index,
        items: bomItems,
        type: expectedType,
      });
    });
    test('loadBomFailure', () => {
      action = loadBomFailure({ index, errorMessage, statusCode });
      expectedType = '[Compare] Load BOM Failure';

      expect(action).toEqual({
        errorMessage,
        statusCode,
        index,
        type: expectedType,
      });
    });
    test('selectBomItem', () => {
      action = selectBomItem({ index, item: bomItem });
      expectedType = '[Compare] Select BOM Item';

      expect(action).toEqual({
        index,
        item: bomItem,
        type: expectedType,
      });
    });
  });
});
