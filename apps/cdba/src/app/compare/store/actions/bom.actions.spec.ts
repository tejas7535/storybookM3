import {
  BOM_IDENTIFIER_MOCK,
  BOM_ODATA_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  ODATA_BOM_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
  BomActions,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCostComponentSplit,
  loadCostComponentSplitFailure,
  loadCostComponentSplitSuccess,
  selectBomItem,
  toggleSplitType,
} from './bom.actions';

describe('BoM Actions', () => {
  let action: BomActions;
  let expectedType: string;

  const index = 1;
  const errorMessage = 'Please Help';
  const statusCode = 418;
  const bomItems = BOM_ODATA_MOCK;
  const bomItem = BOM_ODATA_MOCK[3];

  afterEach(() => {
    action = undefined;
    expectedType = undefined;
  });

  describe('loadBom Actions', () => {
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
  describe('Cost Component Split Actions', () => {
    test('loadCostComponentSplit', () => {
      const bomIdentifier = ODATA_BOM_IDENTIFIER_MOCK;
      action = loadCostComponentSplit({ index, bomIdentifier });

      expect(action).toEqual({
        index,
        bomIdentifier,
        type: '[Compare] Load Cost Component Split',
      });
    });

    test('loadCostComponentSplitSuccess', () => {
      const items = COST_COMPONENT_SPLIT_ITEMS_MOCK;
      action = loadCostComponentSplitSuccess({ index, items });

      expect(action).toEqual({
        index,
        items,
        type: '[Compare] Load Cost Component Split Success',
      });
    });

    test('loadCostComponentSplitFailure', () => {
      action = loadCostComponentSplitFailure({
        index,
        errorMessage,
        statusCode,
      });

      expect(action).toEqual({
        index,
        errorMessage,
        statusCode,
        type: '[Compare] Load Cost Component Split Failure',
      });
    });

    test('toggleSplitType', () => {
      action = toggleSplitType();

      expect(action).toEqual({
        type: '[Compare] Toggle Split Type',
      });
    });
  });
});
