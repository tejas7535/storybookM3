import { UserRoles } from '@gq/shared/constants';

import { QuotationDetail } from '../../../models/quotation-detail';

export interface EditCellData {
  condition: {
    enabled: boolean;
    conditionField: keyof QuotationDetail;
  };
  role: UserRoles;
  field: keyof QuotationDetail;
  dialogComponent: any;
}
