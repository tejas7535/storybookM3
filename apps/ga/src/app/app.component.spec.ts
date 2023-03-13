import { Meta, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockModule } from 'ng-mocks';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsService,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
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

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      RouterTestingModule,
      PushModule,
      MockModule(CoreModule),
      MockModule(AppShellModule),
      MockModule(UserSettingsModule),
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

        expect(translocoService.translate).toHaveBeenCalledTimes(13);
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
