import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getBeautifiedSelectedTimeRange } from '../core/store/selectors';
import { ChartLegendItem } from '../shared/charts/models/chart-legend-item.model';
import { Employee, TailwindColor } from '../shared/models';
import { ChartType } from './models/chart-type.enum';
import {
  chartTypeSelected,
  loadParent,
} from './store/actions/organizational-view.action';
import {
  getContinents,
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getSelectedChartType,
  getWorldMap,
} from './store/selectors/organizational-view.selector';
import { CountryData } from './world-map/models/country-data.model';

@Component({
  selector: 'ia-organizational-view',
  templateUrl: './organizational-view.component.html',
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
})
export class OrganizationalViewComponent implements OnInit {
  orgChart$: Observable<Employee[]>;
  isLoadingOrgChart$: Observable<boolean>;
  isLoadingWorldMap$: Observable<boolean>;
  selectedChartType$: Observable<ChartType>;
  worldMap$: Observable<CountryData[]>;
  continents$: Observable<string[]>;
  selectedTimeRange$: Observable<string>;

  chartLegendItems = [
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.danger.title',
      TailwindColor.ERROR,
      'organizationalView.worldMap.chartLegend.danger.tooltip'
    ),
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.warning.title',
      TailwindColor.SUNNY_YELLOW,
      'organizationalView.worldMap.chartLegend.warning.tooltip'
    ),
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.ok.title',
      TailwindColor.PRIMARY,
      'organizationalView.worldMap.chartLegend.ok.tooltip'
    ),
  ];

  chartType = ChartType;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgChart$ = this.store.select(getOrgChart);
    this.isLoadingOrgChart$ = this.store.select(getIsLoadingOrgChart);
    this.isLoadingWorldMap$ = this.store.select(getIsLoadingWorldMap);
    this.selectedChartType$ = this.store.select(getSelectedChartType);
    this.worldMap$ = this.store.select(getWorldMap);
    this.continents$ = this.store.select(getContinents);
    this.selectedTimeRange$ = this.store.select(getBeautifiedSelectedTimeRange);
  }

  chartTypeChanged(chartType: ChartType): void {
    this.store.dispatch(chartTypeSelected({ chartType }));
  }

  loadParent(employee: Employee): void {
    this.store.dispatch(loadParent({ employee }));
  }
}
