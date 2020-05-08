import { SidebarMode } from '../../models';
import * as fromSidebarActions from './sidebar.actions';

describe('SidebarActions', () => {
  describe('toggleSidebar', () => {
    it('should create an action', () => {
      const action = fromSidebarActions.toggleSidebar();

      expect(action).toEqual({
        type: '[Sidebar] Toggle Sidebar',
      });
    });
  });

  describe('setSidebarMode', () => {
    it('should create an action', () => {
      const sidebarMode: SidebarMode = SidebarMode.Open;
      const action = fromSidebarActions.setSidebarMode({ sidebarMode });

      expect(action).toEqual({
        sidebarMode,
        type: '[Sidebar] Set Sidebar Mode',
      });
    });
  });
});
