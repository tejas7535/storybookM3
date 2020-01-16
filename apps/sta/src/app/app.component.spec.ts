import { from, Observable, of, Subscriber } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { BreakpointService } from '@schaeffler/shared/responsive';
import {
  FooterModule,
  HeaderModule,
  SettingsSidebarModule,
  SidebarMode,
  SidebarModule,
  SidebarService
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { BreadcrumbModule } from './shared/breadcrumb/breadcrumb.module';

import { AppComponent } from './app.component';
import { ResultComponent } from './shared/result/result.component';

import { AuthService } from './core/auth.service';
import { DataStoreService } from './shared/result/services/data-store.service';

@Component({ selector: 'sta-result', template: '' })
class ResultStubComponent implements Partial<ResultComponent> {
  tags$;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: AuthService;
  let sidebarService: SidebarService;
  let breakpointObserverMock: Subscriber<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BreadcrumbModule,
        FooterModule,
        HeaderModule,
        HttpClientTestingModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule,
        SettingsSidebarModule,
        SidebarModule
      ],
      declarations: [AppComponent, ResultStubComponent],
      providers: [
        DataStoreService,
        BreakpointService,
        SidebarService,
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn()
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AuthService);
    service.initAuth = jest.fn();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    sidebarService = TestBed.get(SidebarService);
    component = fixture.componentInstance;

    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        onchange: undefined,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      };
    });
  });

  /**
   * Fake Observer to emit fake stuff
   */
  const fakeObservable = new Observable(observer => {
    breakpointObserverMock = observer;

    return {
      unsubscribe(): any {}
    };
  });

  test('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    expect(service.initAuth).toHaveBeenCalled();
  });

  test(`should have as title 'Schaeffler Text Assistant'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Schaeffler Text Assistant');
  });

  describe('ngOnInit()', () => {
    test('should set Observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.isDataAvl$).toBeDefined();
      expect(component.subscription).toBeDefined();
    });

    test('should set settingsSidebarOpen to true initialy', async () => {
      component['dataStore'].isDataAvailable = jest
        .fn()
        .mockImplementation(() => of(false));
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      await fixture.whenStable();

      expect(component.settingsSidebarOpen).toBeTruthy();
    });

    test('should set settingsSidebarOpen to true when data avl', async () => {
      component['dataStore'].isDataAvailable = jest
        .fn()
        .mockImplementation(() => from([false, true]));

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      await fixture.whenStable();

      expect(component.settingsSidebarOpen).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();
      component.destroy$.next = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
      expect(component.destroy$.next).toHaveBeenCalled();
    });
  });

  describe('settingsSidebarOpenedChanges', () => {
    test('should set settingsSidebarOpen to provided parameter', () => {
      const open = false;
      component.settingsSidebarOpen = true;

      component.settingsSidebarOpenedChanges(open);

      expect(component.settingsSidebarOpen).toBeFalsy();
    });
  });

  describe('toggleSidebar()', () => {
    test('should set next sidebarToggled value', () => {
      const sidebarMode = SidebarMode.Open;
      spyOn(sidebarService, 'getSidebarMode').and.returnValue(fakeObservable);
      const spy = spyOn(component['sidebarToggled'], 'next');

      component.toggleSidebar();
      breakpointObserverMock.next(sidebarMode);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(SidebarMode.Open);
    });

    test('should only set next sidebarToggled value in one time ToggleSidebarAction()', () => {
      spyOn(sidebarService, 'getSidebarMode').and.returnValue(fakeObservable);
      const spy = spyOn(component['sidebarToggled'], 'next');
      component.toggleSidebar();

      breakpointObserverMock.next(SidebarMode.Open);
      expect(spy).toHaveBeenCalledWith(SidebarMode.Open);

      breakpointObserverMock.next(SidebarMode.Closed);
      expect(spy).not.toHaveBeenCalledWith(SidebarMode.Closed);
    });
  });

  describe('handleSidebarMode', () => {
    test('should subscribe to getSidebarMode', () => {
      const spy = spyOn(sidebarService, 'getSidebarMode').and.callThrough();

      component['handleSidebarMode']();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('handleSidebarToggledObservable', () => {
    test('should leave old mode as undefined if it was undefined', () => {
      component.mode = undefined;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toBeUndefined();
    });

    test('should set mode to open when old mode is "Closed"', () => {
      component.mode = SidebarMode.Closed;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toEqual(SidebarMode.Open);
    });

    test('should set mode to open when old mode is "Minified"', () => {
      component.mode = SidebarMode.Minified;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toEqual(SidebarMode.Open);
    });

    test('should set mode to Minified when old mode is "Open" and new is "Open"', () => {
      component.mode = SidebarMode.Open;

      component['handleSidebarToggledObservable'](SidebarMode.Open);

      expect(component.mode).toEqual(SidebarMode.Minified);
    });

    test('should set mode to Minified when old mode is "Open" and new is "Minified"', () => {
      component.mode = SidebarMode.Open;

      component['handleSidebarToggledObservable'](SidebarMode.Minified);

      expect(component.mode).toEqual(SidebarMode.Minified);
    });

    test('should set mode to Closed when old mode is "Open" and new is "Closed"', () => {
      component.mode = SidebarMode.Open;

      component['handleSidebarToggledObservable'](SidebarMode.Closed);

      expect(component.mode).toEqual(SidebarMode.Closed);
    });
  });

  describe('resizeSidebar', () => {
    test('should toggle resizeIcon', () => {
      component.resizeIcon = component.iconEnlarge;

      component.resizeSidebar();

      expect(component.resizeIcon).toEqual(component.iconShrink);

      component.resizeSidebar();

      expect(component.resizeIcon).toEqual(component.iconEnlarge);
    });

    test('should toggle isSidebarExpanded', () => {
      component.isSidebarExpanded = true;

      component.resizeSidebar();

      expect(component.isSidebarExpanded).toBeFalsy();
    });
  });

  describe('closeSidebar', () => {
    test('should close settingsSidebarOpen', () => {
      component.settingsSidebarOpen = true;

      component.closeSidebar();

      expect(component.settingsSidebarOpen).toBeFalsy();
    });
  });
});
