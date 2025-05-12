import { Stub } from '../../test/stub.class';
import { MenuPanelButtonComponent } from './menu-panel-button.component';

describe('MenuPanelButtonComponent', () => {
  let component: MenuPanelButtonComponent;

  beforeEach(() => {
    component = Stub.getForEffect({ component: MenuPanelButtonComponent });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeMenu', () => {
    it('should close the menu', () => {
      const triggerSpy = { closeMenu: jest.fn() };
      const closeSpy = jest
        .spyOn(component as any, 'menuTrigger')
        .mockReturnValue(triggerSpy);
      component.closeMenu();
      expect(closeSpy).toHaveBeenCalled();
      expect(triggerSpy.closeMenu).toHaveBeenCalled();
    });
  });
});
