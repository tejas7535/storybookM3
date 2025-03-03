import { inject, Injectable } from '@angular/core';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { PriceSource, QuotationDetail } from '@gq/shared/models';
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
export class PriceSimulationService {
  private readonly simulationService = inject(SimulationService);

  /**
   * Simulate the selected quotation details based on the field and value and updates the store
   *
   * @param simulatedField the field that is being simulated
   * @param value the value of the field
   * @param selectedRows the selected rows
   * @param gqId the quotation id
   */
  public simulateSelectedQuotationDetails(
    simulatedField: ColumnFields,
    value: number,
    selectedRows: IRowNode[],
    gqId: number
  ): void {
    const simulatedRows = selectedRows.map((row: IRowNode) =>
      this.getSimulatedRow(simulatedField, value, row.data as QuotationDetail)
    );

    const selectedRowsAsDetails = selectedRows.map(
      (row: IRowNode) => row.data as QuotationDetail
    );

    this.simulationService.updateStoreForSimulation(
      gqId,
      simulatedRows,
      simulatedField,
      selectedRowsAsDetails
    );
  }

  private getSimulatedRow(
    simulatedField: ColumnFields,
    value: number,
    detail: QuotationDetail
  ): QuotationDetail {
    if (!this.shouldSimulate(simulatedField, detail)) {
      return detail;
    }
    let simulatedRow: QuotationDetail = detail;

    const affectedKpis = this.simulationService.calculateAffectedKPIs(
      value,
      simulatedField,
      detail
    );
    // for target price, only target price should be updated
    if (simulatedField === ColumnFields.TARGET_PRICE) {
      simulatedRow = {
        ...detail,
        targetPrice: this.simulationService.getAffectedKpi(
          affectedKpis,
          ColumnFields.TARGET_PRICE
        ),
      };
    } else {
      const simulatedPrice = this.simulationService.getAffectedKpi(
        affectedKpis,
        ColumnFields.PRICE
      );
      simulatedRow = {
        ...detail,
        price: simulatedPrice,
        priceSource: PriceSource.MANUAL,
        netValue: calculateNetValue(simulatedPrice, detail),
        gpi:
          simulatedField === ColumnFields.GPI
            ? value
            : this.simulationService.getAffectedKpi(
                affectedKpis,
                ColumnFields.GPI
              ),
        gpm:
          simulatedField === ColumnFields.GPM
            ? value
            : this.simulationService.getAffectedKpi(
                affectedKpis,
                ColumnFields.GPM
              ),
        discount:
          simulatedField === ColumnFields.DISCOUNT
            ? value
            : this.simulationService.getAffectedKpi(
                affectedKpis,
                ColumnFields.DISCOUNT
              ),
        priceDiff: calculatePriceDiff(detail.lastCustomerPrice, simulatedPrice),
        rlm: calculateMargin(simulatedPrice, detail.relocationCost),
      };
    }

    return simulatedRow;
  }

  private shouldSimulate(
    field: ColumnFields,
    detail: QuotationDetail
  ): boolean {
    switch (field) {
      case ColumnFields.DISCOUNT: {
        return detail.sapGrossPrice && detail.sapGrossPrice > 0;
      }
      case ColumnFields.GPI: {
        return detail.gpc && detail.gpc > 0;
      }
      case ColumnFields.GPM: {
        return detail.sqv && detail.sqv > 0;
      }
      default: {
        return true;
      }
    }
  }
}
