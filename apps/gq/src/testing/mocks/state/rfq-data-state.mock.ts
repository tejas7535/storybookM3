import { RfqDataState } from '@gq/core/store/rfq-data/rfq-data.reducer';

import { RFQ_DATA_MOCK } from '../models/rfq-data.mock';

export const RFQ_DATA_STATE_MOCK: RfqDataState = {
  rfqData: RFQ_DATA_MOCK,
  rfqDataLoading: false,
  errorMessage: 'this is an error message',
};
