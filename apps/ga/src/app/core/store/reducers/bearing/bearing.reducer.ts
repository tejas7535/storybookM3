import { Action, createReducer, on } from '@ngrx/store';

import { ExtendedSearchParameters } from '../../../../shared/models';
import {
  bearingSearchExtendedCountFailure,
  bearingSearchExtendedCountSuccess,
  bearingSearchExtendedFailure,
  bearingSearchExtendedSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingExtended,
  searchBearingExtendedCount,
  selectBearing,
} from '../../actions/bearing/bearing.actions';

export interface BearingState {
  search: {
    query: string;
    resultList: string[];
  };
  extendedSearch: {
    parameters: ExtendedSearchParameters;
    resultList: string[];
    resultsCount: number;
  };
  loading: boolean;
  selectedBearing: string;
  modelId: string;
  modelCreationSuccess: boolean;
}

export const initialState: BearingState = {
  search: {
    query: undefined,
    resultList: [],
  },
  extendedSearch: {
    parameters: {
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
  loading: false,
  selectedBearing: undefined,
  modelId: undefined,
  modelCreationSuccess: undefined,
};

export const bearingReducer = createReducer(
  initialState,
  on(
    searchBearing,
    (state: BearingState, { query }): BearingState => ({
      ...state,
      search: {
        ...initialState.search,
        query,
      },
      loading: true,
    })
  ),
  on(
    bearingSearchSuccess,
    (state: BearingState, { resultList }): BearingState => ({
      ...state,
      search: {
        ...state.search,
        resultList,
      },
      loading: false,
    })
  ),
  on(
    searchBearingExtended,
    searchBearingExtendedCount,
    (state: BearingState, { parameters }): BearingState => ({
      ...state,
      extendedSearch: {
        ...state.extendedSearch,
        parameters,
      },
      loading: true,
    })
  ),
  on(
    bearingSearchExtendedSuccess,
    (state: BearingState, { resultList }): BearingState => ({
      ...state,
      extendedSearch: {
        ...state.extendedSearch,
        resultList,
      },
      loading: false,
    })
  ),
  on(
    bearingSearchExtendedFailure,
    bearingSearchExtendedCountFailure,
    (state: BearingState): BearingState => ({
      ...state,
      extendedSearch: {
        ...state.extendedSearch,
        resultList: [],
      },
      loading: false,
    })
  ),
  on(
    bearingSearchExtendedCountSuccess,
    (state: BearingState, { resultsCount }): BearingState => ({
      ...state,
      extendedSearch: {
        ...state.extendedSearch,
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
