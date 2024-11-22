import { Component } from '@angular/core';

import { ForecastChartComponent } from '../../feature/forecast-chart/components/forecast-chart/forecast-chart.component';
import { ColumnFilters } from '../../shared/ag-grid/grid-filter-model';
import { GlobalSelectionCriteriaComponent } from '../../shared/components/global-selection-criteria/global-selection-criteria/global-selection-criteria.component';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { StyledGridSectionComponent } from '../../shared/components/styled-grid-section/styled-grid-section.component';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { MaterialCustomerTableComponent } from './table/components/material-customer-table/material-customer-table.component';

@Component({
  selector: 'd360-home',
  standalone: true,
  imports: [
    GlobalSelectionCriteriaComponent,
    ForecastChartComponent,
    StyledSectionComponent,
    MaterialCustomerTableComponent,
    StyledGridSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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
}
