import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '../../../testing/src';
import { LanguageSelectComponent } from './language-select.component';

describe('LanguageSelectComponent', () => {
  let component: LanguageSelectComponent;
  let spectator: Spectator<LanguageSelectComponent>;
  let translocoService: TranslocoService;

  const windowLocationReloadMock = jest.fn();

  const createComponent = createComponentFactory({
    component: LanguageSelectComponent,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatTooltipModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    translocoService = spectator.inject(TranslocoService);

    delete window.location;
    window.location = { reload: windowLocationReloadMock } as any;
  });

  afterEach(() => {
    windowLocationReloadMock.mockClear();
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onLanguageSelectionChange', () => {
    test('should propagate selected language to transloco service', () => {
      component['transloco'].setActiveLang = jest.fn();

      component.onLanguageSelectionChange('de');

      expect(component['transloco'].setActiveLang).toHaveBeenCalledWith('de');
    });

    test('should refresh page if property is set tru', () => {
      component['transloco'].setActiveLang = jest.fn();
      component.reloadOnLanguageChange = true;

      component.onLanguageSelectionChange('de');

      expect(component['transloco'].setActiveLang).toHaveBeenCalledWith('de');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    test('add a subscribtion that listens to language changes and sets languageSelectControl value', (done) => {
      const mockLanguage = 'xxx';
      const languageSelectControlSpy = jest.spyOn(
        component.languageSelectControl,
        'setValue'
      );
      component.ngOnInit();

      translocoService.setActiveLang(mockLanguage);

      translocoService.langChanges$.subscribe(() => {
        expect(languageSelectControlSpy).toHaveBeenCalledWith(mockLanguage);

        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      const unsubscribeSpy = jest.spyOn(
        component['subscription'],
        'unsubscribe'
      );
      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
