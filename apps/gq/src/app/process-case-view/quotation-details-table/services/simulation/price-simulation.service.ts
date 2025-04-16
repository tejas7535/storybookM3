import { inject, Injectable } from '@angular/core';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetail } from '@gq/shared/models';
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
    const selectedRowsAsDetails = selectedRows.map(
      (row: IRowNode) => row.data as QuotationDetail
    );

    this.simulationService.performSimulation(
      gqId,
      simulatedField,
      value,
      null,
      selectedRowsAsDetails
    );
  }
}
