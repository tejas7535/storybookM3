import { SidebarMode } from '../../models';
import * as fromSidebarActions from '../actions/sidebar.actions';
import {
  initialState,
  reducer,
  sidebarReducer,
  SidebarState,
} from './sidebar.reducer';

describe('In SidebarReducer', () => {
  it('should return default state', () => {
    const action: any = {};
    const state = sidebarReducer(undefined, action);

    expect(state).toBe(initialState);
    expect('mode' in state).toBeTruthy();

    expect(state.mode).toEqual(SidebarMode.Open);
  });

  describe('ToggleSidebarAction', () => {
    it('should return same state', () => {
      const action = fromSidebarActions.toggleSidebar();
      const state = sidebarReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('SetSidebarAction', () => {
    let action: fromSidebarActions.SidebarActions;
    let state: SidebarState;

    it('should set sidebar mode to closed', () => {
      action = fromSidebarActions.setSidebarMode({
        sidebarMode: SidebarMode.Closed,
      });

      state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Open },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Closed);
    });

    it('should set sidebar mode to minified', () => {
      action = fromSidebarActions.setSidebarMode({
        sidebarMode: SidebarMode.Minified,
      });
      state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Open },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Minified);
    });

    it('should set sidebar mode to open', () => {
      action = fromSidebarActions.setSidebarMode({
        sidebarMode: SidebarMode.Open,
      });
      state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Closed },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Open);
    });
  });

  describe('Reducer function', () => {
    test('should return sidebarReducer', () => {
      const action = fromSidebarActions.toggleSidebar();
      expect(reducer(initialState, action)).toEqual(
        sidebarReducer(initialState, action)
      );
    });
  });
});
