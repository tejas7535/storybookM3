import { AccountInfo } from '@azure/msal-browser';

import * as fromAuthSelectors from './auth.selectors';

describe('Azure Auth selectors', () => {
  test('should return accountInfo', () => {
    const accountInfo = ({ name: 'Test' } as unknown) as AccountInfo;
    expect(fromAuthSelectors.getAccountInfo.projector({ accountInfo })).toEqual(
      accountInfo
    );
  });

  test('should return username', () => {
    const accountInfo = ({ name: 'Test' } as unknown) as AccountInfo;
    expect(fromAuthSelectors.getUsername.projector({ accountInfo })).toEqual(
      accountInfo.name
    );
  });

  test('should return undefined on undefined user', () => {
    const accountInfo: AccountInfo = undefined;
    expect(
      fromAuthSelectors.getUsername.projector({ accountInfo })
    ).toBeUndefined();
  });

  test('should return login true for authenticated user', () => {
    const accountInfo = ({ name: 'Test' } as unknown) as AccountInfo;
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

  test('should return roles', () => {
    const accountInfo = ({
      name: 'Test',
      idTokenClaims: {
        roles: ['User'],
      },
    } as unknown) as AccountInfo;

    expect(fromAuthSelectors.getRoles.projector({ accountInfo })).toEqual([
      'User',
    ]);
  });

  test('should return empty array if no roles are present', () => {
    const accountInfo = ({ name: 'Test' } as unknown) as AccountInfo;

    expect(fromAuthSelectors.getRoles.projector({ accountInfo })).toEqual([]);
  });

  test('should return profile image url', () => {
    const url = 'my-sweet-img.png';

    expect(
      fromAuthSelectors.getProfileImage.projector({ profileImage: { url } })
    ).toEqual(url);
  });
});
