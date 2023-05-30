import { ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
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
  },
});
