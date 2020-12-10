import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { EChartOption } from 'echarts';

import { getBannerOpen } from '@schaeffler/banner';
import { Icon } from '@schaeffler/icons';

import * as fromStore from '../../core/store';
import {
  CHART_OPTIONS_HAIGH,
  CHART_OPTIONS_WOEHLER,
  CHART_SETTINGS_HAIGH,
  CHART_SETTINGS_WOEHLER,
  GRAPH_DEFINITIONS_WOEHLER,
} from '../../shared/constants';
import { ChartType } from '../../shared/enums';
import { LegendSquare, PredictionResultParsed } from '../../shared/models';

@Component({
  selector: 'ltp-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
})
export class PredictionComponent implements OnInit {
  predictionResult: Observable<PredictionResultParsed>;
  bannerIsOpen: Observable<boolean>;

  legendGraphs: LegendSquare[];

  chartSettings = CHART_SETTINGS_WOEHLER;
  chartOptions: EChartOption = CHART_OPTIONS_WOEHLER;

  mergeData$: Observable<EChartOption>;

  selectedChartType: ChartType = ChartType.Woehler;

  constructor(private readonly store: Store<fromStore.LTPState>) {}

  public ngOnInit(): void {
    this.predictionResult = this.store.pipe(
      select(fromStore.getPredictionResult)
    );
    this.bannerIsOpen = this.store.pipe(select(getBannerOpen));
    this.store.pipe(select(fromStore.getDisplay)).subscribe((display) => {
      this.selectedChartType = display.chartType;
      this.chartOptions =
        display.chartType === ChartType.Woehler
          ? CHART_OPTIONS_WOEHLER
          : CHART_OPTIONS_HAIGH;
      this.chartSettings =
        display.chartType === ChartType.Woehler
          ? CHART_SETTINGS_WOEHLER
          : CHART_SETTINGS_HAIGH;
      (this.chartOptions
        .xAxis as EChartOption.BasicComponents.CartesianAxis).name = translate(
        (this.chartOptions.xAxis as EChartOption.BasicComponents.CartesianAxis)
          .name
      );
      (this.chartOptions
        .yAxis as EChartOption.BasicComponents.CartesianAxis).name = translate(
        (this.chartOptions.yAxis as EChartOption.BasicComponents.CartesianAxis)
          .name
      );
      if (display.chartType === ChartType.Woehler) {
        this.chartOptions = {
          ...this.chartOptions,
          tooltip: {
            show: true,
            formatter: this.customizeTooltip,
          },
        };
      }
    });
    this.predictionResult.subscribe((res) => {
      this.legendGraphs = this.chartSettings.sources
        .filter(
          (source) =>
            source.legendDisplay &&
            this.filterLegendGraphs(source.value, res.data)
        )
        .map((source) => source.legendDisplay);

      return res.data;
    });

    this.mergeData$ = this.store.pipe(
      select(fromStore.getPredictionResultGraphData),
      map((graphData) => {
        return {
          ...this.chartOptions,
          xAxis: {
            ...this.chartOptions.xAxis,
            ...graphData.xAxis,
          },
          yAxis: {
            ...this.chartOptions.yAxis,
            ...graphData.yAxis,
          },
          dataset: {
            ...this.chartOptions,
            ...graphData.dataset,
          },
        };
      })
    );

    this.store.dispatch(fromStore.postPrediction());
  }

  /**
   * Changes the selected chart type
   */
  public selectChartType(chartType: number): void {
    this.store.dispatch(fromStore.setChartType({ chartType }));
  }

  /**
   * cusomizes the tooltip for a certain point on the graph. Is passed as Input to the chart component
   */
  public customizeTooltip = (points: any): string => {
    const point = points[0];
    if (
      point.value &&
      !(point.value.x <= 10000 || point.value.x >= 10000000) &&
      Object.keys(point.value).indexOf('y1') === -1
    ) {
      const series = GRAPH_DEFINITIONS_WOEHLER.find((s) => {
        return Object.keys(point.value).indexOf(s.value) > -1;
      });

      const tooltip = `${translate('prediction.chart.tooltip', {
        value: point.axisValue,
      })}<br>${translate('prediction.chart.tooltipSurvivalProbability', {
        survivalProbability: series.survivalProbability,
      })}`;

      return tooltip;
    }

    return undefined;
  };

  /**
   * Gets FileList object, extracts single file and calls parseLoadFile method
   */
  // public handleFileInput(files: FileList): void {
  //   const loadCollective = files.item(0);
  //   this.parseLoadFile(loadCollective);
  // }

  // handleDummyLoad(): void {
  //   const loadCollective = '/assets/loads/cca-sql-dump.txt';
  //   this.parseLoadFile(loadCollective, true);
  // }

  /**
   * Parses load File and class dispatchLoad method
   */
  // public async parseLoadFile(
  //   loadCollective: File | string,
  //   download = false
  // ): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.papa.parse(loadCollective, {
  //       download,
  //       complete: (result) => {
  //         this.openDialog(result.data);

  //         resolve();
  //       },
  //       error: (err) => {
  //         console.error(`An error occured: ${err}`);

  //         reject();
  //       },
  //     });
  //   });
  // }

  // openDialog(parsedFile: any[]): void {
  //   const dialogRef = this.dialog.open(UploadModalComponent, {
  //     width: '600px',
  //     restoreFocus: false,
  //   });

  //   dialogRef.afterClosed().subscribe((result: LoadOptions) => {
  //     if (result) {
  //       this.dispatchLoad(parsedFile, result);
  //     }
  //   });
  // }

  /**
   * handle first column and omit text values and dispatches load array to store
   */
  // public dispatchLoad(parsedFile: any[], settings: LoadOptions): void {
  //   const limit = 50000;
  //   const loadsRequest: LoadsRequest = {
  //     status: 1,
  //     data: undefined,
  //     ...settings,
  //   };
  //   loadsRequest.data = parsedFile.reduce((values, entry) => {
  //     const value = Number(entry[0]);
  //     if (!isNaN(value)) {
  //       values.push(value);
  //     }

  //     return values;
  //   }, []);
  //   if (loadsRequest.data.length > limit) {
  //     loadsRequest.data.slice(0, loadsRequest.data.length);
  //   }
  //   this.store.dispatch(fromStore.setLoadsRequest({ loadsRequest }));
  // }

  /**
   * Returns true if the entered value is contained in the keys of a given Object array
   */
  public filterLegendGraphs(value: string, data: Object[] = []): boolean {
    return (
      data
        .map((point) => {
          const keys = Object.keys(point).filter((key) => key !== 'x');
          if (keys.length === 1) {
            return keys[0];
          }

          return undefined;
        })
        .indexOf(value) >= 0
    );
  }

  /**
   * Returns true if the current chart settings are for the Woehler chart
   */
  public showWoehler(): boolean {
    return this.selectedChartType === ChartType.Woehler;
  }

  getIcon(icon: string): Icon {
    return new Icon(icon, false);
  }
}
