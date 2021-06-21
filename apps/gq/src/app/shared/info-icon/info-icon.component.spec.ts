import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { InfoIconComponent } from './info-icon.component';

describe('InfoIconComponent', () => {
  let component: InfoIconComponent;
  let spectator: Spectator<InfoIconComponent>;

  const createComponent = createComponentFactory({
    component: InfoIconComponent,
    imports: [MatIconModule, MatMenuModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('iconEnter', () => {
    test('open menu', () => {
      const menuTrigger: any = { openMenu: jest.fn() };
      component.iconEnter(menuTrigger);
      expect(menuTrigger.openMenu).toHaveBeenCalled();
    });
  });

  describe('iconLeave', () => {
    test('iconLeave', () => {
      jest.useFakeTimers('legacy');
      const menuTrigger: any = { closeMenu: jest.fn() };

      component.iconLeave(menuTrigger);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);
      jest.advanceTimersByTime(1501);
      expect(menuTrigger.closeMenu).toHaveBeenCalled();
    });
  });
});
