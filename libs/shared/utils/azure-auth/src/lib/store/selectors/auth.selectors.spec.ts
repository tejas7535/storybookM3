import { AccountInfo } from '../../models';
import * as fromAuthSelectors from './auth.selectors';

describe('Azure Auth selectors', () => {
  test('should return accountInfo', () => {
    const accountInfo = { name: 'Test' } as unknown as AccountInfo;
    expect(fromAuthSelectors.getAccountInfo.projector({ accountInfo })).toEqual(
      accountInfo
    );
  });

  test('should return username', () => {
    const accountInfo = { name: 'Test' } as unknown as AccountInfo;
    expect(fromAuthSelectors.getUsername.projector({ accountInfo })).toEqual(
      accountInfo.name
    );
  });

  test('should return undefined on undefined user', () => {
    const accountInfo: AccountInfo = undefined;
    expect(
      fromAuthSelectors.getUsername.projector({ accountInfo })
    ).toBeUndefined();
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({ accountInfo })
    ).toBeUndefined();
  });

  test('should return user unique identifier', () => {
    const accountInfo = {
      username: 'Test@schaeffler.com',
    } as unknown as AccountInfo;
    const expectedUserId = 'Test';
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({ accountInfo })
    ).toEqual(expectedUserId);
  });

  test('should return undefined on undefined username', () => {
    const accountInfo = {
      username: undefined,
    } as unknown as AccountInfo;
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({ accountInfo })
    ).toBeUndefined();
  });

  test('should return empty string with empty string as username', () => {
    const accountInfo = {
      username: '',
    } as unknown as AccountInfo;
    const expected = '';
    expect(
      fromAuthSelectors.getUserUniqueIdentifier.projector({ accountInfo })
    ).toEqual(expected);
  });

  test('should return users department', () => {
    const accountInfo = {
      username: '',
      department: 'C-IT',
    } as unknown as AccountInfo;

    expect(
      fromAuthSelectors.getUserDepartment.projector({ accountInfo })
    ).toEqual('C-IT');
  });

  test('should return undefined as department', () => {
    const accountInfo = {
      username: '',
    } as unknown as AccountInfo;

    expect(
      fromAuthSelectors.getUserDepartment.projector({ accountInfo })
    ).toBeUndefined();
  });

  test('should return login true for authenticated user', () => {
    const accountInfo = { name: 'Test' } as unknown as AccountInfo;
    expect(
      fromAuthSelectors.getIsLoggedIn.projector({ accountInfo })
    ).toBeTruthy();
  });

  test('should return login false for unauthenticated user', () => {
    const accountInfo: AccountInfo = undefined;
    expect(
      fromAuthSelectors.getIsLoggedIn.projector({ accountInfo })
    ).toBeFalsy();
  });

  describe('role selectors', () => {
    let idTokenRoles: string[];

    beforeEach(() => {
      idTokenRoles = undefined;
    });
    describe('getRoles', () => {
      test('should return roles', () => {
        const accountInfo = {
          name: 'Test',
          idTokenClaims: {
            roles: ['User'],
          },
        } as unknown as AccountInfo;

        expect(fromAuthSelectors.getRoles.projector({ accountInfo })).toEqual([
          'User',
        ]);
      });

      test('should return empty array if no roles are present', () => {
        const accountInfo = { name: 'Test' } as unknown as AccountInfo;

        expect(fromAuthSelectors.getRoles.projector({ accountInfo })).toEqual(
          []
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
            fromAuthSelectors.getBackendRoles.projector({ accountInfo })
          ).toEqual(['Admin']);
        });

        test('should return empty array if no backend roles are present', () => {
          const accountInfo = { name: 'Test' } as unknown as AccountInfo;

          expect(
            fromAuthSelectors.getBackendRoles.projector({ accountInfo })
          ).toEqual([]);
        });
      });
    });

    describe('hasIdTokenRole', () => {
      test('should return true if given role exists', () => {
        idTokenRoles = ['BaseAccess', 'Foo', 'Bar'];

        expect(
          fromAuthSelectors.hasIdTokenRole('BaseAccess').projector(idTokenRoles)
        ).toBeTruthy();
      });

      test('should return false if given role does not exists', () => {
        idTokenRoles = ['BaseAccess', 'Foo', 'Bar'];

        expect(
          fromAuthSelectors.hasIdTokenRole('User').projector(idTokenRoles)
        ).toBeFalsy();
      });

      test('should return false if given role is undefined', () => {
        idTokenRoles = ['BaseAccess', 'Foo', 'Bar'];

        expect(
          // eslint-disable-next-line unicorn/no-useless-undefined
          fromAuthSelectors.hasIdTokenRole(undefined).projector(idTokenRoles)
        ).toBeFalsy();
      });

      test('should return false if idTokenRoles are undefined', () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        idTokenRoles = undefined;

        expect(
          fromAuthSelectors.hasIdTokenRole('User').projector(idTokenRoles)
        ).toBeFalsy();
      });
    });
    describe('hasIdTokenRoles', () => {
      test('should return true if given roles exists', () => {
        idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];

        expect(
          fromAuthSelectors
            .hasIdTokenRoles(['BaseAccess', 'User'])
            .projector(idTokenRoles)
        ).toBeTruthy();
      });

      test('should return false if given roles do not exist', () => {
        idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];

        expect(
          fromAuthSelectors
            .hasIdTokenRoles(['Admin', 'SuperUser'])
            .projector(idTokenRoles)
        ).toBeFalsy();
      });

      test('should return false if not all given roles exist', () => {
        idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];

        expect(
          fromAuthSelectors
            .hasIdTokenRoles(['User', 'Admin'])
            .projector(idTokenRoles)
        ).toBeFalsy();
      });

      test('should return false if given roles array is undefined', () => {
        idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];

        expect(
          // eslint-disable-next-line unicorn/no-useless-undefined
          fromAuthSelectors.hasIdTokenRoles(undefined).projector(idTokenRoles)
        ).toBeFalsy();
      });

      test('should return false if idTokenRoles are undefined', () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        idTokenRoles = undefined;

        expect(
          fromAuthSelectors.hasIdTokenRoles(['User']).projector(idTokenRoles)
        ).toBeFalsy();
      });
    });

    describe('hasAnyIdTokenRole', () => {
      test('should return true if any of given roles exists', () => {
        idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];

        expect(
          fromAuthSelectors
            .hasAnyIdTokenRole(['BaseAccess', 'User'])
            .projector(idTokenRoles)
        ).toBeTruthy();
      });

      test('should return false if no of given roles exist', () => {
        idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];

        expect(
          fromAuthSelectors
            .hasAnyIdTokenRole(['Admin', 'SuperUser'])
            .projector(idTokenRoles)
        ).toBeFalsy();
      });

      test('should return false if given roles are undefined', () => {
        idTokenRoles = ['BaseAccess', 'User', 'Foo', 'Bar'];

        expect(
          // eslint-disable-next-line unicorn/no-useless-undefined
          fromAuthSelectors.hasAnyIdTokenRole(undefined).projector(idTokenRoles)
        ).toBeFalsy();
      });

      test('should return false if idTokenRoles are undefined', () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        idTokenRoles = undefined;

        expect(
          fromAuthSelectors
            .hasAnyIdTokenRole(['User', 'Foo', 'Bar'])
            .projector(idTokenRoles)
        ).toBeFalsy();
      });
    });
  });

  test('should return profile image url', () => {
    const url = 'my-sweet-img.png';

    expect(
      fromAuthSelectors.getProfileImage.projector({ profileImage: { url } })
    ).toEqual(url);
  });
});
