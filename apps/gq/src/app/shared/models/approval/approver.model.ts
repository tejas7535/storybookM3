import { ActiveDirectoryUser } from '../user.model';
import { ApprovalLevel } from './approval-level.enum';

export interface Approver extends ActiveDirectoryUser {
  approvalLevel: ApprovalLevel;
}
