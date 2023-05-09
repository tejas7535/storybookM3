import { MaterialQuantities } from '@gq/shared/models/table';

export class AddQuotationDetailsRequest {
  public gqId: number;
  public items: MaterialQuantities[];
}
