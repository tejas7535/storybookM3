import { Injectable } from '@angular/core';

import {
  ComparableLinkedTransaction,
  ExtendedComparableLinkedTransaction,
  SapConditionType,
} from '@gq/core/store/reducers/models';

import { ColumnFields } from '../../ag-grid/constants/column-fields.enum';
import { KpiValue } from '../../components/modal/editing-modal/kpi-value.model';
import { StatusBarProperties } from '../../models';
import { QuotationDetail } from '../../models/quotation-detail';
import { PriceUnitForQuotationItemId } from '../../models/quotation-detail/price-units-for-quotation-item-ids.model';
@Injectable({
  providedIn: 'root',
})
export class PriceService {
  static addCalculationsForDetails(details: QuotationDetail[]): void {
    details.forEach((detail) => PriceService.addCalculationsForDetail(detail));
  }

  static addCalculationsForDetail(detail: QuotationDetail): void {
    const priceUnit = this.getPriceUnit(detail);

    // First we need to round the price value to prevent wrong calculations down the line
    // See GQUOTE-1673
    if (typeof detail.price === 'number') {
      detail.price = this.roundValue(detail.price, priceUnit);
    }

    if (typeof detail.recommendedPrice === 'number') {
      detail.recommendedPrice = this.roundValue(
        detail.recommendedPrice,
        priceUnit
      );
    }

    if (typeof detail.lastCustomerPrice === 'number') {
      detail.lastCustomerPrice = this.roundValue(
        detail.lastCustomerPrice,
        priceUnit
      );
    }

    if (typeof detail.strategicPrice === 'number') {
      detail.strategicPrice = this.roundValue(detail.strategicPrice, priceUnit);
    }

    if (typeof detail.gpc === 'number') {
      detail.gpc = this.roundValue(detail.gpc, priceUnit);
    }

    if (typeof detail.sqv === 'number') {
      detail.sqv = this.roundValue(detail.sqv, priceUnit);
    }

    detail.netValue = this.calculateNetValue(
      detail.price,
      detail.orderQuantity
    );
    detail.priceDiff = PriceService.calculatepriceDiff(detail);
    detail.discount = PriceService.calculateDiscount(detail.price, detail);
    // calculate priceUnit dependent values
    PriceService.calculatePriceUnitValues(detail);

    detail.gpi = PriceService.calculateMargin(detail.price, detail.gpc);
    detail.lastCustomerPriceGpi = PriceService.calculateMargin(
      detail.lastCustomerPrice,
      detail.gpc
    );
    detail.gpm = PriceService.calculateMargin(detail.price, detail.sqv);
    detail.lastCustomerPriceGpm = PriceService.calculateMargin(
      detail.lastCustomerPrice,
      detail.sqv
    );
    detail.rlm = PriceService.calculateMargin(
      detail.price,
      detail.relocationCost
    );
    PriceService.calculateSapPriceValues(detail);
  }

  static roundValue = (val: number, priceUnit: number) => {
    const roundingFactor = priceUnit >= 1 ? priceUnit * 100 : 100;

    return Math.round((val + Number.EPSILON) * roundingFactor) / roundingFactor;
  };

  static calculatePriceUnitValues(detail: QuotationDetail): void {
    const priceUnit = this.getPriceUnit(detail);
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

  static calculatepriceDiff(detail: QuotationDetail): number {
    const lastPrice = detail.lastCustomerPrice;
    const currentPrice = detail.price;

    return currentPrice && lastPrice
      ? PriceService.roundPercentageToTwoDecimals(
          (currentPrice - lastPrice) / lastPrice
        )
      : undefined;
  }

  static calculateNetValue(price: number, orderQuantity: number): number {
    if (!price || !orderQuantity) {
      return undefined;
    }

    return this.multiplyAndRoundValues(price, orderQuantity);
  }

  static getPriceUnit = (detail: QuotationDetail) =>
    detail.sapPriceUnit || detail.material?.priceUnit;

  static calculateMargin(price: number, costValue: number): number | undefined {
    if (price && costValue) {
      const margin = (price - costValue) / price;

      return PriceService.roundPercentageToTwoDecimals(margin);
    }

    return undefined;
  }

  static calculateDiscount(price: number, detail: QuotationDetail): number {
    const priceUnit = this.getPriceUnit(detail);

    if (priceUnit && price && detail.sapGrossPrice) {
      const discount = 1 - (price * priceUnit) / detail.sapGrossPrice;

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
  ): StatusBarProperties {
    let totalNetValue = 0;
    let netValueGPM = 0;
    let sumGPINetValue = 0;
    let sumGPMNetValue = 0;
    let totalWeightedGPI = 0;
    let totalWeightedGPM = 0;
    let sumPriceDiffNetValue = 0;
    let sumPriceDiff = 0;
    let totalPriceDiff = 0;

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
        if (row.priceDiff) {
          sumPriceDiff += row.netValue * row.priceDiff;
          sumPriceDiffNetValue += row.netValue;
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
    if (sumPriceDiffNetValue !== 0) {
      totalPriceDiff = PriceService.roundToTwoDecimals(
        sumPriceDiff / sumPriceDiffNetValue
      );
    }

    return new StatusBarProperties(
      totalNetValue,
      totalWeightedGPI,
      totalWeightedGPM,
      totalPriceDiff,
      details.length
    );
  }

  static roundPercentageToTwoDecimals(number: number): number {
    return Math.round(number * 10_000) / 100;
  }

  static roundToTwoDecimals(number: number): number {
    return Math.round(number * 100) / 100;
  }

  static executeTransactionComputations(
    transactions: ComparableLinkedTransaction[],
    priceUnit: number
  ): ComparableLinkedTransaction[] {
    return transactions.map((transaction) => ({
      ...transaction,
      price: PriceService.multiplyAndRoundValues(transaction.price, priceUnit),
      profitMargin: PriceService.roundToTwoDecimals(transaction.profitMargin),
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
        (el) => el.sapConditionType === SapConditionType.ZMIN
      )?.amount;

      const zrtu = detail.filteredSapConditionDetails.find(
        (el) => el.sapConditionType === SapConditionType.ZRTU
      )?.amount;
      detail.msp =
        zrtu && detail.rsp
          ? PriceService.calculateMsp(detail.rsp, zrtu)
          : undefined;

      detail.sapVolumeScale =
        detail.filteredSapConditionDetails.find(
          (el) =>
            el.sapConditionType === SapConditionType.ZDVO ||
            el.sapConditionType === SapConditionType.ZEVO
        )?.amount || undefined;
    }
  }

  static calculateMsp(rsp: number, zrtu: number): number {
    return rsp * (1 - zrtu / 100);
  }

  static calculateAffectedKPIs(
    value: number,
    field: ColumnFields,
    detail: QuotationDetail,
    isRelativePrice = true
  ): KpiValue[] {
    if (field === ColumnFields.ORDER_QUANTITY) {
      return [];
    }
    const result: KpiValue[] = [];
    let updatedPrice: number;

    if (isRelativePrice) {
      switch (field) {
        case ColumnFields.PRICE:
          updatedPrice = PriceService.multiplyAndRoundValues(
            detail.price,
            1 + value / 100
          );
          break;
        case ColumnFields.GPI:
          updatedPrice = PriceService.getManualPriceByMarginAndCost(
            detail.gpc,
            value
          );
          break;
        case ColumnFields.GPM:
          updatedPrice = PriceService.getManualPriceByMarginAndCost(
            detail.sqv,
            value
          );
          break;
        case ColumnFields.DISCOUNT:
          updatedPrice = PriceService.getManualPriceByDiscount(
            detail.sapGrossPrice,
            value
          );
          break;
        default:
          throw new Error('No matching Column Field for computation');
      }
    } else {
      updatedPrice = value;
    }

    result.push({
      key: ColumnFields.PRICE,
      value: updatedPrice,
    });

    // calc gpi
    if (field !== ColumnFields.GPI) {
      const gpi = PriceService.calculateMargin(updatedPrice, detail.gpc);
      result.push({
        key: ColumnFields.GPI,
        value: gpi,
      });
    }

    // calc gpm
    if (field !== ColumnFields.GPM) {
      const gpm = PriceService.calculateMargin(updatedPrice, detail.sqv);
      result.push({
        key: ColumnFields.GPM,
        value: gpm,
      });
    }

    // calc discount
    if (field !== ColumnFields.DISCOUNT) {
      const discount = PriceService.calculateDiscount(updatedPrice, detail);
      result.push({
        key: ColumnFields.DISCOUNT,
        value: discount,
      });
    }

    return result;
  }
}
