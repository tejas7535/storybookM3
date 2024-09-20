import { RfqData, RfqDataDeliveryUnit } from '@gq/shared/models';
import { RfqStatus } from '@gq/shared/models/quotation-detail/rfq-status.enum';
import { RfqType } from '@gq/shared/models/quotation-detail/rfq-type.enum';

export const RFQ_DATA_MOCK: RfqData = {
  sapId: '123',
  currency: 'EUR',
  quotationItemId: 10,
  materialNumber15: '009547-15-00',
  productionPlantNumber: '123',
  rfqId: '8512-12',
  gqPositionId: '123',
  sqv: 34.12,
  status: RfqStatus.OPEN,
  type: RfqType.TYPE_2,
  createdBy: 'Me:-)',
  createdOn: '2023-12-12',
  deliveryTime: 5,
  deliveryUnit: RfqDataDeliveryUnit.WEEKS,
  gpm: 10.21,
};
