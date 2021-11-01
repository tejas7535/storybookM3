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
  let element: HTMLElement;
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
    element = spectator.element;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should set the correct translation key', () => {
    const translationKeyDefault = 'hints.default';
    const translationKeyMissingRoles = 'hints.missingRoles';

    expect(element.innerHTML).toContain(translationKeyDefault);

    component.hintText = 'missingRoles';
    spectator.detectChanges();

    expect(element.innerHTML).toContain(translationKeyMissingRoles);
  });
});
