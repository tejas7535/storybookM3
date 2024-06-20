import { MaterialQuantities } from '@gq/shared/models/table';

export class CreateCase {
  customer: {
    customerId: string;
    salesOrg: string;
  };
  materialQuantities: MaterialQuantities[];
  purchaseOrderTypeId?: string;
  partnerRoleId?: string;
}
