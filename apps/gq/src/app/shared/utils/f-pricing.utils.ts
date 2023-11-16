import { QuotationDetail } from '@gq/shared/models';

export const quotationDetailIsFNumber = (
  quotationDetail: QuotationDetail
): boolean => {
  if (!quotationDetail) {
    return false;
  }

  if (checkStartsWithFOrZ(quotationDetail)) {
    return true;
  }

  return false;
};

export function checkStartsWithFOrZ(quotationDetail: QuotationDetail): boolean {
  return (
    quotationDetail?.material?.materialDescription?.startsWith('F-') ||
    quotationDetail?.material?.materialDescription?.startsWith('Z-')
  );
}
