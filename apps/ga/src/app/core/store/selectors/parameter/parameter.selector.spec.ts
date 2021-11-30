import { MODEL_MOCK_ID } from '../../../../../testing/mocks/rest.service.mock';
import { BearingState } from '../../reducers/bearing/bearing.reducer';
import { Movement } from './../../../../shared/models/parameters/movement.model';
import {
  initialState,
  ParameterState,
} from './../../reducers/parameter/parameter.reducer';
import {
  getCalculationParameters,
  getEnvironmentTemperatures,
  getLoadsInputType,
  getParameterUpdating,
  getParameterValidity,
  getSelectedMovementType,
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
      expect(getLoadsInputType(mockState)).toEqual(true);
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
