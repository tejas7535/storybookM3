import { Plant } from '@gq/shared/models/quotation-detail/plant.model';
import { QuotationRfqData } from '@gq/shared/models/quotation-detail/rfq-data/quotation-rfq-data.interface';
import { RfqDataDeliveryUnit } from '@gq/shared/models/quotation-detail/rfq-data/rfq-data-delivery-unit.enum';
import { RfqStatus } from '@gq/shared/models/quotation-detail/rfq-data/rfq-status.enum';
import { RfqType } from '@gq/shared/models/quotation-detail/rfq-data/rfq-type.enum';

export const QUOTATION_RFQ_DATA_MOCK: QuotationRfqData = {
  rfqId: 'rfq-1245',
  gqPositionId: '123',
  materialNumber15: '123456789',
  productionPlant: {
    address: 'RfqAddress',
    city: 'RfqCity',
    country: 'rfqCountry',
    plantNumber: '1234',
    designation: 'designationRfq',
    postalCode: 'rfqPostalCode',
  } as Plant,
  sqv: 35,
  status: RfqStatus.OPEN,
  type: RfqType.TYPE_3,
  createdOn: '2021-02-03T14:19:44.5734925',
  createdBy: 'a user',
  deliveryTime: 5,
  deliveryUnit: RfqDataDeliveryUnit.WEEKS,
  gpm: 0.1032,
};
