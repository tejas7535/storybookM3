import { FilterDimension, IdValue } from '../../shared/models';

export interface UserSettingsDialogData {
  dimension: FilterDimension;
  selectedDimensionIdValue: IdValue;
  initialLoad: boolean;
}
