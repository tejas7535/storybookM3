import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import {
  calculateDiscount,
  calculateMargin,
  calculatePriceDiff,
  getPriceUnit,
  multiplyAndRoundValues,
  roundValue,
} from '@gq/shared/utils/pricing.utils';

import { QuotationIdentifier, SapConditionType } from '../../reducers/models';

export const addCalculationsForDetails = (details: QuotationDetail[]): void => {
  details.forEach((detail) => addCalculationsForDetail(detail));
};

export const addCalculationsForDetail = (detail: QuotationDetail): void => {
  const priceUnit = getPriceUnit(detail);

  // First we need to round the price value to prevent wrong calculations down the line
  // See GQUOTE-1673
  if (typeof detail.price === 'number') {
    detail.price = roundValue(detail.price, priceUnit);
  }

  if (typeof detail.recommendedPrice === 'number') {
    detail.recommendedPrice = roundValue(detail.recommendedPrice, priceUnit);
  }

  if (typeof detail.lastCustomerPrice === 'number') {
    detail.lastCustomerPrice = roundValue(detail.lastCustomerPrice, priceUnit);
  }

  if (typeof detail.strategicPrice === 'number') {
    detail.strategicPrice = roundValue(detail.strategicPrice, priceUnit);
  }

  if (typeof detail.gpc === 'number') {
    detail.gpc = roundValue(detail.gpc, priceUnit);
  }

  if (typeof detail.sqv === 'number') {
    detail.sqv = roundValue(detail.sqv, priceUnit);
  }

  if (
    typeof detail.price === 'number' &&
    typeof detail.orderQuantity === 'number'
  ) {
    detail.netValue = multiplyAndRoundValues(
      detail.price,
      detail.orderQuantity
    );
  }

  if (
    typeof detail.lastCustomerPrice === 'number' &&
    typeof detail.price === 'number'
  ) {
    detail.priceDiff = calculatePriceDiff(
      detail.lastCustomerPrice,
      detail.price
    );
  }

  // calculate priceUnit dependent values
  calculatePriceUnitValues(detail);

  if (
    typeof detail.price === 'number' &&
    typeof detail.sapGrossPrice === 'number'
  ) {
    detail.discount = calculateDiscount(detail.price, detail.sapGrossPrice);
  }

  detail.gpi = calculateMargin(detail.price, detail.gpc);
  detail.lastCustomerPriceGpi = calculateMargin(
    detail.lastCustomerPrice,
    detail.gpc
  );
  detail.gpm = calculateMargin(detail.price, detail.sqv);
  detail.lastCustomerPriceGpm = calculateMargin(
    detail.lastCustomerPrice,
    detail.sqv
  );
  detail.rlm = calculateMargin(detail.price, detail.relocationCost);
  calculateSapPriceValues(detail);
};

export const calculateSapPriceValues = (detail: QuotationDetail): void => {
  if (detail.filteredSapConditionDetails) {
    const rsp = calculateRsp(detail);
    detail.rsp = rsp;

    const zrtu = detail.filteredSapConditionDetails.find(
      (el) => el.sapConditionType === SapConditionType.ZRTU
    )?.amount;
    detail.msp =
      zrtu && detail.rsp ? calculateMsp(detail.rsp, zrtu) : undefined;

    detail.sapVolumeScale =
      detail.filteredSapConditionDetails.find(
        (el) =>
          el.sapConditionType === SapConditionType.ZDVO ||
          el.sapConditionType === SapConditionType.ZEVO
      )?.amount || undefined;
  }
};

const calculateRsp = (detail: QuotationDetail): number | undefined => {
  const rspCondition = detail.filteredSapConditionDetails.find(
    (el) => el.sapConditionType === SapConditionType.ZMIN
  );
  if (!rspCondition) {
    return undefined;
  }

  let rsp = rspCondition.amount;

  if (
    detail.sapPriceUnit &&
    rspCondition.pricingUnit &&
    detail.sapPriceUnit !== rspCondition.pricingUnit
  ) {
    rsp = multiplyAndRoundValues(
      rsp / rspCondition.pricingUnit,
      detail.sapPriceUnit
    );
  }

  return rsp;
};

export const calculateMsp = (rsp: number, zrtu: number): number =>
  rsp * (1 - zrtu / 100);

export const mapQueryParamsToIdentifier = (
  queryParams: any
): {
  gqId: number;
  customerNumber: string;
  salesOrg: string;
} => {
  const gqId: number = queryParams['quotation_number'];
  const customerNumber: string = queryParams['customer_number'];
  const salesOrg: string = queryParams['sales_org'];

  return gqId && customerNumber && salesOrg
    ? { gqId, customerNumber, salesOrg }
    : undefined;
};

export const checkEqualityOfIdentifier = (
  fromRoute: QuotationIdentifier,
  current: QuotationIdentifier
): boolean =>
  fromRoute.customerNumber === current?.customerNumber &&
  fromRoute.gqId === current?.gqId &&
  fromRoute.salesOrg === current?.salesOrg;

export const calculatePriceUnitValues = (detail: QuotationDetail): void => {
  const priceUnit = getPriceUnit(detail);

  // calculate priceUnit dependent values
  if (typeof detail.gpc === 'number') {
    detail.gpc = multiplyAndRoundValues(detail.gpc, priceUnit);
  }

  if (typeof detail.sqv === 'number') {
    detail.sqv = multiplyAndRoundValues(detail.sqv, priceUnit);
  }

  if (typeof detail.lastCustomerPrice === 'number') {
    detail.lastCustomerPrice = multiplyAndRoundValues(
      detail.lastCustomerPrice,
      priceUnit
    );
  }

  if (typeof detail.price === 'number') {
    detail.price = multiplyAndRoundValues(detail.price, priceUnit);
  }

  if (typeof detail.recommendedPrice === 'number') {
    detail.recommendedPrice = multiplyAndRoundValues(
      detail.recommendedPrice,
      priceUnit
    );
  }

  if (typeof detail.strategicPrice === 'number') {
    detail.strategicPrice = multiplyAndRoundValues(
      detail.strategicPrice,
      priceUnit
    );
  }

  if (
    typeof detail.sapPriceUnit === 'number' &&
    typeof detail.material.priceUnit === 'number'
  ) {
    if (typeof detail.sapPrice === 'number') {
      detail.sapPrice = multiplyAndRoundValues(
        detail.sapPrice / detail.material.priceUnit,
        detail.sapPriceUnit
      );
    }
    if (typeof detail.sapGrossPrice === 'number') {
      detail.sapGrossPrice = multiplyAndRoundValues(
        detail.sapGrossPrice / detail.material.priceUnit,
        detail.sapPriceUnit
      );
    }
  }
};
