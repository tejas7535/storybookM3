import { Injectable } from '@angular/core';

import {
  QuotationDetail,
  StatusBarCalculation,
} from '../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  static addCalculationsForDetails(details: QuotationDetail[]): void {
    details.forEach((detail) => PriceService.addCalculationsForDetail(detail));
  }

  static addCalculationsForDetail(detail: QuotationDetail): void {
    detail.gpi = PriceService.calculateGPI(detail.price, detail.gpc);
    detail.percentDifference = PriceService.calculatePercentDiffernce(detail);
    detail.netValue = PriceService.calculateNetValue(
      detail.price,
      detail.orderQuantity
    );
  }

  static calculatePercentDiffernce(detail: QuotationDetail): number {
    const lastPrice = detail.lastCustomerPrice;
    const currentPrice =
      // Use finalRecommendedSelling Price for the business price when price source is there
      //  detail.priceSource === PriceSource.GQ
      //    ? detail.finalRecommendedSellingPrice :
      detail.price;

    if (currentPrice && lastPrice) {
      const priceDiff = (currentPrice - lastPrice) / lastPrice;

      return PriceService.roundToTwoDecimals(priceDiff);
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

      return PriceService.roundToTwoDecimals(gpi);
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

  static roundToTwoDecimals(number: number): number {
    return Math.round(number * 10000) / 100;
  }
}
