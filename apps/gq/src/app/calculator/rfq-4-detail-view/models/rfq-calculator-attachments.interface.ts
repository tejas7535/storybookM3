import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';

import { AccessibleByEnum } from './accessibly-by.enum';

export interface RfqCalculatorAttachment extends Attachment {
  accessibleBy: AccessibleByEnum;
  rfqId: number;
}
