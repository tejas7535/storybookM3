import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

export interface GetRfqRequestsResponse {
  results: RfqRequest[];
}
export interface RfqRequest {
  gqPositionId: string;
  rfqId: number;
  materialDesc: string;
  materialNumber: string;
  customerName: string;
  customerNumber: number;
  createdBy: string;
  rfqLastUpdated: string;
  calculatorRequestRecalculationStatus: Rfq4Status;
  assignedTo?: string;
}
