import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';

import { initialState } from '@cdba/core/store/reducers/roles/roles.reducer';
import {
  ROLES_STATE_ERROR_MOCK,
  ROLES_STATE_SUCCESS_MOCK,
  PRODUCT_LINE_ROLE_DESCRIPTION_MOCK,
  SUB_REGION_ROLE_DESCRIPTION_MOCK,
} from '@cdba/testing/mocks';

import { RoleDescriptionsComponent } from './role-descriptions.component';

describe('RoleDescriptionsComponent', () => {
  let component: RoleDescriptionsComponent;
  let element: HTMLElement;
  let spectator: Spectator<RoleDescriptionsComponent>;
  let store: MockStore;

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
          roles: initialState,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    element = spectator.element;
    store = spectator.inject(MockStore);
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should provide rolesGroups if data is available', () => {
      store.setState({ roles: ROLES_STATE_SUCCESS_MOCK });

      expect(component.rolesGroups.length).toBe(2);

      expect(component.rolesGroups[0].title).toBe(
        'roles.descriptions.productLines'
      );
      expect(component.rolesGroups[0].roles[0].rights).toBe(
        PRODUCT_LINE_ROLE_DESCRIPTION_MOCK.description
      );

      expect(component.rolesGroups[1].title).toBe(
        'roles.descriptions.subRegions'
      );
      expect(component.rolesGroups[1].roles[0].rights).toBe(
        SUB_REGION_ROLE_DESCRIPTION_MOCK.description
      );
    });

    test('should handle unavailable role description data', () => {
      store.setState({ roles: ROLES_STATE_ERROR_MOCK });

      expect(component.rolesGroups.length).toBe(0);
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
  describe('ngOnDestroy', () => {
    test('should unsubscribe from role descriptions subscription', () => {
      component['roleDescriptionsSubscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(
        component['roleDescriptionsSubscription'].unsubscribe
      ).toHaveBeenCalled();
    });
  });
});
