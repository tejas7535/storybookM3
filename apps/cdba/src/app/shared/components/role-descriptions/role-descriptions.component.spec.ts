import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';

import { ROLES_STATE_MOCK } from '@cdba/testing/mocks/state/roles-state.mock';

import { RoleDescriptionsComponent } from './role-descriptions.component';

describe('RoleDescriptionsComponent', () => {
  let component: RoleDescriptionsComponent;
  let spectator: Spectator<RoleDescriptionsComponent>;

  const createComponent = createComponentFactory({
    component: RoleDescriptionsComponent,
    imports: [
      CommonModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(RolesAndRightsModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          roles: ROLES_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
