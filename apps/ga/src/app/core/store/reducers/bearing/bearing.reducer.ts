import { Action, createReducer, on } from '@ngrx/store';

import {
  bearingSearchSuccess,
  searchBearing,
  selectBearing,
} from '../../actions/bearing/bearing.actions';

export interface BearingState {
  search: {
    query: string;
    resultList: string[];
  };
  extendedSearch: {
    query: string;
    bearingDesign: string;
    innerDiameter: number;
    innerDiameterDeviation: number;
    outerDiameter: number;
    outerDiameterDeviation: number;
    width: number;
    widthDeviation: number;
    resultList: string[];
  };
  loading: boolean;
  selectedBearing: any;
}

export const initialState: BearingState = {
  search: {
    query: undefined,
    resultList: [],
  },
  extendedSearch: {
    query: undefined,
    bearingDesign: undefined,
    innerDiameter: undefined,
    innerDiameterDeviation: undefined,
    outerDiameter: undefined,
    outerDiameterDeviation: undefined,
    width: undefined,
    widthDeviation: undefined,
    resultList: [],
  },
  loading: false,
  selectedBearing: undefined,
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
        ...initialState.search,
        resultList,
      },
      loading: false,
    })
  ),
  on(
    selectBearing,
    (state: BearingState, { bearing }): BearingState => ({
      ...state,
      selectedBearing: bearing,
    })
  )
);

export function reducer(state: BearingState, action: Action): BearingState {
  return bearingReducer(state, action);
}
