import { QuotationState } from '../../app/core/store/reducers/quotation/quotation.reducers';

export const QUOTATION_STATE_MOCK: QuotationState = {
  customer: { customerDetailsLoading: false, item: undefined },
  quotation: { quotationDetailsLoading: false, items: [] },
};
