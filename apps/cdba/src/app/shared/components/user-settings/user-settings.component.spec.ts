import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { MockModule } from 'ng-mocks';

import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;

  const windowLocationReloadMock = jest.fn();

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    imports: [
      ReactiveFormsModule,
      MockModule(MatFormFieldModule),
      MockModule(MatIconModule),
      MockModule(MatSelectModule),
      MockModule(MatTooltipModule),
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LanguageSelectModule),
    ],
    providers: [
      mockProvider(TranslocoLocaleService),
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
