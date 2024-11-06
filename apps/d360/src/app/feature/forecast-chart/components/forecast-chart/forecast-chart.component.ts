/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';

import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { EChartsOption } from 'echarts';
import moment, { isMoment } from 'moment';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { previewData } from '../../../../pages/home/chart/preview-data';
import { ColumnFilters } from '../../../../shared/ag-grid/grid-filter-model';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { DatePickerMonthYearComponent } from '../../../../shared/components/date-picker-month-year/date-picker-month-year.component';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { StyledGridSectionComponent } from '../../../../shared/components/styled-grid-section/styled-grid-section.component';
import { StyledSectionComponent } from '../../../../shared/components/styled-section/styled-section.component';
import { ValidateForm } from '../../../../shared/decorators';
import { dimmedGrey, schaefflerColor } from '../../../../shared/styles/colors';
import { PlanningView } from '../../../demand-validation/planning-view';
import { GlobalSelectionUtils } from '../../../global-selection/global-selection.utils';
import { ChartSettingsService } from '../../forecast-chart.service';
import {
  ChartEntry,
  chartSeriesConfig,
  ChartSettings,
  ChartUnitMode,
  ForecastChartData,
} from '../../model';
import { ForecastChartLegendComponent } from '../forecast-chart-legend/forecast-chart-legend.component';

@Component({
  selector: 'app-forecast-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule,
    StyledSectionComponent,
    StyledGridSectionComponent,
    MatButtonModule,
    MatIconModule,
    DatePickerComponent,
    DatePickerMonthYearComponent,
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    MatDivider,
    TranslocoModule,
    LoadingSpinnerModule,
    ForecastChartLegendComponent,
  ],
  templateUrl: './forecast-chart.component.html',
  styleUrl: './forecast-chart.component.scss',
})
export class ForecastChartComponent implements OnInit {
  private readonly chartSettingsService: ChartSettingsService =
    inject(ChartSettingsService);
  private readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);

  globalSelectionState = input.required<GlobalSelectionState>();
  columnFilters = input<ColumnFilters>();

  private readonly destroy = inject(DestroyRef);

  constructor() {
    effect(
      () => {
        this.loadData$(
          this.globalSelectionState(),
          this.columnFilters()
        ).subscribe();
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  option: EChartsOption;

  public openPanel: string | null = null;
  public openPanelContent = true;

  private chartSettings: ChartSettings =
    this.chartSettingsService.defaultChartSettings;

  public dateForm = new FormGroup(
    {
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    },
    { validators: this.crossFieldValidator() }
  );

  public typeForm: FormGroup = new FormGroup<any>({
    count: new FormControl<PlanningView>(null),
    type: new FormControl<ChartUnitMode>(null),
  });

  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public isError: WritableSignal<boolean> = signal<boolean>(false);

  public isPreviewDataRendered: WritableSignal<boolean> =
    signal<boolean>(false);

  ngOnInit() {
    this.loadChartSettings()
      .pipe(
        switchMap(() =>
          this.loadData$(this.globalSelectionState(), this.columnFilters())
        ),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
  }

  loadChartSettings(): Observable<ChartSettings> {
    return this.chartSettingsService.getChartSettings().pipe(
      tap((response) => {
        this.chartSettings = response;

        this.dateForm
          .get('startDate')
          .setValue(new Date(response.startDate).toISOString());
        this.dateForm
          .get('endDate')
          .setValue(new Date(response.endDate).toISOString());

        this.typeForm.get('count').setValue(response.planningView);
        this.typeForm.get('type').setValue(response.chartUnitMode);
      })
    );
  }

  loadData$(
    globalSelectionState: GlobalSelectionState,
    columnFilters: Record<string, any>
  ): Observable<ForecastChartData> {
    this.isLoading.set(true);
    this.isError.set(false);

    if (this.globalSelectionStateService.isEmpty()) {
      this.option = this.generateChartOptions(previewData);
      this.isPreviewDataRendered.set(true);
      this.isLoading.set(false);

      return EMPTY;
    } else {
      return this.chartSettingsService
        .getForecastChartData(
          GlobalSelectionUtils.globalSelectionCriteriaToFilter(
            globalSelectionState
          ),
          columnFilters,
          this.chartSettings
        )
        .pipe(
          tap((chart) => {
            this.option = this.generateChartOptions(chart);
            this.isLoading.set(false);
            this.isPreviewDataRendered.set(false);
          }),
          catchError((_) => {
            this.option = this.generateChartOptions(previewData);
            this.isLoading.set(false);
            this.isPreviewDataRendered.set(true);
            this.isError.set(true);

            return EMPTY;
          }),
          takeUntilDestroyed(this.destroy)
        );
    }
  }

  generateChartOptions(data: ForecastChartData): EChartsOption {
    return {
      grid: {
        left: '120px',
        right: '30px',
        top: '10px',
        bottom: '30px',
      },
      animationDuration: 1500,
      axisPointer: {
        lineStyle: {
          type: 'solid',
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: data.chartEntries.map((c: ChartEntry) =>
            moment(c.yearMonth).format('MM.YYYY').toString()
          ),
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
              color: dimmedGrey,
              opacity: 0.2,
            },
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        alwaysShowContent: false,
        axisPointer: {
          axis: 'auto',
          type: 'line',
          label: {
            backgroundColor: '#fff',
          },
        },
      },
      toolbox: {
        feature: {},
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: dimmedGrey,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
              color: dimmedGrey,
              opacity: 0.2,
            },
          },
        },
      ],
      series: this.setChartData(data),
    };
  }

  setChartData(data: ForecastChartData): any {
    return [
      {
        name: translate('home.chart.legend.deliveries'),
        type: 'line',
        stack: 'Total',
        color: chartSeriesConfig.deliveries.color,
        areaStyle: { opacity: 1 },
        symbol: 'none',
        data: data.chartEntries.map((c: ChartEntry) => c.deliveries),
        zlevel: -1,
        z: 100,
      },
      {
        name: translate('home.chart.legend.orders'),
        type: 'line',
        stack: 'Total',
        color: chartSeriesConfig.orders.color,
        symbol: 'none',
        areaStyle: { opacity: 1 },
        data: data.chartEntries.map((c: ChartEntry) => c.orders),
        zlevel: -1,
        z: 90,
      },
      {
        name: translate('home.chart.legend.demandPlan'),
        type: 'line',
        stack: 'Total',
        color: chartSeriesConfig.demandPlan.color,
        symbol: 'none',
        areaStyle: { opacity: 1 },
        data: data.chartEntries.map((c: ChartEntry) => c.demandPlan),
        zlevel: -1,
        z: 80,
      },
      {
        name: translate('home.chart.legend.opAdjustment'),
        type: 'line',
        stack: 'Total',
        color: chartSeriesConfig.opAdjustment.color,
        symbol: 'none',
        areaStyle: { opacity: 1 },
        data: data.chartEntries.map((c: ChartEntry) => c.opAdjustment),
        zlevel: -1,
        z: 70,
      },
      {
        name: translate('home.chart.legend.opportunities'),
        type: 'line',
        stack: 'Total',
        color: chartSeriesConfig.opportunities.color,
        symbol: 'none',
        areaStyle: { opacity: 1 },
        data: data.chartEntries.map((c: ChartEntry) => c.opportunities),
        zlevel: -1,
        z: 60,
      },
      {
        name: translate('home.chart.legend.rollingSalesForecast'),
        color: chartSeriesConfig.rollingSalesForecast.color,
        type: 'line',
        lineStyle: {
          normal: {
            color: chartSeriesConfig.rollingSalesForecast.color,
            width: 1,
            type: [5, 5],
          },
        },
        data: data.chartEntries.map((c: ChartEntry) => c.rollingSalesForecast),
        zlevel: 2,
      },
      {
        type: 'line',
        itemStyle: { normal: { color: schaefflerColor, showLabel: false } },
        zlevel: 1,
        markLine: {
          label: {
            show: false,
            showLabel: false,
          },
          lineStyle: {
            dashOffset: '0',
            width: 1,
            type: 'solid',
          },
          symbol: 'none',
          data: [
            {
              symbol: 'none',
              xAxis: moment(new Date()).format('MM.YYYY').toString(),
            },
          ],
        },
      },
    ];
  }

  togglePanel(id: string) {
    this.openPanel = this.openPanel === id ? null : id;
  }

  onChangeCount(event: MatRadioChange) {
    this.typeForm.get('count').setValue(event.value);
    this.chartSettings.planningView = event.value;
    this.updateAndSaveChartSettings();
  }

  onChangeType(event: MatRadioChange) {
    this.typeForm.get('type').setValue(event.value);
    this.chartSettings.chartUnitMode = event.value;
    this.updateAndSaveChartSettings();
  }

  @ValidateForm('dateForm')
  onUpdateDateSettings() {
    if (!this.dateForm.valid) {
      return;
    }

    this.chartSettings.startDate = moment(
      this.dateForm.get('startDate').value
    ).toISOString();
    this.chartSettings.endDate = moment(
      this.dateForm.get('endDate').value
    ).toISOString();

    this.updateAndSaveChartSettings();
  }

  updateAndSaveChartSettings() {
    this.chartSettingsService
      .updateChartSettings(this.chartSettings)
      .pipe(
        switchMap(() =>
          this.loadData$(this.globalSelectionState(), this.columnFilters())
        ),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
    this.openPanel = null;
  }

  controlsDisabled(): boolean {
    return this.isLoading() || this.isPreviewDataRendered();
  }

  /**
   * The form cross field validator to check the dates.
   *
   * @private
   * @return {ValidatorFn}
   * @memberof ForecastChartComponent
   */
  private crossFieldValidator(): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const errors: { [key: string]: string[] } = {};

      // touch start- / endDate, so we show directly all errors
      formGroup.markAllAsTouched();

      // start- / endDate
      let startDate = formGroup.get('startDate')?.value;
      let endDate = formGroup.get('endDate')?.value;

      startDate = isMoment(startDate) ? startDate : moment(startDate);
      endDate = isMoment(endDate) ? endDate : moment(endDate);

      if (startDate && endDate && startDate > endDate) {
        formGroup.get('endDate').setErrors({ toDateAfterFromDate: true });
        errors.endDate = ['end-before-start'];
      } else {
        // we set the error manually, so we also need to clean up manually ;)
        let fieldErrors = formGroup.get('endDate').errors;
        if (fieldErrors?.['toDateAfterFromDate']) {
          delete fieldErrors['toDateAfterFromDate'];

          // if fieldErrors is {} (empty object) after deleting the key,
          // we need to set null, otherwise it is still shown up as an error
          fieldErrors =
            Object.keys(fieldErrors).length === 0 ? null : fieldErrors;
        }

        // set the new error state
        formGroup.get('endDate').setErrors(fieldErrors);
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
}
