import { MaterialQuantities } from './material-quantities.model';

export class AddQuotationDetailsRequest {
  public gqId: number;
  public items: MaterialQuantities[];
}
