import { Meta, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
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
import { UserSettingsModule } from './shared/components/user-settings';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let translocoService: TranslocoService;
  let applicationInsightsService: ApplicationInsightsService;
  let metaService: Meta;
  let titleService: Title;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      RouterTestingModule,
      PushModule,
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
      provideMockStore({}),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
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
    store = spectator.inject(MockStore);

    metaService = spectator.inject(Meta);
    titleService = spectator.inject(Title);
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

  describe('openBanner', () => {
    it('should open the banner between 26.9 and 07.10.', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2022-09-27'));
      const banner = {
        text: translate('banner.bannerText'),
        icon: 'warning',
        buttonText: translate('banner.buttonText'),
        truncateSize: 0,
        type: '[Banner] Open Banner',
      };
      store.dispatch = jest.fn();

      component.openBanner();

      expect(store.dispatch).toHaveBeenCalledWith(banner);
      jest.useRealTimers();
    });

    it('should mot open the banner after the slot between 26.9 and 07.10.', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2022-10-10'));

      store.dispatch = jest.fn();

      component.openBanner();

      expect(store.dispatch).toBeCalledTimes(0);
      jest.useRealTimers();
    });
  });

  describe('languageChanges', () => {
    it('should call setLanguage dispatch and trackLanguage method', (done) => {
      translocoService.getActiveLang = jest.fn(() => 'es');
      translocoService.translate = jest.fn();
      metaService.updateTag = jest.fn();
      titleService.setTitle = jest.fn();

      component.ngOnInit();

      translocoService.langChanges$.subscribe((language) => {
        expect(language).toBe('de');
        expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
          '[Language]',
          { value: 'de' }
        );

        expect(translocoService.translate).toHaveBeenCalledTimes(15); // called two times more with the banner
        expect(metaService.updateTag).toHaveBeenCalledTimes(12);
        expect(titleService.setTitle).toHaveBeenCalledTimes(2);

        done();
      });
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
});
