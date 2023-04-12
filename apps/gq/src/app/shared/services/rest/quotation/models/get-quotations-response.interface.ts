import { ViewQuotation } from '../../../../models/quotation';

export interface GetQuotationsResponse {
  quotations: ViewQuotation[];
  statusTypeOfListedQuotation: string;
  activeCount: number;
  inactiveCount: number;
}
