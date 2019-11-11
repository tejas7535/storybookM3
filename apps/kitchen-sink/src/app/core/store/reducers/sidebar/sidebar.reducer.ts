import { Action, createReducer, on } from '@ngrx/store';

import { SidebarMode } from '@schaeffler/shared/ui-components';
import {
  setSidebarMode,
  toggleSidebar
} from '../../actions/sidebar/sidebar.actions';
export interface SidebarState {
  mode: SidebarMode;
}

export const initialState: SidebarState = {
  mode: SidebarMode.Open
};

export const sidebarReducer = createReducer(
  initialState,
  on(toggleSidebar, (state, { sidebarMode }) => {
    let mode: SidebarMode;

    switch (state.mode) {
      case SidebarMode.Closed: {
        mode = SidebarMode.Open;
        break;
      }
      case SidebarMode.Minified: {
        mode = SidebarMode.Open;
        break;
      }
      case SidebarMode.Open: {
        switch (sidebarMode) {
          case SidebarMode.Open:
          case SidebarMode.Minified: {
            mode = SidebarMode.Minified;
            break;
          }
          case SidebarMode.Closed: {
            mode = SidebarMode.Closed;
            break;
          }
          default:
            return undefined;
        }
        break;
      }
      default:
        return state;
    }

    return {
      ...state,
      mode
    };
  }),
  on(setSidebarMode, (state, { sidebarMode }) => ({
    ...state,
    mode: sidebarMode
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: SidebarState, action: Action): SidebarState {
  return sidebarReducer(state, action);
}
