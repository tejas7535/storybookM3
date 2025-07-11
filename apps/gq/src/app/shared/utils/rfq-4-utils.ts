import { QuotationDetail } from '../models';
import { Rfq4Status } from '../models/quotation-detail/cost';

export const isRfq4ProcessInProgressOrCompletedForQuotationDetail = (
  quotationDetail: QuotationDetail
): boolean =>
  quotationDetail.detailCosts &&
  (quotationDetail.detailCosts.rfq4Status === Rfq4Status.IN_PROGRESS ||
    quotationDetail.detailCosts.rfq4Status === Rfq4Status.CONFIRMED);
