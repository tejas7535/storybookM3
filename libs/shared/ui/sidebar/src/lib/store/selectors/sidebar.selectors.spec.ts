import { SidebarMode } from '../../models';
import { initialState } from '../reducers/sidebar.reducer';
import { getSidebarMode } from './sidebar.selectors';

describe('SidebarSelector', () => {
  describe('#getSidebarMode', () => {
    it('should return sidebar mode of initial state', () => {
      const result = getSidebarMode.projector(initialState);
      expect(result).toEqual(SidebarMode.Open);
    });
  });
});
