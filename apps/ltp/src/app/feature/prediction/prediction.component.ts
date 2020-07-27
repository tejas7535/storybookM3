import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { Papa } from 'ngx-papaparse';

import { getBannerOpen } from '@schaeffler/banner';
import { Icon } from '@schaeffler/icons';

import * as fromStore from '../../core/store';
import {
  CHART_SETTINGS_HAIGH,
  CHART_SETTINGS_WOEHLER,
  GRAPH_DEFINITIONS_WOEHLER,
} from '../../shared/constants';
import { ChartType } from '../../shared/enums';
import {
  LegendSquare,
  LoadOptions,
  LoadsRequest,
  PredictionResultParsed,
} from '../../shared/models';
import { UploadModalComponent } from './upload-modal/upload-modal.component';

@Component({
  selector: 'ltp-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
})
export class PredictionComponent implements OnInit {
  predictionResult: Observable<PredictionResultParsed>;
  bannerIsOpen: Observable<boolean>;

  legendGraphs: LegendSquare[];

  // TODO: model definition
  chartSettings = CHART_SETTINGS_WOEHLER;

  constructor(
    private readonly dialog: MatDialog,
    private readonly papa: Papa,
    private readonly store: Store<fromStore.LTPState>
  ) {
    this.predictionResult = this.store.pipe(
      select(fromStore.getPredictionResult)
    );
    this.bannerIsOpen = this.store.pipe(select(getBannerOpen));
    this.store
      .pipe(select(fromStore.getDisplay))
      .subscribe(
        (display) =>
          (this.chartSettings =
            display.chartType === ChartType.Woehler
              ? CHART_SETTINGS_WOEHLER
              : CHART_SETTINGS_HAIGH)
      );
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
  }

  public ngOnInit(): void {
    this.store.dispatch(fromStore.postPrediction());
  }

  /**
   * Changes the selected chart type
   */
  public selectChartType(chartType: number): void {
    this.store.dispatch(fromStore.setChartType({ chartType }));
  }

  /**
   * Gets FileList object, extracts single file and calls parseLoadFile method
   */
  public handleFileInput(files: FileList): void {
    const loadCollective = files.item(0);
    this.parseLoadFile(loadCollective);
  }

  handleDummyLoad(): void {
    const loadCollective = '/assets/loads/cca-sql-dump.txt';
    this.parseLoadFile(loadCollective, true);
  }

  /**
   * Parses load File and class dispatchLoad method
   */
  public async parseLoadFile(
    loadCollective: File | string,
    download = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.papa.parse(loadCollective, {
        download,
        complete: (result) => {
          this.openDialog(result.data);

          resolve();
        },
        error: (err) => {
          console.error(`An error occured: ${err}`);

          reject();
        },
      });
    });
  }

  openDialog(parsedFile: any[]): void {
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
    const limit = 50000;
    const loadsRequest: LoadsRequest = {
      status: 1,
      data: undefined,
      ...settings,
    };
    loadsRequest.data = parsedFile.reduce((values, entry) => {
      const value = Number(entry[0]);
      if (!isNaN(value)) {
        values.push(value);
      }

      return values;
    }, []);
    if (loadsRequest.data.length > limit) {
      loadsRequest.data.slice(0, loadsRequest.data.length);
    }
    this.store.dispatch(fromStore.setLoadsRequest({ loadsRequest }));
  }

  /**
   * cusomizes the tooltip for a certain point on the graph. Is passed as Input to the chart component
   */
  public customizeTooltip = (arg: any): Object => {
    const {
      argument,
      value,
      rangeValue1Text,
      rangeValue2Text,
      seriesName,
    } = arg;

    const fixedValue = value
      ? value.toFixed(2)
      : `${parseFloat(rangeValue1Text).toFixed(2)} - ${parseFloat(
          rangeValue2Text
        ).toFixed(2)}`;

    if (argument < 10000000 && argument > 10000) {
      let text = translate('prediction.chart.tooltip', {
        value: fixedValue,
      });

      GRAPH_DEFINITIONS_WOEHLER.forEach((graphDefinition) => {
        const { name, survivalProbability } = graphDefinition;
        if (name === seriesName && survivalProbability) {
          text = `${text}<br>${translate(
            'prediction.chart.tooltipSurvivalProbability',
            {
              survivalProbability,
            }
          )}`;
        }
      });

      return { text };
    }

    return {
      html: '',
    };
  };

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
    return this.chartSettings === CHART_SETTINGS_WOEHLER;
  }

  getIcon(icon: string): Icon {
    return new Icon(icon, false);
  }
}
