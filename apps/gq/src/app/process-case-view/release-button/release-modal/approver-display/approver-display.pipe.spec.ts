/* tslint:disable:no-unused-variable */

import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';

import { ApproverDisplayPipe } from './approver-display.pipe';

describe('Pipe: UserDisplayTexte', () => {
  it('create an instance', () => {
    const pipe = new ApproverDisplayPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the string', () => {
    const pipe = new ApproverDisplayPipe();
    const approver: Approver = {
      firstName: 'firstname',
      lastName: 'lastname',
      userId: 'lastfirst',
      approvalLevel: ApprovalLevel.L1,
    } as Approver;

    const result = pipe.transform(approver);

    expect(result).toEqual('(LASTFIRST) firstname lastname - L1');

    expect(true).toBeTruthy();
  });
});
