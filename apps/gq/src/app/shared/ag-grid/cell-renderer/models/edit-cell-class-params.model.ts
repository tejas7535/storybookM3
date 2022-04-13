import { QuotationDetail } from '../../../models/quotation-detail';

export interface EditCellData {
  condition: {
    enabled: boolean;
    conditionField: keyof QuotationDetail;
  };
  field: keyof QuotationDetail;
  dialogComponent: any;
}
