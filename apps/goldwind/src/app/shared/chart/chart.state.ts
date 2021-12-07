import { LoadAssessmentDisplay } from '../../core/store/reducers/load-assessment/models';
import { MaintenanceAssessmentDisplay } from '../../core/store/reducers/maintenance-assessment/maintenance.assessment.model';
import { Interval } from '../../core/store/reducers/shared/models';

export interface ChartState<T> {
  display: T;
  interval: Interval;
}
