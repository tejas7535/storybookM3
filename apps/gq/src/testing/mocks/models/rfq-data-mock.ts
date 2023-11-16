import { RfqData } from '@gq/shared/models/quotation-detail/rfq-data.interface';
import { RfqStatus } from '@gq/shared/models/quotation-detail/rfq-status.enum';
import { RfqType } from '@gq/shared/models/quotation-detail/rfq-type.enum';

export const RFQ_DATA_MOCK: RfqData = {
  id: 'rfq-1245',
  materialNumber15: '123456789',
  productionPlantId: '1234',
  sqv: 35,
  status: RfqStatus.OPEN,
  type: RfqType.TYPE_3,
  createdOn: '2021-02-03T14:19:44.5734925',
  createdBy: 'a user',
};
