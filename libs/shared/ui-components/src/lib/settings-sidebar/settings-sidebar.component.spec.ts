import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BreakpointService } from '@schaeffler/shared/responsive';

import { configureTestSuite } from 'ng-bullet';

import { IconModule } from '../icon/icon.module';

import { SettingsSidebarComponent } from './settings-sidebar.component';

describe('SettingsSidebarComponent', () => {
  let component: SettingsSidebarComponent;
  let fixture: ComponentFixture<SettingsSidebarComponent>;
  let breakpointService: BreakpointService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsSidebarComponent],
      imports: [
        IconModule,
        MatSidenavModule,
        MatButtonModule,
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

    breakpointService = TestBed.inject(BreakpointService);
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

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });
    test('should call isLessThanMedium of breakpointService', () => {
      const spy = jest.spyOn(breakpointService, 'isLessThanMedium');

      // tslint:disable-next-line: no-lifecycle-call
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
