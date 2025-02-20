import { CustomerId } from '@gq/shared/models/customer/customer-ids.model';

export interface CreateCaseHeaderData {
  customer: CustomerId;
  customCurrency: string;
  shipToParty: CustomerId;
  caseName: string;
  quotationToDate: string;
  quotationToManualInput: boolean;
  customerInquiryDate: string;
  bindingPeriodValidityEndDate: string;
  requestedDeliveryDate?: string;
  partnerRoleId?: string;
  purchaseOrderTypeId?: string;
  offerTypeId?: number;
}
