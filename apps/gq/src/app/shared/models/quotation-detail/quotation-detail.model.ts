import {
  SapConditionType,
  SapPriceConditionDetail,
} from '@gq/core/store/reducers/models';

import { AbcxClassification } from '../quotation/abcx-classification.enum';
import { LastCustomerPriceCondition } from './last-customer-price-condition.enum';
import { LastOfferDetail } from './last-offer-detail.model';
import { MaterialDetails } from './material-details.model';
import { MaterialStockByPlant } from './material-stock-by-plant.model';
import { MrpData } from './mrp-data.model';
import { Plant } from './plant.model';
import { PriceSource } from './price-source.enum';
import { QuotationFPricingData } from './quotation-f-pricing-data.interface';
import { QuotationRfqData } from './quotation-rfq-data.interface';
import { SAP_ERROR_MESSAGE_CODE } from './sap-error-message-code.enum';
import { SapPriceCondition } from './sap-price-condition.enum';
import { SAP_SYNC_STATUS } from './sap-sync-status.enum';
export class QuotationDetail {
  quotationId: string;
  gqCreated: string;
  gqLastUpdated: string;
  gqCreatedByUserId: string;
  gqCreatedByUser: string;
  gqLastUpdatedByUserId: string;
  gqLastUpdatedByUser: string;
  gqPositionId: string;
  quotationItemId: number;
  material: MaterialDetails;
  orderQuantity: number;
  plant: Plant;
  productionPlant: Plant;
  price: number;
  priceComment: string;
  gqRating: number;
  recommendedPrice: number;
  lastCustomerPrice: number;
  lastCustomerPriceDate: string;
  lastCustomerPriceCondition: LastCustomerPriceCondition;
  lastCustomerPriceQuantity: number;

  gpc: number;
  gpcDate: string;
  sqv: number;
  sqvDate: string;
  rlt: number;
  productionSegment: string;
  strategicPrice: number;
  priceSource: PriceSource;
  customerMaterial: string;
  coefficient1: number;
  coefficient2: number;
  relocationCost: number;
  relocatedProductionPlant: Plant;
  lastOfferDetail: LastOfferDetail;
  comment: string;
  sapPrice: number;
  sapPriceCondition: SapPriceCondition;
  leadingSapConditionType: SapConditionType;
  sapGrossPrice: number;
  materialStockByPlant: MaterialStockByPlant;
  filteredSapConditionDetails: SapPriceConditionDetail[];
  materialClassificationSOP: string;
  strategicMaterial: string;
  sapSyncStatus: SAP_SYNC_STATUS;
  deliveryUnit: number;
  sapSyncErrorCode: SAP_ERROR_MESSAGE_CODE;
  sapPriceUnit: number;
  leadingPriceUnit: number;
  abcxClassification: AbcxClassification;
  targetPrice: number;
  mrpData: MrpData;
  rfqData: QuotationRfqData;
  fPricing: QuotationFPricingData;

  priceDiff: number;
  netValue: number;
  gpi: number;
  lastCustomerPriceGpi: number;
  gpm: number;
  lastCustomerPriceGpm: number;
  rlm: number;
  discount: number;

  // properties added in GQ application
  msp: number;
  rsp: number;
  sapVolumeScale: number;
}
