import { MOCK_PROPERTIES, MODEL_MOCK_ID } from '@ga/testing/mocks';

import { LoadTypes, SelectedGreases } from '../../../../shared/models';
import { BearingState } from '../../reducers/bearing/bearing.reducer';
import { Movement } from './../../../../shared/models/parameters/movement.model';
import {
  initialState,
  ParameterState,
} from './../../reducers/parameter/parameter.reducer';
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
} from './parameter.selector';

describe('Parameter Selector', () => {
  let mockState: { parameter: ParameterState; bearing: BearingState };

  beforeEach(() => {
    mockState = {
      bearing: {
        selectedBearing: 'mockBearing',
        modelId: MODEL_MOCK_ID,
      } as BearingState,
      parameter: { ...initialState },
    };
  });

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
        parameter: {
          ...mockState.parameter,
          properties: MOCK_PROPERTIES,
        },
      };

      expect(getProperties(parameterMockState)).toEqual(MOCK_PROPERTIES);
    });
  });

  describe('getLoadDirections', () => {
    it('should return only the loadDirection properties', () => {
      const parameterMockState = {
        ...mockState,
        parameter: {
          ...mockState.parameter,
          properties: MOCK_PROPERTIES,
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
        parameter: {
          ...mockState.parameter,
          properties: MOCK_PROPERTIES,
        },
      };

      expect(axialLoadPossible(parameterMockState)).toEqual(true);
    });
  });

  describe('radialLoadPossible', () => {
    it('should return if radial load is possible', () => {
      const parameterMockState = {
        ...mockState,
        parameter: {
          ...mockState.parameter,
          properties: MOCK_PROPERTIES,
        },
      };

      expect(radialLoadPossible(parameterMockState)).toEqual(true);
    });
  });

  describe('getCalculationParameters', () => {
    it('should return an object with all calculation parms', () => {
      const validMockState = {
        ...mockState,
        parameter: {
          ...mockState.parameter,
          loads: {
            ...mockState.parameter.loads,
            radial: 700,
            axial: 500,
            exact: true,
          },
          movements: {
            ...mockState.parameter.movements,
            rotationalSpeed: 9000,
          },
          valid: true,
        },
      };

      expect(getCalculationParameters(validMockState)).toEqual({
        modelId: MODEL_MOCK_ID,
        options: {
          idcO_DESIGNATION: 'mockBearing',
          idlC_TYPE_OF_MOVEMENT: initialState.movements.type,
          idscO_GREASE_SELECTION_ARCANOL: SelectedGreases.no,
          idcO_LOAD_INPUT_GREASE_APP: LoadTypes.LB_ENTER_LOAD,
          idL_RELATIVE_SPEED_WITHOUT_SIGN: `${validMockState.parameter.movements.rotationalSpeed.toFixed(
            1
          )}`,
          idcO_RADIAL_LOAD: `${validMockState.parameter.loads.radial.toFixed(
            1
          )}`,
          idcO_AXIAL_LOAD: `${validMockState.parameter.loads.axial.toFixed(1)}`,
          idscO_OILTEMP: `${initialState.environment.operatingTemperature.toFixed(
            1
          )}`,
          idslC_TEMPERATURE: `${initialState.environment.environmentTemperature.toFixed(
            1
          )}`,
          idscO_INFLUENCE_OF_AMBIENT:
            initialState.environment.environmentImpact,
        },
      });
    });
  });
});
