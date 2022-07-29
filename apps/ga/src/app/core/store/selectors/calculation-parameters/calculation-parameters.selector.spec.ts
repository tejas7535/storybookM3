import { Movement } from '@ga/shared/models';
import {
  APP_STATE_MOCK,
  MODEL_MOCK_ID,
  PROPERTIES_MOCK,
} from '@ga/testing/mocks';

import {
  axialLoadPossible,
  getCalculationParameters,
  getEnvironmentTemperatures,
  getLoadDirections,
  getLoadsInputType,
  getParameterUpdating,
  getParameterValidity,
  getProperties,
  getSelectedMovementType,
  radialLoadPossible,
} from './calculation-parameters.selector';

describe('Calculation Parameters Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
    bearingSelection: {
      ...APP_STATE_MOCK.bearingSelection,
      selectedBearing: 'mockBearing',
      modelId: MODEL_MOCK_ID,
    },
  };

  describe('getSelectedMovementType', () => {
    it('should return loading latest status', () => {
      expect(getSelectedMovementType(mockState)).toEqual(Movement.rotating);
    });
  });

  describe('getEnvironmentTemperatures', () => {
    it('should return latest temperatures', () => {
      expect(getEnvironmentTemperatures(mockState)).toEqual({
        operatingTemperature: 70,
        environmentTemperature: 20,
      });
    });
  });

  describe('getLoadsInputType', () => {
    it('should return loads input type', () => {
      expect(getLoadsInputType(mockState)).toEqual(false);
    });
  });

  describe('getParameterValidity', () => {
    it('should return validity of parameters', () => {
      expect(getParameterValidity(mockState)).toEqual(false);
    });
  });

  describe('getParameterUpdating', () => {
    it('should return update status of parameters', () => {
      expect(getParameterUpdating(mockState)).toEqual(false);
    });
  });

  describe('getProperties', () => {
    it('should return the properties of the model', () => {
      const parameterMockState = {
        ...mockState,
        calculationParameters: {
          ...mockState.calculationParameters,
          properties: PROPERTIES_MOCK,
        },
      };

      expect(getProperties(parameterMockState)).toEqual(PROPERTIES_MOCK);
    });
  });

  describe('getLoadDirections', () => {
    it('should return only the loadDirection properties', () => {
      const parameterMockState = {
        ...mockState,
        calculationParameters: {
          ...mockState.calculationParameters,
          properties: PROPERTIES_MOCK,
        },
      };

      const expectedResult = {
        IDL_AXIAL_NEGATIVE_INSTALLATION_CODE: true,
        IDL_AXIAL_POSITIVE_INSTALLATION_CODE: true,
        IDL_RADIAL_INSTALLATION_CODE: true,
      };

      expect(getLoadDirections(parameterMockState)).toEqual(expectedResult);
    });
  });

  describe('axialLoadPossible', () => {
    it('should return if axial load is possible', () => {
      const parameterMockState = {
        ...mockState,
        calculationParameters: {
          ...mockState.calculationParameters,
          properties: PROPERTIES_MOCK,
        },
      };

      expect(axialLoadPossible(parameterMockState)).toEqual(true);
    });
  });

  describe('radialLoadPossible', () => {
    it('should return if radial load is possible', () => {
      const parameterMockState = {
        ...mockState,
        calculationParameters: {
          ...mockState.calculationParameters,
          properties: PROPERTIES_MOCK,
        },
      };

      expect(radialLoadPossible(parameterMockState)).toEqual(true);
    });
  });

  describe('getCalculationParameters', () => {
    it('should return an object with all calculation parms', () => {
      const validMockState = {
        ...mockState,
        calculationParameters: {
          ...mockState.calculationParameters,
          loads: {
            ...mockState.calculationParameters.loads,
            radial: 700,
            axial: 500,
            exact: true,
          },
          movements: {
            ...mockState.calculationParameters.movements,
            rotationalSpeed: 9000,
          },
          valid: true,
        },
      };

      expect(getCalculationParameters(validMockState)).toEqual({
        modelId: MODEL_MOCK_ID,
        options: {
          idL_RELATIVE_SPEED_WITHOUT_SIGN: '9000.0',
          idcO_AXIAL_LOAD: '500.0',
          idcO_DESIGNATION: 'mockBearing',
          idcO_LOAD_INPUT_GREASE_APP: 'LB_ENTER_LOAD',
          idcO_RADIAL_LOAD: '700.0',
          idlC_TYPE_OF_MOVEMENT: 'LB_ROTATING',
          idscO_GREASE_SELECTION_ARCANOL: 'LB_NO_CALCULATE_ALL_GREASES',
          idscO_INFLUENCE_OF_AMBIENT: 'LB_AVERAGE_AMBIENT_INFLUENCE',
          idscO_OILTEMP: '70.0',
          idslC_TEMPERATURE: '20.0',
        },
      });
    });
  });
});
