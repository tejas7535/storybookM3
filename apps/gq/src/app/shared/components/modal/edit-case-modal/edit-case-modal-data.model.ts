import { PurchaseOrderType } from '@gq/shared/models';
import { IdValue } from '@gq/shared/models/search';

export interface EditCaseModalData {
  caseName: string;
  currency: string;
  enableSapFieldEditing: boolean;
  shipToParty?: IdValue;
  quotationToDate?: string;
  requestedDeliveryDate?: string;
  customerPurchaseOrderDate?: string;
  bindingPeriodValidityEndDate?: string;
  salesOrg?: string;
  purchaseOrderType?: PurchaseOrderType;
}
