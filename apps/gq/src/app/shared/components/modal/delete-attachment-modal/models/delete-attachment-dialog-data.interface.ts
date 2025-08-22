import { Observable } from 'rxjs/internal/Observable';

import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';

export interface DeleteAttachmentDialogData<T extends Attachment> {
  dialogTitle?: string;
  dialogSubtitle?: string;
  deleteButtonCaption?: string;
  attachment: T;
  delete: (attachment: T) => void;
  deleting$: Observable<boolean>;
  deleteSuccess$: Observable<void>;
}
