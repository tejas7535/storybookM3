import { CommonModule } from '@angular/common';
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

import { provideTranslocoTestingModule } from '../../../testing/src';
import { LocaleSelectComponent } from './locale-select.component';

describe('LocaleSelectComponent', () => {
  let component: LocaleSelectComponent;
  let spectator: Spectator<LocaleSelectComponent>;

  const windowLocationReloadMock = jest.fn();

  const createComponent = createComponentFactory({
    component: LocaleSelectComponent,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MockModule(MatFormFieldModule),
      MockModule(MatIconModule),
      MockModule(MatSelectModule),
      MockModule(MatTooltipModule),
      provideTranslocoTestingModule({ en: {} }),
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

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onLocaleSelectionChange', () => {
    test('should propagate selected locale to transloco service', () => {
      component['localeService'].setLocale = jest.fn();

      component.onLocaleSelectionChange('de-DE');

      expect(component['localeService'].setLocale).toHaveBeenCalledWith(
        'de-DE'
      );
    });

    test('should refresh page if property is set tru', () => {
      component['localeService'].setLocale = jest.fn();
      component.reloadOnLocaleChange = true;

      component.onLocaleSelectionChange('de-DE');

      expect(component['localeService'].setLocale).toHaveBeenCalledWith(
        'de-DE'
      );
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
