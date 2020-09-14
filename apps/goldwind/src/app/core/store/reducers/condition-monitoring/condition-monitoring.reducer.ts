import { Action, createReducer, on } from '@ngrx/store';

import {
  getStompStatus,
  subscribeBroadcastSuccess,
} from '../../actions/condition-monitoring/condition-monitoring.actions';
import { MessageEvent } from './models';

export interface ConditionMonitoringState {
  centerLoad: {
    socketStatus: number;
    events: MessageEvent[];
    contents: any;
  };
}

export const initialState: ConditionMonitoringState = {
  centerLoad: {
    socketStatus: undefined,
    events: [],
    contents: undefined,
  },
};

export const conditionMonitoringReducer = createReducer(
  initialState,
  on(getStompStatus, (state: ConditionMonitoringState, { status }) => ({
    ...state,
    centerLoad: { ...state.centerLoad, socketStatus: status },
  })),
  on(
    subscribeBroadcastSuccess,
    (state: ConditionMonitoringState, { id, body }) => {
      const event = {
        id,
        timestamp: +new Date(),
      };

      return {
        ...state,
        centerLoad: {
          ...state.centerLoad,
          events: [...state.centerLoad.events, event],
          contents: { ...state.centerLoad.contents, ...{ [id]: body } },
        },
      };
    }
  )
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: ConditionMonitoringState,
  action: Action
): ConditionMonitoringState {
  return conditionMonitoringReducer(state, action);
}
