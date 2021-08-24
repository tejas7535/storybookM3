import { Movement } from './../../../../shared/models/parameters/movement.model';
import {
  initialState,
  ParameterState,
} from './../../reducers/parameter/parameter.reducer';
import { getSelectedMovementType } from './parameter.selector';

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
});
