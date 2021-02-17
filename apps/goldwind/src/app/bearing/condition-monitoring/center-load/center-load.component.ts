import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { LoadSenseState } from '../../../core/store/reducers/load-sense/load-sense.reducer';
import { GraphData } from '../../../core/store/reducers/shared/models';
import {
  getLoadGraphData,
  getLoadSenseMeasturementTimes,
} from '../../../core/store/selectors/';
import { radarChartOptions } from '../../../shared/chart/chart';
import { DATE_FORMAT } from '../../../shared/constants';

@Component({
  selector: 'goldwind-center-load',
  templateUrl: './center-load.component.html',
  styleUrls: ['./center-load.component.scss'],
})
export class CenterLoadComponent implements OnInit {
  @Input() live: boolean;
  loadSenseGraphData$: Observable<GraphData>;
  loadSenseMeasurementTimes$: Observable<string[]>;
  current: string;

  chartOptions: EChartsOption = {
    ...radarChartOptions,
    tooltip: {
      ...radarChartOptions.tooltip,
      formatter: (params: any) => this.tooltipFormatter(params),
    },
    legend: {
      ...radarChartOptions.legend,
      data: [
        translate('conditionMonitoring.centerLoad.generator'),
        translate('conditionMonitoring.centerLoad.rotor'),
      ],
    },
    radar: {
      ...radarChartOptions.radar,
      indicator: [
        { text: '0°', max: 8000 },
        { text: '45°', max: 8000 },
        { text: '90°', max: 8000 },
        { text: '135°', max: 8000 },
        { text: '180°', max: 8000 },
        { text: '225°', max: 8000 },
        { text: '270°', max: 8000 },
        { text: '315°', max: 8000 },
      ],
    },
  };

  public constructor(private readonly store: Store<LoadSenseState>) {}

  tooltipFormatter(params: any): any {
    if (params.seriesName === 'Rotor') {
      return `${params.seriesName}<br />
      Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[0].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[1].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[2].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[3].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[4].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 11:&nbsp;&nbsp;${params.data.value[5].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 13:&nbsp;&nbsp;${params.data.value[6].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 15:&nbsp;&nbsp;${params.data.value[7].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />`;
    }
    if (params.seriesName === 'Generator') {
      return `${params.seriesName}<br />
      Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[0].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[1].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[2].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[3].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 10:&nbsp;&nbsp;${params.data.value[4].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 12:&nbsp;&nbsp;${params.data.value[5].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 14:&nbsp;&nbsp;${params.data.value[6].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />
      Lsp 16:&nbsp;&nbsp;${params.data.value[7].toLocaleString(
        DATE_FORMAT.local,
        { maximumFractionDigits: 0 }
      )} N<br />`;
    }
  }

  ngOnInit(): void {
    this.getLoadSenseGraphData();

    this.loadSenseMeasurementTimes$ = this.store.pipe(
      select(getLoadSenseMeasturementTimes),
      tap((val) => {
        this.current =
          this.current ?? val ? this.formatDate(val.pop()) : undefined;
      })
    );
  }

  getLoadSenseGraphData(timestamp?: string): void {
    this.loadSenseGraphData$ = this.store.pipe(
      select(getLoadGraphData, { timestamp })
    );
  }

  timeChange(event: any, loadSenseMeasurementTimes: string[]): void {
    const current = loadSenseMeasurementTimes[event.value];

    this.current = this.formatDate(current);
    this.getLoadSenseGraphData(current);
  }

  formatDate(current: string): string {
    return new Date(current).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
    );
  }
}
