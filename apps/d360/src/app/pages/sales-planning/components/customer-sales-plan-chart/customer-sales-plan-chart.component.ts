import { CommonModule } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ForecastChartComponent } from '../../../../feature/forecast-chart/components/forecast-chart/forecast-chart.component';
import { PeriodType } from '../../../../feature/forecast-chart/model';
import { GlobalSelectionState } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { StyledSectionComponent } from '../../../../shared/components/styled-section/styled-section.component';
import { Customer } from '../../sales-planning.component';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerModule,
    NgxEchartsModule,
    ForecastChartComponent,
    StyledSectionComponent,
  ],
  templateUrl: './customer-sales-plan-chart.component.html',
})
export class CustomerSalesPlanChartComponent {
  protected readonly customer = input.required<Customer>();

  protected readonly PeriodType = PeriodType;

  /**
   * Compute the GlobalSelectionState based on provided customerName and customerNumber.
   * If both are available, they are used to build a custom global selection;
   * otherwise, return an empty selection.
   */
  protected readonly globalSelectionState: Signal<GlobalSelectionState> =
    computed(() => {
      const customerName = this.customer().customerName;
      const customerNumber = this.customer().customerNumber;

      return customerName && customerNumber
        ? {
            ...EMPTY_GLOBAL_SELECTION_STATE,
            customerNumber: [{ id: customerNumber, text: customerName }],
          }
        : EMPTY_GLOBAL_SELECTION_STATE;
    });
}
