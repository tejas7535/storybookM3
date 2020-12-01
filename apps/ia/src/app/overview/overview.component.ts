// tslint:disable no-default-import
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Employee } from '../shared/models';
import { ChartType } from './models/chart-type.enum';
import { OverviewState } from './store';
import { chartTypeSelected } from './store/actions/overview.action';
import {
  getFilteredEmployeesForOrgChart,
  getOrgChartLoading,
  getSelectedChartType,
} from './store/selectors/overview.selector';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  orgChart$: Observable<Employee[]>;
  isOrgChartLoading$: Observable<boolean>;
  selectedChartType$: Observable<ChartType>;

  chartType = ChartType;

  public constructor(private readonly store: Store<OverviewState>) {}

  public ngOnInit(): void {
    this.orgChart$ = this.store.pipe(select(getFilteredEmployeesForOrgChart));
    this.isOrgChartLoading$ = this.store.pipe(select(getOrgChartLoading));
    this.selectedChartType$ = this.store.pipe(select(getSelectedChartType));
  }

  public chartTypeChanged(chartType: ChartType): void {
    this.store.dispatch(chartTypeSelected({ chartType }));
  }
}
