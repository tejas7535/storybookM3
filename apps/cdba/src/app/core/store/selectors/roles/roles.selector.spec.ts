import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { AuthState } from '@schaeffler/azure-auth';

import { AuthRoles } from '@cdba/core/auth/models/auth.models';
import {
  initialState as initialStateRoles,
  RolesState,
} from '@cdba/core/store/reducers/roles/roles.reducer';
import {
  ACCOUNT_INFO_MOCK,
  AUTH_STATE_MOCK,
  INITIAL_AUTH_STATE_MOCK,
  ROLES_STATE_ERROR_MOCK,
  ROLES_STATE_SUCCESS_MOCK,
} from '@cdba/testing/mocks';

import {
  getHasDescriptiveRoles,
  getRoleDescriptions,
  getRoleDescriptionsErrorMessage,
  getRoleDescriptionsLoaded,
} from './roles.selector';

const getMockAuthState = (roles: AuthRoles): AuthState => ({
  ...AUTH_STATE_MOCK,
  accountInfo: {
    ...ACCOUNT_INFO_MOCK,
    idTokenClaims: {
      roles,
    },
  },
});

describe('Roles Selectors', () => {
  interface MockState {
    'azure-auth': AuthState;
    roles: RolesState;
  }

  const mockStateSuccess: MockState = {
    'azure-auth': AUTH_STATE_MOCK,
    roles: ROLES_STATE_SUCCESS_MOCK,
  };

  const mockStateError: MockState = {
    'azure-auth': INITIAL_AUTH_STATE_MOCK,
    roles: ROLES_STATE_ERROR_MOCK,
  };

  const mockStateInitial: MockState = {
    'azure-auth': INITIAL_AUTH_STATE_MOCK,
    roles: initialStateRoles,
  };

  describe('getRoleDescriptions', () => {
    test('should return roleDescriptions', () => {
      expect(getRoleDescriptions(mockStateSuccess)).toEqual(
        mockStateSuccess.roles.roleDescriptions.items
      );
    });

    test('should return empty role descriptions', () => {
      expect(getRoleDescriptions(mockStateInitial)).toEqual(
        initialStateRoles.roleDescriptions.items
      );
    });
  });

  describe('getRoleDescriptionsLoaded', () => {
    test('should return true', () => {
      expect(getRoleDescriptionsLoaded(mockStateSuccess)).toBeTruthy();
    });

    test('should return false', () => {
      expect(getRoleDescriptionsLoaded(mockStateInitial)).toBeFalsy();
    });
  });

  describe('getRoleDescriptionsErrorMessage', () => {
    test('should return error message', () => {
      expect(getRoleDescriptionsErrorMessage(mockStateError)).toEqual(
        ROLES_STATE_ERROR_MOCK.roleDescriptions.errorMessage
      );
    });

    test('should return undefined', () => {
      expect(getRoleDescriptionsErrorMessage(mockStateInitial)).toBeUndefined();
    });
  });

  describe('getHasDescriptiveRoles', () => {
    let store: MockStore;
    let expected: any;
    let result: any;

    beforeEach(() =>
      TestBed.configureTestingModule({
        providers: [provideMockStore({ initialState: mockStateInitial })],
      })
    );

    beforeEach(() => {
      store = TestBed.inject(MockStore);

      expected = undefined;
      result = undefined;
    });

    test(
      'should not return a value with initial state',
      marbles((m) => {
        expected = m.cold('-');
        result = store.pipe(getHasDescriptiveRoles);

        m.expect(result).toBeObservable(expected);
      })
    );

    test(
      'should return false with missing product line role',
      marbles((m) => {
        store.setState({
          ...mockStateSuccess,
          'azure-auth': getMockAuthState(['CDBA_SUB_REGION_21']),
        });
        expected = m.cold('a', { a: false });

        result = store.pipe(getHasDescriptiveRoles);

        m.expect(result).toBeObservable(expected);
      })
    );

    test(
      'should return false with missing sub-region role',
      marbles((m) => {
        store.setState({
          ...mockStateSuccess,
          'azure-auth': getMockAuthState(['CDBA_PRODUCT_LINE_03']),
        });
        expected = m.cold('a', { a: false });

        result = store.pipe(getHasDescriptiveRoles);

        m.expect(result).toBeObservable(expected);
      })
    );

    test(
      'should return true with necessary roles',
      marbles((m) => {
        store.setState({
          ...mockStateSuccess,
          'azure-auth': getMockAuthState([
            'CDBA_PRODUCT_LINE_03',
            'CDBA_SUB_REGION_21',
          ]),
        });
        expected = m.cold('a', { a: true });

        result = store.pipe(getHasDescriptiveRoles);

        m.expect(result).toBeObservable(expected);
      })
    );

    test(
      'should return true with admin role',
      marbles((m) => {
        store.setState({
          ...mockStateSuccess,
          'azure-auth': getMockAuthState(['CDBA_ADMIN']),
        });
        expected = m.cold('a', { a: true });

        result = store.pipe(getHasDescriptiveRoles);

        m.expect(result).toBeObservable(expected);
      })
    );
  });
});
