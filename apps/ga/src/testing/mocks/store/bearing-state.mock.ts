import { BearingState } from '@ga/core/store/reducers/bearing/bearing.reducer';
import { BearingSelectionType } from '@ga/shared/models';

export const BEARING_STATE_MOCK: BearingState = {
  quickBearingSelection: {
    query: undefined,
    resultList: [],
  },
  advancedBearingSelection: {
    filters: {
      bearingType: undefined,
      boreDiameterMin: undefined,
      boreDiameterMax: undefined,
      outsideDiameterMin: undefined,
      outsideDiameterMax: undefined,
      widthMin: undefined,
      widthMax: undefined,
    },
    resultList: undefined,
    resultsCount: 0,
  },
  bearingSelectionType: BearingSelectionType.QuickSelection,
  loading: false,
  selectedBearing: undefined,
  modelId: undefined,
  modelCreationLoading: false,
  modelCreationSuccess: undefined,
};
