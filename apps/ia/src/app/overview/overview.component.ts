import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { IdValue } from '../shared/models';
import { ChartType } from './models/chart-type.enum';
import { OrgChartEmployee } from './org-chart/models/org-chart-employee.model';
import { OverviewState } from './store';
import { chartTypeSelected, loadParent } from './store/actions/overview.action';
import {
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getSelectedChartType,
  getWorldMap,
  getWorldMapContinents,
} from './store/selectors/overview.selector';
import { CountryData } from './world-map/models/country-data.model';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  orgChart$: Observable<OrgChartEmployee[]>;
  isLoadingOrgChart$: Observable<boolean>;
  isLoadingWorldMap$: Observable<boolean>;
  selectedChartType$: Observable<ChartType>;
  worldMap$: Observable<CountryData[]>;
  worldMapContinents$: Observable<IdValue[]>;

  chartType = ChartType;

  public constructor(private readonly store: Store<OverviewState>) {}

  public ngOnInit(): void {
    this.orgChart$ = this.store.pipe(select(getOrgChart));
    this.isLoadingOrgChart$ = this.store.pipe(select(getIsLoadingOrgChart));
    this.isLoadingWorldMap$ = this.store.pipe(select(getIsLoadingWorldMap));
    this.selectedChartType$ = this.store.pipe(select(getSelectedChartType));
    this.worldMap$ = this.store.pipe(select(getWorldMap));
    this.worldMapContinents$ = this.store.pipe(select(getWorldMapContinents));
  }

  public chartTypeChanged(chartType: ChartType): void {
    this.store.dispatch(chartTypeSelected({ chartType }));
  }

  public loadParent(employee: OrgChartEmployee): void {
    this.store.dispatch(loadParent({ employee }));
  }
}
