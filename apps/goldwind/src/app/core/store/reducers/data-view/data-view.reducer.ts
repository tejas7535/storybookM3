import { Action, createReducer, on } from '@ngrx/store';

import {
  getData,
  getDataFailure,
  getDataSuccess,
  setDataInterval,
  setFrequency,
} from '../../actions/data-view/data-view.actions';
import { SensorData } from './models';

export interface DataViewState {
  loading: boolean;
  result: SensorData[];
  interval: {
    startDate: number;
    endDate: number;
  };
  frequency: number;
}

export const initialState: DataViewState = {
  loading: false,
  result: undefined,
  interval: {
    startDate: Math.floor(
      +new Date().setFullYear(new Date().getFullYear() - 1) / 1000
    ),
    endDate: Math.floor(+new Date() / 1000),
  },
  frequency: 1,
};

export const dataViewReducer = createReducer(
  initialState,
  on(
    getData,
    (state: DataViewState): DataViewState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    getDataSuccess,
    (state: DataViewState, { result }): DataViewState => ({
      ...state,
      result,
      loading: false,
    })
  ),
  on(
    getDataFailure,
    (state: DataViewState): DataViewState => ({
      ...state,
      loading: false,
    })
  ),
  on(
    setDataInterval,
    (state: DataViewState, { interval }): DataViewState => ({
      ...state,
      interval,
    })
  ),
  on(
    setFrequency,
    (state: DataViewState, { frequency }): DataViewState => ({
      ...state,
      frequency,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: DataViewState, action: Action): DataViewState {
  return dataViewReducer(state, action);
}
