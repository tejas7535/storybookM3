import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '../shared.module';
import { NavItem } from './models';
import { NavButtonsComponent } from './nav-buttons.component';

describe('NavButtonsComponent', () => {
  let component: NavButtonsComponent;
  let spectator: Spectator<NavButtonsComponent>;

  const createComponent = createComponentFactory({
    component: NavButtonsComponent,
    detectChanges: false,
    imports: [SharedModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSelectedIndexChange', () => {
    test('should emit selected tab', () => {
      component.items = [
        new NavItem('A', 'xyz.a'),
        new NavItem('B', 'xyz.b'),
        new NavItem('C', 'xyz.c'),
      ];
      component.selectedTabChange.emit = jest.fn();

      component.onSelectedIndexChange(1);

      expect(component.selectedTabChange.emit).toHaveBeenCalledWith('B');
    });
  });

  describe('set selectedTab', () => {
    test('should set selectedIndex', () => {
      component.items = [
        new NavItem('A', 'xyz.a'),
        new NavItem('B', 'xyz.b'),
        new NavItem('C', 'xyz.c'),
      ];

      component.selectedTab = 'B';

      expect(component.selectedIndex).toBe(1);
    });

    test('should not set selectedIndex', () => {
      component.items = [
        new NavItem('A', 'xyz.a'),
        new NavItem('B', 'xyz.b'),
        new NavItem('C', 'xyz.c'),
      ];

      component.selectedTab = 'D';

      expect(component.selectedIndex).toBe(-1);
    });
  });
});
