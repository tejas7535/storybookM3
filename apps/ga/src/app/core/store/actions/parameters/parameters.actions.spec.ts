import { ParameterState } from '../../reducers/parameter/parameter.reducer';
import { modelUpdateSuccess, patchParameters } from './parameters.actions';

describe('Parameter Actions', () => {
  describe('Patch Parameters', () => {
    it('patchParameters', () => {
      const mockParameters = {} as ParameterState;
      const action = patchParameters({ parameters: mockParameters });

      expect(action).toEqual({
        parameters: mockParameters,
        type: '[Parameters] Patch Parameters',
      });
    });
  });

  describe('Model Update Success', () => {
    it('modelUpdateSuccess', () => {
      const action = modelUpdateSuccess();

      expect(action).toEqual({
        type: '[Parameters] Model Update Success',
      });
    });
  });
});
