import { AppRouteValue } from '../../app.routes.enum';
import { KpiType } from '../../feature/demand-validation/model';
import { FilterValues } from '../../pages/demand-validation/tables/demand-validation-table/column-definitions';
import { DateRangePeriod } from '../utils/date-range';

// Enum-Keys
export enum UserSettingsKey {
  StartPage = 'startPage',
  DemandValidation = 'demandValidation',
}
export enum DemandValidationUserSettingsKey {
  Workbench = 'workbench',
  TimeRange = 'timeRange',
}
export enum DemandValidationTimeRangeUserSettingsKey {
  Type = 'type',
  StartDate = 'startDate',
  EndDate = 'endDate',
  OptionalEndDate = 'optionalEndDate',
}

// Interfaces
export interface DemandValidationTimeRangeUserSettings {
  [DemandValidationTimeRangeUserSettingsKey.Type]: DateRangePeriod;
  [DemandValidationTimeRangeUserSettingsKey.StartDate]: number;
  [DemandValidationTimeRangeUserSettingsKey.EndDate]: number;
  [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: number | null;
}

export interface DemandValidationSettings {
  [DemandValidationUserSettingsKey.Workbench]: Omit<
    FilterValues,
    KpiType.ValidatedForecast
  >;
  [DemandValidationUserSettingsKey.TimeRange]: DemandValidationTimeRangeUserSettings;
}

export interface UserSettings {
  [UserSettingsKey.StartPage]: AppRouteValue | null;
  [UserSettingsKey.DemandValidation]: DemandValidationSettings | null;
}
