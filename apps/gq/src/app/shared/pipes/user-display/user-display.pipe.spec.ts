/* tslint:disable:no-unused-variable */

import {
  ActiveDirectoryUser,
  ApprovalLevel,
  Approver,
} from '@gq/shared/models';

import { UserDisplayPipe } from './user-display.pipe';

describe('Pipe: UserDisplayText', () => {
  it('create an instance', () => {
    const pipe = new UserDisplayPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if user is undefined', () => {
    expect(
      new UserDisplayPipe().transform(undefined as ActiveDirectoryUser)
    ).toBe('');
  });

  it('should return the display value for approver', () => {
    const pipe = new UserDisplayPipe();
    const approver = {
      firstName: 'firstname',
      lastName: 'lastname',
      userId: 'lastfirst',
      approvalLevel: ApprovalLevel.L1,
    } as Approver;

    const result = pipe.transform(approver);

    expect(result).toBe('(LASTFIRST) firstname lastname - L1');
  });

  it('should return the display value for user', () => {
    const pipe = new UserDisplayPipe();
    const approver = {
      firstName: 'firstname',
      lastName: 'lastname',
      userId: 'lastfirst',
    } as ActiveDirectoryUser;

    const result = pipe.transform(approver);

    expect(result).toBe('(LASTFIRST) firstname lastname');
  });

  it('should not display the userId', () => {
    const pipe = new UserDisplayPipe();
    const approver = {
      firstName: 'firstname',
      lastName: 'lastname',
      userId: 'lastfirst',
    } as ActiveDirectoryUser;

    const result = pipe.transform(approver, true);

    expect(result).toBe('firstname lastname');
  });

  it('should not display first and last name, if they are undefined', () => {
    const pipe = new UserDisplayPipe();
    const approver = {
      userId: 'lastfirst',
    } as ActiveDirectoryUser;

    const result = pipe.transform(approver);

    expect(result).toBe('(LASTFIRST)');
  });
});
