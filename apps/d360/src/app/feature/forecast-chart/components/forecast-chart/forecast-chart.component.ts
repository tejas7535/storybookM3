/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  Signal,
  signal,
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

import { TranslocoModule } from '@jsverse/transloco';
import { formatISO, startOfYear } from 'date-fns';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import {
  previewDataMonthly,
  previewDataYearly,
} from '../../../../pages/home/chart/preview-data';
import { ColumnFilters } from '../../../../shared/ag-grid/grid-filter-model';
import { DatePickerMonthYearComponent } from '../../../../shared/components/date-picker-month-year/date-picker-month-year.component';
import { GlobalSelectionState } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { ValidateForm } from '../../../../shared/decorators';
import { disabledGrey } from '../../../../shared/styles/colors';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { PlanningView } from '../../../demand-validation/planning-view';
import { GlobalSelectionUtils } from '../../../global-selection/global-selection.utils';
import { ChartSettingsService } from '../../forecast-chart.service';
import {
  chartSeriesConfig,
  ChartSettings,
  ChartUnitMode,
  ForecastChartData,
  MonthlyChartEntry,
  PeriodType,
} from '../../model';
import { MonthlyForecastChartComponent } from '../monthly-forecast-chart/monthly-forecast-chart.component';
import { YearlyForecastChartComponent } from '../yearly-forecast-chart/yearly-forecast-chart.component';

@Component({
  selector: 'd360-forecast-chart',
  imports: [
    CommonModule,
    NgxEchartsModule,
    MatButtonModule,
    MatIconModule,
    DatePickerMonthYearComponent,
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    MatDivider,
    TranslocoModule,
    LoadingSpinnerModule,
    YearlyForecastChartComponent,
    MonthlyForecastChartComponent,
  ],
  templateUrl: './forecast-chart.component.html',
  styleUrl: './forecast-chart.component.scss',
})
export class ForecastChartComponent implements OnInit {
  public currency = input.required<string>();
  public globalSelectionState = input.required<GlobalSelectionState>();
  public customerFilter = input<SelectableValue>(null);
  protected readonly currentFilter: Signal<GlobalSelectionState> =
    computed<GlobalSelectionState>(() =>
      this.customerFilter()
        ? {
            region: [],
            salesArea: [],
            sectorManagement: [],
            salesOrg: [],
            gkamNumber: [],
            customerNumber: [this.customerFilter()],
            materialClassification: [],
            sector: [],
            materialNumber: [],
            productionPlant: [],
            productionSegment: [],
            alertType: [],
          }
        : this.globalSelectionState()
    );
  public columnFilters = input.required<ColumnFilters>();
  public chartIdentifier = input.required<string>();
  public defaultPeriodType = input.required<PeriodType>();
  public isAssignedToMe = input<boolean>(null);
  public disablePreview = input<boolean>(false);

  private readonly destroy = inject(DestroyRef);
  private readonly chartSettingsService: ChartSettingsService =
    inject(ChartSettingsService);

  protected readonly chartSeriesConfig = chartSeriesConfig;
  protected readonly disabledGray = disabledGrey;

  protected readonly kpiTypes = Object.entries(chartSeriesConfig)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key]) => key) as (keyof typeof chartSeriesConfig)[];

  protected toggledKpis = signal<any>({
    salesAmbition: false,
    opportunities: false,
    onTopCapacityForecast: false,
    onTopOrder: false,
  });

  protected chartSettingsInitialized = signal<boolean>(false);

  constructor() {
    effect(
      () =>
        this.chartSettingsInitialized() &&
        this.loadData$(
          this.currentFilter(),
          this.columnFilters(),
          this.isAssignedToMe()
        )
          .pipe(takeUntilDestroyed(this.destroy))
          .subscribe()
    );
  }

  protected chartData = signal<MonthlyChartEntry[]>([]);

  protected readonly openPanel = signal<string>(null);
  protected readonly openPanelContent = signal(true);

  private chartSettings: ChartSettings;

  public dateForm = new FormGroup(
    {
      startDate: new FormControl(null),
      endDate: new FormControl(null),
    },
    { validators: this.crossFieldValidator() }
  );

  public typeForm: FormGroup = new FormGroup<any>({
    count: new FormControl<PlanningView>(null),
    type: new FormControl<ChartUnitMode>(null),
    period: new FormControl<PeriodType>(null),
  });

  protected isLoading = signal<boolean>(false);
  protected isError = signal<boolean>(false);
  protected isPreviewDataRendered = signal<boolean>(false);

  public ngOnInit() {
    this.loadChartSettings()
      .pipe(
        switchMap(() =>
          this.loadData$(
            this.currentFilter(),
            this.columnFilters(),
            this.isAssignedToMe()
          )
        ),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
  }

  private loadChartSettings(): Observable<ChartSettings> {
    return this.chartSettingsService
      .getChartSettings(this.chartIdentifier(), this.defaultPeriodType())
      .pipe(
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
          this.typeForm.get('period').setValue(response.periodType);

          this.chartSettingsInitialized.set(true);
        })
      );
  }

  protected isYearlyChartSelected() {
    return this.typeForm.get('period').value === PeriodType.YEARLY;
  }

  private loadData$(
    globalSelectionState: GlobalSelectionState,
    columnFilters: Record<string, any>,
    isAssignedToMe?: boolean
  ): Observable<ForecastChartData> {
    this.isLoading.set(true);
    this.isError.set(false);
    if (
      !this.disablePreview() &&
      (!globalSelectionState ||
        Object.values(globalSelectionState).every(
          (value) => value.length === 0
        ))
    ) {
      this.chartData.set(
        this.isYearlyChartSelected()
          ? previewDataYearly().chartEntries
          : previewDataMonthly().chartEntries
      );
      this.isPreviewDataRendered.set(true);
      this.isLoading.set(false);

      return EMPTY;
    } else {
      let startDate;
      let endDate;

      if (this.isYearlyChartSelected()) {
        const currentYear = new Date().getFullYear();

        startDate = startOfYear(new Date(currentYear - 2, 0, 1));
        endDate = startOfYear(new Date(currentYear + 3, 0, 1));
      } else {
        startDate = this.chartSettings.startDate;
        endDate = this.chartSettings.endDate;
      }

      return this.chartSettingsService
        .getForecastChartData(
          GlobalSelectionUtils.globalSelectionCriteriaToFilter(
            globalSelectionState
          ),
          columnFilters,
          this.chartSettings,
          formatISO(startDate, { representation: 'date' }),
          formatISO(endDate, { representation: 'date' }),
          this.currency(),
          isAssignedToMe
        )
        .pipe(
          tap((forecastChartData) => {
            this.chartData.set(forecastChartData.chartEntries);
            this.isLoading.set(false);
            this.isPreviewDataRendered.set(false);
          }),
          catchError((_) => {
            this.isLoading.set(false);
            if (!this.disablePreview()) {
              this.isPreviewDataRendered.set(true);
            }

            this.isError.set(true);

            return EMPTY;
          }),
          takeUntilDestroyed(this.destroy)
        );
    }
  }

  protected togglePanel(id: string) {
    this.openPanel.set(this.openPanel() === id ? null : id);
  }

  protected onChangeCount(event: MatRadioChange) {
    this.chartSettings.planningView = event.value;
    this.onChartSettingChange('count', event.value);
  }

  protected onChangeType(event: MatRadioChange) {
    this.chartSettings.chartUnitMode = event.value;
    this.onChartSettingChange('type', event.value);
  }

  public onPeriodChange(event: MatRadioChange) {
    this.chartSettings.periodType = event.value;
    this.chartData.set([]);
    this.onChartSettingChange('period', event.value);
  }

  private onChartSettingChange(settingType: string, value: any) {
    this.typeForm.get(settingType).setValue(value);

    this.updateAndSaveChartSettings();
  }

  @ValidateForm('dateForm')
  public onUpdateDateSettings() {
    if (!this.dateForm.valid) {
      return;
    }

    this.chartSettings.startDate = this.dateForm.get('startDate').value;
    this.chartSettings.endDate = this.dateForm.get('endDate').value;

    this.updateAndSaveChartSettings();
  }

  private updateAndSaveChartSettings() {
    this.chartSettingsService
      .updateChartSettings(this.chartSettings, this.chartIdentifier())
      .pipe(
        switchMap(() =>
          this.loadData$(
            this.currentFilter(),
            this.columnFilters(),
            this.isAssignedToMe()
          )
        ),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
    this.openPanel.set(null);
  }

  public settingsDisabled(): boolean {
    return this.isLoading() || this.isPreviewDataRendered();
  }

  protected dateSelectionDisabled(): boolean {
    return this.settingsDisabled() || this.isYearlyChartSelected();
  }

  /**
   * The form cross field validator to check the dates.
   *
   * @private
   * @return {ValidatorFn}
   * @memberof ForecastChartComponent
   */
  private crossFieldValidator(): ValidatorFn {
    return (formGroup: AbstractControl) =>
      ValidationHelper.getStartEndDateValidationErrors(
        formGroup as FormGroup,
        true
      );
  }

  public updateToggledKpis(kpi: keyof typeof chartSeriesConfig) {
    this.toggledKpis.set({
      ...this.toggledKpis(),
      [kpi]: !this.toggledKpis()[kpi],
    });
  }
}
