import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared.module';
import { LanguageSettingComponent } from './language-setting.component';

describe('LanguageSettingComponent', () => {
  let component: LanguageSettingComponent;
  let spectator: Spectator<LanguageSettingComponent>;

  const createComponent = createComponentFactory({
    component: LanguageSettingComponent,
    imports: [
      SharedModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setLanguage', () => {
    test('should propagate selected language to transloco service', () => {
      component['transloco'].setActiveLang = jest.fn();
      delete window.location;
      window.location = { reload: jest.fn() } as any;

      component.setLanguage('de');

      expect(component['transloco'].setActiveLang).toHaveBeenCalledWith('de');
      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
