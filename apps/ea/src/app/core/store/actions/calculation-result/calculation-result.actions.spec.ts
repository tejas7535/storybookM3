import { CalculationResult } from '../../models';
import {
  calculateModel,
  createModel,
  fetchCalculationResult,
  setCalculationFailure,
  setCalculationId,
  setCalculationImpossible,
  setCalculationResult,
  setModelId,
  updateModel,
} from './calculation-result.actions';

describe('Calculation Result Actions', () => {
  describe('Create Model', () => {
    it('createModel', () => {
      const action = createModel({});

      expect(action).toEqual({
        type: '[Calculation Result] Create Model',
      });
    });
  });

  describe('Set Model Id', () => {
    it('setModelId', () => {
      const action = setModelId({ modelId: 'abc' });

      expect(action).toEqual({
        modelId: 'abc',
        type: '[Calculation Result] Set Model Id',
      });
    });
  });
  describe('Set Calculation Id', () => {
    it('setCalculationId', () => {
      const action = setCalculationId({ calculationId: '123' });

      expect(action).toEqual({
        calculationId: '123',
        type: '[Calculation Result] Set Calculation Id',
      });
    });
  });

  describe('Update Model', () => {
    it('updateModel', () => {
      const action = updateModel();

      expect(action).toEqual({
        type: '[Calculation Result] Update Model',
      });
    });
  });

  describe('Calculate Model', () => {
    it('calculateModel', () => {
      const action = calculateModel();

      expect(action).toEqual({
        type: '[Calculation Result] Calculate Model',
      });
    });
  });

  describe('Fetch calculation result', () => {
    it('fetchCalculationResult', () => {
      const action = fetchCalculationResult();

      expect(action).toEqual({
        type: '[Calculation Result] Fetch Calculation Result',
      });
    });
  });

  describe('Set calculation result', () => {
    it('setCalculationResult', () => {
      const action = setCalculationResult({
        calculationResult: '123' as unknown as CalculationResult,
      });

      expect(action).toEqual({
        calculationResult: '123',
        type: '[Calculation Result] Set Calculation Result',
      });
    });
  });

  describe('Set calculation failure', () => {
    it('setCalculationFailure', () => {
      const action = setCalculationFailure({
        error: 'Thats an error for sure',
      });

      expect(action).toEqual({
        error: 'Thats an error for sure',
        type: '[Calculation Result] Set Calculation Failure',
      });
    });
  });

  describe('Set calculation impossible', () => {
    it('setCalculationImpossible', () => {
      const action = setCalculationImpossible({
        isCalculationImpossible: true,
      });

      expect(action).toEqual({
        isCalculationImpossible: true,
        type: '[Calculation Result] Set Calculation Impossible',
      });
    });
  });
});
