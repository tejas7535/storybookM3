import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';

export interface QuotationAttachment extends Omit<Attachment, 'gqPositionId'> {
  sapId: string;
  folderName: string;
}
