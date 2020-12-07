import { MaterialQuantities } from './material-quantities.model';

export class AddQuotationDetailsRequest {
  public gqId: string;
  public items: MaterialQuantities[];
}
