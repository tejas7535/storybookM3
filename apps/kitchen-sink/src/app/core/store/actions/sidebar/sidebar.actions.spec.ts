import { SidebarMode } from '@schaeffler/shared/ui-components';
import * as fromSidebarActions from './sidebar.actions';

describe('SidebarActions', () => {
  describe('toggleSidebar', () => {
    it('should create an action', () => {
      const sidebarMode: SidebarMode = SidebarMode.Open;
      const action = fromSidebarActions.toggleSidebar({ sidebarMode });

      expect(action).toEqual({
        sidebarMode,
        type: '[Sidebar] Toggle Sidebar'
      });
    });
  });

  describe('setSidebarMode', () => {
    it('should create an action', () => {
      const sidebarMode: SidebarMode = SidebarMode.Open;
      const action = fromSidebarActions.setSidebarMode({ sidebarMode });

      expect(action).toEqual({
        sidebarMode,
        type: '[Sidebar] Set Sidebar Mode'
      });
    });
  });
});
