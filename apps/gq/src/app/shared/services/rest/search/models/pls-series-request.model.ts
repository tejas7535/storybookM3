import { SalesIndication } from '@gq/core/store/reducers/models';

import { CustomerId } from '../../../../models/customer/customer-ids.model';

export interface PLsSeriesRequest {
  customer: CustomerId;
  salesIndications: SalesIndication[];
  includeQuotationHistory: boolean;
  historicalDataLimitInYear: number;
}
