import { QuotationDetail } from '@gq/shared/models';

export const isFNumber = (quotationDetail: QuotationDetail): boolean => {
  if (!quotationDetail) {
    return false;
  }

  if (
    hasMaterialFNumberProductType(quotationDetail) &&
    hasReferencePrice(quotationDetail) &&
    checkStartsWithFOrZ(quotationDetail)
  ) {
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

/**
 * Checks if productType is defined. Only F Number materials have productType defined, otherwise it is undefined.
 *
 * @param quotationDetail the quotation detail to check if productType is defined
 * @returns true if productType is defined, false otherwise
 */
export function hasMaterialFNumberProductType(
  quotationDetail: QuotationDetail
): boolean {
  return !!quotationDetail?.material?.productType;
}

/**
 * checks if the quotation detail has a reference price
 *
 * @param quotationDetail the quotation detail to check if it has a reference price
 * @returns true if the quotation detail has a reference price, false otherwise
 */
export function hasReferencePrice(quotationDetail: QuotationDetail): boolean {
  return !!quotationDetail?.fPricing?.referencePrice;
}
