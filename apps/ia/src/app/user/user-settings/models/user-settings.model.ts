import { FilterDimension } from '../../../shared/models';

export interface UserSettings {
  dimension: FilterDimension;
  dimensionKey: string;
  dimensionDisplayName: string;
}
