/* eslint-disable @nx/enforce-module-boundaries */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Meta } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  NavigationEnd,
  NavigationSkipped,
  provideRouter,
  Router,
} from '@angular/router';

import { firstValueFrom, of, Subject } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';

import { AppShellModule } from '@schaeffler/app-shell';
import { BannerModule } from '@schaeffler/banner';
import {
  DEFAULT_ASSETS_PATH,
  EA_CAPACITOR,
  EaDeliveryService,
  EaEmbeddedService,
} from '@schaeffler/engineering-apps-behaviors/utils';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { AppComponent } from './app.component';
import { SettingsComponent } from './core/components/settings/settings.component';
import { MMSeparator } from './core/services';
import { OneTrustMobileService } from './core/services/tracking/one-trust-mobile.service';
import { CalculationSelectionFacade } from './core/store/facades/calculation-selection/calculation-selection.facade';
import { GlobalFacade } from './core/store/facades/global/global.facade';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let meta: Meta;
  let globalFacade: GlobalFacade;
  let router: Router;

  let routerEventsMock: Subject<any>;
  const mockFn = jest.fn();

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      MockModule(AppShellModule),
      MockModule(LanguageSelectModule),
      MockModule(BannerModule),
      MockModule(MatSlideToggleModule),
      MockModule(MatSidenavModule),
      MockModule(MatIconModule),
      MockComponent(SettingsComponent),
      MatIconTestingModule,
      PushPipe,
    ],
    providers: [
      {
        provide: GlobalFacade,
        useValue: {
          isBannerOpened$: of(true),
          isInitialized$: of(true),
          initGlobal: jest.fn(),
        },
      },
      {
        provide: CalculationSelectionFacade,
        useValue: {
          setCurrentStep: jest.fn(),
        },
      },
      mockProvider(OneTrustMobileService),
      provideRouter([]),
      {
        provide: Router,
        useFactory: () => {
          routerEventsMock = new Subject<any>();

          return {
            events: routerEventsMock,
            // eslint-disable-next-line unicorn/no-null
            getCurrentNavigation: jest.fn((): any => null),
            // eslint-disable-next-line unicorn/no-null
            lastSuccessfulNavigation: null as any,
            initialNavigation: jest.fn(),
          };
        },
      },
      {
        provide: OneTrustMobileService,
        useValue: {
          showPreferenceCenterUI: mockFn,
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          selectTranslate: (input: string) => of(input),
          translate: jest.fn(),
          setActiveLang: jest.fn(),
          getDefaultLang: jest.fn(() => 'en'),
        },
      },
      MockProvider(EA_CAPACITOR),
      MockProvider(DEFAULT_ASSETS_PATH, '/base/assets/'),
      EaDeliveryService,
      EaEmbeddedService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [AppComponent],
    detectChanges: false,
  });

  describe('inputs', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      spectator = createComponent({
        props: {
          bearing: '6226',
          separator: MMSeparator.Comma,
          language: 'en',
          userTier: 'anonymous',
        },
      });
      component = spectator.debugElement.componentInstance;
      meta = spectator.inject(Meta);
      router = spectator.inject(Router);
      globalFacade = spectator.inject(GlobalFacade);
    });

    it('should create the app component with correct inputs', () => {
      expect(component).toBeTruthy();

      expect(component.bearing()).toEqual('6226');
      expect(component.separator()).toEqual(MMSeparator.Comma);
      expect(component.language()).toEqual('en');
      expect(component.userTier()).toEqual('anonymous');
    });
  });

  describe('no inputs', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      spectator = createComponent();
      component = spectator.debugElement.componentInstance;
      meta = spectator.inject(Meta);
      router = spectator.inject(Router);
      globalFacade = spectator.inject(GlobalFacade);
    });

    it('should create the app component', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
      it('should call update meta tags if the app is standalone', () => {
        meta.addTags = jest.fn();

        component.ngOnInit();

        expect(meta.addTags).toHaveBeenCalled();
      });

      it('should call init global on navigation end for standalone version', () => {
        component.ngOnInit();

        routerEventsMock.next(new NavigationEnd(1, '', ''));

        expect(globalFacade.initGlobal).toHaveBeenCalled();
      });

      it('should call initial navigation if standalone', () => {
        component.ngOnInit();

        expect(router.initialNavigation).toHaveBeenCalled();
      });

      describe('not standalone', () => {
        beforeEach(() => {
          jest.spyOn(component, 'isStandalone').mockReturnValue(false);
        });

        it('should call init global immediately for non standalone version', () => {
          component.ngOnInit();

          expect(globalFacade.initGlobal).toHaveBeenCalled();
        });

        it('should replace the state and subscribe to navigation skipped', () => {
          component.ngOnInit();

          expect(history.state).toEqual({ step: 0 });

          const event = new NavigationSkipped(1, '', '');

          routerEventsMock.next(event);

          expect(
            component['calculationSelectionFacade'].setCurrentStep
          ).toHaveBeenCalledWith(0, true);
        });
      });
    });

    describe('ngOnDestroy', () => {
      it('should complete destroy$', () => {
        component['destroy$'].next = jest.fn();
        component['destroy$'].complete = jest.fn();

        spectator.detectChanges();
        component.ngOnDestroy();

        expect(component['destroy$'].next).toHaveBeenCalled();
        expect(component['destroy$'].complete).toHaveBeenCalled();
      });
    });

    describe('getFooterLinks', () => {
      it('should return the footer links for native', waitForAsync(async () => {
        const result = await firstValueFrom(component['footerLinks$']);
        expect(result).toMatchSnapshot();
      }));

      it('should return the footer links for embedded', waitForAsync(async () => {
        const result = await firstValueFrom(component['footerLinks$']);
        expect(result).toMatchSnapshot();
      }));
    });

    it('makeMetaTags should return the properly formatted tags', () => {
      const returnValue = component['makeMetaTags']('title', 'description');
      expect(returnValue.length).toEqual(6);
      expect(returnValue).toMatchSnapshot();
    });
  });
});
