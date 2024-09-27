import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { AbcxClassification } from '@gq/shared/models/quotation';

import { SimulatedQuotation } from '../../../app/shared/models';
import {
  LastCustomerPriceCondition,
  MaterialDetails,
  PriceSource,
  QuotationDetail,
  SAP_ERROR_MESSAGE_CODE,
  SAP_SYNC_STATUS,
  SapPriceCondition,
} from '../../../app/shared/models/quotation-detail';
import { LAST_OFFER_DETAIL_MOCK } from './last-offer-detail.mock';
import { MATERIAL_STOCK_BY_PLANT_MOCK } from './material-stock-by-plant.mock';
import { MRP_DATA_MOCK } from './mrp-data.mock';
import { PLANT_MOCK } from './plant.mock';
import { QUOTATION_F_PRICING_MOCK } from './quotation-f-pricing.mock';
import { QUOTATION_RFQ_DATA_MOCK } from './quotation-rfq-data-mock';
import {
  SAP_PRICE_DETAIL_ZEVO_MOCK,
  SAP_PRICE_DETAIL_ZMIN_MOCK,
  SAP_PRICE_DETAIL_ZRTU_MOCK,
} from './sap-price-condition-detail.mock';
import { STATUS_BAR_PROPERTIES_MOCK } from './status-bar.mock';

export const QUOTATION_DETAIL_MOCK: QuotationDetail = {
  quotationId: '123456',
  gqCreated: '2021-02-03T14:19:44.5734925',
  gqLastUpdated: '2021-02-03T14:19:44.5734925',
  gqCreatedByUserId: 'userid',
  gqCreatedByUser: 'user name',
  gqLastUpdatedByUserId: 'user name2',
  gqLastUpdatedByUser: 'userid2',
  gqPositionId: '5694232',
  quotationItemId: 1234,
  material: {
    materialNumber15: '016718798-0030',
    materialDescription: '6052-M-C3',
    priceUnit: 1,
  } as MaterialDetails,
  orderQuantity: 10,
  plant: PLANT_MOCK,
  productionPlant: PLANT_MOCK,
  price: 200,
  priceComment: 'test comment',
  gqRating: 2,
  recommendedPrice: 250,
  strategicPrice: undefined,
  lastCustomerPrice: 170,
  lastCustomerPriceGpi: 0.8824,
  lastCustomerPriceGpm: 0.8235,
  lastCustomerPriceDate: '2020-12-17T09:29:34',
  lastCustomerPriceCondition: LastCustomerPriceCondition.CA,
  lastCustomerPriceQuantity: 50,
  sapSyncStatus: SAP_SYNC_STATUS.NOT_SYNCED,
  abcxClassification: AbcxClassification.UR1,
  targetPrice: 90.55,
  mrpData: MRP_DATA_MOCK,
  rfqData: QUOTATION_RFQ_DATA_MOCK,
  fPricing: QUOTATION_F_PRICING_MOCK,

  priceDiff: 0.1765,
  gpc: 20,
  gpcDate: '2022-01-01T00:00:00',
  sqv: 30,
  sqvDate: '2022-03-01T00:00:00',
  rlt: 20,
  productionSegment: '10',
  netValue: 2000,
  priceSource: PriceSource.GQ,
  gpi: 0.9,
  gpm: 0.85,
  customerMaterial: 'mockCustomerMaterial',
  coefficient1: 0.88,
  coefficient2: 2.5,
  relocationCost: 24.5,
  relocatedProductionPlant: PLANT_MOCK,
  rlm: 0.8775,
  lastOfferDetail: LAST_OFFER_DETAIL_MOCK,
  comment: 'testcomment',
  sapGrossPrice: 100,
  sapPrice: 80,
  sapPriceCondition: SapPriceCondition.STANDARD,
  leadingSapConditionType: null,
  discount: -1,
  materialStockByPlant: MATERIAL_STOCK_BY_PLANT_MOCK,
  filteredSapConditionDetails: [
    SAP_PRICE_DETAIL_ZMIN_MOCK,
    SAP_PRICE_DETAIL_ZRTU_MOCK,
    SAP_PRICE_DETAIL_ZEVO_MOCK,
  ],
  materialClassificationSOP: '1',
  msp: 0.99,
  rsp: 1,
  strategicMaterial: 'Y-PT',
  sapVolumeScale: 0.5,
  deliveryUnit: 1,
  sapSyncErrorCode: SAP_ERROR_MESSAGE_CODE.SDG1000,
  sapPriceUnit: 1,
  leadingPriceUnit: 1,
};

export const QUOTATION_DETAILS_MOCK = [
  {
    gpi: 0.4328,
    gpm: 0.2537,
    netValue: 13.4,
    orderQuantity: 10,
    priceDiff: 0.1,
    material: {
      materialNumber15: '093328702000010',
    } as MaterialDetails,
    gqRating: 2,
  } as QuotationDetail,
  {
    gpi: 0.2475,
    gpm: 0.0099,
    netValue: 2020,
    orderQuantity: 2000,
    priceDiff: 0.2,
    material: {
      materialNumber15: '093328702000010',
    } as MaterialDetails,
    gqRating: 2,
  } as QuotationDetail,
  {
    gpi: -0.19,
    gpm: 0,
    netValue: 0.4,
    orderQuantity: 20,
    priceDiff: 0,
    material: {
      materialNumber15: '093328702000020',
    } as MaterialDetails,
    gqRating: 2,
  } as QuotationDetail,
];

export const SIMULATED_QUOTATION_MOCK: SimulatedQuotation = {
  gqId: 1234,
  simulatedField: ColumnFields.PRICE,
  quotationDetails: [QUOTATION_DETAIL_MOCK],
  previousStatusBar: STATUS_BAR_PROPERTIES_MOCK,
  simulatedStatusBar: STATUS_BAR_PROPERTIES_MOCK,
};

export const SIMULATED_QUOTATION_MOCKS_WITH_RFQ: SimulatedQuotation = {
  gqId: 1234,
  simulatedField: ColumnFields.PRICE,
  quotationDetails: [QUOTATION_DETAIL_MOCK],
  previousStatusBar: {
    ...STATUS_BAR_PROPERTIES_MOCK,
    gpm: QUOTATION_DETAIL_MOCK.rfqData.gpm * 100,
    gpi: SIMULATED_QUOTATION_MOCK.previousStatusBar.gpi,
    priceDiff: SIMULATED_QUOTATION_MOCK.previousStatusBar.priceDiff,
  },
  simulatedStatusBar: {
    ...STATUS_BAR_PROPERTIES_MOCK,
    gpm: QUOTATION_DETAIL_MOCK.rfqData.gpm * 100,
    gpi: STATUS_BAR_PROPERTIES_MOCK.gpi,
    priceDiff: STATUS_BAR_PROPERTIES_MOCK.priceDiff,
  },
};
