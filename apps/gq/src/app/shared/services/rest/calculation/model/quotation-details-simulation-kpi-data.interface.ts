import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetail } from '@gq/shared/models';

export interface QuotationDetailsSimulationKpiData {
  gqId: number;
  simulatedField: ColumnFields;
  simulatedValue?: number;
  priceSourceOption?: PriceSourceOptions;
  selectedQuotationDetails: QuotationDetail[];
}
