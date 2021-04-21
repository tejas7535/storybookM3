import { MaterialQuantities } from '../../../../../shared/models/table';

export class AddQuotationDetailsRequest {
  public gqId: number;
  public items: MaterialQuantities[];
}
