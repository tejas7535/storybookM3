import { inject, Injectable } from '@angular/core';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import { QuotationDetail } from '@gq/shared/models';
import {
  calculateDiscount,
  calculateMargin,
  getManualPriceByDiscount,
  getManualPriceByMarginAndCost,
  multiplyAndRoundValues,
} from '@gq/shared/utils/pricing.utils';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private readonly activeCaseFacade = inject(ActiveCaseFacade);

  public performSimulation(
    gqId: number,
    simulatedField: ColumnFields,
    simulatedValue: number,
    priceSourceOption: PriceSourceOptions,
    selectedRows: QuotationDetail[]
  ) {
    this.activeCaseFacade.performSimulation(
      gqId,
      simulatedField,
      simulatedValue,
      priceSourceOption,
      selectedRows
    );
  }

  // todo: Method to remove! Method used in editing modal. Probably should be replaced with BE call to calculate KPIs.
  /**
   * Calculate the affected KPIs based on the value of the field
   *
   * @param value the value of the field
   * @param simulatedField the field that is being updated
   * @param detail the quotation detail
   * @param isRelativePrice if the value is a relative price (%) or absolute price
   *
   * @returns the affected KPIs
   */
  public calculateAffectedKPIs = (
    value: number,
    simulatedField: ColumnFields,
    detail: QuotationDetail,
    isRelativePrice = true
  ): KpiValue[] => {
    // no affected KPIs for order quantity
    if (simulatedField === ColumnFields.ORDER_QUANTITY) {
      return [];
    }

    const result: KpiValue[] = [];
    const updatedPrice = isRelativePrice
      ? this.calculateRelativePrice(simulatedField, detail, value)
      : value;

    // if target price is simulated, only target price should be updated, else update all KPIs
    if (simulatedField === ColumnFields.TARGET_PRICE) {
      result.push({
        key: ColumnFields.TARGET_PRICE,
        value: updatedPrice === detail?.targetPrice ? undefined : updatedPrice,
      });
    } else {
      result.push({
        key: ColumnFields.PRICE,
        value: updatedPrice,
      });

      // calc gpi
      if (simulatedField !== ColumnFields.GPI) {
        const gpi = calculateMargin(updatedPrice, detail.gpc);
        result.push({
          key: ColumnFields.GPI,
          value: gpi,
        });
      }

      // calc gpm
      if (simulatedField !== ColumnFields.GPM) {
        const gpm = calculateMargin(updatedPrice, detail.sqv);
        result.push({
          key: ColumnFields.GPM,
          value: gpm,
        });
      }

      // calc discount
      if (
        simulatedField !== ColumnFields.DISCOUNT &&
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

  // todo: Method to remove!
  private calculateRelativePrice(
    field: ColumnFields,
    detail: QuotationDetail,
    relativeValue: number
  ): number {
    const relativeMultiplier = 1 + relativeValue / 100;

    switch (field) {
      case ColumnFields.PRICE: {
        return multiplyAndRoundValues(detail.price, relativeMultiplier);
      }
      case ColumnFields.TARGET_PRICE: {
        return multiplyAndRoundValues(detail.targetPrice, relativeMultiplier);
      }
      case ColumnFields.GPI: {
        return getManualPriceByMarginAndCost(detail.gpc, relativeValue);
      }
      case ColumnFields.GPM: {
        return getManualPriceByMarginAndCost(detail.sqv, relativeValue);
      }
      case ColumnFields.DISCOUNT: {
        return getManualPriceByDiscount(detail.sapGrossPrice, relativeValue);
      }
      default: {
        throw new Error('No matching Column Field for computation');
      }
    }
  }
}
