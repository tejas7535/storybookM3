import { inject, Injectable } from '@angular/core';

import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
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
    const selectedDetails = selectedRows.map((row) => row.data);

    this.simulationService.performSimulation(
      gqId,
      ColumnFields.PRICE_SOURCE,
      null,
      priceSourceOption,
      selectedDetails
    );
  }
}
