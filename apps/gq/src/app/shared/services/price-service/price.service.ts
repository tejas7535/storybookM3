import { Injectable } from '@angular/core';

import { Transaction } from '../../../core/store/reducers/transactions/models/transaction.model';
import { QuotationDetail } from '../../models/quotation-detail';
import { StatusBarCalculation } from './models/status-bar-calculation.model';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  static addCalculationsForDetails(details: QuotationDetail[]): void {
    details.forEach((detail) => PriceService.addCalculationsForDetail(detail));
  }

  static addCalculationsForDetail(detail: QuotationDetail): void {
    detail.netValue = PriceService.calculateNetValue(
      detail.price,
      detail.orderQuantity
    );
    detail.percentDifference = PriceService.calculatePercentDifference(detail);

    // calculate priceUnit dependent values
    PriceService.calculatePriceUnitValues(detail);

    detail.gpi = PriceService.calculateGPI(detail.price, detail.gpc);
  }

  static calculatePriceUnitValues(detail: QuotationDetail): void {
    const { priceUnit } = detail.material;
    // calculate priceUnit dependent values
    detail.gpc = PriceService.multiplyAndRoundValues(detail.gpc, priceUnit);
    detail.sqv = PriceService.multiplyAndRoundValues(detail.sqv, priceUnit);
    detail.lastCustomerPrice = PriceService.multiplyAndRoundValues(
      detail.lastCustomerPrice,
      priceUnit
    );
    detail.price = PriceService.multiplyAndRoundValues(detail.price, priceUnit);
    detail.recommendedPrice = PriceService.multiplyAndRoundValues(
      detail.recommendedPrice,
      priceUnit
    );
    detail.strategicPrice = PriceService.multiplyAndRoundValues(
      detail.strategicPrice,
      priceUnit
    );
  }

  static multiplyAndRoundValues(value1: number, value2: number): number {
    return value1 && value2
      ? PriceService.roundToTwoDecimals(value1 * value2)
      : undefined;
  }

  static calculatePercentDifference(detail: QuotationDetail): number {
    const lastPrice = PriceService.roundToTwoDecimals(detail.lastCustomerPrice);
    const currentPrice = detail.price;
    if (currentPrice && lastPrice) {
      const priceDiff = (currentPrice - lastPrice) / lastPrice;

      return PriceService.roundPercentageToTwoDecimals(priceDiff);
    }

    return undefined;
  }

  static calculateNetValue(price: number, quantity: number): number {
    if (price && quantity) {
      return price * quantity;
    }

    return undefined;
  }

  static calculateGPI(price: number, gpc: number): number {
    if (price && gpc) {
      const gpi = (price - gpc) / price;

      return PriceService.roundPercentageToTwoDecimals(gpi);
    }

    return undefined;
  }

  static calculateStatusBarValues(
    details: QuotationDetail[]
  ): StatusBarCalculation {
    let netValue = 0;
    // sum of (gpi% * netValue) of each line
    let sumGPINetValue = 0;

    details.forEach((row: QuotationDetail) => {
      if (row.netValue) {
        netValue += row.netValue;
        if (row.gpi) {
          sumGPINetValue += row.gpi * row.netValue;
        }
      }
    });
    let weightedGPI = 0;
    if (netValue !== 0) {
      weightedGPI = Math.round((sumGPINetValue / netValue) * 100) / 100;
      netValue = Math.round(netValue * 100) / 100;
    }

    return { netValue, weightedGPI };
  }

  static roundPercentageToTwoDecimals(number: number): number {
    return Math.round(number * 10000) / 100;
  }
  static roundToTwoDecimals(number: number): number {
    return Math.round(number * 100) / 100;
  }

  static multiplyTransactionsWithPriceUnit(
    transactions: Transaction[],
    priceUnit: number
  ): Transaction[] {
    return transactions.map((transaction) => ({
      ...transaction,
      price: PriceService.multiplyAndRoundValues(transaction.price, priceUnit),
    }));
  }
}
