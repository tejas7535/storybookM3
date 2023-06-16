import { TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { AccountInfo } from '../../models';
import { AuthState } from '../reducers/auth.reducer';
import * as fromAuthSelectors from './auth.selectors';

describe('Azure Auth selectors', () => {
  test('should return accountInfo', () => {
    const accountInfo = { name: 'Test' } as unknown as AccountInfo;
    expect(
      fromAuthSelectors.getAccountInfo.projector({ accountInfo } as AuthState)
    ).toEqual(accountInfo);
  });

  test('should return username', () => {
    const accountInfo = { name: 'Test' } as unknown as AccountInfo;
    expect(
      fromAuthSelectors.getUsername.projector({ accountInfo } as AuthState)
    ).toEqual(accountInfo.name);
  });

  test('should return undefined on undefined user', () => {
    const accountInfo: AccountInfo = undefined;
    expect(
      fromAuthSelectors.getUsername.projector({ accountInfo } as AuthState)
    ).toBeUndefined();
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({
        accountInfo,
      } as AuthState)
    ).toBeUndefined();
  });

  test('should return user unique identifier', () => {
    const accountInfo = {
      username: 'Test@schaeffler.com',
    } as unknown as AccountInfo;
    const expectedUserId = 'Test';
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({
        accountInfo,
      } as AuthState)
    ).toEqual(expectedUserId);
  });

  test('should return undefined on undefined username', () => {
    const accountInfo = {
      username: undefined,
    } as unknown as AccountInfo;
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({
        accountInfo,
      } as AuthState)
    ).toBeUndefined();
  });

  test('should return empty string with empty string as username', () => {
    const accountInfo = {
      username: '',
    } as unknown as AccountInfo;
    const expected = '';
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({
        accountInfo,
      } as AuthState)
    ).toEqual(expected);
  });

  test('should return users department', () => {
    const accountInfo = {
      username: '',
      department: 'C-IT',
    } as unknown as AccountInfo;

    expect(
      fromAuthSelectors.getUserDepartment.projector({
        accountInfo,
      } as AuthState)
    ).toEqual('C-IT');
  });

  test('should return undefined as department', () => {
    const accountInfo = {
      username: '',
    } as unknown as AccountInfo;

    expect(
      fromAuthSelectors.getUserDepartment.projector({
        accountInfo,
      } as AuthState)
    ).toBeUndefined();
  });

  test('should return login true for authenticated user', () => {
    const accountInfo = { name: 'Test' } as unknown as AccountInfo;
    expect(
      fromAuthSelectors.getIsLoggedIn.projector({ accountInfo } as AuthState)
    ).toBeTruthy();
  });

  test('should return login false for unauthenticated user', () => {
    const accountInfo: AccountInfo = undefined;
    expect(
      fromAuthSelectors.getIsLoggedIn.projector({ accountInfo } as AuthState)
    ).toBeFalsy();
  });

  test('should return profile image url', () => {
    const url = 'my-sweet-img.png';

    expect(
      fromAuthSelectors.getProfileImage.projector({
        profileImage: { url },
      } as AuthState)
    ).toEqual(url);
  });

  describe('role selectors', () => {
    let store: MockStore;
    let idTokenRoles: string[];
    let expected: any;
    let result: any;

    beforeEach(() =>
      TestBed.configureTestingModule({
        providers: [provideMockStore()],
      })
    );

    beforeEach(() => {
      store = TestBed.inject(MockStore);

      idTokenRoles = undefined;
      expected = undefined;
      result = undefined;
    });

    const prepareMockState = (authState: Partial<AuthState>) => ({
      'azure-auth': authState,
    });

    const prepareAuthMockStateWithRoles = (roles: string[]) =>
      prepareMockState({
        accountInfo: {
          name: 'Test',
          idTokenClaims: {
            roles,
          },
        } as unknown as AccountInfo,
      });

    describe('getRoles', () => {
      test(
        'should return roles',
        marbles((m) => {
          const accountInfo = {
            name: 'Test',
            idTokenClaims: {
              roles: ['User'],
            },
          } as unknown as AccountInfo;

          store.setState(prepareMockState({ accountInfo }));
          expected = m.cold('a', { a: ['User'] });

          result = store.pipe(fromAuthSelectors.getRoles);

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return empty array if no roles are present',
        marbles((m) => {
          const accountInfo = { name: 'Test' } as unknown as AccountInfo;

          store.setState(prepareMockState({ accountInfo }));
          expected = m.cold('a', { a: [] });

          result = store.pipe(fromAuthSelectors.getRoles);

          m.expect(result).toBeObservable(expected);
        })
      );
    });

    describe('hasIdTokenRole', () => {
      test(
        'should return true if given role exists',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: true });
          result = store.pipe(fromAuthSelectors.hasIdTokenRole('BaseAccess'));

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if given role does not exists',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });
          result = store.pipe(fromAuthSelectors.hasIdTokenRole('User'));

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if given role is undefined',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });
          // eslint-disable-next-line unicorn/no-useless-undefined
          result = store.pipe(fromAuthSelectors.hasIdTokenRole(undefined));

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if idTokenRoles are undefined',
        marbles((m) => {
          idTokenRoles = undefined;
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });
          result = store.pipe(fromAuthSelectors.hasIdTokenRole('User'));

          m.expect(result).toBeObservable(expected);
        })
      );
    });

    describe('hasIdTokenRoles', () => {
      test(
        'should return true if given roles exists',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: true });
          result = store.pipe(
            fromAuthSelectors.hasIdTokenRoles(['BaseAccess', 'User'])
          );

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if given roles do not exist',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });

          result = store.pipe(
            fromAuthSelectors.hasIdTokenRoles(['Admin', 'SuperUser'])
          );

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if not all given roles exist',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });

          result = store.pipe(
            fromAuthSelectors.hasIdTokenRoles(['User', 'Admin'])
          );

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if given roles array is undefined',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });

          // eslint-disable-next-line unicorn/no-useless-undefined
          result = store.pipe(fromAuthSelectors.hasIdTokenRoles(undefined));

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if idTokenRoles are undefined',
        marbles((m) => {
          // eslint-disable-next-line unicorn/no-useless-undefined
          idTokenRoles = undefined;
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });

          result = store.pipe(fromAuthSelectors.hasIdTokenRoles(['User']));

          m.expect(result).toBeObservable(expected);
        })
      );
    });

    describe('hasAnyIdTokenRole', () => {
      test(
        'should return true if any of given roles exists',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: true });

          result = store.pipe(
            fromAuthSelectors.hasAnyIdTokenRole(['BaseAccess', 'User'])
          );

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if no of given roles exist',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });

          result = store.pipe(
            fromAuthSelectors.hasAnyIdTokenRole(['Admin', 'SuperUser'])
          );

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if given roles are undefined',
        marbles((m) => {
          idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });

          result = store.pipe(
            // eslint-disable-next-line unicorn/no-useless-undefined
            fromAuthSelectors.hasAnyIdTokenRole(undefined)
          );

          m.expect(result).toBeObservable(expected);
        })
      );

      test(
        'should return false if idTokenRoles are undefined',
        marbles((m) => {
          // eslint-disable-next-line unicorn/no-useless-undefined
          idTokenRoles = undefined;
          store.setState(prepareAuthMockStateWithRoles(idTokenRoles));

          expected = m.cold('a', { a: false });

          result = store.pipe(
            fromAuthSelectors.hasAnyIdTokenRole(['User', 'Foo', 'Bar'])
          );

          m.expect(result).toBeObservable(expected);
        })
      );
    });
  });

  describe('backend role selectors', () => {
    describe('getBackendRoles', () => {
      test('should return backend roles', () => {
        const accountInfo = {
          backendRoles: ['Admin'],
        } as unknown as AccountInfo;

        expect(
          fromAuthSelectors.getBackendRoles.projector({
            accountInfo,
          } as AuthState)
        ).toEqual(['Admin']);
      });

      test('should return empty array if no backend roles are present', () => {
        const accountInfo = { name: 'Test' } as unknown as AccountInfo;

        expect(
          fromAuthSelectors.getBackendRoles.projector({
            accountInfo,
          } as AuthState)
        ).toEqual([]);
      });
    });
  });
});
