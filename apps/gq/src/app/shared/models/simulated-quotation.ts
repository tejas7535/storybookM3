import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { QuotationDetailsSummaryKpi } from './quotation/quotation-details-summary-kpi.model';
import { QuotationDetail } from './quotation-detail';

export class SimulatedQuotation {
  public gqId: number;
  public simulatedField: ColumnFields;
  public quotationDetails: QuotationDetail[];
  public previousStatusBar: QuotationDetailsSummaryKpi;
  public simulatedStatusBar: QuotationDetailsSummaryKpi;
}
