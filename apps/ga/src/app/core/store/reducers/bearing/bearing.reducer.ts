import { Action, createReducer } from '@ngrx/store';

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

export const bearingReducer = createReducer(initialState);

export function reducer(state: BearingState, action: Action): BearingState {
  return bearingReducer(state, action);
}
