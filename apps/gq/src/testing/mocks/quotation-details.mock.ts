import {
  QuotationDetails,
  QuotationInfoEnum,
} from '../../app/core/store/models';

export const QUOTATION_DETAILS_MOCK: QuotationDetails = {
  materialDescription: '6052-M-C3',
  materialNumber: '016718798-0030',
  productionHierarchy: '1406054007',
  productionCost: '419,59 €',
  productionPlant: '3000',
  plantCity: 'Schweinfurt',
  plantCountry: 'Germany',
  rsp: '845,76 €',
  info: QuotationInfoEnum.AddedToOffer,
};
