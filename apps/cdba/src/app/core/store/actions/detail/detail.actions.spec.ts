import { BOM_MOCK, CALCULATIONS_TYPE_MOCK } from '../../../../../testing/mocks';
import { BomItem, ReferenceTypeIdentifier } from '../../reducers/detail/models';
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
  loadRfqs,
  loadRfqsFailure,
  loadRfqsSuccess,
  selectBomItem,
  selectReferenceType,
} from '../detail/detail.actions';

describe('Detail Actions', () => {
  let action: DetailActions;
  let referenceTypeIdentifier: ReferenceTypeIdentifier;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;

    referenceTypeIdentifier = {
      materialNumber: '1234',
      plant: 'Beautiful Plant',
      identificationHash: 'unique identifier',
    };

    errorMessage = 'An error occured';
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
      action = loadReferenceTypeFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load Reference Type Failure',
      });
    });
  });

  describe('Get BOM Actions', () => {
    test('loadBom', () => {
      action = loadBom();

      expect(action).toEqual({
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
      action = loadBomFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
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
      const items = CALCULATIONS_TYPE_MOCK;
      action = loadCalculationsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Calculations Success',
      });
    });

    test('loadCalculationsFailure', () => {
      action = loadCalculationsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load Calculations Failure',
      });
    });
  });

  describe('Get Drawings Actions', () => {
    test('loadDrawings', () => {
      action = loadDrawings({ referenceTypeId: referenceTypeIdentifier });

      expect(action).toEqual({
        referenceTypeId: referenceTypeIdentifier,
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
      action = loadDrawingsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load Drawings Failure',
      });
    });
  });

  describe('Get RFQs Actions', () => {
    test('loadRfqs', () => {
      action = loadRfqs({ referenceTypeId: referenceTypeIdentifier });

      expect(action).toEqual({
        referenceTypeId: referenceTypeIdentifier,
        type: '[Detail] Load RFQs',
      });
    });

    test('loadRfqsSuccess', () => {
      const items: any[] = [];
      action = loadRfqsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load RFQs Success',
      });
    });

    test('loadRfqsFailure', () => {
      action = loadRfqsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load RFQs Failure',
      });
    });
  });
});
