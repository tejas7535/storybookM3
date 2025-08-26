import { RecalculationReasons } from '@gq/shared/models/quotation-detail/cost/recalculation-reasons.enum';
import { QuotationDetailSqvCheck } from '@gq/shared/models/quotation-detail/rfq/quotation-detail-sqv-check.interface';

import { SqvCheckSource } from '../../../../../app/shared/models/quotation-detail/cost/sqv-check-source.enum';

export const QUOTATION_DETAIL_SQV_CHECK_MOCK: QuotationDetailSqvCheck = {
  sqvCheckResult: 1,
  sqvCheckSource: SqvCheckSource.RELOCATION,
  sqvCheckStatus: RecalculationReasons.VALID,
  sqvValidityPeriod: undefined,
};
