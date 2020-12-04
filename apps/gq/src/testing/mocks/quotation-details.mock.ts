import {
  QuotationDetail,
  QuotationInfoEnum,
} from '../../app/core/store/models';

export const QUOTATION_DETAIL_MOCK: QuotationDetail = {
  quotationId: '123456',
  quotationItemId: '34643567',
  gqPositionId: '5694232',
  materialDesignation: '6052-M-C3',
  materialNumber15: '016718798-0030',
  orderQuantity: 10,
  productionHierarchy: '1406054007',
  productionCost: '419,59 €',
  productionPlant: '3000',
  plantCity: 'Schweinfurt',
  plantCountry: 'Germany',
  rsp: '845.76 €',
  info: QuotationInfoEnum.None,
  priceSource: 'MokSource',
  netValue: '26.67',
  margin: '89654',
};
