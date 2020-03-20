import { Observable, Subscriber } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, Routes } from '@angular/router';
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

import { LandingModule } from './feature/landing/landing.module';

import { AppComponent } from './app.component';
import { ResultComponent } from './shared/result/result.component';

import { AuthService } from './core/auth.service';

import { AuthGuard } from './core/auth.guard';
import { ServiceType } from './shared/result/models';

@Component({ selector: 'sta-result', template: '' })
class ResultStubComponent implements Partial<ResultComponent> {
  tags$: Observable<string[]>;

  @Input() public currentService: ServiceType;
}

export const testRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/overview/overview.module').then(m => m.OverviewModule)
  },
  {
    path: 'tagging',
    loadChildren: () =>
      import('./feature/auto-tagging/auto-tagging.module').then(
        m => m.AutoTaggingModule
      )
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(m => m.PageNotFoundModule)
  }
];

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: AuthService;
  let sidebarService: SidebarService;
  let breakpointObserverMock: Subscriber<any>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FooterModule,
        HeaderModule,
        HttpClientTestingModule,
        LandingModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule.withRoutes(testRoutes),
        SettingsSidebarModule,
        SidebarModule,
        NoopAnimationsModule
      ],
      declarations: [AppComponent, ResultStubComponent],
      providers: [
        AuthGuard,
        BreakpointService,
        SidebarService,
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn(),
            hasValidAccessToken: jest.fn(),
            getUserName: jest.fn(),
            configureImplicitFlow: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              firstChild: {
                data: {
                  service: 'tagging'
                }
              }
            }
          }
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(AuthService);
    sidebarService = TestBed.inject(SidebarService);
    router = TestBed.inject(Router);

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
    expect(service.configureImplicitFlow).toHaveBeenCalled();
  });

  test(`should have as title 'STA - Schaeffler Text Assistant'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('STA - Schaeffler Text Assistant');
  });

  describe('ngOnInit()', () => {
    test('should set Observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.subscription).toBeDefined();
      expect(component.isMobile$).toBeDefined();
      expect(component.isLessThanMedium$).toBeDefined();
      expect(component.isMedium$).toBeDefined();
    });

    test('should call handleSidebarToggledObservable on change', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      component['handleSidebarToggledObservable'] = jest.fn();

      component['sidebarToggled'].next(SidebarMode.Minified);

      expect(component['handleSidebarToggledObservable']).toHaveBeenCalledWith(
        SidebarMode.Minified
      );
    });

    test('should set isHome and settingsSidebarOpen correctly I', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      await router.navigateByUrl('/');

      expect(component.isHome).toBeTruthy();
      expect(component.settingsSidebarOpen).toBeFalsy();
    });

    test('should set isHome and settingsSidebarOpen correctly II', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      await router.navigateByUrl('/overview');

      expect(component.isHome).toBeFalsy();
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

    test('should do nothing when called with undefined mode', () => {
      component.mode = undefined;

      component['handleSidebarToggledObservable'](undefined);

      expect(component.mode).toBeUndefined();
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
