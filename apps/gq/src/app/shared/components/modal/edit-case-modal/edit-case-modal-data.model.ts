import { Customer, PurchaseOrderType } from '@gq/shared/models';
import { OfferType } from '@gq/shared/models/offer-type.interface';
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
  shipToPartySalesOrg?: string;
  purchaseOrderType?: PurchaseOrderType;
  partnerRoleType?: SectorGpsd;
  offerType?: OfferType;
  disabled?: boolean;
  isSapCase?: boolean;
}
