import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { BreakpointService } from '@schaeffler/responsive';
import { SettingsSidebarModule } from '@schaeffler/settings-sidebar';
import { SidebarModule } from '@schaeffler/sidebar';

import { AppComponent } from './app.component';
import { AuthGuard } from './core/auth.guard';
import { AuthService } from './core/auth.service';
import { LandingModule } from './feature/landing/landing.module';
import { ServiceType } from './shared/result/models';
import { ResultComponent } from './shared/result/result.component';

@Component({ selector: 'sta-result', template: '' })
class ResultStubComponent implements Partial<ResultComponent> {
  tags$: Observable<string[]>;

  @Input() public currentService: ServiceType;
}

export const testRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/overview/overview.module').then(
        (m) => m.OverviewModule
      ),
  },
  {
    path: 'tagging',
    loadChildren: () =>
      import('./feature/auto-tagging/auto-tagging.module').then(
        (m) => m.AutoTaggingModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: AuthService;
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
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
      ],
      declarations: [AppComponent, ResultStubComponent],
      providers: [
        AuthGuard,
        BreakpointService,
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn(),
            hasValidAccessToken: jest.fn(),
            getUserName: jest.fn(),
            configureImplicitFlow: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              firstChild: {
                data: {
                  service: 'tagging',
                },
              },
            },
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
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
      component.addSubscriptions = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.isMobile$).toBeDefined();
      expect(component.isLessThanMedium$).toBeDefined();
      expect(component.isMedium$).toBeDefined();
      expect(component.isDesktop$).toBeDefined();
      expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
  describe('addSubscriptions', () => {
    test('subscribtion should be definied', () => {
      component.addSubscriptions();
      expect(component.subscription).toBeDefined();
    });

    test('should set isHome and settingsSidebarOpen correctly I', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      await router.navigateByUrl('/');

      expect(component.isHome).toBeTruthy();
      expect(component.settingsSidebarOpen).toBeFalsy();
    });

    test('should set isHome and settingsSidebarOpen correctly II', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      await router.navigateByUrl('/overview');

      expect(component.isHome).toBeFalsy();
      expect(component.settingsSidebarOpen).toBeTruthy();
    });

    test('should set isSideBarExpanded to true when translation and Desktop', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      component.isDesktop = true;
      await router.navigateByUrl(component.translationRoute);

      expect(component.isSidebarExpanded).toBeTruthy();
      expect(component.currentRoute).toEqual(component.translationRoute);
    });

    test('should set isSideBarExpanded to false when not translation and Desktop', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      component.isDesktop = true;
      await router.navigateByUrl('/tagging');

      expect(component.isSidebarExpanded).toBeFalsy();
    });

    test('should set isSideBarExpanded to false when translation and not Desktop', async () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      component.isDesktop = false;
      await router.navigateByUrl(component.translationRoute);

      expect(component.isSidebarExpanded).toBeFalsy();
      expect(component.currentRoute).toEqual(component.translationRoute);
    });

    test('should set isSideBarExpanded to true when isDesktop and currentRoute equals translation ', () => {
      component.isDesktop$ = of(true);
      component.currentRoute = component.translationRoute;

      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      expect(component.isSidebarExpanded).toBeTruthy();
      expect(component.isDesktop).toBeTruthy();
    });

    test('should set isSideBarExpanded to false when !isDesktop and currentRoute equals translation ', () => {
      component.isDesktop$ = of(false);
      component.currentRoute = component.translationRoute;

      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      expect(component.isSidebarExpanded).toBeFalsy();
      expect(component.isDesktop).toBeFalsy();
    });

    test('should set isSideBarExpanded to false when isDesktop and currentRoute not equals translation ', () => {
      component.isDesktop$ = of(true);
      component.currentRoute = '/tagging';

      // tslint:disable-next-line: no-lifecycle-call
      component.addSubscriptions();

      expect(component.isSidebarExpanded).toBeFalsy();
      expect(component.isDesktop).toBeTruthy();
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
