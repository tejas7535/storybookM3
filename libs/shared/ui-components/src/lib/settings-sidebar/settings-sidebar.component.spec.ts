import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BreakpointService } from '@schaeffler/shared/responsive';

import { configureTestSuite } from 'ng-bullet';

import { SettingsSidebarComponent } from './settings-sidebar.component';

describe('SettingsSidebarComponent', () => {
  let component: SettingsSidebarComponent;
  let fixture: ComponentFixture<SettingsSidebarComponent>;
  let breakpointService: BreakpointService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsSidebarComponent],
      imports: [
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule,
        NoopAnimationsModule
      ],
      providers: [BreakpointService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    breakpointService = TestBed.get(BreakpointService);
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

    test('Observable of viewport should be defined', () => {
      expect(component.isMobile$).toBeDefined();
      expect(component.isLessThanMedium$).toBeDefined();
    });
  });

  describe('#ngOnInit', () => {
    test('should call isMobileViewPort of breakpointService', () => {
      breakpointService.isMobileViewPort = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(breakpointService.isMobileViewPort).toHaveBeenCalled();
    });
    test('should call isLessThanMedium of breakpointService', () => {
      breakpointService.isLessThanMedium = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(breakpointService.isLessThanMedium).toHaveBeenCalled();
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
