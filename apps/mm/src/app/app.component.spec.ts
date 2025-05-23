/* eslint-disable @nx/enforce-module-boundaries */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Meta } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, provideRouter, Router } from '@angular/router';

import { of, Subject } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockComponent, MockModule } from 'ng-mocks';

import { AppShellFooterLink, AppShellModule } from '@schaeffler/app-shell';
import { BannerModule } from '@schaeffler/banner';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';
import { SettingsComponent } from './core/components/settings/settings.component';
import { OneTrustMobileService } from './core/services/tracking/one-trust-mobile.service';
import { GlobalFacade } from './core/store/facades/global/global.facade';
import { AppDelivery } from './shared/models';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let meta: Meta;
  let globalFacade: GlobalFacade;
  let router: Router;
  let translocoService: TranslocoService;

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
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: GlobalFacade,
        useValue: {
          isBannerOpened$: of(true),
          appDelivery$: of(AppDelivery.Embedded),
          isInitialized$: of(true),
          isStandalone$: of(false),
          initGlobal: jest.fn(),
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
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [AppComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    jest.resetAllMocks();
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    meta = spectator.inject(Meta);
    router = spectator.inject(Router);
    globalFacade = spectator.inject(GlobalFacade);
    translocoService = spectator.inject(TranslocoService);

    translocoService.translate = jest.fn((key: string) => key) as any;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set meta tags', () => {
      meta.addTags = jest.fn();

      spectator.detectChanges();
      component.ngOnInit();

      expect(meta.addTags).toHaveBeenCalledWith(component['metaTags']);
    });

    it('should call init global on navigation end', () => {
      spectator.detectChanges();
      component.ngOnInit();

      routerEventsMock.next(new NavigationEnd(1, '', ''));

      expect(globalFacade.initGlobal).toHaveBeenCalled();
    });

    it('should populate the footerLinks', () => {
      component.footerLinks$.next = jest.fn();
      component['getFooterLinks'] = jest.fn((): any[] => []);

      spectator.detectChanges();
      component.ngOnInit();

      expect(component.footerLinks$.next).toHaveBeenCalledWith([]);
      expect(component['getFooterLinks']).toHaveBeenCalledWith(
        AppDelivery.Embedded
      );
    });

    it('should call initial navigation', () => {
      spectator.detectChanges();
      component.ngOnInit();

      expect(router.initialNavigation).toHaveBeenCalled();
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
    const defaultLinks: AppShellFooterLink[] = [
      {
        link: `${LegalRoute}/${LegalPath.ImprintPath}`,
        title: 'legal.imprint',
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
        title: 'legal.dataPrivacy',
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.TermsPath}`,
        title: 'legal.termsOfUse',
        external: false,
      },
    ];

    const nativeLink: AppShellFooterLink = {
      link: undefined,
      title: 'legal.cookiePolicy',
      external: false,
      onClick: ($event: MouseEvent) => {
        $event.preventDefault();
        mockFn();
      },
    };

    const embeddedLink: AppShellFooterLink = {
      link: `${LegalRoute}/${LegalPath.CookiePath}`,
      title: 'legal.cookiePolicy',
      external: false,
    };

    it('should return the footer links for native', () => {
      const appDelivery = AppDelivery.Native;

      const result = component['getFooterLinks'](appDelivery);

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify([...defaultLinks, nativeLink])
      );
    });

    it('native cookie link should open ot preference center ui', () => {
      const appDelivery = AppDelivery.Native;

      const result = component['getFooterLinks'](appDelivery);

      const mockEvent = {
        preventDefault: jest.fn(),
      };

      result.at(-1)?.onClick(mockEvent as unknown as MouseEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalled();
    });

    it('should return the footer links for embedded', () => {
      const appDelivery = AppDelivery.Embedded;

      const result = component['getFooterLinks'](appDelivery);

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify([...defaultLinks, embeddedLink])
      );
    });
  });
});
