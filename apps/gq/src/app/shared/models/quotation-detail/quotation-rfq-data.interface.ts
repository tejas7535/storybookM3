import { Plant } from './plant.model';
import { RfqDataDeliveryUnit } from './rfq-data-delivery-unit.enum';
import { RfqStatus } from './rfq-status.enum';
import { RfqType } from './rfq-type.enum';

export interface QuotationRfqData {
  rfqId: string;
  gqPositionId: string;
  materialNumber15: string;
  sqv: number;
  productionPlant: Plant;
  status: RfqStatus;
  type: RfqType;
  createdOn: string;
  createdBy: string;
  deliveryTime: number;
  deliveryUnit: RfqDataDeliveryUnit;
  gpm: number;
}
