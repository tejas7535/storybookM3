/* eslint-disable max-lines */
import Big from 'big.js';

import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { KpiValue } from '../components/modal/editing-modal/models/kpi-value.model';
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
  if (!number) {
    return number;
  }

  return new Big(number).round(2, Big.roundHalfUp).toNumber();
};

export const calculateAffectedKPIs = (
  value: number,
  field: ColumnFields,
  detail: QuotationDetail,
  isRelativePrice = true
): KpiValue[] => {
  if (field === ColumnFields.ORDER_QUANTITY) {
    return [];
  }
  const result: KpiValue[] = [];
  let updatedPrice: number;

  if (isRelativePrice) {
    switch (field) {
      case ColumnFields.PRICE: {
        updatedPrice = multiplyAndRoundValues(detail.price, 1 + value / 100);
        break;
      }
      case ColumnFields.TARGET_PRICE: {
        updatedPrice = multiplyAndRoundValues(
          detail.targetPrice,
          1 + value / 100
        );
        break;
      }
      case ColumnFields.GPI: {
        updatedPrice = getManualPriceByMarginAndCost(detail.gpc, value);
        break;
      }
      case ColumnFields.GPM: {
        updatedPrice = getManualPriceByMarginAndCost(detail.sqv, value);
        break;
      }
      case ColumnFields.DISCOUNT: {
        updatedPrice = getManualPriceByDiscount(detail.sapGrossPrice, value);
        break;
      }
      default: {
        throw new Error('No matching Column Field for computation');
      }
    }
  } else {
    updatedPrice = value;
  }

  if (field === ColumnFields.TARGET_PRICE) {
    result.push({
      key: ColumnFields.TARGET_PRICE,
      value: updatedPrice,
    });
  } else {
    result.push({
      key: ColumnFields.PRICE,
      value: updatedPrice,
    });

    // calc gpi
    if (field !== ColumnFields.GPI) {
      const gpi = calculateMargin(updatedPrice, detail.gpc);
      result.push({
        key: ColumnFields.GPI,
        value: gpi,
      });
    }

    // calc gpm
    if (field !== ColumnFields.GPM) {
      const gpm = calculateMargin(updatedPrice, detail.sqv);
      result.push({
        key: ColumnFields.GPM,
        value: gpm,
      });
    }

    // calc discount
    if (
      field !== ColumnFields.DISCOUNT &&
      typeof detail.sapGrossPrice === 'number'
    ) {
      const discount = calculateDiscount(updatedPrice, detail.sapGrossPrice);
      result.push({
        key: ColumnFields.DISCOUNT,
        value: discount,
      });
    }
  }

  return result;
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
  const discount = 1 - price / sapGrossPrice;

  return roundPercentageToTwoDecimals(discount);
};

export const roundPercentageToTwoDecimals = (number: number): number =>
  Math.round(number * 10_000) / 100;
