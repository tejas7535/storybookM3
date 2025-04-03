import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const RfqSqvCheckAttachmentsActions = createActionGroup({
  source: 'RFQ SQV Check Attachments',
  events: {
    'upload attachments': props<{ files: File[] }>(),
    'upload attachments success': props<{
      gqPositionId: string;
      newApprovalStatus: SqvApprovalStatus;
    }>(),
    'upload attachments failure': props<{ errorMessage: string }>(),
    'download attachments': props<{ gqPositionId: string }>(),
    'download attachments success': props<{ fileName: string }>(),
    'download attachments failure': props<{ errorMessage: string }>(),
    'set gqPositionId': props<{ gqPositionId: string }>(),
    'reset gqPositionId': emptyProps(),
  },
});
