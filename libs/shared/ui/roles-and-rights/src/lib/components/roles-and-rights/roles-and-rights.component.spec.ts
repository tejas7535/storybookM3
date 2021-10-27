import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { RolesAndRightsModule } from '../../roles-and-rights.module';
import { RolesAndRightsComponent } from './roles-and-rights.component';
import * as en from '../../i18n/en.json';

describe('RolesAndRightsComponent', () => {
  let spectator: Spectator<RolesAndRightsComponent>;
  let component: RolesAndRightsComponent;

  const createComponent = createComponentFactory({
    component: RolesAndRightsComponent,
    imports: [
      RolesAndRightsModule,
      provideTranslocoTestingModule({ 'forbidden/en': en }),
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    it('should define the properties', () => {
      expect(component.headingText).toBeUndefined();
      expect(component.rolesGroups).toBeUndefined();
      expect(component.roles).toBeUndefined();
    });
  });
});
