import { Action, createReducer, on } from '@ngrx/store';

import {
  BearingSelectionType,
  BearingSelectionTypeUnion,
  AdvancedBearingSelectionFilters,
} from '@ga/shared/models';

import {
  advancedBearingSelectionCountFailure,
  advancedBearingSelectionCountSuccess,
  advancedBearingSelectionFailure,
  advancedBearingSelectionSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingForAdvancedSelection,
  searchBearingForAdvancedSelectionCount,
  selectBearing,
  setBearingSelectionType,
} from '../../actions/bearing/bearing.actions';

export interface BearingState {
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
  modelCreationSuccess: boolean;
}

export const initialState: BearingState = {
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
  modelCreationSuccess: undefined,
};

export const bearingReducer = createReducer(
  initialState,
  on(
    setBearingSelectionType,
    (state: BearingState, { bearingSelectionType }): BearingState => ({
      ...state,
      bearingSelectionType,
    })
  ),
  on(
    searchBearing,
    (state: BearingState, { query }): BearingState => ({
      ...state,
      quickBearingSelection: {
        ...initialState.quickBearingSelection,
        query,
      },
      loading: true,
    })
  ),
  on(
    bearingSearchSuccess,
    (state: BearingState, { resultList }): BearingState => ({
      ...state,
      quickBearingSelection: {
        ...state.quickBearingSelection,
        resultList,
      },
      loading: false,
    })
  ),
  on(
    searchBearingForAdvancedSelection,
    searchBearingForAdvancedSelectionCount,
    (state: BearingState, { selectionFilters }): BearingState => ({
      ...state,
      advancedBearingSelection: {
        ...state.advancedBearingSelection,
        filters: selectionFilters,
      },
      loading: true,
    })
  ),
  on(
    advancedBearingSelectionSuccess,
    (state: BearingState, { resultList }): BearingState => ({
      ...state,
      advancedBearingSelection: {
        ...state.advancedBearingSelection,
        resultList,
      },
      loading: false,
    })
  ),
  on(
    advancedBearingSelectionFailure,
    advancedBearingSelectionCountFailure,
    (state: BearingState): BearingState => ({
      ...state,
      advancedBearingSelection: {
        ...state.advancedBearingSelection,
        resultList: [],
      },
      loading: false,
    })
  ),
  on(
    advancedBearingSelectionCountSuccess,
    (state: BearingState, { resultsCount }): BearingState => ({
      ...state,
      advancedBearingSelection: {
        ...state.advancedBearingSelection,
        resultsCount,
      },
      loading: false,
    })
  ),
  on(
    modelCreateSuccess,
    (state: BearingState, { modelId }): BearingState => ({
      ...state,
      modelId,
      modelCreationSuccess: true,
    })
  ),
  on(
    modelCreateFailure,
    (state: BearingState): BearingState => ({
      ...state,
      modelCreationSuccess: false,
      modelId: undefined,
    })
  ),
  on(
    selectBearing,
    (state: BearingState, { bearing }): BearingState => ({
      ...state,
      selectedBearing: bearing,
      modelCreationSuccess: undefined,
    })
  )
);

export function reducer(state: BearingState, action: Action): BearingState {
  return bearingReducer(state, action);
}
