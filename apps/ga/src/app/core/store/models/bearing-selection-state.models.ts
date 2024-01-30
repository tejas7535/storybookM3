import {
  AdvancedBearingSelectionFilters,
  BearingInfo,
  BearingSelectionTypeUnion,
} from '@ga/shared/models';

export interface BearingSelectionState {
  quickBearingSelection: {
    query: string;
    resultList: BearingInfo[];
  };
  advancedBearingSelection: {
    filters: AdvancedBearingSelectionFilters;
    resultList: BearingInfo[];
    resultsCount: number;
  };
  bearingSelectionType: BearingSelectionTypeUnion;
  loading: boolean;
  selectedBearing: string;
  modelId: string;
  modelCreationLoading: boolean;
  modelCreationSuccess: boolean;
}
