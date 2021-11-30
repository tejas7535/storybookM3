import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';
import { Papa } from 'ngx-papaparse';

import { getBannerOpen, openBanner } from '@schaeffler/banner';

import { RouteNames } from '../../../app-routing.enum';
import { changeFavicon } from '../../../shared/change-favicon';
import {
  CHART_OPTIONS_HAIGH,
  CHART_OPTIONS_WOEHLER,
  CHART_SETTINGS_HAIGH,
  CHART_SETTINGS_WOEHLER,
  GRAPH_DEFINITIONS_WOEHLER,
} from '../constants';
import { ChartType } from '../enums';
import {
  Display,
  LegendSquare,
  LoadOptions,
  LoadsRequest,
  PredictionResultParsed,
} from '../models';
import * as fromStore from '../store';
import { BreadcrumbsService } from './../../../shared/services/breadcrumbs/breadcrumbs.service';
import { UploadModalComponent } from './upload-modal/upload-modal.component';

@Component({
  selector: 'mac-ltp-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
})
export class PredictionComponent implements OnInit {
  public predictionResult: Observable<PredictionResultParsed>;
  public bannerIsOpen: Observable<boolean>;

  public legendGraphs: LegendSquare[];

  public chartSettings = CHART_SETTINGS_WOEHLER;
  public chartOptions: EChartsOption = CHART_OPTIONS_WOEHLER;

  public mergeData$: Observable<EChartsOption>;

  public selectedChartType: ChartType = ChartType.Woehler;

  public breadcrumbs$ = this.breadcrumbsService.currentBreadcrumbs;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly papa: Papa,
    private readonly store: Store,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly decimalPipe: DecimalPipe,
    private readonly transloco: TranslocoService
  ) {}

  public ngOnInit(): void {
    changeFavicon('assets/favicons/ltp.ico', 'Lifetime Predictor');
    this.breadcrumbsService.updateBreadcrumb(RouteNames.LifetimePredictor);
    this.predictionResult = this.store.select(fromStore.getPredictionResult);
    this.bannerIsOpen = this.store.select(getBannerOpen);
    this.store.select(fromStore.getDisplay).subscribe((display: Display) => {
      this.selectedChartType = display.chartType;
      this.chartOptions =
        display.chartType === ChartType.Woehler
          ? CHART_OPTIONS_WOEHLER
          : CHART_OPTIONS_HAIGH;
      this.chartSettings =
        display.chartType === ChartType.Woehler
          ? CHART_SETTINGS_WOEHLER
          : CHART_SETTINGS_HAIGH;
      this.mergeData$ = this.store.select(
        fromStore.getPredictionResultGraphDataMapped(this.chartOptions)
      );

      (this.chartOptions.xAxis as any).name = translate(
        (this.chartOptions.xAxis as any).name
      );
      (this.chartOptions.yAxis as any).name = translate(
        (this.chartOptions.yAxis as any).name
      );
      if (display.chartType === ChartType.Woehler) {
        this.chartOptions = {
          ...this.chartOptions,
          tooltip: {
            trigger: 'item',
            show: true,
            formatter: this.customizeTooltip,
          },
        };
      }
    });
    this.predictionResult.subscribe((res: PredictionResultParsed) => {
      this.legendGraphs = this.chartSettings.sources
        .filter(
          (source) =>
            source.legendDisplay &&
            this.filterLegendGraphs(source.value, res.data)
        )
        .map((source) => source.legendDisplay);

      return res.data;
    });

    registerLocaleData(localeDe, 'de');

    this.store.dispatch(fromStore.postPrediction());
    this.openBanner();
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
  public customizeTooltip = (point: any): string => {
    if (
      point.value &&
      !(point.value.x < 10_000 || point.value.x > 10_000_000) &&
      !Object.keys(point.value).includes('y1')
    ) {
      const series = GRAPH_DEFINITIONS_WOEHLER.find((s) =>
        Object.keys(point.value).includes(s.value)
      );

      const tooltip = `${translate('ltp.prediction.chart.tooltip', {
        value: Math.round(point.value[series.value]),
      })}<br>${translate('ltp.prediction.chart.tooltipSurvivalProbability', {
        survivalProbability: series.survivalProbability,
        cycles: this.decimalPipe.transform(
          point.value['x'],
          '1.0-0',
          this.transloco.getActiveLang()
        ),
      })}`;

      return tooltip;
    }

    return undefined;
  };

  /**
   * Gets FileList object, extracts single file and calls parseLoadFile method
   */
  public handleFileInput(files: FileList): void {
    const loadCollective = files.item(0);
    this.parseLoadFile(loadCollective);
  }

  public handleDummyLoad(): void {
    const loadCollective = '/assets/loads/cca-sql-dump.txt';
    this.parseLoadFile(loadCollective, true);
  }

  /**
   * Parses load File and class dispatchLoad method
   */
  public parseLoadFile(loadCollective: File | string, download = false): void {
    this.papa.parse(loadCollective, {
      download,
      complete: (result) => {
        this.openDialog(result.data);
      },
      error: (err) => {
        console.error(`An error occured: ${err}`);
      },
    });
  }

  public openDialog(parsedFile: any[]): void {
    const dialogRef = this.dialog.open(UploadModalComponent, {
      width: '600px',
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: LoadOptions) => {
      if (result) {
        this.dispatchLoad(parsedFile, result);
      }
    });
  }

  /**
   * handle first column and omit text values and dispatches load array to store
   */
  public dispatchLoad(parsedFile: any[], settings: LoadOptions): void {
    const limit = 50_000;
    const loadsRequest: LoadsRequest = {
      status: 1,
      data: undefined,
      ...settings,
    };
    loadsRequest.data = parsedFile
      .map((entry) => entry[0])
      .filter((value) => !Number.isNaN(Number(value)))
      .map((value) => Number(value));
    if (loadsRequest.data.length > limit) {
      loadsRequest.data.slice(0, loadsRequest.data.length);
    }
    this.store.dispatch(fromStore.setLoadsRequest({ loadsRequest }));
  }

  /**
   * Returns true if the entered value is contained in the keys of a given Object array
   */
  public filterLegendGraphs(value: string, data: any[] = []): boolean {
    return data
      .map((point) => {
        const keys = Object.keys(point).filter((key) => key !== 'x');
        if (keys.length === 1) {
          return keys[0];
        }

        return {};
      })
      .includes(value);
  }

  /**
   * Returns true if the current chart settings are for the Woehler chart
   */
  public showWoehler(): boolean {
    return this.selectedChartType === ChartType.Woehler;
  }

  public openBanner(): void {
    this.store.dispatch(
      openBanner({
        text: translate('ltp.disclaimer'),
        buttonText: translate('ltp.disclaimerClose'),
        icon: 'info',
        truncateSize: 0,
      })
    );
  }
}
