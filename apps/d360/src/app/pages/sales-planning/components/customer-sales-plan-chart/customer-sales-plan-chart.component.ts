import { CommonModule } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ForecastChartComponent } from '../../../../feature/forecast-chart/components/forecast-chart/forecast-chart.component';
import { PeriodType } from '../../../../feature/forecast-chart/model';
import { GlobalSelectionState } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';

const EMPTY_GLOBAL_SELECTION_STATE: GlobalSelectionState = {
  alertType: [],
  customerNumber: [],
  gkamNumber: [],
  materialClassification: [],
  materialNumber: [],
  productionPlant: [],
  productionSegment: [],
  region: [],
  salesArea: [],
  salesOrg: [],
  sector: [],
  sectorManagement: [],
};

@Component({
  selector: 'd360-customer-sales-plan-chart',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    ReactiveFormsModule,
    LoadingSpinnerModule,
    NgxEchartsModule,
    ForecastChartComponent,
  ],
  templateUrl: './customer-sales-plan-chart.component.html',
})
export class CustomerSalesPlanChartComponent {
  protected readonly planningCurrency = input.required<string>();
  protected readonly customerName = input.required<string>();
  protected readonly customerNumber = input.required<string>();

  protected readonly PeriodType = PeriodType;

  /**
   * Compute the GlobalSelectionState based on provided customerName and customerNumber.
   * If both are available, they are used to build a custom global selection;
   * otherwise, return an empty selection.
   */
  protected readonly globalSelectionState: Signal<GlobalSelectionState> =
    computed(() => {
      const customerName = this.customerName();
      const customerNumber = this.customerNumber();

      return customerName && customerNumber
        ? {
            ...EMPTY_GLOBAL_SELECTION_STATE,
            customerNumber: [{ id: customerNumber, text: customerName }],
          }
        : EMPTY_GLOBAL_SELECTION_STATE;
    });
}
