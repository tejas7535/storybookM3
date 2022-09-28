import { CalculationParametersState } from '@ga/core/store/models';
import { AUTOMATIC_LUBRICATON_MOCK, PROPERTIES_MOCK } from '@ga/testing/mocks';

import {
  getProperties,
  getPropertiesFailure,
  getPropertiesSuccess,
  modelUpdateSuccess,
  patchParameters,
  setAutomaticLubrication,
} from './calculation-parameters.actions';

describe('Calculation Parameters Actions', () => {
  describe('Patch Parameters', () => {
    it('patchParameters', () => {
      const mockParameters = {} as CalculationParametersState;
      const action = patchParameters({ parameters: mockParameters });

      expect(action).toEqual({
        parameters: mockParameters,
        type: '[Calculation Parameters] Patch Parameters',
      });
    });
  });

  describe('Model Update Success', () => {
    it('modelUpdateSuccess', () => {
      const action = modelUpdateSuccess();

      expect(action).toEqual({
        type: '[Calculation Parameters] Model Update Success',
      });
    });
  });

  describe('Get Properties', () => {
    it('getProperties', () => {
      const action = getProperties();

      expect(action).toEqual({
        type: '[Calculation Parameters] Get Properties',
      });
    });
  });

  describe('[Calculation Parameters] Get Properties Success', () => {
    it('getPropertiesSuccess', () => {
      const action = getPropertiesSuccess({ properties: PROPERTIES_MOCK });

      expect(action).toEqual({
        type: '[Calculation Parameters] Get Properties Success',
        properties: PROPERTIES_MOCK,
      });
    });
  });

  describe('Get Properties Failure', () => {
    it('getPropertiesFailure', () => {
      const action = getPropertiesFailure();

      expect(action).toEqual({
        type: '[Calculation Parameters] Get Properties Failure',
      });
    });
  });

  describe('Set Automatic Lubrication', () => {
    it('setAutomaticLubrication', () => {
      const action = setAutomaticLubrication({
        automaticLubrication: AUTOMATIC_LUBRICATON_MOCK,
      });

      expect(action).toEqual({
        type: '[Calculation Parameters] Set Automatic Lubrication',
        automaticLubrication: AUTOMATIC_LUBRICATON_MOCK,
      });
    });
  });
});
