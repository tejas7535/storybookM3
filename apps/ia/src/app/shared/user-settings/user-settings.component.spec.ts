import { ReactiveFormsModule } from '@angular/forms';
import {
  MATERIAL_SANITY_CHECKS,
  MatOptionModule,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Language } from './models/language.model';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;
  let transloco: TranslocoService;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    imports: [
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSelectModule,
      MatOptionModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    transloco = spectator.inject(TranslocoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should get avaibalbe languages', () => {
      const availableLanguages = [
        new Language('en', 'English'),
        new Language('es', 'Espanol'),
      ];
      transloco.getAvailableLangs = jest
        .fn()
        .mockReturnValue(availableLanguages);

      component.ngOnInit();

      expect(transloco.getAvailableLangs).toHaveBeenCalled();
      expect(component.availableLanguages).toEqual(availableLanguages);
    });

    test('should create form control', () => {
      const activeLanguge = 'es';
      component.languageSelectControl = undefined;
      transloco.getActiveLang = jest.fn().mockReturnValue(activeLanguge);

      component.ngOnInit();

      expect(component.languageSelectControl).toBeDefined();
      expect(component.languageSelectControl.value).toEqual(activeLanguge);
      expect(transloco.getActiveLang).toHaveBeenCalled();
    });
  });
});
