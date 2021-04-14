import {
  BOM_MOCK,
  CALCULATIONS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
  CompareActions,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  selectBomItem,
  selectCalculation,
  selectReferenceTypes,
} from './compare.actions';

describe('Compare Actions', () => {
  let action: CompareActions;
  let expectedType: string;

  const referenceTypeIdentifiers = [REFERENCE_TYPE_IDENTIFIER_MOCK];
  const materialNumber = 'Material-12345';
  const index = 1;
  const error = new Error('Please Help');
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
    test('selectReferenceTypes', () => {
      action = selectReferenceTypes({ referenceTypeIdentifiers });
      expectedType = '[Compare] Select Reference Types';

      expect(action).toEqual({
        referenceTypeIdentifiers,
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
      action = loadCalculationHistory({ materialNumber, index });
      expectedType = '[Compare] Load Calculation History';

      expect(action).toEqual({
        materialNumber,
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
      action = loadCalculationHistoryFailure({ error, index });
      expectedType = '[Compare] Load Calculation History Failure';

      expect(action).toEqual({
        error,
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
      action = loadBom({ index });
      expectedType = '[Compare] Load BOM';

      expect(action).toEqual({
        index,
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
      action = loadBomFailure({ error, index });
      expectedType = '[Compare] Load BOM Failure';

      expect(action).toEqual({
        error,
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
