import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { SidebarMode } from '../../models';
import { setSidebarMode } from '../actions/sidebar.actions';

export interface SidebarState {
  mode: SidebarMode;
}

export const initialState: SidebarState = {
  mode: SidebarMode.Open,
};

export const sidebarReducer = createReducer(
  initialState,
  on(setSidebarMode, (state, { sidebarMode }) => ({
    ...state,
    mode: sidebarMode,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: SidebarState, action: Action): SidebarState {
  return sidebarReducer(state, action);
}

export const getSidebarState = createFeatureSelector<SidebarState>('sidebar');
