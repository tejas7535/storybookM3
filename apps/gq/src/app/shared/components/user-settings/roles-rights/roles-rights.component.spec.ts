import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RolesDescriptionModule } from './roles-description/roles-description.module';
import { RolesRightsComponent } from './roles-rights.component';

describe('RolesRightsComponent', () => {
  let component: RolesRightsComponent;
  let spectator: Spectator<RolesRightsComponent>;

  const createComponent = createComponentFactory({
    component: RolesRightsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      RolesDescriptionModule,
      PushPipe,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          'azure-auth': {},
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
