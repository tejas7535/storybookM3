import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import {
  setGreaseDisplay,
  setGreaseInterval,
} from '../../core/store/actions/grease-status/grease-status.actions';
import { GreaseStatusState } from '../../core/store/reducers/grease-status/grease-status.reducer';
import { GreaseDisplay } from '../../core/store/reducers/grease-status/models';
import { GraphData, Interval } from '../../core/store/reducers/shared/models';
import {
  getGreaseDisplay,
  getGreaseInterval,
  getGreaseStatusGraphData,
} from '../../core/store/selectors/';
import { axisChartOptions } from '../../shared/chart/chart';
import { DATE_FORMAT, GREASE_CONTROLS } from '../../shared/constants';

@Component({
  selector: 'goldwind-grease-status-monitoring',
  templateUrl: './grease-status.component.html',
  styleUrls: ['./grease-status.component.scss'],
})
export class GreaseStatusComponent implements OnInit, OnDestroy {
  greaseStatusGraphData$: Observable<GraphData>;
  interval$: Observable<Interval>;
  checkBoxes = GREASE_CONTROLS;

  displayForm = new FormGroup({
    waterContent_1: new FormControl(''),
    deterioration_1: new FormControl(''),
    temperatureOptics_1: new FormControl(''),
    waterContent_2: new FormControl(''),
    deterioration_2: new FormControl(''),
    temperatureOptics_2: new FormControl(''),
    rsmShaftSpeed: new FormControl(''),
  });

  chartOptions: EChartsOption = {
    ...axisChartOptions,
    legend: {
      ...axisChartOptions.legend,
      formatter: (name: string) => this.formatLegend(name),
    },
    tooltip: {
      ...axisChartOptions.tooltip,
      formatter: (params: any) => this.formatTooltip(params),
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
    const { label, unit } = GREASE_CONTROLS.find(
      ({ formControl }) => formControl === name
    );

    return `${translate(`greaseStatus.${label}`)} (${unit})`;
  }

  formatTooltip(params: any): string {
    return (
      Array.isArray(params) &&
      params.reduce((acc, param, index) => {
        const { label, unit } = GREASE_CONTROLS.find(
          ({ formControl }) => formControl === param.seriesName
        );

        const result = `${acc}${translate(`greaseStatus.${label}`)}: ${
          param.data.value[1]
        } ${unit}<br>`;

        return index === params.length - 1
          ? `${result}${new Date(param.data.value[0]).toLocaleString(
              DATE_FORMAT.local,
              DATE_FORMAT.options
            )} ${new Date(param.data.value[0]).toLocaleTimeString(
              DATE_FORMAT.local
            )}`
          : `${result}`;
      }, '')
    );
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
