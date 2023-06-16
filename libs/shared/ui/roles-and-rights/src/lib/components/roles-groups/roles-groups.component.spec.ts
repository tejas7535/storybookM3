import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RolesAndRightsModule } from '../../roles-and-rights.module';
import { RolesGroupsComponent } from './roles-groups.component';

describe('RolesGroupsComponent', () => {
  let spectator: Spectator<RolesGroupsComponent>;
  let component: RolesGroupsComponent;

  const createComponent = createComponentFactory({
    component: RolesGroupsComponent,
    imports: [RolesAndRightsModule],
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
      expect(component.rolesGroups).toBeUndefined();
    });
  });
});
