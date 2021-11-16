import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getBeautifiedSelectedTimeRange } from '../core/store/selectors';
import { ChartLegendItem } from '../shared/charts/chart-legend/models/chart-legend-item.model';
import { IdValue } from '../shared/models';
import { Employee } from '../shared/models/employee.model';
import { TailwindColor } from '../shared/models/taliwind-color.enum';
import { ChartType } from './models/chart-type.enum';
import {
  chartTypeSelected,
  loadParent,
} from './store/actions/organizational-view.action';
import {
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getSelectedChartType,
  getWorldMap,
  getWorldMapContinents,
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
  worldMapContinents$: Observable<IdValue[]>;
  selectedTimeRange$: Observable<string>;

  chartLegendItems = [
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.danger.title',
      TailwindColor.ERROR,
      'organizationalView.worldMap.chartLegend.danger.tooltip'
    ),
    new ChartLegendItem(
      'organizationalView.worldMap.chartLegend.warning.title',
      TailwindColor.WARNING,
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
    this.worldMapContinents$ = this.store.select(getWorldMapContinents);
    this.selectedTimeRange$ = this.store.select(getBeautifiedSelectedTimeRange);
  }

  chartTypeChanged(chartType: ChartType): void {
    this.store.dispatch(chartTypeSelected({ chartType }));
  }

  loadParent(employee: Employee): void {
    this.store.dispatch(loadParent({ employee }));
  }
}
