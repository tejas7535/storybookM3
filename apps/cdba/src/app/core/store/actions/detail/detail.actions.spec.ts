import { HttpStatusCode } from '@angular/common/http';

import { BomItem, ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_MOCK,
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
  const errorMessage = 'An error occured';
  const statusCode = HttpStatusCode.BadRequest;

  beforeEach(() => {
    action = undefined;

    referenceTypeIdentifier = {
      materialNumber: '1234',
      plant: 'Beautiful Plant',
    };
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
      const referenceType = REFERENCE_TYPE_MOCK;

      action = loadReferenceTypeSuccess({ referenceType });

      expect(action).toEqual({
        referenceType,
        type: '[Detail] Load Reference Type Success',
      });
    });

    test('loadItemFailure', () => {
      action = loadReferenceTypeFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
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
      action = loadBomFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
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
      const calculations = CALCULATIONS_MOCK;
      const excludedCalculations = EXCLUDED_CALCULATIONS_MOCK;
      action = loadCalculationsSuccess({ calculations, excludedCalculations });

      expect(action).toEqual({
        calculations,
        excludedCalculations,
        type: '[Detail] Load Calculations Success',
      });
    });

    test('loadCalculationsFailure', () => {
      action = loadCalculationsFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
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
      action = loadDrawingsFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
        type: '[Detail] Load Drawings Failure',
      });
    });
  });
});
