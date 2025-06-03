import {
  Component,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
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
   * @private
   * @type {CurrencyService}
   * @memberof HomeComponent
   */
  private readonly currencyService: CurrencyService = inject(CurrencyService);

  /**
   * The user currency.
   *
   * @protected
   * @type {Signal<string>}
   * @memberof HomeComponent
   */
  protected userCurrency: Signal<string> = toSignal(
    this.currencyService.getCurrentCurrency()
  );

  /**
   * The current filter values.
   *
   * @protected
   * @type {WritableSignal<GlobalSelectionState>}
   * @memberof HomeComponent
   */
  protected globalSelectionCriteria: WritableSignal<GlobalSelectionState> =
    signal(null);

  /**
   * The column filters.
   *
   * @protected
   * @type {WritableSignal<ColumnFilters>}
   * @memberof HomeComponent
   */
  protected columnFilters: WritableSignal<ColumnFilters> = signal({});

  /**
   * The PeriodTypes for use in the template.
   *
   * @protected
   * @memberof HomeComponent
   */
  protected readonly PeriodType = PeriodType;
}
