import { FilterDimension, IdValue } from '../../shared/models';

export interface UserSettingsDialogData {
  dimension: FilterDimension;
  selectedBusinessArea: IdValue;
  initialLoad: boolean;
}
