import { ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ApprovalActions = createActionGroup({
  source: 'Approval',
  events: {
    'Get all Approvers': emptyProps(),
    'Get all Approvers Success': props<{ approvers: Approver[] }>(),
    'Get all Approvers Failure': props<{ error: Error }>(),
    'Get Approval Status': props<{ sapId: string }>(),
    'Get Approval Status Success': props<{ approvalStatus: ApprovalStatus }>(),
    'Get Approval Status Failure': props<{ error: Error }>(),
  },
});
