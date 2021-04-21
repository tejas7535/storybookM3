import { MaterialQuantities } from '../../../../../shared/models/table';

export class CreateCase {
  customer: {
    customerId: string;
    salesOrg: string;
  };
  materialQuantities: MaterialQuantities[];
}
