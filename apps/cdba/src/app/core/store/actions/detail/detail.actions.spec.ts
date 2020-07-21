import {
  getBom,
  getBomFailure,
  getBomSuccess,
  getCalculations,
  getCalculationsFailure,
  getCalculationsSuccess,
  getDrawings,
  getDrawingsFailure,
  getDrawingsSuccess,
  getReferenceTypeDetails,
  getReferenceTypeItem,
  getReferenceTypeItemFailure,
  getReferenceTypeItemSuccess,
  getRfqs,
  getRfqsFailure,
  getRfqsSuccess,
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
    test('getReferenceTypeDetails', () => {
      const action = getReferenceTypeDetails();

      expect(action).toEqual({
        type: '[Detail] Load Reference Type Data',
      });
    });
  });

  describe('Get Item Actions', () => {
    test('getItem', () => {
      const action = getReferenceTypeItem({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load Reference Type Item',
      });
    });

    test('getItemSuccess', () => {
      const item: any = {};
      const action = getReferenceTypeItemSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Detail] Load Reference Type Item Success',
      });
    });

    test('getItemFailure', () => {
      const action = getReferenceTypeItemFailure();

      expect(action).toEqual({
        type: '[Detail] Load Reference Type Item Failure',
      });
    });
  });

  describe('Get BOM Actions', () => {
    test('getBom', () => {
      const action = getBom({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load BOM',
      });
    });

    test('getBomSuccess', () => {
      const items: any[] = [];
      const action = getBomSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load BOM Success',
      });
    });

    test('getBomFailure', () => {
      const action = getBomFailure();

      expect(action).toEqual({
        type: '[Detail] Load BOM Failure',
      });
    });
  });

  describe('Get Calculations Actions', () => {
    test('getCalculations', () => {
      const action = getCalculations({ materialNumber });

      expect(action).toEqual({
        materialNumber,
        type: '[Detail] Load Calculations',
      });
    });

    test('getCalculationsSuccess', () => {
      const item = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);
      const action = getCalculationsSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Detail] Load Calculations Success',
      });
    });

    test('getCalculationsFailure', () => {
      const action = getCalculationsFailure();

      expect(action).toEqual({
        type: '[Detail] Load Calculations Failure',
      });
    });
  });

  describe('Get Drawings Actions', () => {
    test('getDrawings', () => {
      const action = getDrawings({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load Drawings',
      });
    });

    test('getDrawingsSuccess', () => {
      const items: any[] = [];
      const action = getDrawingsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Drawings Success',
      });
    });

    test('getDrawingsFailure', () => {
      const action = getDrawingsFailure();

      expect(action).toEqual({
        type: '[Detail] Load Drawings Failure',
      });
    });
  });

  describe('Get RFQs Actions', () => {
    test('getRfqs', () => {
      const action = getRfqs({ referenceTypeId });

      expect(action).toEqual({
        referenceTypeId,
        type: '[Detail] Load RFQs',
      });
    });

    test('getRfqsSuccess', () => {
      const items: any[] = [];
      const action = getRfqsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load RFQs Success',
      });
    });

    test('getRfqsFailure', () => {
      const action = getRfqsFailure();

      expect(action).toEqual({
        type: '[Detail] Load RFQs Failure',
      });
    });
  });
});
