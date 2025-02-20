import { SalesOrg } from '@gq/core/store/reducers/create-case/models/sales-orgs.model';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { PurchaseOrderType } from '@gq/shared/models/purchase-order-type.interface';
import { IdValue } from '@gq/shared/models/search';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { Moment } from 'moment';

export interface HeaderInformationData {
  bindingPeriodValidityEndDate?: Moment;
  caseName?: string;
  currency?: string;
  customer?: IdValue;
  customerInquiryDate?: Moment;
  offerType?: OfferType;
  partnerRoleType?: SectorGpsd;
  purchaseOrderType?: PurchaseOrderType;
  quotationToDate?: Moment;
  quotationToManualInput?: boolean;
  requestedDeliveryDate?: Moment;
  salesOrg?: SalesOrg;
  shipToParty?: IdValue;
}
