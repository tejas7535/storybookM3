import { Component, OnInit, ViewChild } from '@angular/core';

import { map, Observable, take } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getSelectedTimeRange } from '../core/store/selectors';
import { ChartLegendItem } from '../shared/charts/models/chart-legend-item.model';
import { FilterDimension, IdValue, TailwindColor } from '../shared/models';
import { ChartType, DimensionFluctuationData } from './models';
import { OrgChartData, OrgChartEmployee } from './org-chart/models';
import { OrgChartComponent } from './org-chart/org-chart.component';
import {
  chartTypeSelected,
  loadChildAttritionOverTimeForWorldMap,
  loadChildAttritionOverTimeOrgChart,
  loadOrgChartEmployees,
  loadParent,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMapFluctuationRegionMeta,
} from './store/actions/organizational-view.action';
import {
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getOrgChartEmployees,
  getOrgChartEmployeesLoading,
  getOrgChartLoading,
  getRegions,
  getSelectedChartType,
  getWorldMap,
} from './store/selectors/organizational-view.selector';
import { CountryDataAttrition } from './world-map/models/country-data-attrition.model';

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
  orgChart$: Observable<OrgChartData>;
  orgChartLoading$: Observable<boolean>;
  orgChartEmployees$: Observable<OrgChartEmployee[]>;
  orgChartEmployeesLoading$: Observable<boolean>;
  isLoadingOrgChart$: Observable<boolean>;
  isLoadingWorldMap$: Observable<boolean>;
  selectedChartType$: Observable<ChartType>;
  worldMap$: Observable<CountryDataAttrition[]>;
  regions$: Observable<string[]>;
  selectedTimeRange$: Observable<IdValue>;
  openPositionsAvailable$: Observable<boolean>;

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

  @ViewChild(OrgChartComponent) orgChartComponent: OrgChartComponent;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.orgChart$ = this.selectOrgChartWithTranslation();
    this.orgChartLoading$ = this.store.select(getOrgChartLoading);
    this.orgChartEmployees$ = this.store.select(getOrgChartEmployees);
    this.orgChartEmployeesLoading$ = this.store.select(
      getOrgChartEmployeesLoading
    );
    this.isLoadingOrgChart$ = this.store.select(getIsLoadingOrgChart);
    this.isLoadingWorldMap$ = this.store.select(getIsLoadingWorldMap);
    this.selectedChartType$ = this.store.select(getSelectedChartType);
    this.worldMap$ = this.store.select(getWorldMap);
    this.regions$ = this.store.select(getRegions);
    this.selectedTimeRange$ = this.store.select(getSelectedTimeRange);
  }

  selectOrgChartWithTranslation(): Observable<OrgChartData> {
    return this.store.select(getOrgChart).pipe(
      concatLatestFrom(() => [
        this.translocoService
          .selectTranslateObject('orgChart.node', {}, 'organizational-view')
          .pipe(take(1)),
      ]),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(([orgChartData, translation]) => ({
        data: orgChartData.data,
        dimension: orgChartData.dimension,
        translation,
      }))
    );
  }

  chartTypeChanged(chartType: ChartType): void {
    this.store.dispatch(chartTypeSelected({ chartType }));
  }

  loadParent(data: DimensionFluctuationData): void {
    this.store.dispatch(loadParent({ data }));
  }

  loadChildAttritionOverTime(data: DimensionFluctuationData): void {
    this.store.dispatch(
      loadChildAttritionOverTimeOrgChart({
        filterDimension: data.filterDimension,
        dimensionKey: data.dimensionKey,
        dimensionName: data.dimension,
      })
    );
  }

  loadRegionMeta(region: string): void {
    this.store.dispatch(loadWorldMapFluctuationRegionMeta({ region }));
    this.store.dispatch(
      loadChildAttritionOverTimeForWorldMap({
        filterDimension: FilterDimension.REGION,
        dimensionName: region,
      })
    );
  }

  loadCountryMeta(country: string): void {
    this.store.dispatch(loadWorldMapFluctuationCountryMeta({ country }));
    this.store.dispatch(
      loadChildAttritionOverTimeForWorldMap({
        filterDimension: FilterDimension.COUNTRY,
        dimensionName: country,
      })
    );
  }

  loadOrgChartEmployees(data: DimensionFluctuationData): void {
    this.store.dispatch(loadOrgChartEmployees({ data }));
  }

  exportImg(): void {
    this.orgChartComponent.exportImg();
  }
}
