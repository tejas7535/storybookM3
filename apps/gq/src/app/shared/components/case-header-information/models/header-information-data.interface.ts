import { OfferType } from '@gq/shared/models/offer-type.interface';
import { PurchaseOrderType } from '@gq/shared/models/purchase-order-type.interface';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { ShipToParty } from '@gq/shared/services/rest/quotation/models/ship-to-party';
import { Moment } from 'moment';

export interface HeaderInformationData {
  bindingPeriodValidityEndDate?: Moment;
  caseName?: string;
  currency?: string;
  customerInquiryDate?: Moment;
  offerType?: OfferType;
  partnerRoleType?: SectorGpsd;
  purchaseOrderType?: PurchaseOrderType;
  quotationToDate?: Moment;
  quotationToManualInput?: boolean;
  requestedDeliveryDate?: Moment;
  shipToParty?: ShipToParty;
}
