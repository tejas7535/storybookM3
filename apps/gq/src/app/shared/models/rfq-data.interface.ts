import { QuotationRfqData } from './quotation-detail/quotation-rfq-data.interface';

export interface RfqData extends Omit<QuotationRfqData, 'productionPlant'> {
  sapId: string;
  quotationItemId: number;
  currency: string;
  productionPlantNumber: string;
}
