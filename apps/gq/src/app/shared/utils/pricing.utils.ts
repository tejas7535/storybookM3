/* eslint-disable max-lines */
import Big from 'big.js';

import { QuotationDetail } from '../models/quotation-detail';
import { QuotationDetailKpi } from '../services/rest/calculation/model/quotation-detail-kpi.interface';
import { QuotationKpiRequest } from '../services/rest/calculation/model/quotation-kpi-request.interface';

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
  lastPrice ? roundToFourDecimals((currentPrice - lastPrice) / lastPrice) : 0;

export const calculateMargin = (price: number, costValue: number): number => {
  if (price && price > 0 && costValue && costValue > 0) {
    const margin = (price - costValue) / price;

    return roundToFourDecimals(margin);
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
  const costBig = new Big(cost);
  const marginBig = new Big(margin);
  const one = new Big(1);

  // cost / (-margin + 1)
  const newPrice = costBig.div(marginBig.neg().plus(one));

  return roundToTwoDecimals(newPrice.toNumber());
};

export const getManualPriceByDiscount = (
  sapGrossPrice: number,
  discount: number
): number => {
  const newPrice = (1 - discount) * sapGrossPrice;

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

  return roundToFourDecimals(discount);
};

export const roundPercentageToTwoDecimals = (number: number): number =>
  Math.round(number * 10_000) / 100;

export const roundToFourDecimals = (number: number): number =>
  Math.round(number * 10_000) / 10_000;

export const quotationDetailsToRequestData = (
  quotationDetails: QuotationDetail[]
): QuotationKpiRequest => {
  const detailKpiList: QuotationDetailKpi[] = quotationDetails.map(
    (qd): QuotationDetailKpi => {
      const {
        gpi,
        gpm,
        priceDiff,
        orderQuantity,
        material,
        rfqData,
        netValue,
        gqRating,
      } = qd;
      const kpi: QuotationDetailKpi = {
        netValue,
        gpi,
        gpm,
        priceDiff,
        gqRating,
        quantity: orderQuantity,
        materialNumber15: material.materialNumber15,
        rfqDataGpm: rfqData?.gpm,
      };

      return kpi;
    }
  );

  return { detailKpiList };
};

export const quotationDetailsForSimulationToRequestData = (
  simulatedQuotationDetails: QuotationDetail[],
  selectedQuotationDetails: QuotationDetail[]
): QuotationKpiRequest => {
  // If all quotation details are available for simulation - convert all of them to request
  if (simulatedQuotationDetails.length === selectedQuotationDetails.length) {
    return quotationDetailsToRequestData(simulatedQuotationDetails);
  }

  // If just a few quotation details can be simulated we need to combine them with not simulated once
  const simulatedDetailsIds: Set<string> = new Set(
    simulatedQuotationDetails.map((sqd) => sqd.gqPositionId)
  );
  const combineDetails: QuotationDetail[] = [
    ...simulatedQuotationDetails,
    ...selectedQuotationDetails.filter(
      (selected) => !simulatedDetailsIds.has(selected.gqPositionId)
    ),
  ];

  return quotationDetailsToRequestData(combineDetails);
};
