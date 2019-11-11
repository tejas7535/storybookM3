import { SidebarMode } from '@schaeffler/shared/ui-components';
import * as fromSidebarActions from '../../actions/sidebar/sidebar.actions';
import { initialState, sidebarReducer } from './sidebar.reducer';

describe('In SidebarReducer', () => {
  it('should return default state', () => {
    const action: any = {};
    const state = sidebarReducer(undefined, action);

    expect(state).toBe(initialState);
    expect('mode' in state).toBeTruthy();

    expect(state.mode).toEqual(SidebarMode.Open);
  });

  describe('ToggleSidebarAction', () => {
    it('should return undefined mode if state is changed to undefined...', () => {
      const action = fromSidebarActions.toggleSidebar(undefined);
      const state = sidebarReducer(initialState, action);

      expect(state).toBeUndefined();
    });

    it('should toggle closed mode to open', () => {
      const action = fromSidebarActions.toggleSidebar({
        sidebarMode: SidebarMode.Closed
      });
      const state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Closed },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Open);
    });

    it('should toggle minified mode to open', () => {
      const action = fromSidebarActions.toggleSidebar({
        sidebarMode: SidebarMode.Closed
      });
      const state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Minified },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Open);
    });

    it('should toggle open mode to minified, if open is requested', () => {
      const action = fromSidebarActions.toggleSidebar({
        sidebarMode: SidebarMode.Open
      });
      const state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Open },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Minified);
    });

    it('should toggle open mode to minified, if minified is requested', () => {
      const action = fromSidebarActions.toggleSidebar({
        sidebarMode: SidebarMode.Minified
      });
      const state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Open },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Minified);
    });

    it('should toggle open mode to closed, if closed is requested', () => {
      const action = fromSidebarActions.toggleSidebar({
        sidebarMode: SidebarMode.Closed
      });
      const state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Open },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Closed);
    });

    it('should return same state for undefined SidebarMode', () => {
      const action = fromSidebarActions.toggleSidebar({
        sidebarMode: SidebarMode.Open
      });

      const state = sidebarReducer({ ...initialState, mode: 7 }, action);

      expect(state.mode).toEqual(7);
    });
  });

  describe('SetSidebarAction', () => {
    it('should set given state', () => {
      let action = fromSidebarActions.setSidebarMode({
        sidebarMode: SidebarMode.Closed
      });
      let state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Open },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Closed);

      action = fromSidebarActions.setSidebarMode({
        sidebarMode: SidebarMode.Minified
      });
      state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Open },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Minified);

      action = fromSidebarActions.setSidebarMode({
        sidebarMode: SidebarMode.Open
      });
      state = sidebarReducer(
        { ...initialState, mode: SidebarMode.Closed },
        action
      );

      expect(state.mode).toEqual(SidebarMode.Open);
    });
  });
});
