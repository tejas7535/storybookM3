import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { SharedModule } from '../../shared.module';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    providers: [
      mockProvider(TranslocoService),
      mockProvider(TranslocoLocaleService),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    imports: [
      SharedModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLanguageSelectionChange', () => {
    it('should propagate selected language to transloco service', () => {
      component['transloco'].setActiveLang = jest.fn();

      component.onLanguageSelectionChange('de');

      expect(component['transloco'].setActiveLang).toHaveBeenCalledWith('de');
    });
  });

  describe('onLocaleSelectionChange', () => {
    it('should propagate selected language to transloco service', () => {
      component['localeService'].setLocale = jest.fn();

      component.onLocaleSelectionChange('de-DE');

      expect(component['localeService'].setLocale).toHaveBeenCalledWith(
        'de-DE'
      );
    });
  });
});
