import { SalesIndication } from '../../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { CustomerIds } from '../../../../models/customer/customer-ids.model';

export interface PLsSeriesRequest {
  customer: CustomerIds;
  salesIndications: SalesIndication[];
  includeQuotationHistory: boolean;
  historicalDataLimitInYear: number;
}
