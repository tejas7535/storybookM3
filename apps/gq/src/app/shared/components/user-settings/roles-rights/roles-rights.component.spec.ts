import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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
      ReactiveComponentModule,
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
  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
