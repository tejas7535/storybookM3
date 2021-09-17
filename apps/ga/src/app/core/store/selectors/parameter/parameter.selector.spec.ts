import { BearingState } from '../../reducers/bearing/bearing.reducer';
import { Movement } from './../../../../shared/models/parameters/movement.model';
import {
  initialState,
  ParameterState,
} from './../../reducers/parameter/parameter.reducer';
import {
  getCalculationParamters,
  getEnvironmentTemperatures,
  getLoadsInputType,
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

  describe('getCalculationParamters', () => {
    it('should return an object with all calculation parms', () => {
      expect(getCalculationParamters(mockState)).toEqual({
        idcO_DESIGNATION: 'mockBearing',
        idlC_TYPE_OF_MOVEMENT: initialState.movements.type,
        idL_RELATIVE_SPEED_WITHOUT_SIGN: `${initialState.movements.rotationalSpeed}`,
        idlC_OSCILLATION_ANGLE: `${initialState.movements.shiftAngle}`,
        idlC_MOVEMENT_FREQUENCY: `${initialState.movements.shiftFrequency}`,
        idcO_RADIAL_LOAD: `${initialState.loads.radial}`,
        idcO_AXIAL_LOAD: `${initialState.loads.axial}`,
        idscO_OILTEMP: `${initialState.environment.operatingTemperature}`,
        idslC_TEMPERATURE: `${initialState.environment.environmentTemperature}`,
        idscO_INFLUENCE_OF_AMBIENT: `${initialState.environment.environmentImpact}`,
      });
    });
  });
});
