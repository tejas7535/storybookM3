import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';

export interface QuotationAttachment extends Attachment {
  sapId: string;
  folderName: string;
}
