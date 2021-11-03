import {
  MaterialDetails,
  PriceSource,
  QuotationDetail,
} from '../../../app/shared/models/quotation-detail';
import { LAST_OFFER_DETAIL_MOCK } from './last-offer-detail.mock';
import { PLANT_MOCK } from './plant.mock';

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
  gqRating: 2,
  recommendedPrice: 250,
  strategicPrice: undefined,
  lastCustomerPrice: 170,
  lastCustomerPriceDate: '2020-12-17T09:29:34',
  percentDifference: 17.65,
  gpc: 20,
  sqv: 30,
  rlt: 20,
  productionSegment: 10,
  netValue: 2000,
  priceSource: PriceSource.GQ,
  gpi: 90,
  gpm: 80,
  customerMaterial: 'mockCustomerMaterial',
  coefficient1: 0.88,
  coefficient2: 2.5,
  relocationCost: 24.5,
  relocatedProductionPlant: PLANT_MOCK,
  rlm: 0.65,
  lastOfferDetail: LAST_OFFER_DETAIL_MOCK,
  comment: 'testcomment',
  sapGrossPrice: 100,
  sapPrice: 80,
  sapPriceCondition: 'sapPriceCondition',
  discount: 50,
};

export const QUATATION_DETAILS_MOCK = [
  {
    gpi: 43.28,
    gpm: 25.37,
    netValue: 13.4,
    orderQuantity: 10,
    material: {
      materialNumber15: '093328702000010',
    } as MaterialDetails,
  } as QuotationDetail,
  {
    gpi: 24.75,
    gpm: 0.99,
    netValue: 2020,
    orderQuantity: 2000,
    material: {
      materialNumber15: '093328702000010',
    } as MaterialDetails,
  } as QuotationDetail,
  {
    gpi: -19,
    gpm: 0,
    netValue: 0.4,
    orderQuantity: 20,
    material: {
      materialNumber15: '093328702000020',
    } as MaterialDetails,
  } as QuotationDetail,
];
