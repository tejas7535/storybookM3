import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetailForSimulatedKpi } from '@gq/shared/services/rest/calculation/model/quotation-detail-for-simulated-kpi.interface';

export interface QuotationSimulatedKpiRequest {
  simulatedField: ColumnFields;
  simulatedValue?: number;
  priceSourceOption?: PriceSourceOptions;
  detailKpiList: QuotationDetailForSimulatedKpi[];
}
