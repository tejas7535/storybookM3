import { LeavingType } from '../../shared/models/employee/leaving-type.enum';
import { PerformanceRating } from './performance-rating.enum';

export interface PmgmDataDto {
  employeeKey: string;
  employee: string;
  orgUnit: string;
  orgUnitKey: string;
  isManager: boolean;
  prevYearIsManager: boolean;
  overallPerformanceRating: PerformanceRating;
  prevYearOverallPerformanceRating: PerformanceRating;
  highRiskOfLoss: boolean;
  prevYearHighRiskOfLoss: boolean;
  personalArea: string;
  fluctuationType: LeavingType;
}
