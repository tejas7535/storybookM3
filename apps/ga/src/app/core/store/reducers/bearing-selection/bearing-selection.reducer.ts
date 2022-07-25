import { Action, createReducer, on } from '@ngrx/store';

import {
  advancedBearingSelectionCountFailure,
  advancedBearingSelectionCountSuccess,
  advancedBearingSelectionFailure,
  advancedBearingSelectionSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  resetBearing,
  searchBearing,
  searchBearingForAdvancedSelection,
  searchBearingForAdvancedSelectionCount,
  selectBearing,
  setBearingSelectionType,
} from '@ga/core/store/actions';
import { BearingSelectionState } from '@ga/core/store/models';
import { BearingSelectionType } from '@ga/shared/models';

export const initialState: BearingSelectionState = {
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

export const bearingSelectionReducer = createReducer(
  initialState,
  on(setBearingSelectionType, (state, { bearingSelectionType }) => ({
    ...state,
    bearingSelectionType,
  })),
  on(searchBearing, (state, { query }) => ({
    ...state,
    quickBearingSelection: {
      ...initialState.quickBearingSelection,
      query,
    },
    loading: true,
  })),
  on(bearingSearchSuccess, (state, { resultList }) => ({
    ...state,
    quickBearingSelection: {
      ...state.quickBearingSelection,
      resultList,
    },
    loading: false,
  })),
  on(
    searchBearingForAdvancedSelection,
    searchBearingForAdvancedSelectionCount,
    (state, { selectionFilters }) => ({
      ...state,
      advancedBearingSelection: {
        ...state.advancedBearingSelection,
        filters: selectionFilters,
      },
      loading: true,
    })
  ),
  on(advancedBearingSelectionSuccess, (state, { resultList }) => ({
    ...state,
    advancedBearingSelection: {
      ...state.advancedBearingSelection,
      resultList,
    },
    loading: false,
  })),
  on(
    advancedBearingSelectionFailure,
    advancedBearingSelectionCountFailure,
    (state) => ({
      ...state,
      advancedBearingSelection: {
        ...state.advancedBearingSelection,
        resultList: [],
      },
      loading: false,
    })
  ),
  on(advancedBearingSelectionCountSuccess, (state, { resultsCount }) => ({
    ...state,
    advancedBearingSelection: {
      ...state.advancedBearingSelection,
      resultsCount,
    },
    loading: false,
  })),
  on(selectBearing, (state, { bearing }) => ({
    ...state,
    selectedBearing: bearing,
    modelCreationSuccess: undefined,
    modelCreationLoading: true,
  })),
  on(modelCreateSuccess, (state, { modelId }) => ({
    ...state,
    modelId,
    modelCreationSuccess: true,
    modelCreationLoading: false,
  })),
  on(modelCreateFailure, (state) => ({
    ...state,
    modelCreationSuccess: false,
    modelCreationLoading: false,
    modelId: undefined,
  })),
  on(resetBearing, () => ({
    ...initialState,
  }))
);

export function reducer(
  state: BearingSelectionState,
  action: Action
): BearingSelectionState {
  return bearingSelectionReducer(state, action);
}
