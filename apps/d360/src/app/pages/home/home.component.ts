import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ForecastChartComponent } from '../../feature/forecast-chart/components/forecast-chart/forecast-chart.component';
import { PeriodType } from '../../feature/forecast-chart/model';
import { CurrencyService } from '../../feature/info/currency.service';
import { ColumnFilters } from '../../shared/ag-grid/grid-filter-model';
import { GlobalSelectionCriteriaComponent } from '../../shared/components/global-selection-criteria/global-selection-criteria/global-selection-criteria.component';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { MaterialCustomerTableComponent } from './table/components/material-customer-table/material-customer-table.component';

@Component({
  selector: 'd360-home',
  imports: [
    GlobalSelectionCriteriaComponent,
    ForecastChartComponent,
    StyledSectionComponent,
    MaterialCustomerTableComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  /**
   * The CurrencyService.
   *
   * @type {CurrencyService}
   * @memberof HomeComponent
   */
  private readonly currencyService: CurrencyService = inject(CurrencyService);

  /**
   * The user currency.
   *
   * @type {Signal<string>}
   * @protected
   */
  protected userCurrency: Signal<string> = toSignal(
    this.currencyService.getCurrentCurrency()
  );

  /**
   * The current filter values.
   *
   * @type {GlobalSelectionState}
   * @memberof HomeComponent
   */
  public globalSelectionCriteria: GlobalSelectionState = null;

  /**
   * The column filters.
   *
   * @type {ColumnFilters}
   * @memberof HomeComponent
   */
  public columnFilters: ColumnFilters = {};

  /**
   * On filter update set the new values for the global selection state.
   *
   * @param {GlobalSelectionState} globalSelectionState
   * @memberof HomeComponent
   */
  onUpdateGlobalSelectionState(globalSelectionState: GlobalSelectionState) {
    this.globalSelectionCriteria = globalSelectionState;
  }

  /**
   * On filter update set the new values for the column filters.
   *
   * @param {ColumnFilters} columnFilters
   * @memberof HomeComponent
   */
  onUpdateColumnFilter(columnFilters: ColumnFilters) {
    this.columnFilters = columnFilters;
  }

  protected readonly PeriodType = PeriodType;
}
