import { Movement } from './../../../../shared/models/parameters/movement.model';
import {
  initialState,
  ParameterState,
} from './../../reducers/parameter/parameter.reducer';
import {
  getEnvironmentTemperatures,
  getLoadsInputType,
  getSelectedMovementType,
} from './parameter.selector';

describe('Parameter Selector', () => {
  let mockState: { parameter: ParameterState };

  beforeEach(() => {
    mockState = { parameter: { ...initialState } };
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
});
