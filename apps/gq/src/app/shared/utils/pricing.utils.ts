/* eslint-disable max-lines */
import Big from 'big.js';

import { StatusBarProperties } from '../models';
import { QuotationDetail } from '../models/quotation-detail';

export const roundValue = (val: number, priceUnit: number) => {
  const roundingFactor = priceUnit >= 1 ? priceUnit * 100 : 100;

  return Math.round((val + Number.EPSILON) * roundingFactor) / roundingFactor;
};

export const multiplyAndRoundValues = (
  value1: number,
  value2: number
): number => roundToTwoDecimals(value1 * value2);

export const calculatePriceDiff = (
  lastPrice: number,
  currentPrice: number
): number =>
  lastPrice
    ? roundPercentageToTwoDecimals((currentPrice - lastPrice) / lastPrice)
    : 0;

export const calculateMargin = (price: number, costValue: number): number => {
  if (price && price > 0 && costValue && costValue > 0) {
    const margin = (price - costValue) / price;

    return roundPercentageToTwoDecimals(margin);
  }

  return undefined;
};

export const calculateNetValue = (
  price: number,
  detail: QuotationDetail
): number => {
  // value on client side is always already multiplied, so price unit needs to be taken into account
  // https://confluence.schaeffler.com/display/PARS/Consider+Price+Unit
  const mutliplicationFactor = detail.orderQuantity / detail.leadingPriceUnit;

  return multiplyAndRoundValues(price, mutliplicationFactor);
};

/**
 * https://confluence.schaeffler.com/display/PARS/Implementation+Prices
 * @param details
 */
export const calculateStatusBarValues = (
  details: QuotationDetail[]
): StatusBarProperties => {
  let totalNetValue = 0;
  let netValueGPM = 0;
  let sumGPINetValue = 0;
  let sumGPMNetValue = 0;
  let totalWeightedGPI = 0;
  let totalWeightedGPM = 0;
  let sumPriceDiffNetValue = 0;
  let sumPriceDiff = 0;
  let totalPriceDiff = 0;

  keepMaxQuantityIfDuplicate(details).forEach((row: QuotationDetail) => {
    if (row.netValue) {
      totalNetValue += row.netValue;
      if (row.gpi) {
        sumGPINetValue += row.gpi * row.netValue;
      }
      if (row.gpm || row.gpmRfq) {
        // when there's and RFQ the total Avg GPM is calculated with the GPM of the RFQ
        const gpmToCalculateWith = row.gpmRfq || row.gpm;

        netValueGPM += row.netValue;
        sumGPMNetValue += gpmToCalculateWith * row.netValue;
      }
      if (row.priceDiff) {
        sumPriceDiff += row.netValue * row.priceDiff;
        sumPriceDiffNetValue += row.netValue;
      }
    }
  });
  if (netValueGPM !== 0) {
    totalWeightedGPM = roundToTwoDecimals(sumGPMNetValue / netValueGPM);
  }
  if (totalNetValue !== 0) {
    totalWeightedGPI = roundToTwoDecimals(sumGPINetValue / totalNetValue);
    totalNetValue = roundToTwoDecimals(totalNetValue);
  }
  if (sumPriceDiffNetValue !== 0) {
    totalPriceDiff = roundToTwoDecimals(sumPriceDiff / sumPriceDiffNetValue);
  }

  return new StatusBarProperties(
    totalNetValue,
    totalWeightedGPI,
    totalWeightedGPM,
    totalPriceDiff,
    details.length
  );
};

export const keepMaxQuantityIfDuplicate = (
  quotationDetails: QuotationDetail[]
): QuotationDetail[] => {
  const filtered = new Map<string, QuotationDetail>();
  quotationDetails?.forEach((quotationDetail: QuotationDetail) => {
    const key = quotationDetail.material.materialNumber15;
    if (filtered.has(key)) {
      if (filtered.get(key).orderQuantity < quotationDetail.orderQuantity) {
        filtered.set(key, quotationDetail);
      }
    } else {
      filtered.set(key, quotationDetail);
    }
  });

  return [...filtered.values()];
};

export const roundToTwoDecimals = (number: number): number => {
  if (!number || Number.isNaN(Number(number))) {
    return undefined;
  }

  return new Big(number).round(2, Big.roundHalfUp).toNumber();
};

export const getManualPriceByMarginAndCost = (
  cost: number,
  margin: number
): number => {
  const newPrice = cost / (-margin / 100 + 1);

  return roundToTwoDecimals(newPrice);
};

export const getManualPriceByDiscount = (
  sapGrossPrice: number,
  discount: number
): number => {
  const newPrice = (1 - discount / 100) * sapGrossPrice;

  return roundToTwoDecimals(newPrice);
};

export const calculateDiscount = (
  price: number,
  sapGrossPrice: number
): number => {
  // If price is 0, discount is not applicable
  if (price === 0) {
    return 0;
  }

  const discount = 1 - price / sapGrossPrice;

  return roundPercentageToTwoDecimals(discount);
};

export const roundPercentageToTwoDecimals = (number: number): number =>
  Math.round(number * 10_000) / 100;
