import { QuotationDetail } from './quotation-detail';

export class SimulatedQuotation {
  public gqId: number;
  public quotationDetails: QuotationDetail[];
  public simulatedDiscount: number;
  public simulatedNetPrice: number;
  public simulatedGPM: number;
  public simulatedGPI: number;
}
