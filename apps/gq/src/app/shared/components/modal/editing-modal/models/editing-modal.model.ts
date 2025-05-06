import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { CustomerId } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';

export interface EditingModal {
  quotationDetail: QuotationDetail;
  field: ColumnFields;
  customerId?: CustomerId;
}
