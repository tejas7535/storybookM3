/* eslint-disable @nx/enforce-module-boundaries */
import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsModule,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
import { BannerModule } from '@schaeffler/banner';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { SettingsComponent } from './core/components/settings/settings.component';
import { detectAppDelivery } from './core/helpers/settings-helpers';
import { OneTrustMobileService } from './core/services/tracking/one-trust-mobile.service';
import { MaterialModule } from './shared/material.module';
import { AppDelivery } from './shared/models';

jest.mock('./core/helpers/settings-helpers');
const mockedDetectAppDelivery = jest.mocked(detectAppDelivery, {
  shallow: true,
});

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let onetrustMobileService: OneTrustMobileService;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      MockModule(AppShellModule),
      MockModule(LanguageSelectModule),
      MockModule(BannerModule),
      RouterTestingModule,
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),

      // TOOD: remove when sidebar component has its module
      ReactiveFormsModule,
      MaterialModule,
      ApplicationInsightsModule.forRoot(environment.applicationInsights),
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
    providers: [
      provideMockStore(),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      mockProvider(OneTrustMobileService),
    ],
    declarations: [AppComponent, SettingsComponent],
  });

  beforeEach(() => {
    jest.resetAllMocks();
    mockedDetectAppDelivery.mockImplementation(() => AppDelivery.Embedded);
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    onetrustMobileService = spectator.inject(OneTrustMobileService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set embedded to true if in iframe', () => {
    expect(component.embedded).toBe(true);
  });

  describe('#checkIframe', () => {
    it('should set embedded to true if in iframe', () => {
      mockedDetectAppDelivery.mockImplementation(() => AppDelivery.Embedded);

      component.checkIframe();
      expect(component.embedded).toBe(true);
    });
  });

  describe('#updateFooterLinks', () => {
    it('should contain translated footerLinks', () => {
      mockedDetectAppDelivery.mockImplementation(() => AppDelivery.Standalone);

      const footerLinksResult = component['updateFooterLinks']();

      expect(footerLinksResult).toStrictEqual([
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
        {
          link: `${LegalRoute}/${LegalPath.CookiePath}`,
          title: 'legal.cookiePolicy',
          external: false,
        },
      ]);
    });

    describe('when app delivery is native', () => {
      beforeEach(() => {
        mockedDetectAppDelivery.mockImplementation(() => AppDelivery.Native);
      });

      it('should contain translated footerLinks for native apps excluding standalone cookie path', () => {
        const footerLinksResult = component['updateFooterLinks']();
        expect(footerLinksResult).toStrictEqual([
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
          {
            link: undefined,
            title: 'legal.cookiePolicy',
            external: false,
            onClick: expect.any(Function),
          },
        ]);
      });

      it('should perform onClick action', () => {
        const footerLinks = component['updateFooterLinks']();

        const onClick = footerLinks[3].onClick as (event: MouseEvent) => void;

        const event = {
          preventDefault: jest.fn(),
        } as Partial<MouseEvent> as MouseEvent;

        onClick(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(onetrustMobileService.showPreferenceCenterUI).toHaveBeenCalled();
      });
    });
  });
});
