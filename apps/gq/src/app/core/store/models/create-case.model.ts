import { MaterialQuantities } from './material-quantities.model';

export class CreateCase {
  customer: {
    customerId: string;
    salesOrg: string;
  };
  materialQuantities: MaterialQuantities[];
}
