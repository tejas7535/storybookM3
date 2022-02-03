import { Injectable } from '@angular/core';

import { ExtendedComparableLinkedTransaction } from '../../../core/store/reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import { ComparableLinkedTransaction } from '../../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { QuotationDetail } from '../../models/quotation-detail';
import { PriceUnitForQuotationItemId } from '../../models/quotation-detail/price-units-for-quotation-item-ids.model';
import { StatusBarCalculation } from './models/status-bar-calculation.model';
import { SapConditionType } from '../../../core/store/reducers/sap-price-details/models/';
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
    detail.discount = PriceService.calculateDiscount(detail);
    // calculate priceUnit dependent values
    PriceService.calculatePriceUnitValues(detail);

    detail.gpi = PriceService.calculateMargin(detail.price, detail.gpc);
    detail.gpm = PriceService.calculateMargin(detail.price, detail.sqv);
    detail.rlm = PriceService.calculateMargin(
      detail.price,
      detail.relocationCost
    );
    PriceService.calculateSapPriceValues(detail);
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
    const lastPrice = detail.lastCustomerPrice;
    const currentPrice = detail.price;

    return currentPrice && lastPrice
      ? PriceService.roundPercentageToTwoDecimals(
          (currentPrice - lastPrice) / lastPrice
        )
      : undefined;
  }

  static calculateNetValue(price: number, quantity: number): number {
    if (price && quantity) {
      return price * quantity;
    }

    return undefined;
  }

  static calculateMargin(price: number, costValue: number): number | undefined {
    if (price && costValue) {
      const margin = (price - costValue) / price;

      return PriceService.roundPercentageToTwoDecimals(margin);
    }

    return undefined;
  }

  static calculateDiscount(detail: QuotationDetail): number {
    if (detail.price && detail.sapGrossPrice) {
      const discount =
        1 - (detail.price * detail.material.priceUnit) / detail.sapGrossPrice;

      return PriceService.roundPercentageToTwoDecimals(discount);
    }

    return undefined;
  }

  static getManualPriceByDiscount(
    sapGrossPrice: number,
    discount: number
  ): number {
    const newPrice = (1 - discount / 100) * sapGrossPrice;

    return PriceService.roundToTwoDecimals(newPrice);
  }

  static getManualPriceByMarginAndCost(cost: number, margin: number): number {
    const newPrice = cost / (-margin / 100 + 1);

    return PriceService.roundToTwoDecimals(newPrice);
  }

  /**
   * https://confluence.schaeffler.com/display/PARS/Implementation+Prices
   * @param details
   */
  static calculateStatusBarValues(
    details: QuotationDetail[]
  ): StatusBarCalculation {
    let totalNetValue = 0;
    let netValueGPM = 0;
    let sumGPINetValue = 0;
    let sumGPMNetValue = 0;
    let totalWeightedGPI = 0;
    let totalWeightedGPM = 0;

    this.keepMaxQuantityIfDuplicate(details).forEach((row: QuotationDetail) => {
      if (row.netValue) {
        totalNetValue += row.netValue;
        if (row.gpi) {
          sumGPINetValue += row.gpi * row.netValue;
        }
        if (row.gpm) {
          netValueGPM += row.netValue;
          sumGPMNetValue += row.gpm * row.netValue;
        }
      }
    });
    if (netValueGPM !== 0) {
      totalWeightedGPM = PriceService.roundToTwoDecimals(
        sumGPMNetValue / netValueGPM
      );
    }
    if (totalNetValue !== 0) {
      totalWeightedGPI = PriceService.roundToTwoDecimals(
        sumGPINetValue / totalNetValue
      );
      totalNetValue = PriceService.roundToTwoDecimals(totalNetValue);
    }

    return { totalNetValue, totalWeightedGPI, totalWeightedGPM };
  }

  static roundPercentageToTwoDecimals(number: number): number {
    return Math.round(number * 10_000) / 100;
  }

  static roundToTwoDecimals(number: number): number {
    return Math.round(number * 100) / 100;
  }

  static multiplyTransactionsWithPriceUnit(
    transactions: ComparableLinkedTransaction[],
    priceUnit: number
  ): ComparableLinkedTransaction[] {
    return transactions.map((transaction) => ({
      ...transaction,
      price: PriceService.multiplyAndRoundValues(transaction.price, priceUnit),
    }));
  }

  static multiplyExtendedComparableLinkedTransactionsWithPriceUnit(
    transactions: ExtendedComparableLinkedTransaction[],
    priceUnitsForQuotationItemIds: PriceUnitForQuotationItemId[]
  ): ExtendedComparableLinkedTransaction[] {
    return transactions.map((transaction) => ({
      ...transaction,
      price: PriceService.multiplyAndRoundValues(
        transaction.price,
        priceUnitsForQuotationItemIds.find(
          (priceUnitsForQuotationItemId: PriceUnitForQuotationItemId) =>
            transaction.itemId === priceUnitsForQuotationItemId.quotationItemId
        ).priceUnit
      ),
    }));
  }

  static keepMaxQuantityIfDuplicate(
    quotationDetails: QuotationDetail[]
  ): QuotationDetail[] {
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
  }

  static calculateSapPriceValues(detail: QuotationDetail): void {
    if (detail.filteredSapConditionDetails) {
      detail.rsp = detail.filteredSapConditionDetails.find(
        (el) => el.sapConditionType == SapConditionType.ZMIN
      )?.amount;

      const zrtu = detail.filteredSapConditionDetails.find(
        (el) => el.sapConditionType === SapConditionType.ZRTU
      )?.amount;
      detail.msp =
        zrtu && detail.rsp
          ? PriceService.calculateMsp(detail.rsp, zrtu)
          : undefined;
    }
  }

  static calculateMsp(rsp: number, zrtu: number): number {
    return rsp * (1 - zrtu / 100);
  }
}
