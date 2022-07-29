import { MatDividerModule } from '@angular/material/divider';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MeasurementUnitsSelectComponent } from '@ga/shared/components/measurement-units-select/index';

import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    imports: [
      MockModule(MatDividerModule),
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LanguageSelectModule),
      MockModule(LocaleSelectModule),
      MeasurementUnitsSelectComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });
});
