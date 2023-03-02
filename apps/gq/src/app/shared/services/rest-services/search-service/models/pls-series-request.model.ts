import { SalesIndication } from '@gq/core/store/reducers/models';

import { CustomerIds } from '../../../../models/customer/customer-ids.model';

export interface PLsSeriesRequest {
  customer: CustomerIds;
  salesIndications: SalesIndication[];
  includeQuotationHistory: boolean;
  historicalDataLimitInYear: number;
}
