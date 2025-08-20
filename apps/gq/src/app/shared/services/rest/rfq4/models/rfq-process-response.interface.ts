import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

export interface RfqProcessResponse {
  gqPositionId: string;
  processVariables: {
    gqId: number;
    gqPositionId: string;
    rfq4Status: Rfq4Status;
    rfqId?: number;
  };
  allowedToReopen: boolean;
}
