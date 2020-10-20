import { QuotationInfoEnum } from './quotation-info.enum';

export class QuotationDetail {
  constructor(
    public materialDesignation: string,
    public materialNumber13: string,
    public productionHierarchy: string,
    public productionCost: string,
    public productionPlant: string,
    public plantCity: string,
    public plantCountry: string,
    public rsp: string,
    public info: QuotationInfoEnum
  ) {}
}
