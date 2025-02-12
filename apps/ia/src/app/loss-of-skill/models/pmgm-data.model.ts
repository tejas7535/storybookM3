import { LeavingType } from '../../shared/models/employee/leaving-type.enum';
import { PerformanceRating } from './performance-rating.enum';
import { PmgmArrow } from './pmgm-arrow.enum';
import { PmgmAssessment } from './pmgm-assessment.enum';

export class PmgmData {
  constructor(
    public employeeKey: string,
    public employee: string,
    public orgUnit: string,
    public orgUnitKey: string,
    public isManager: boolean,
    public managerChange: PmgmArrow,
    public overallPerformanceRating: PerformanceRating,
    public overallPerformanceRatingChange: PmgmArrow,
    public highRiskOfLoss: boolean,
    public highRiskOfLossChange: PmgmArrow,
    public personalArea: string,
    public fluctuationType: LeavingType,
    public assessment: PmgmAssessment
  ) {}
}
