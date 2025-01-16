import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { StatusBarProperties } from '../ag-grid/custom-status-bar/quotation-details-status/model/status-bar.model';
import { QuotationDetail } from './quotation-detail';

export class SimulatedQuotation {
  public gqId: number;
  public simulatedField: ColumnFields;
  public quotationDetails: QuotationDetail[];
  public previousStatusBar: StatusBarProperties;
  public simulatedStatusBar: StatusBarProperties;
}
