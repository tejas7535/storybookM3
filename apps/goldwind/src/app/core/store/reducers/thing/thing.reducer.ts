import { Action, createReducer, on } from '@ngrx/store';

import {
  getThing,
  getThingFailure,
  getThingSuccess,
} from '../../actions/thing/thing.actions';
import { IotThing } from './models/iot-thing.model';

export interface ThingState {
  thing: {
    loading: boolean;
    thing: IotThing;
  };
}

export const initialState: ThingState = {
  thing: {
    loading: false,
    thing: undefined,
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
      thing,
      loading: false,
    },
  })),
  on(getThingFailure, (state: ThingState) => ({
    ...state,
    thing: { ...state.thing, loading: false },
  }))
);

// export const thingReducer = createReducer(initialState);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: ThingState, action: Action): ThingState {
  return thingReducer(state, action);
}
