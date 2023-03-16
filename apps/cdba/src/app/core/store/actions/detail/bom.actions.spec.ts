import { HttpStatusCode } from '@angular/common/http';

import {
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
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
  const errorMessage = 'An error occured';
  const statusCode = HttpStatusCode.BadRequest;

  beforeEach(() => {
    action = undefined;
  });

  describe('loadBom Actions', () => {
    test('loadBom', () => {
      const bomIdentifier = BOM_IDENTIFIER_MOCK;
      action = loadBom({ bomIdentifier });

      expect(action).toEqual({
        bomIdentifier,
        type: '[Detail] Load BOM',
      });
    });

    test('loadBomSuccess', () => {
      const items = BOM_MOCK;
      action = loadBomSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load BOM Success',
      });
    });

    test('loadBomFailure', () => {
      action = loadBomFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
        type: '[Detail] Load BOM Failure',
      });
    });
  });

  describe('loadCostComponentSplit Actions', () => {
    test('loadCostComponentSplit', () => {
      const bomIdentifier = BOM_IDENTIFIER_MOCK;
      action = loadCostComponentSplit({ bomIdentifier });

      expect(action).toEqual({
        bomIdentifier,
        type: '[Detail] Load Cost Component Split',
      });
    });

    test('loadCostComponentSplitSuccess', () => {
      const items = COST_COMPONENT_SPLIT_ITEMS_MOCK;
      action = loadCostComponentSplitSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Cost Component Split Success',
      });
    });

    test('loadCostComponentSplitFailure', () => {
      action = loadCostComponentSplitFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
        type: '[Detail] Load Cost Component Split Failure',
      });
    });

    test('toggleSplitType', () => {
      action = toggleSplitType();

      expect(action).toEqual({
        type: '[Detail] Toggle Split Type',
      });
    });
  });

  describe('Select Bom Action', () => {
    test('selectBomItem', () => {
      const item = BOM_MOCK[0];

      action = selectBomItem({ item });

      expect(action).toEqual({
        item,
        type: '[Detail] Select BOM Item',
      });
    });
  });
});
