import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { PositionAttachment } from '@gq/shared/services/rest/attachments/models/position-attachment.interface';
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
    'download attachments': props<{
      gqPositionId: string;
      file?: Attachment;
    }>(),
    'download attachments success': props<{ fileName: string }>(),
    'download attachments failure': props<{ errorMessage: string }>(),
    'set gqPositionId': props<{ gqPositionId: string }>(),
    'reset gqPositionId': emptyProps(),
    'get all attachments': props<{ gqPositionId: string }>(),
    'get all attachments success': props<{
      attachments: PositionAttachment[];
    }>(),
    'get all attachments failure': props<{ errorMessage: string }>(),
    'reset attachments': emptyProps(),
  },
});
