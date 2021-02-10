import { Injectable } from '@angular/core';

import { loadQuotationSuccess } from '../../../core/store/actions/process-case/process-case.action';
import { Quotation, QuotationDetail } from '../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  public addCalculations(quotation: Quotation): any {
    const item: Quotation = {
      ...quotation,
      quotationDetails: this.addCalculationsForDetails(
        quotation.quotationDetails
      ),
    };

    return loadQuotationSuccess({
      item,
    });
  }

  public addCalculationsForDetails(
    details: QuotationDetail[]
  ): QuotationDetail[] {
    return details.map((detail) => this.addCalculationsForDetail(detail));
  }

  public addCalculationsForDetail(detail: QuotationDetail): QuotationDetail {
    const updatedDetail: QuotationDetail = {
      ...detail,
      percentDifference: this.calculatePercentDiffernce(detail),
      netValue: this.calculateNetValue(detail.price, detail.orderQuantity),
    };

    return updatedDetail;
  }

  public calculatePercentDiffernce(detail: QuotationDetail): number {
    const lastPrice = detail.lastCustomerPrice;
    const currentPrice =
      // Use finalRecommendedSelling Price for the business price when price source is there
      //  detail.priceSource === PriceSource.GQ
      //    ? detail.finalRecommendedSellingPrice :
      detail.price;

    if (currentPrice && lastPrice) {
      return Math.round(((currentPrice - lastPrice) / lastPrice) * 10000) / 100;
    }

    return undefined;
  }

  public calculateNetValue(price: number, quantity: number): number {
    if (price && quantity) {
      return price * quantity;
    }

    return undefined;
  }
}
