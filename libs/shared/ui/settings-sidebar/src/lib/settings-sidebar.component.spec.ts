import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { BreakpointService } from '@schaeffler/responsive';

import { SettingsSidebarComponent } from './settings-sidebar.component';

describe('SettingsSidebarComponent', () => {
  let spectator: Spectator<SettingsSidebarComponent>;
  let component: SettingsSidebarComponent;
  let breakpointService: BreakpointService;

  const createComponent = createComponentFactory({
    component: SettingsSidebarComponent,
    imports: [
      MatIconModule,
      MatSidenavModule,
      MatButtonModule,
      FlexLayoutModule,
      NoopAnimationsModule,
    ],
    providers: [BreakpointService],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    breakpointService = spectator.inject(BreakpointService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default variables', () => {
    test('default variables for inputs should be set', () => {
      expect(component.open).toBeTruthy();
      expect(component.openSidebarBtn).toBeFalsy();
      expect(component.closeSidebarBtn).toBeFalsy();
    });

    test('Viewport variables should be defined', () => {
      expect(component.isMobileViewPort).toBeDefined();
      expect(component.isLessThanMedium).toBeDefined();
    });
  });

  describe('#ngOnInit', () => {
    test('should call isMobileViewPort of breakpointService', () => {
      const spy = jest.spyOn(breakpointService, 'isMobileViewPort');

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });
    test('should call isLessThanMedium of breakpointService', () => {
      const spy = jest.spyOn(breakpointService, 'isLessThanMedium');

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#onChangeState', () => {
    test('should emit openedChange when called', () => {
      spyOn(component['openedChange'], 'emit');

      component.onChangeState(true);

      expect(component['openedChange'].emit).toHaveBeenCalledWith(true);
    });
  });
});
