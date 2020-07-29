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
  loadReferenceTypeDetails,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  loadRfqs,
  loadRfqsFailure,
  loadRfqsSuccess,
} from '..';
import { CALCULATIONS_TYPE_MOCK } from '../../../../../testing/mocks';
import { CalculationsResultModel } from '../../reducers/detail/models/calculations-result-model';

describe('Detail Actions', () => {
  let referenceTypeId: any;
  let materialNumber: string;

  beforeEach(() => {
    referenceTypeId = {
      materialNumber: '1234',
      plant: 'Beautiful Plant',
    };

    materialNumber = referenceTypeId.materialNumber;
  });

  describe('Get Reference Type Details Actions', () => {
    test('loadReferenceTypeDetails', () => {
      const action = loadReferenceTypeDetails();

      expect(action).toEqual({
        type: '[Detail] Load Reference Type Data',
      });
    });
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
      const action = loadReferenceTypeFailure();

      expect(action).toEqual({
        type: '[Detail] Load Reference Type Failure',
      });
    });
  });

  describe('Get BOM Actions', () => {
    test('loadBom', () => {
      const action = loadBom({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load BOM',
      });
    });

    test('loadBomSuccess', () => {
      const items: any[] = [];
      const action = loadBomSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load BOM Success',
      });
    });

    test('loadBomFailure', () => {
      const action = loadBomFailure();

      expect(action).toEqual({
        type: '[Detail] Load BOM Failure',
      });
    });
  });

  describe('Get Calculations Actions', () => {
    test('loadCalculations', () => {
      const action = loadCalculations({ materialNumber });

      expect(action).toEqual({
        materialNumber,
        type: '[Detail] Load Calculations',
      });
    });

    test('loadCalculationsSuccess', () => {
      const item = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);
      const action = loadCalculationsSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Detail] Load Calculations Success',
      });
    });

    test('loadCalculationsFailure', () => {
      const action = loadCalculationsFailure();

      expect(action).toEqual({
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
      const action = loadDrawingsFailure();

      expect(action).toEqual({
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
      const action = loadRfqsFailure();

      expect(action).toEqual({
        type: '[Detail] Load RFQs Failure',
      });
    });
  });
});
