import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MockModule } from 'ng-mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RoleDescriptionsModule } from '../role-descriptions.module';
import { RoleDescriptionsDialogComponent } from './role-descriptions-dialog.component';

describe('RoleDescriptionsDialogComponent', () => {
  let component: RoleDescriptionsDialogComponent;
  let spectator: Spectator<RoleDescriptionsDialogComponent>;

  const createComponent = createComponentFactory({
    component: RoleDescriptionsDialogComponent,
    imports: [
      MatDialogModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(RolesAndRightsModule),
      MockModule(RoleDescriptionsModule),
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

  test('should be created', () => {
    expect(component).toBeTruthy();
  });
});
