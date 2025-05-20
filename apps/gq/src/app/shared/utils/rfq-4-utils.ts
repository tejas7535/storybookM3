import { QuotationDetail } from '../models';
import { Rfq4Status } from '../models/quotation-detail/cost';

export const isRfq4ProcessOngoingForQuotationDetail = (
  quotationDetail: QuotationDetail
): boolean =>
  quotationDetail.detailCosts &&
  quotationDetail.detailCosts.rfq4Status === Rfq4Status.IN_PROGRESS;
