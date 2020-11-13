import { QuotationInfoEnum } from './quotation-info.enum';

export class QuotationDetail {
  constructor(
    public quotationId: string,
    public quotationItemId: string,
    public orderQuantity: number,
    public materialDesignation: string,
    public materialNumber15: string,
    public productionHierarchy: string,
    public productionCost: string,
    public productionPlant: string,
    public plantCity: string,
    public plantCountry: string,
    public rsp: string,
    public info: QuotationInfoEnum,
    public margin: string,
    public netValue: string,
    public priceSource: string
  ) {}
}
