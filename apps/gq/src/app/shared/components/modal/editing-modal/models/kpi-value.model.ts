import { QuotationDetail } from '../../../../models/quotation-detail';

export interface KpiValue {
  key: keyof QuotationDetail;
  value: number;
}

export interface KpiDisplayValue extends KpiValue {
  displayValue: string;
  previousDisplayValue: string;
  hasWarning?: boolean;
  hasError?: boolean;
  warningText?: string;
}

export enum KpiValueFormatter {
  PERCENT,
  NUMBER_CURRENCY,
}
