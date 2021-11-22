import { BomItem, ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
} from '@cdba/testing/mocks';

import {
  DetailActions,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectBomItem,
  selectReferenceType,
} from '../detail/detail.actions';

describe('Detail Actions', () => {
  let action: DetailActions;
  let referenceTypeIdentifier: ReferenceTypeIdentifier;
  let error: string;

  beforeEach(() => {
    action = undefined;

    referenceTypeIdentifier = {
      materialNumber: '1234',
      plant: 'Beautiful Plant',
      identificationHash: 'unique identifier',
    };

    error = 'An error occured';
  });

  test('selectReferenceType', () => {
    action = selectReferenceType({ referenceTypeIdentifier });

    expect(action).toEqual({
      referenceTypeIdentifier,
      type: '[Detail] Select Reference Type',
    });
  });

  describe('Get Item Actions', () => {
    test('loadItem', () => {
      action = loadReferenceType();

      expect(action).toEqual({
        type: '[Detail] Load Reference Type',
      });
    });

    test('loadItemSuccess', () => {
      const item: any = {};
      action = loadReferenceTypeSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Detail] Load Reference Type Success',
      });
    });

    test('loadItemFailure', () => {
      action = loadReferenceTypeFailure({ error });

      expect(action).toEqual({
        error,
        type: '[Detail] Load Reference Type Failure',
      });
    });
  });

  describe('Get BOM Actions', () => {
    test('loadBom', () => {
      const bomIdentifier = BOM_IDENTIFIER_MOCK;
      action = loadBom({ bomIdentifier });

      expect(action).toEqual({
        bomIdentifier,
        type: '[Detail] Load BOM',
      });
    });

    test('loadBomSuccess', () => {
      const items: BomItem[] = [];
      action = loadBomSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load BOM Success',
      });
    });

    test('loadBomFailure', () => {
      action = loadBomFailure({ error });

      expect(action).toEqual({
        error,
        type: '[Detail] Load BOM Failure',
      });
    });
  });

  describe('Select Bom Action', () => {
    test('selectBomItem', () => {
      const item: BomItem = BOM_MOCK[0];

      action = selectBomItem({ item });

      expect(action).toEqual({
        item,
        type: '[Detail] Select BOM Item',
      });
    });
  });

  describe('Get Calculations Actions', () => {
    test('loadCalculations', () => {
      action = loadCalculations();

      expect(action).toEqual({
        type: '[Detail] Load Calculations',
      });
    });

    test('loadCalculationsSuccess', () => {
      const items = CALCULATIONS_MOCK;
      action = loadCalculationsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Calculations Success',
      });
    });

    test('loadCalculationsFailure', () => {
      action = loadCalculationsFailure({ error });

      expect(action).toEqual({
        error,
        type: '[Detail] Load Calculations Failure',
      });
    });
  });

  describe('Get Drawings Actions', () => {
    test('loadDrawings', () => {
      action = loadDrawings();

      expect(action).toEqual({
        type: '[Detail] Load Drawings',
      });
    });

    test('loadDrawingsSuccess', () => {
      const items: any[] = [];
      action = loadDrawingsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Drawings Success',
      });
    });

    test('loadDrawingsFailure', () => {
      action = loadDrawingsFailure({ error });

      expect(action).toEqual({
        error,
        type: '[Detail] Load Drawings Failure',
      });
    });
  });
});
