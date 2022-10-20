import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getSelectedTimeRange } from '../core/store/selectors';
import { ChartLegendItem } from '../shared/charts/models/chart-legend-item.model';
import { IdValue, TailwindColor } from '../shared/models';
import { ChartType } from './models/chart-type.enum';
import { DimensionFluctuationData } from './models/dimension-fluctuation-data.model';
import {
  chartTypeSelected,
  loadOrgChartFluctuationMeta,
  loadParent,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMapFluctuationRegionMeta,
} from './store/actions/organizational-view.action';
import {
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getRegions,
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
  orgChart$: Observable<DimensionFluctuationData[]>;
  isLoadingOrgChart$: Observable<boolean>;
  isLoadingWorldMap$: Observable<boolean>;
  selectedChartType$: Observable<ChartType>;
  worldMap$: Observable<CountryData[]>;
  regions$: Observable<string[]>;
  selectedTimeRange$: Observable<IdValue>;

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
    this.regions$ = this.store.select(getRegions);
    this.selectedTimeRange$ = this.store.select(getSelectedTimeRange);
  }

  chartTypeChanged(chartType: ChartType): void {
    this.store.dispatch(chartTypeSelected({ chartType }));
  }

  loadParent(data: DimensionFluctuationData): void {
    this.store.dispatch(loadParent({ data }));
  }

  loadFluctuationMeta(data: DimensionFluctuationData): void {
    this.store.dispatch(loadOrgChartFluctuationMeta({ data }));
  }

  loadRegionMeta(region: string): void {
    this.store.dispatch(loadWorldMapFluctuationRegionMeta({ region }));
  }

  loadCountryMeta(country: string): void {
    this.store.dispatch(loadWorldMapFluctuationCountryMeta({ country }));
  }
}
