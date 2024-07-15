import { Meta, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, ReplaySubject } from 'rxjs';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { MockModule } from 'ng-mocks';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsService,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
import { BannerModule } from '@schaeffler/banner';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SettingsFacade, StorageMessagesActions } from './core/store';
import { UserSettingsModule } from './shared/components/user-settings';
import { PartnerVersion } from './shared/models';
import { AppAnalyticsService } from './shared/services/app-analytics-service/app-analytics-service';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let translocoService: TranslocoService;
  let applicationInsightsService: ApplicationInsightsService;
  let appAnalyticsService: AppAnalyticsService;
  let metaService: Meta;
  let titleService: Title;
  let store: Store;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerMock = {
    navigate: jest.fn(),
    events: eventSubject.asObservable(),
    url: 'testApp/url',
  };

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      RouterTestingModule,
      PushPipe,
      LetDirective,
      MockModule(CoreModule),
      MockModule(AppShellModule),
      MockModule(UserSettingsModule),
      MockModule(BannerModule),
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
    providers: [
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
          addCustomPropertyToTelemetryData: jest.fn(),
        },
      },
      {
        provide: Router,
        useValue: routerMock,
      },
      {
        provide: SettingsFacade,
        useValue: {
          partnerVersion$: of(undefined),
          internalUser$: of(true),
        },
      },
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    translocoService = spectator.inject(TranslocoService);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
    appAnalyticsService = spectator.inject(AppAnalyticsService);

    metaService = spectator.inject(Meta);
    titleService = spectator.inject(Title);
    store = spectator.inject(Store);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$', () => {
      component.destroy$.next = jest.fn();
      component.destroy$.complete = jest.fn();

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('partnerVersion', () => {
    it('should set the partner version telemetry data and call assignPartnerVersionTheme with undefined', () => {
      component['assignPartnerVersionTheme'] = jest.fn();

      component.ngOnInit();

      expect(
        applicationInsightsService.addCustomPropertyToTelemetryData
      ).toHaveBeenCalledWith('partnerVersion', undefined);
      expect(component['assignPartnerVersionTheme']).toHaveBeenCalledWith(
        undefined
      );
    });

    it('should set the partner version telemetry data and call assignPartnerVersionTheme with partnerVersion', () => {
      component['assignPartnerVersionTheme'] = jest.fn();

      component.partnerVersion$ = of(PartnerVersion.Schmeckthal);
      component.ngOnInit();

      expect(
        applicationInsightsService.addCustomPropertyToTelemetryData
      ).toHaveBeenCalledWith('partnerVersion', PartnerVersion.Schmeckthal);
      expect(component['assignPartnerVersionTheme']).toHaveBeenCalledWith(
        PartnerVersion.Schmeckthal
      );
    });
  });

  describe('internalUser', () => {
    it('should set the internaluser value in the telemetry data', () => {
      component.ngOnInit();

      expect(
        applicationInsightsService.addCustomPropertyToTelemetryData
      ).toHaveBeenCalledWith('internalUser', 'true');
    });
  });

  describe('languageChanges', () => {
    it('should call setLanguage dispatch and trackLanguage method', (done) => {
      translocoService.getActiveLang = jest.fn(() => 'es');
      translocoService.translate = jest.fn();
      metaService.updateTag = jest.fn();
      titleService.setTitle = jest.fn();
      store.dispatch = jest.fn();

      component.ngOnInit();

      translocoService.langChanges$.subscribe((language) => {
        expect(language).toBe('de');
        expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
          '[Language]',
          { value: 'de' }
        );

        expect(translocoService.translate).toHaveBeenCalledTimes(13);
        expect(metaService.updateTag).toHaveBeenCalledTimes(12);
        expect(titleService.setTitle).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(
          StorageMessagesActions.getStorageMessage()
        );

        done();
      });
    });
  });

  describe('routing changes', () => {
    let trackingSpy: jest.SpyInstance;
    beforeEach(() => {
      trackingSpy = jest.spyOn(
        component['appAnalyticsService'],
        'logNavigationEvent'
      );
    });

    describe('when application is of embedded or mobile type', () => {
      beforeEach(() => {
        appAnalyticsService.shouldLogEvents = jest.fn(() => true);

        component.ngOnInit();
      });

      it('should log navigation event', () => {
        eventSubject.next(new NavigationEnd(1, 'myTestUrl', 'redirectPath'));

        expect(trackingSpy).toHaveBeenCalledWith('myTestUrl');
      });
    });

    describe('when application is not embedded or mobile type', () => {
      beforeEach(() => {
        appAnalyticsService.shouldLogEvents = jest.fn(() => false);

        component.ngOnInit();
      });

      it('should not log anything', () => {
        eventSubject.next(new NavigationEnd(1, 'myTestUrl', 'redirectPath'));

        expect(trackingSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('getPartnerVersionLogoUrl', () => {
    it('should return a logo url with the given partner version', () => {
      const url = component.getPartnerVersionLogoUrl('test');

      expect(url).toEqual('/assets/images/partner-version-logos/test.png');
    });
  });

  describe('assignFooterLinks', () => {
    it('should initially set translated footerLinks', () => {
      window.origin = 'localhost://';

      component['assignFooterLinks']();

      expect(component.footerLinks).toStrictEqual([
        {
          link: `${LegalRoute}/${LegalPath.ImprintPath}`,
          title: 'de.legal.imprint',
          external: false,
        },
        {
          link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
          title: 'de.legal.dataPrivacy',
          external: false,
        },
        {
          link: `${LegalRoute}/${LegalPath.TermsPath}`,
          title: 'de.legal.termsOfUse',
          external: false,
        },
        {
          link: `${LegalRoute}/${LegalPath.CookiePath}`,
          title: 'de.legal.cookiePolicy',
          external: false,
        },
      ]);
    });

    it('should contain translated footerLinks for capacitor android app', () => {
      window.origin = 'http://localhost';

      component['assignFooterLinks']();

      expect(component.footerLinks).toStrictEqual([
        {
          link: `${LegalRoute}/${LegalPath.ImprintPath}`,
          title: 'de.legal.imprint',
          external: false,
        },
        {
          link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
          title: 'de.legal.dataPrivacy',
          external: false,
        },
        {
          link: `${LegalRoute}/${LegalPath.TermsPath}`,
          title: 'de.legal.termsOfUse',
          external: false,
        },
      ]);
    });

    it('should contain translated footerLinks for capacitor ios app', () => {
      window.origin = 'capacitor://';

      component['assignFooterLinks']();

      expect(component.footerLinks).toStrictEqual([
        {
          link: `${LegalRoute}/${LegalPath.ImprintPath}`,
          title: 'de.legal.imprint',
          external: false,
        },
        {
          link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
          title: 'de.legal.dataPrivacy',
          external: false,
        },
        {
          link: `${LegalRoute}/${LegalPath.TermsPath}`,
          title: 'de.legal.termsOfUse',
          external: false,
        },
      ]);
    });
  });

  describe('assignPartnerVersionTheme', () => {
    let addSpy: jest.SpyInstance;
    let removeSpy: jest.SpyInstance;

    const partnerVersionValues = Object.values(PartnerVersion).map(
      (value: string) => `partner-version-${value}`
    );

    beforeEach(() => {
      addSpy = jest.spyOn(
        component['document'].documentElement.classList,
        'add'
      );
      removeSpy = jest.spyOn(
        component['document'].documentElement.classList,
        'remove'
      );
    });

    it('should remove partner-version classes from the root if no partner version is set', () => {
      component['assignPartnerVersionTheme'](undefined);

      expect(removeSpy).toHaveBeenCalledWith(
        'partner-version',
        ...partnerVersionValues
      );
      expect(addSpy).not.toHaveBeenCalled();
    });

    it('should remove all partner-version classes and add the ones for the set partner version', () => {
      for (const partnerVersion of Object.values(PartnerVersion)) {
        component['assignPartnerVersionTheme'](partnerVersion);

        expect(removeSpy).toHaveBeenCalledWith(
          'partner-version',
          ...partnerVersionValues
        );
        expect(addSpy).toHaveBeenCalledWith(
          'partner-version',
          `partner-version-${partnerVersion}`
        );
      }
    });
  });
});
