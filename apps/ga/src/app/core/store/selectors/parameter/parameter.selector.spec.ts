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
  getParameterValidity,
  getSelectedMovementType,
} from './parameter.selector';

describe('Parameter Selector', () => {
  let mockState: { parameter: ParameterState; bearing: BearingState };

  beforeEach(() => {
    mockState = {
      bearing: {
        selectedBearing: 'mockBearing',
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

  describe('getCalculationParameters', () => {
    it('should return an object with all calculation parms', () => {
      const validMockState = {
        ...mockState,
        parameter: {
          ...mockState.parameter,
          movements: {
            ...mockState.parameter.movements,
            rotationalSpeed: 9000,
          },
          valid: true,
        },
      };

      expect(getCalculationParameters(validMockState)).toEqual({
        idcO_DESIGNATION: 'mockBearing',
        idlC_TYPE_OF_MOVEMENT: initialState.movements.type,
        idL_RELATIVE_SPEED_WITHOUT_SIGN: `${validMockState.parameter.movements.rotationalSpeed.toFixed(
          2
        )}`,
        idcO_RADIAL_LOAD: `${initialState.loads.radial.toFixed(2)}`,
        idcO_AXIAL_LOAD: `${initialState.loads.axial.toFixed(2)}`,
        idscO_OILTEMP: `${initialState.environment.operatingTemperature.toFixed(
          2
        )}`,
        idslC_TEMPERATURE: `${initialState.environment.environmentTemperature.toFixed(
          2
        )}`,
        idscO_INFLUENCE_OF_AMBIENT: initialState.environment.environmentImpact,
      });
    });
  });
});
