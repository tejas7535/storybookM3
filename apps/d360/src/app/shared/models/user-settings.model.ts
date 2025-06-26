import { AppRouteValue } from '../../app.routes.enum';
import { SelectedKpisAndMetadata } from '../../feature/demand-validation/model';
import { AlertType } from '../../pages/admin/banner-settings/banner-settings.component';
import { FilterValues } from '../../pages/demand-validation/tables/demand-validation-table/column-definitions';
import { DateRangePeriod } from '../utils/date-range';

// Enum-Keys
export enum UserSettingsKey {
  SystemMessage = 'systemMessage',
  StartPage = 'startPage',
  DemandValidation = 'demandValidation',
  OverviewPage = 'overviewPage',
}
export enum DemandValidationUserSettingsKey {
  Workbench = 'workbench',
  TimeRange = 'timeRange',
  Exports = 'exports',
}
export enum DemandValidationTimeRangeUserSettingsKey {
  Type = 'type',
  StartDate = 'startDate',
  EndDate = 'endDate',
  OptionalEndDate = 'optionalEndDate',
}
export enum SystemMessageKey {
  Message = 'message',
  Headline = 'headline',
  ContentHash = 'contentHash',
  Active = 'active',
  Closable = 'closable',
  Type = 'type',
}

// Interfaces
export interface DemandValidationTimeRangeUserSettings {
  [DemandValidationTimeRangeUserSettingsKey.Type]: DateRangePeriod;
  [DemandValidationTimeRangeUserSettingsKey.StartDate]: number;
  [DemandValidationTimeRangeUserSettingsKey.EndDate]: number;
  [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: number | null;
}

export interface DemandValidationExport {
  id: string;
  title: string;
  active: boolean;
  selectedKpisAndMetadata: SelectedKpisAndMetadata[];
}

export interface DemandValidationSettings {
  [DemandValidationUserSettingsKey.Workbench]: Omit<
    FilterValues,
    SelectedKpisAndMetadata.ValidatedForecast
  >;
  [DemandValidationUserSettingsKey.TimeRange]: DemandValidationTimeRangeUserSettings;
  [DemandValidationUserSettingsKey.Exports]: DemandValidationExport[];
}

export interface SystemMessageSettings {
  [SystemMessageKey.Message]: string | null;
  [SystemMessageKey.Headline]: string | null;
  [SystemMessageKey.ContentHash]?: string | null;
  [SystemMessageKey.Active]: boolean;
  [SystemMessageKey.Closable]: boolean;
  [SystemMessageKey.Type]: AlertType | null;
}

export interface OverviewPageSettings {
  [OverviewPageSettingsKey.OnlyAssignedToMe]: boolean;
}

export enum OverviewPageSettingsKey {
  OnlyAssignedToMe = 'onlyAssignedToMe',
}

export interface UserSettings {
  [UserSettingsKey.SystemMessage]: SystemMessageSettings | null;
  [UserSettingsKey.StartPage]: AppRouteValue | null;
  [UserSettingsKey.DemandValidation]: DemandValidationSettings | null;
  [UserSettingsKey.OverviewPage]: OverviewPageSettings | null;
}
