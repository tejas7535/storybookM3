import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { QuotationDetail } from './quotation-detail';
import { StatusBarProperties } from './status-bar.model';

export class SimulatedQuotation {
  public gqId: number;
  public simulatedField: ColumnFields;
  public quotationDetails: QuotationDetail[];
  public previousStatusBar: StatusBarProperties;
  public simulatedStatusBar: StatusBarProperties;
}
