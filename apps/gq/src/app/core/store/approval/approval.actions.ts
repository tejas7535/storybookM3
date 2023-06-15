import { ActiveDirectoryUser } from '@gq/shared/models';
import { ApprovalStatus, Approver } from '@gq/shared/models/quotation';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ApprovalActions = createActionGroup({
  source: 'Approval',
  events: {
    'Get all Approvers': emptyProps(),
    'Get all Approvers Success': props<{ approvers: Approver[] }>(),
    'All Approvers already loaded': emptyProps(),
    'Get all Approvers Failure': props<{ error: Error }>(),
    'Get Approval Status': props<{ sapId: string }>(),
    'Get Approval Status Success': props<{ approvalStatus: ApprovalStatus }>(),
    'Approval Status already loaded': emptyProps(),
    'Get Approval Status Failure': props<{ error: Error }>(),
    'Clear Approval Status': emptyProps(),
    'Get Active Directory Users': props<{ searchExpression: string }>(),
    'Get Active Directory Users Success': props<{
      activeDirectoryUsers: ActiveDirectoryUser[];
    }>(),
    'Get Active Directory Users Failure': props<{ error: Error }>(),
    'Clear Active Directory Users': emptyProps(),
  },
});
