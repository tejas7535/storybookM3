import {
  AdvancedBearingSelectionFilters,
  BearingSelectionTypeUnion,
} from '@ga/shared/models';

export interface BearingSelectionState {
  quickBearingSelection: {
    query: string;
    resultList: string[];
  };
  advancedBearingSelection: {
    filters: AdvancedBearingSelectionFilters;
    resultList: string[];
    resultsCount: number;
  };
  bearingSelectionType: BearingSelectionTypeUnion;
  loading: boolean;
  selectedBearing: string;
  modelId: string;
  modelCreationLoading: boolean;
  modelCreationSuccess: boolean;
}
