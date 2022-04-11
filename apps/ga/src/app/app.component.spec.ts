import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { setLanguage } from './core/store/actions/settings/settings.actions';
import { LANGUAGE } from './shared/constants';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      RouterTestingModule,
      CoreModule,
      ReactiveComponentModule,
      ReactiveFormsModule,
      MatSelectModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      provideMockStore({}),
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set active language and dispatch', () => {
      component.languageControl.setValue = jest.fn();
      component['translocoService'].getActiveLang = jest.fn(() => 'language');

      component.ngOnInit();

      expect(component.languageControl.setValue).toHaveBeenCalledWith(
        'language'
      );
      expect(component['translocoService'].getActiveLang).toHaveBeenCalled();
    });
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
    it('should call setLanguage dispatch and trackLanguage method', () => {
      const trackLanguageSpy = jest.spyOn(component, 'trackLanguage');
      const mockLanguage = 'Esperanto';

      component.languageControl.setValue(mockLanguage);

      expect(store.dispatch).toHaveBeenCalledWith(
        setLanguage({ language: mockLanguage })
      );
      expect(trackLanguageSpy).toHaveBeenCalledWith(mockLanguage);
    });
  });

  describe('updateFooterLinks', () => {
    it('should contain translated footerLinks', () => {
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
  });

  describe('#trackLanguage', () => {
    it('should call the logEvent method', () => {
      const mockLanguage = 'de';

      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackLanguage(mockLanguage);

      expect(trackingSpy).toHaveBeenCalledWith(LANGUAGE, {
        value: mockLanguage,
      });
    });
  });
});
