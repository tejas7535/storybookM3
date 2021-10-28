import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared.module';
import { UserSettingsComponent } from './user-settings.component';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;

  const windowLocationReloadMock = jest.fn();

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    imports: [
      SharedModule,
      SharedTranslocoModule,
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

    delete window.location;
    window.location = { reload: windowLocationReloadMock } as any;
  });

  afterEach(() => {
    windowLocationReloadMock.mockClear();
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
