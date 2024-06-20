import { Customer, PurchaseOrderType } from '@gq/shared/models';
import { IdValue } from '@gq/shared/models/search';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';

export interface EditCaseModalData {
  caseName: string;
  currency: string;
  enableSapFieldEditing: boolean;
  caseCustomer: Customer;
  shipToParty?: IdValue;
  quotationToDate?: string;
  requestedDeliveryDate?: string;
  customerPurchaseOrderDate?: string;
  bindingPeriodValidityEndDate?: string;
  salesOrg?: string;

  purchaseOrderType?: PurchaseOrderType;
  partnerRoleType?: SectorGpsd;
  disabled?: boolean;
}
