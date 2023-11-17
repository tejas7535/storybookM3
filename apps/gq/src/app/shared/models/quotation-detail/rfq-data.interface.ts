import { Plant } from './plant.model';
import { RfqStatus } from './rfq-status.enum';
import { RfqType } from './rfq-type.enum';

export interface RfqData {
  rfqId: string;
  materialNumber15: string;
  sqv: number;
  productionPlant: Plant;
  status: RfqStatus;
  type: RfqType;
  createdOn: string;
  createdBy: string;
}
