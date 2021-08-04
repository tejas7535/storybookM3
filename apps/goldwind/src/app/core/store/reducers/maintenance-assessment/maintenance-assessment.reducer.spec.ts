import {
  setMaintenanceAssessmentDisplay,
  setMaintenanceAssessmentInterval,
} from '../../actions';
import {
  initialState,
  maintenanceAssessmentReducer,
} from './maintenance-assessment.reducer';

describe('Maintenance Reducer', () => {
  describe('setMaintenanceAssessmentDisplay', () => {
    it('should handle the state', () => {
      const action = setMaintenanceAssessmentDisplay({
        maintenanceAssessmentDisplay: {
          deterioration_1: true,
          deterioration_2: false,
          rsmShaftSpeed: true,
          temperatureOptics_1: false,
          temperatureOptics_2: true,
          waterContent_1: false,
          waterContent_2: false,
        },
      });
      const state = maintenanceAssessmentReducer(initialState, action);

      expect(state.display.rsmShaftSpeed).toBeTruthy();
    });
  });
  describe('setMaintenanceAssessmentInterval', () => {
    it('should handle the state', () => {
      const action = setMaintenanceAssessmentInterval({
        interval: {
          startDate: 610_952_400,
          endDate: 610_952_400,
        },
      });
      const state = maintenanceAssessmentReducer(initialState, action);

      expect(state.interval.startDate).toBe(610_952_400);
      expect(state.interval.endDate).toBe(610_952_400);
    });
  });
});
