import { inject, Injectable } from '@angular/core';

import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
} from '@gq/shared/models';
import { getSapStandardPriceSource } from '@gq/shared/utils/price-source.utils';
import {
  calculateMargin,
  calculateNetValue,
  calculatePriceDiff,
} from '@gq/shared/utils/pricing.utils';
import { IRowNode } from 'ag-grid-enterprise';

import { SimulationService } from './simulation.service';

@Injectable({
  providedIn: 'root',
})
export class PriceSourceSimulationService {
  private readonly simulationService = inject(SimulationService);

  /**
   * Simulate the price source change for the selected rows
   *
   * @param priceSourceOption the price source option
   * @param gqId the quotation id
   * @param selectedRows the selected rows
   */
  public onPriceSourceSimulation(
    priceSourceOption: PriceSourceOptions,
    gqId: number,
    selectedRows: IRowNode[]
  ): void {
    const simulatedRows = selectedRows
      .map((row: IRowNode) => {
        const detail: QuotationDetail = row.data;

        const targetPriceSource =
          this.getTargetPriceSourceForPriceSourceSimulation(
            detail,
            priceSourceOption
          );

        /**
         * Do not simulate if
         * 1. priceSource is already correct
         * 2. GQ Price is targetPriceSource but no GQ Price is available
         * 3. StrategicPrice is targetPriceSource but no strategic Price is available
         * 4. SAP Price is targetPriceSource but not SAP Price is available
         * 5. Target Price is targetPriceSource but no Target Price is available
         */
        if (
          detail.priceSource === targetPriceSource ||
          (targetPriceSource === PriceSource.GQ && !detail.recommendedPrice) ||
          (targetPriceSource === PriceSource.STRATEGIC &&
            !detail.strategicPrice) ||
          (targetPriceSource !== PriceSource.GQ &&
            targetPriceSource !== PriceSource.TARGET_PRICE &&
            !detail.sapPriceCondition) ||
          (targetPriceSource === PriceSource.TARGET_PRICE &&
            !detail.targetPrice)
        ) {
          return undefined as any;
        }
        // set new price according to targetPriceSource and available data of the position
        const newPrice = this.getPriceByTargetPriceSource(
          targetPriceSource,
          detail
        );

        // set new price source according to targetPriceSource and available data of the position
        const newPriceSource = this.getPriceSourceForPriceSourceSimulation(
          targetPriceSource,
          detail
        );
        const affectedKpis = this.simulationService.calculateAffectedKPIs(
          newPrice,
          ColumnFields.PRICE,
          row.data,
          false
        );

        const simulatedPrice = this.simulationService.getAffectedKpi(
          affectedKpis,
          ColumnFields.PRICE
        );

        const simulatedRow: QuotationDetail = {
          ...row.data,
          price: simulatedPrice,
          priceSource: newPriceSource,
          netValue: calculateNetValue(simulatedPrice, row.data),
          gpi: this.simulationService.getAffectedKpi(
            affectedKpis,
            ColumnFields.GPI
          ),
          gpm: this.simulationService.getAffectedKpi(
            affectedKpis,
            ColumnFields.GPM
          ),
          discount: this.simulationService.getAffectedKpi(
            affectedKpis,
            ColumnFields.DISCOUNT
          ),
          priceDiff: calculatePriceDiff(
            row.data.lastCustomerPrice,
            simulatedPrice
          ),
          rlm: calculateMargin(simulatedPrice, row.data.relocationCost),
        };

        return simulatedRow;
      })
      .filter(Boolean);

    const selectedDetails = selectedRows.map((row) => row.data);

    this.simulationService.updateStoreForSimulation(
      gqId,
      simulatedRows,
      ColumnFields.PRICE_SOURCE,
      selectedDetails
    );
  }

  private getTargetPriceSourceForPriceSourceSimulation(
    detail: QuotationDetail,
    priceSourceOption: PriceSourceOptions
  ) {
    if (priceSourceOption === PriceSourceOptions.GQ) {
      return detail.recommendedPrice ? PriceSource.GQ : PriceSource.STRATEGIC;
    }

    if (priceSourceOption === PriceSourceOptions.TARGET_PRICE) {
      return PriceSource.TARGET_PRICE;
    }

    if (detail.sapPriceCondition === SapPriceCondition.STANDARD) {
      return getSapStandardPriceSource(detail);
    }

    if (detail.sapPriceCondition === SapPriceCondition.CAP_PRICE) {
      return PriceSource.CAP_PRICE;
    }

    return PriceSource.SAP_SPECIAL;
  }

  private getPriceSourceForPriceSourceSimulation(
    targetPriceSource: PriceSource,
    detail: QuotationDetail
  ): PriceSource {
    if (
      [
        PriceSource.GQ,
        PriceSource.STRATEGIC,
        PriceSource.TARGET_PRICE,
      ].includes(targetPriceSource)
    ) {
      return targetPriceSource;
    }

    if (detail.sapPriceCondition === SapPriceCondition.STANDARD) {
      return getSapStandardPriceSource(detail);
    }

    if (detail.sapPriceCondition === SapPriceCondition.CAP_PRICE) {
      return PriceSource.CAP_PRICE;
    }

    return PriceSource.SAP_SPECIAL;
  }

  private getPriceByTargetPriceSource(
    targetPriceSource: PriceSource,
    detail: QuotationDetail
  ) {
    if (targetPriceSource === PriceSource.GQ) {
      return detail.recommendedPrice;
    }
    if (targetPriceSource === PriceSource.STRATEGIC) {
      return detail.strategicPrice;
    }
    if (targetPriceSource === PriceSource.TARGET_PRICE) {
      return detail.targetPrice;
    }

    return detail.sapPrice;
  }
}
