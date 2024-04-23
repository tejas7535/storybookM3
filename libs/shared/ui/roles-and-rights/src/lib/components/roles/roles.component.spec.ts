import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RolesAndRightsModule } from '../../roles-and-rights.module';
import { RolesComponent } from './roles.component';

describe('RolesComponent', () => {
  let spectator: Spectator<RolesComponent>;
  let component: RolesComponent;

  const createComponent = createComponentFactory({
    component: RolesComponent,
    imports: [RolesAndRightsModule, provideTranslocoTestingModule({ en: {} })],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    it('should define the properties', () => {
      expect(component.roles).toBeUndefined();
    });
  });
});
