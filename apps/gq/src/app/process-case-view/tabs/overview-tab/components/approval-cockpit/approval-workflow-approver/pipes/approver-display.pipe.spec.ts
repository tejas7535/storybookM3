import { ApprovalLevel, Approver } from '@gq/shared/models';

import { ApproverDisplayPipe } from './approver-display.pipe';

describe('ApproverDisplayPipe', () => {
  const pipe = new ApproverDisplayPipe();
  test('should return emptyString when user is undefined', () => {
    const result = pipe.transform(undefined, 'unknown');
    expect(result).toBe('');
  });

  test('should return first- and lastName and approvalLevel', () => {
    const result = pipe.transform(
      {
        firstName: 'first',
        lastName: 'last',
        approvalLevel: ApprovalLevel.L3,
      } as Approver,
      'unknown'
    );
    expect(result).toBe('first last (L3)');
  });

  test('should a Approver has not been found, just firstname is set, but no ApprovalLevel', () => {
    const result = pipe.transform(
      { firstName: 'USERID' } as Approver,
      'unknown'
    );
    expect(result).toBe('USERID  (unknown)');
  });

  test('should a Approver has not been found, just lastname is set, but no ApprovalLevel', () => {
    const result = pipe.transform(
      { lastName: 'USERID' } as Approver,
      'unknown'
    );
    expect(result).toBe(' USERID (unknown)');
  });
});
