import { QuotationDetail } from '../models';
import { Rfq4Status } from '../models/quotation-detail/cost';

export const isRfq4ProcessNotOpen = (
  quotationDetail: QuotationDetail
): boolean =>
  quotationDetail.rfq4?.rfq4Status !== null &&
  quotationDetail.rfq4?.rfq4Status !== Rfq4Status.OPEN;
