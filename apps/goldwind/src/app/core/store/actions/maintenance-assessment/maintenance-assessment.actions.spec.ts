import { MaintenanceAssessmentDisplay } from '../../reducers/maintenance-assessment/maintenance.assessment.model';
import * as A from './maintenance-assessment.actions';

describe('Maintenance Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'my-test-device-id';
  });

  describe('Get Maintenance Actions', () => {
    it('getMaintenanceAssessmentId', () => {
      const action = A.getMaintenanceAssessmentId();

      expect(action).toEqual({
        type: '[Maintenance Assessment] Load Maintenance Assessment ID',
      });
    });
    it('setMaintenanceAssessmentDisplay', () => {
      const action = A.setMaintenanceAssessmentDisplay({
        maintenanceAssessmentDisplay: {
          deterioration_1: true,
        } as MaintenanceAssessmentDisplay,
      });

      expect(action).toEqual({
        type: '[Maintenance Assessment] Set Maintenance Assessment Display',
        maintenanceAssessmentDisplay: {
          deterioration_1: true,
        },
      });
    });
    it('setMaintenanceAssessmentInterval', () => {
      const action = A.setMaintenanceAssessmentInterval({
        interval: {
          startDate: 610_952_400,
          endDate: 610_952_400,
        },
      });

      expect(action).toEqual({
        type: '[Maintenance Assessment] Set Interval',
        interval: {
          startDate: 610_952_400,
          endDate: 610_952_400,
        },
      });
    });
  });
});
