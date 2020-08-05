import {
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
} from '..';
import { CALCULATIONS_TYPE_MOCK } from '../../../../../testing/mocks';
import { BomIdentifier, BomItem } from '../../reducers/detail/models';

describe('Detail Actions', () => {
  let referenceTypeId: any;
  let materialNumber: string;
  let bomIdentifier: BomIdentifier;
  let errorMessage: string;

  beforeEach(() => {
    referenceTypeId = {
      materialNumber: '1234',
      plant: 'Beautiful Plant',
    };

    materialNumber = referenceTypeId.materialNumber;

    bomIdentifier = new BomIdentifier(
      'date',
      'number',
      'type',
      'version',
      'entered',
      'ref',
      'variant'
    );
    errorMessage = 'An error occured';
  });

  describe('Get Item Actions', () => {
    test('loadItem', () => {
      const action = loadReferenceType({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load Reference Type',
      });
    });

    test('loadItemSuccess', () => {
      const item: any = {};
      const action = loadReferenceTypeSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Detail] Load Reference Type Success',
      });
    });

    test('loadItemFailure', () => {
      const action = loadReferenceTypeFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load Reference Type Failure',
      });
    });
  });

  describe('Get BOM Actions', () => {
    test('loadBom', () => {
      const action = loadBom({ bomIdentifier });

      expect(action).toEqual({
        bomIdentifier,
        type: '[Detail] Load BOM',
      });
    });

    test('loadBomSuccess', () => {
      const items: BomItem[] = [];
      const action = loadBomSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load BOM Success',
      });
    });

    test('loadBomFailure', () => {
      const action = loadBomFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load BOM Failure',
      });
    });
  });

  describe('Get Calculations Actions', () => {
    test('loadCalculations', () => {
      const includeBom = true;
      const action = loadCalculations({ materialNumber, includeBom });

      expect(action).toEqual({
        materialNumber,
        includeBom,
        type: '[Detail] Load Calculations',
      });
    });

    test('loadCalculationsSuccess', () => {
      const items = CALCULATIONS_TYPE_MOCK;
      const action = loadCalculationsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Calculations Success',
      });
    });

    test('loadCalculationsFailure', () => {
      const action = loadCalculationsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load Calculations Failure',
      });
    });
  });

  describe('Get Drawings Actions', () => {
    test('loadDrawings', () => {
      const action = loadDrawings({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load Drawings',
      });
    });

    test('loadDrawingsSuccess', () => {
      const items: any[] = [];
      const action = loadDrawingsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Drawings Success',
      });
    });

    test('loadDrawingsFailure', () => {
      const action = loadDrawingsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load Drawings Failure',
      });
    });
  });

  describe('Get RFQs Actions', () => {
    test('loadRfqs', () => {
      const action = loadRfqs({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load RFQs',
      });
    });

    test('loadRfqsSuccess', () => {
      const items: any[] = [];
      const action = loadRfqsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load RFQs Success',
      });
    });

    test('loadRfqsFailure', () => {
      const action = loadRfqsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Detail] Load RFQs Failure',
      });
    });
  });
});
