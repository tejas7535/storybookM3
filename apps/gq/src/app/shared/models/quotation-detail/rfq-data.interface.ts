import { RfqStatus } from './rfq-status.enum';
import { RfqType } from './rfq-type.enum';

export interface RfqData {
  id: string;
  materialNumber15: string;
  sqv: number;
  productionPlantId: string;
  status: RfqStatus;
  type: RfqType;
  createdOn: string;
  createdBy: string;
}
