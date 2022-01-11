import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AUTH_STATE_MOCK } from '../../../../testing/mocks';
import { RolesRightsModule } from './roles-rights/roles-rights.module';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    imports: [
      LanguageSelectModule,
      RolesRightsModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
