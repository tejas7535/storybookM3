import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { getIsLoggedIn } from '@schaeffler/azure-auth';

import { RoleDescriptionsService } from '@cdba/core/auth/services/role-descriptions.service';
import { ROLE_DESCRIPTIONS_MOCK } from '@cdba/testing/mocks';

import {
  loadRoleDescriptions,
  loadRoleDescriptionsFailure,
  loadRoleDescriptionsSuccess,
} from '../../actions';
import {
  getSelectedFilterIdValueOptionsByFilterName,
  getSelectedFilters,
} from '../../selectors';
import { RolesEffects } from './roles.effects';

describe('RolesEffects', () => {
  let spectator: SpectatorService<RolesEffects>;
  let actions$: any;
  let store: any;
  let effects: RolesEffects;
  let roleDescriptionsService: SpyObject<RoleDescriptionsService>;

  const createService = createServiceFactory({
    service: RolesEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      mockProvider(RoleDescriptionsService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(RolesEffects);
    roleDescriptionsService = spectator.inject(RoleDescriptionsService);

    store.overrideSelector(getSelectedFilters, []);
    store.overrideSelector(getSelectedFilterIdValueOptionsByFilterName, []);
  });

  describe('loadRoleDescriptions$', () => {
    test('should return loadRoleDescriptionsSuccess action', () => {
      const successAction = loadRoleDescriptionsSuccess({
        roleDescriptions: ROLE_DESCRIPTIONS_MOCK,
      });

      actions$ = of(loadRoleDescriptionsSuccess);

      roleDescriptionsService.getRoleDescriptions.andReturn(
        of(ROLE_DESCRIPTIONS_MOCK)
      );

      effects.loadRoleDescriptions$.subscribe((action) => {
        expect(action).toEqual(successAction);
      });
    });

    test('should return loadRoleDescriptionsFailure action', () => {
      const mockErrorResponse = { message: 'failed' };
      const failureAction = loadRoleDescriptionsFailure({
        errorMessage: 'failed',
      });

      actions$ = of(loadRoleDescriptionsSuccess);

      roleDescriptionsService.getRoleDescriptions.andReturn(
        of(mockErrorResponse)
      );

      effects.loadRoleDescriptions$.subscribe((action) => {
        expect(action).toEqual(failureAction);
      });
    });
  });

  describe('ngrxOnInitEffects', () => {
    beforeEach(() => {
      store.dispatch = jest.fn();
    });

    test('should return NO_ACTION', () => {
      const result = effects.ngrxOnInitEffects();
      const expected = { type: 'NO_ACTION' };

      expect(result).toEqual(expected);
    });

    test('should dispatch loadRoleDescriptions when logged in', () => {
      store.overrideSelector(getIsLoggedIn, true);

      effects.ngrxOnInitEffects();

      expect(store.dispatch).toHaveBeenCalledWith(loadRoleDescriptions());
    });

    test('should not dispatch loadRoleDescriptions when not logged in', () => {
      store.overrideSelector(getIsLoggedIn, false);

      effects.ngrxOnInitEffects();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
