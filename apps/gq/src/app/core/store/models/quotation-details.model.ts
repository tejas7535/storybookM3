import { QuotationInfoEnum } from './quotation-info.enum';

export class QuotationDetails {
  constructor(
    public materialDescription: string,
    public materialNumber: string,
    public productionHierarchy: string,
    public productionCost: string,
    public productionPlant: string,
    public plantCity: string,
    public plantCountry: string,
    public rsp: string,
    public info: QuotationInfoEnum
  ) {}
}
