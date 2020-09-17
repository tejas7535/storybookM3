import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { EChartOption } from 'echarts';

import {
  setGreaseDisplay,
  setGreaseInterval,
} from '../../core/store/actions/grease-status/grease-status.actions';
import { GreaseStatusState } from '../../core/store/reducers/grease-status/grease-status.reducer';
import {
  GreaseDisplay,
  GreaseStatusGraphData,
} from '../../core/store/reducers/grease-status/models';
import { Interval } from '../../core/store/reducers/shared/models';
import {
  getGreaseDisplay,
  getGreaseInterval,
  getGreaseStatusGraphData,
} from '../../core/store/selectors/';

enum Unit {
  percent = '%',
  degree = '°C',
}

interface Checkbox {
  label: string;
  formControl: string;
  unit: Unit;
}

@Component({
  selector: 'goldwind-grease-status-monitoring',
  templateUrl: './grease-status.component.html',
  styleUrls: ['./grease-status.component.scss'],
})
export class GreaseStatusComponent implements OnInit, OnDestroy {
  greaseStatusGraphData$: Observable<GreaseStatusGraphData>;
  interval$: Observable<Interval>;

  public checkBoxes: Checkbox[] = [
    {
      label: 'waterContent',
      formControl: 'waterContentPercent',
      unit: Unit.percent,
    },
    {
      label: 'deteroration',
      formControl: 'deteriorationPercent',
      unit: Unit.percent,
    },
    {
      label: 'greaseTemperatur',
      formControl: 'temperatureCelsius',
      unit: Unit.degree,
    },
    // will be activated later on
    // {
    //   label: 'rotationalSpeed',
    //   formControl: 'rotationalSpeed',
    //   unit: Unit.percent,
    // },
  ];

  displayForm = new FormGroup({
    waterContentPercent: new FormControl(''),
    deteriorationPercent: new FormControl(''),
    temperatureCelsius: new FormControl(''),
    rotationalSpeed: new FormControl(''),
  });

  chartOptions: EChartOption = {
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'inside',
      },
      {}, // for slider zoom
    ],
    series: [
      {
        type: 'line',
        large: true,
      },
    ],
    legend: {
      selectedMode: false,
      formatter: (name: string) => this.formatLegend(name),
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#ced5da',
      borderWidth: 1,
      textStyle: { color: '#646464' },
      padding: 10,
      formatter: (params) => this.formatTooltip(params),
    },
  };

  private readonly subscription: Subscription = new Subscription();

  public constructor(private readonly store: Store<GreaseStatusState>) {}

  ngOnInit(): void {
    this.greaseStatusGraphData$ = this.store.pipe(
      select(getGreaseStatusGraphData)
    );

    this.interval$ = this.store.pipe(select(getGreaseInterval));

    this.subscription.add(
      this.store
        .pipe(select(getGreaseDisplay))
        .subscribe((greaseDisplay: GreaseDisplay) => {
          this.displayForm.markAsPristine();
          this.displayForm.setValue(greaseDisplay);
        })
    );

    this.displayForm.valueChanges
      .pipe(filter(() => this.displayForm.dirty))
      .subscribe((greaseDisplay: GreaseDisplay) =>
        this.store.dispatch(setGreaseDisplay({ greaseDisplay }))
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setInterval(interval: Interval): void {
    this.store.dispatch(setGreaseInterval({ interval }));
  }

  formatLegend(name: string): string {
    const { label, unit } = this.checkBoxes.find(
      ({ formControl }: Checkbox) => formControl === name
    );

    return `${translate(`greaseStatus.${label}`)} (${unit})`;
  }

  formatTooltip(
    params: EChartOption.Tooltip.Format[] | EChartOption.Tooltip.Format
  ): string {
    return (
      Array.isArray(params) &&
      params.reduce((acc, param, index) => {
        const { label, unit } = this.checkBoxes.find(
          ({ formControl }: Checkbox) => formControl === param.seriesName
        );

        const result = `${acc}${translate(`greaseStatus.${label}`)}: ${
          param.data.value[1]
        } ${unit}<br>`;

        return index === params.length - 1
          ? `${result}${new Date(param.data.value[0]).toLocaleString()}`
          : `${result}`;
      }, '')
    );
  }

  emptyGreaseStatusGraphData(greaseStatusGraphData: any): boolean {
    return (
      greaseStatusGraphData &&
      greaseStatusGraphData?.series?.filter(
        (series: any) => series.data.length > 0
      ).length === 0
    );
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
