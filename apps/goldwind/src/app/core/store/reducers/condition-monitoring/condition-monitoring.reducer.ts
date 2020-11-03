import { Action, createReducer, on } from '@ngrx/store';

import { getLoad, getLoadFailure, getLoadSuccess } from '../../actions';
import { MessageEvent } from './models';

export interface ConditionMonitoringState {
  centerLoad: {
    loading: boolean;
    events: MessageEvent[];
    contents: any;
  };
}

export const initialState: ConditionMonitoringState = {
  centerLoad: {
    loading: false,
    events: [],
    contents: undefined,
  },
};

export const conditionMonitoringReducer = createReducer(
  initialState,
  on(getLoad, (state: ConditionMonitoringState) => ({
    ...state,
    centerLoad: {
      ...state.centerLoad,
      loading: true,
    },
  })),
  on(getLoadSuccess, (state: ConditionMonitoringState, { id, body }) => {
    const event = {
      id,
      timestamp: +new Date(),
    };

    return {
      ...state,
      centerLoad: {
        loading: false,
        events: [...state.centerLoad.events, event],
        contents: { ...state.centerLoad.contents, ...{ [id]: body } },
      },
    };
  }),
  on(getLoadFailure, (state: ConditionMonitoringState) => ({
    ...state,
    centerLoad: {
      ...state.centerLoad,
      loading: false,
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: ConditionMonitoringState,
  action: Action
): ConditionMonitoringState {
  return conditionMonitoringReducer(state, action);
}
