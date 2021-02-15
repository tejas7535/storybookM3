import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';

import { loadQuotationSuccess } from '../../../core/store/actions/process-case/process-case.action';
import { Quotation, QuotationDetail } from '../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  static addCalculations(quotation: Quotation): Action {
    const item: Quotation = {
      ...quotation,
      quotationDetails: PriceService.addCalculationsForDetails(
        quotation.quotationDetails
      ),
    };

    return loadQuotationSuccess({
      item,
    });
  }

  static addCalculationsForDetails(
    details: QuotationDetail[]
  ): QuotationDetail[] {
    return details.map((detail) =>
      PriceService.addCalculationsForDetail(detail)
    );
  }

  static addCalculationsForDetail(detail: QuotationDetail): QuotationDetail {
    const updatedDetail: QuotationDetail = {
      ...detail,
      gpi: PriceService.calculateGPI(detail.price, detail.gpc),
      percentDifference: PriceService.calculatePercentDiffernce(detail),
      netValue: PriceService.calculateNetValue(
        detail.price,
        detail.orderQuantity
      ),
    };

    return updatedDetail;
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

  static roundToTwoDecimals(number: number): number {
    return Math.round(number * 10000) / 100;
  }
}
