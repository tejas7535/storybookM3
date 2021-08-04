import { Interval } from '../../core/store/reducers/shared/models';
import { MaintenanceAssessmentDisplay } from '../../core/store/reducers/maintenance-assessment/maintenance.assessment.model';
import { LoadAssessmentDisplay } from '../../core/store/reducers/load-assessment/models';

export interface ChartState {
  display:
    | MaintenanceAssessmentDisplay
    | LoadAssessmentDisplay
    | { [key: string]: boolean };
  interval: Interval;
}
