import {
  calculateModel,
  createModel,
  fetchCalculationResult,
  setCalculationId,
  setCalculationImpossible,
  setCalculationResult,
  setLoading,
  setModelId,
  updateModel,
} from './friction-calculation-result.actions';

describe('Friction Calculation Result Actions', () => {
  describe('Create Model', () => {
    it('createModel', () => {
      const action = createModel({});

      expect(action).toEqual({
        type: '[Friction Calculation Result] Create Model',
        forceRecreate: undefined,
      });
    });
  });

  describe('Set Model Id', () => {
    it('setModelId', () => {
      const action = setModelId({ modelId: '123' });

      expect(action).toEqual({
        type: '[Friction Calculation Result] Set Model Id',
        modelId: '123',
      });
    });
  });

  describe('Set Calculation Id', () => {
    it('setCalculationId', () => {
      const action = setCalculationId({ calculationId: '123' });

      expect(action).toEqual({
        type: '[Friction Calculation Result] Set Calculation Id',
        calculationId: '123',
      });
    });
  });

  describe('Update Model', () => {
    it('updateModel', () => {
      const action = updateModel();

      expect(action).toEqual({
        type: '[Friction Calculation Result] Update Model',
      });
    });
  });

  describe('Calculate Model', () => {
    it('calculateModel', () => {
      const action = calculateModel();

      expect(action).toEqual({
        type: '[Friction Calculation Result] Calculate Model',
      });
    });
  });

  describe('Fetch Calculation Result', () => {
    it('fetchCalculationResult', () => {
      const action = fetchCalculationResult();

      expect(action).toEqual({
        type: '[Friction Calculation Result] Fetch Calculation Result',
      });
    });
  });

  describe('Set Calculation Result', () => {
    it('setCalculationResult', () => {
      const action = setCalculationResult({
        calculationResult: {
          co2_downstream: {
            unit: 'kg',
            value: 123,
          },
        },
      });

      expect(action).toEqual({
        type: '[Friction Calculation Result] Set Calculation Result',
        calculationResult: {
          co2_downstream: {
            unit: 'kg',
            value: 123,
          },
        },
      });
    });
  });

  describe('Set Calculation Impossible', () => {
    it('setCalculationImpossible', () => {
      const action = setCalculationImpossible({
        isCalculationImpossible: true,
      });

      expect(action).toEqual({
        type: '[Friction Calculation Result] Set Calculation Impossible',
        isCalculationImpossible: true,
      });
    });
  });

  describe('Set Loading', () => {
    it('setLoading', () => {
      const action = setLoading({
        isLoading: true,
      });

      expect(action).toEqual({
        type: '[Friction Upstream Calculation Result] Set Loading',
        isLoading: true,
      });
    });
  });
});
