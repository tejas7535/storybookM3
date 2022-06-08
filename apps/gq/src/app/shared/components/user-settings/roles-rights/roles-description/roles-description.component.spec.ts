import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RolesRightsComponent } from '../roles-rights.component';
import { RolesDescriptionComponent } from './roles-description.component';
import { RolesDescriptionModule } from './roles-description.module';

describe('RolesDescriptionComponent', () => {
  let component: RolesDescriptionComponent;
  let spectator: Spectator<RolesRightsComponent>;

  const createComponent = createComponentFactory({
    component: RolesRightsComponent,
    imports: [
      MatExpansionModule,
      provideTranslocoTestingModule({ en: {} }),
      RolesDescriptionModule,
      PushModule,
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
