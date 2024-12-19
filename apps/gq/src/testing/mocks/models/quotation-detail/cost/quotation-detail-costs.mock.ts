import { QuotationDetailCosts } from '../../../../../app/shared/models/quotation-detail/cost/quotation-detail-costs.model';
import { SqvCheckSource } from '../../../../../app/shared/models/quotation-detail/cost/sqv-check-source.enum';

export const QUOTATION_DETAIL_COSTS_MOCK: QuotationDetailCosts = {
  sqvCheckResult: 1,
  sqvCheckSource: SqvCheckSource.RELOCATION,
};
