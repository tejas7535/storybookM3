import { MOCK_PROPERTIES } from '@ga/testing/mocks';

import { ParameterState } from '../../reducers/parameter/parameter.reducer';
import {
  getProperties,
  getPropertiesFailure,
  getPropertiesSuccess,
  modelUpdateSuccess,
  patchParameters,
} from './parameters.actions';

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

  describe('Get Properties', () => {
    it('getProperties', () => {
      const action = getProperties();

      expect(action).toEqual({
        type: '[Parameters] Get Properties',
      });
    });
  });

  describe('[Parameters] Get Properties Success', () => {
    it('getPropertiesSuccess', () => {
      const action = getPropertiesSuccess({ properties: MOCK_PROPERTIES });

      expect(action).toEqual({
        type: '[Parameters] Get Properties Success',
        properties: MOCK_PROPERTIES,
      });
    });
  });

  describe('Get Properties Failure', () => {
    it('getPropertiesFailure', () => {
      const action = getPropertiesFailure();

      expect(action).toEqual({
        type: '[Parameters] Get Properties Failure',
      });
    });
  });
});
