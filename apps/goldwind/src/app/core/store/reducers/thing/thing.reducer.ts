import { Action, createReducer, on } from '@ngrx/store';

import {
  getStompStatus,
  getThing,
  getThingFailure,
  getThingSuccess,
  subscribeBroadcastSuccess,
} from '../../actions/thing/thing.actions';
import { IotThing, MessageEvent } from './models';

export interface ThingState {
  thing: {
    loading: boolean;
    thing: IotThing;
    socketStatus: number;
    messages: {
      events: MessageEvent[];
      contents: any;
    };
  };
}

export const initialState: ThingState = {
  thing: {
    loading: false,
    thing: undefined,
    socketStatus: undefined,
    messages: {
      events: [],
      contents: undefined,
    },
  },
};

export const thingReducer = createReducer(
  initialState,
  on(getThing, (state: ThingState) => ({
    ...state,
    thing: { ...state.thing, loading: true },
  })),
  on(getThingSuccess, (state: ThingState, { thing }) => ({
    ...state,
    thing: {
      ...state.thing,
      thing,
      loading: false,
    },
  })),
  on(getThingFailure, (state: ThingState) => ({
    ...state,
    thing: { ...state.thing, loading: false },
  })),
  on(getStompStatus, (state: ThingState, { status }) => ({
    ...state,
    thing: { ...state.thing, socketStatus: status },
  })),
  on(subscribeBroadcastSuccess, (state: ThingState, { id, body }) => {
    const event = {
      id,
      timestamp: +new Date(),
    };

    return {
      ...state,
      thing: {
        ...state.thing,
        messages: {
          ...state.thing.messages,
          events: [...state.thing.messages.events, event],
          contents: { ...state.thing.messages.contents, ...{ [id]: body } },
        },
      },
    };
  })
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: ThingState, action: Action): ThingState {
  return thingReducer(state, action);
}
