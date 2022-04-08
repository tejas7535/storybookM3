import { QuotationDetail } from '../../../models/quotation-detail';

export interface KpiValue {
  key: keyof QuotationDetail;
  value: number;
}
