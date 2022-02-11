import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { AppShellModule } from '@schaeffler/app-shell';
import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { SettingsComponent } from './core/components/settings/settings.component';
import { MaterialModule } from './shared/material.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      AppShellModule,
      RouterTestingModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: environment.oneTrustId,
      }),

      // TOOD: remove when sidebar component has its module
      ReactiveFormsModule,
      MaterialModule,
    ],
    providers: [
      provideMockStore(),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [AppComponent, SettingsComponent],
  });

  beforeEach(() => {
    window.origin = 'localhost://';

    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('#checkIframe', () => {
    it('should set embedded to true if in iframe', () => {
      Object.defineProperty(global, 'window', {
        value: {
          self: 'mockValue',
          top: 'otherMockValue',
        },
      });

      component.checkIframe();
      expect(component.embedded).toBe(true);
    });
  });

  describe('#updateFooterLinks', () => {
    it('should contain translated footerLinks', () => {
      window.origin = 'localhost://';

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

    it('should contain translated footerLinks for capacitor android app', () => {
      window.origin = 'http://localhost';
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
      ]);
    });

    it('should contain translated footerLinks for capacitor ios app', () => {
      window.origin = 'capacitor://';

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
      ]);
    });
  });
});
