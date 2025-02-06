/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

import { catchError, EMPTY, finalize, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClassParams,
  CellStyle,
  ColDef,
  EditableCallbackParams,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  NewColumnsLoadedEvent,
  ValueFormatterParams,
  ValueGetterParams,
  ValueSetterParams,
} from 'ag-grid-enterprise';
import { format, isAfter, isBefore, parseISO, startOfMonth } from 'date-fns';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import {
  KpiData,
  KpiDateRanges,
  KpiEntry,
  MaterialListEntry,
  WriteKpiData,
  WriteKpiEntry,
} from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { translateOr } from '../../../../shared/ag-grid/grid-value-formatter';
import { TextWithDotCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/text-with-dot-cell-renderer/text-with-dot-cell-renderer.component';
import { DataHintComponent } from '../../../../shared/components/data-hint/data-hint.component';
import {
  getMonthYearDateFormatByCode,
  LocaleType,
} from '../../../../shared/constants/available-locales';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import {
  checkRoles,
  demandValidationChangeAllowedRoles,
} from '../../../../shared/utils/auth/roles';
import {
  parseAndFormatNumber,
  strictlyParseLocalFloat,
} from '../../../../shared/utils/number';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { DemandValidationKpiHeaderComponent } from '../demand-validation-kpi-header/demand-validation-kpi-header.component';
import { firstEditableDateForTodayInBucket } from './../../../../feature/demand-validation/limits';
import {
  clientSideTableDefaultProps,
  getDefaultColDef,
} from './../../../../shared/ag-grid/grid-defaults';
import { DateFilterComponent } from './../../../../shared/components/ag-grid/filters/mat-date-filter/date-filter.component';
import {
  demandValidationEditableColor,
  demandValidationInFixZoneColor,
  demandValidationNotEditableColor,
  demandValidationToSmallColor,
  demandValidationWrongInputColor,
} from './../../../../shared/styles/colors';
import { getCellClass } from './cell-style';
import {
  DemandValidationTableColDef,
  FilterValues,
  kpiColumnDefinitionsConfirmed,
  kpiColumnDefinitionsRequested,
} from './column-definitions';
import { LegendsComponent } from './legends/legends.component';
import { MoreInformationComponent } from './more-information/more-information.component';

@Component({
  selector: 'd360-demand-validation-table',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    DataHintComponent,
    AgGridModule,
    LegendsComponent,
    MatMenuModule,
    MatSlideToggleModule,
    MatIcon,
    MatDivider,
    MatButtonModule,
    MoreInformationComponent,
  ],
  templateUrl: './demand-validation-table.component.html',
  styleUrl: './demand-validation-table.component.scss',
})
export class DemandValidationTableComponent {
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  protected readonly localeService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  private readonly demandValidationService: DemandValidationService = inject(
    DemandValidationService
  );
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly store: Store = inject(Store);

  private columnDefinitions: DemandValidationTableColDef[] = [];

  private readonly kpiData: WritableSignal<KpiData | null> =
    signal<KpiData>(null);
  public kpiError: WritableSignal<string> = signal<string>('');
  public materialListEntry = input.required<MaterialListEntry>();
  public planningView = input.required<PlanningView>();
  public kpiDateRange = input.required<KpiDateRanges>();
  public reloadRequired = input.required<number>();
  public showLoader = input.required<boolean>();
  public confirmContinueAndLooseUnsavedChanges = input<() => boolean>();

  public valuesChanged: OutputEmitterRef<WriteKpiData> =
    output<WriteKpiData | null>();

  private readonly changedData: WritableSignal<Record<string, WriteKpiEntry>> =
    signal({});

  private readonly kpiDateExceptions: WritableSignal<Date[]> = signal([]);

  protected dataLoaded: Signal<boolean> = computed(() =>
    Boolean(this.kpiData())
  );

  protected components: Record<string, any> = {
    agDateInput: DateFilterComponent,
  };

  protected filterValues: WritableSignal<FilterValues> = signal({
    deliveries: true,
    firmBusiness: true,
    opportunities: true,
    forecastProposal: true,
    forecastProposalDemandPlanner: true,
    indicativeDemandPlanning: true,
    currentDemandPlan: true,
    activeAndPredecessor: false,
  });
  protected loading: WritableSignal<boolean> = signal(false);

  private gridApi: GridApi | undefined;

  protected gridOptions: GridOptions = {
    ...clientSideTableDefaultProps,
    suppressCsvExport: true,
    onFirstDataRendered: (event: FirstDataRenderedEvent) =>
      event.api.autoSizeAllColumns(),
    onNewColumnsLoaded: (event: NewColumnsLoadedEvent) =>
      event.api.autoSizeAllColumns(),
    onGridReady: (event) => {
      this.gridApi = event.api;
      this.updateColumnDefs();
      this.updateRowData();
    },
  };

  protected defaultColDef: ColDef = {
    sortable: false,
    suppressMovable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    headerComponent: DemandValidationKpiHeaderComponent,
  };

  private readonly backendRoles = toSignal(this.store.select(getBackendRoles));

  protected authorizedToChange = computed(() =>
    this.backendRoles()
      ? checkRoles(this.backendRoles(), demandValidationChangeAllowedRoles)
      : false
  );

  /**
   * Creates an instance of DemandValidationTableComponent.
   *
   * @memberof DemandValidationTableComponent
   */
  public constructor() {
    // load KPI data
    effect(
      () =>
        this.reloadRequired() >= 0 &&
        this.loadKPIs(
          this.materialListEntry(),
          this.kpiDateRange(),
          this.kpiDateExceptions()
        ),
      { allowSignalWrites: true }
    );

    // set and update column defs
    effect(
      () =>
        (this.filterValues() || this.materialListEntry() || this.kpiData()) &&
        this.updateColumnDefs()
    );

    // set and update row data
    effect(
      () => (this.planningView() || this.filterValues()) && this.updateRowData()
    );
  }

  /**
   * Updates row data based on current planning view value and filter values.
   *
   * @private
   * @memberof DemandValidationTableComponent
   */
  private updateRowData(): void {
    this.columnDefinitions =
      this.planningView() === PlanningView.REQUESTED
        ? kpiColumnDefinitionsRequested
        : kpiColumnDefinitionsConfirmed;

    this.gridApi?.setGridOption(
      'rowData',
      [...this.columnDefinitions].filter((row) =>
        row.visible(this.filterValues())
      )
    );
  }

  /**
   * Updates column definitions based on current filter values and material classification.
   *
   * @private
   * @memberof DemandValidationTableComponent
   */
  private updateColumnDefs(): void {
    this.gridApi?.setGridOption('columnDefs', [
      {
        ...getDefaultColDef(),
        headerName: translate('validation_of_demand.planning_table.kpi'),
        valueGetter: (params: ValueGetterParams) =>
          translateOr(
            (params.data as DemandValidationTableColDef).title(
              this.filterValues(),
              this.materialListEntry()?.materialClassification
            ),
            undefined,
            ''
          ),
        cellRenderer: TextWithDotCellRendererComponent,
        cellRendererParams: {
          materialClassification:
            this.materialListEntry()?.materialClassification,
        },
        pinned: true,
        width: 300,
      },
      ...((this.kpiData()?.data?.map((data: KpiEntry) => ({
        ...getDefaultColDef(),
        editable: this.editable(data),
        key: data.fromDate,
        colId: data.fromDate,
        valueGetter: (params: ValueGetterParams) => {
          const index =
            (params.data as DemandValidationTableColDef).key?.(
              this.filterValues(),
              this.materialListEntry()?.materialClassification
            ) ?? null;

          return index ? data[index as keyof KpiEntry] : undefined;
        },
        valueFormatter: this.parseAndFormatNumber.bind(this),
        valueSetter: this.validatedForecastSetter(data).bind(this),
        cellClass: (params: CellClassParams) =>
          getCellClass(
            data.bucketType,
            this.materialListEntry()?.dateRltDl,
            this.materialListEntry()?.dateFrozenZoneDl
          )(params),
        cellStyle: (params: CellClassParams) => ({
          ...this.colorCell(data)(params),
        }),
        headerComponentParams: {
          kpiEntry: data,
          onClickHeader: this.onHeaderClick.bind(this),
        },
      })) as ColDef[]) || []),
    ]);
  }

  /**
   * Parses and formats a number based on localization settings for display within an AG-Grid cell.
   *
   * @private
   * @param {ValueFormatterParams} params - The parameters containing the value to be formatted.
   * @returns {string} - The formatted string representation of the input number.
   * @memberof DemandValidationTableComponent
   */
  private parseAndFormatNumber(params: ValueFormatterParams): string {
    return parseAndFormatNumber(params, this.agGridLocalizationService);
  }

  /**
   * Handles changes to a slide toggle filter value and updates the filter values accordingly.
   *
   * @protected
   * @param {MatSlideToggleChange} event - The change event object from the slider component.
   * @param {keyof FilterValues} key - The key of the filter value that has changed.
   * @memberof DemandValidationTableComponent
   */
  protected onSlideToggleChange(
    event: MatSlideToggleChange,
    key: keyof FilterValues
  ): void {
    this.filterValues.update((current) => ({
      ...current,
      [key]: event.checked,
    }));
  }

  /**
   * Loads KPI data based on the provided material list entry, kpi date range and date exceptions.
   *
   * @private
   * @param {MaterialListEntry | undefined} materialListEntry - The material list entry used for fetching KPI data.
   * @param {KpiDateRanges} kpiDateRange - The date range for which to retrieve KPI data.
   * @param {Date[]} dateExceptions - Any exceptions that apply within the specified date range.
   * @memberof DemandValidationTableComponent
   */
  private loadKPIs(
    materialListEntry: MaterialListEntry | undefined,
    kpiDateRange: KpiDateRanges,
    dateExceptions: Date[]
  ): void {
    this.changedData.set({});
    this.valuesChanged.emit(null);
    this.kpiData.set(null);
    this.kpiError.set('');

    if (materialListEntry && kpiDateRange && dateExceptions) {
      this.loading.set(true);
      this.demandValidationService
        .getKpiData(materialListEntry, kpiDateRange, dateExceptions)
        .pipe(
          take(1),
          tap((data) => {
            if (data) {
              this.kpiData.set(data);

              return;
            }

            this.kpiError.set(translate('hint.noData'));
          }),
          catchError(() => {
            this.kpiError.set(translate('error.loading_failed'));

            return EMPTY;
          }),
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    } else {
      this.kpiError.set(translate('hint.noData'));
    }
  }

  /**
   * Checks whether a cell in the AG-Grid table can be edited based on the provided parameters and data.
   * TODO: 1:1 Copy from React, write better code after we have some unit tests for this.
   *
   * @param {EditableCallbackParams} params - The callback parameters from the grid event.
   * @param {KpiEntry} data - The KPI data associated with the cell to check for editability.
   * @returns {boolean} True if the cell is editable, false otherwise.
   */
  private isEditable(
    params: EditableCallbackParams,
    data: KpiEntry,
    considerColumnDefinitionEditable: boolean = true
  ): boolean {
    if (
      !this.authorizedToChange() ||
      (considerColumnDefinitionEditable &&
        !(params.data as (typeof this.columnDefinitions)[number]).editable)
    ) {
      return false;
    }

    // The logic is now handled by SAP https://jira.schaeffler.com/browse/D360-42
    //  - Material in status AC can be entered Validated Forecast without restriction and KPI Validated Forecast (VF) is completely green
    //  - Material in status SP can be entered Validated Forecast without restriction and KPI VF is completely green
    //  - Material in status SB can be entered Validated Forecast without restriction and KPI VF is completely green
    //  - Material in status IA can not be entered Validated Forecast and KPI VF is completely white
    //  - Material in status PI can be entered Validated Forecast from PI date and KPI VF is green from PI date and white before PI date
    //  - Material in status PO can be entered Validated Forecast up to PO date and KPI VF is green up to PO date and white after PO date
    //  - Material in status SE can be entered Validated Forecast up to SE date and KPI VF is green up to SE date and white after SE date
    //  - Material in status SI can be entered Validated Forecast up to SI date and KPI VF is green up to SI date and white after SI date
    //  - OP materials are excluded

    const fromDateCurrentColumn = parseISO(data.fromDate);
    const firstEditableDateFromSAP = parseISO(
      (data.bucketType === 'MONTH'
        ? this.materialListEntry()?.dateBeginMaintPossibleMonth
        : this.materialListEntry()?.dateBeginMaintPossibleWeek) ||
        (new Date().toISOString() as string)
    );

    let tmpDateEndMaintPossible: string;
    if (data.bucketType === 'MONTH') {
      tmpDateEndMaintPossible =
        this.materialListEntry()?.dateEndMaintPossibleMonth &&
        !this.materialListEntry().dateEndMaintPossibleMonth.includes(
          '1900-01-01'
        )
          ? this.materialListEntry()?.dateEndMaintPossibleMonth
          : new Date('9999-12-31').toISOString();
    } else {
      tmpDateEndMaintPossible =
        this.materialListEntry()?.dateEndMaintPossibleWeek &&
        !this.materialListEntry().dateEndMaintPossibleWeek.includes(
          '1900-01-01'
        )
          ? this.materialListEntry()?.dateEndMaintPossibleWeek
          : new Date('9999-12-31').toISOString();
    }

    const lastEditableDateFromSAP = parseISO(tmpDateEndMaintPossible);

    if (isAfter(fromDateCurrentColumn, lastEditableDateFromSAP)) {
      return false;
    }

    return !isAfter(firstEditableDateFromSAP, fromDateCurrentColumn);
  }

  /**
   * Returns a function that determines whether a specific data row can be edited based on the provided parameters and data.
   *
   * @param {KpiEntry} data - The KPI data associated with the row to check for editability.
   * @returns {(params: EditableCallbackParams) => boolean} A function that accepts an editable callback parameter and returns a boolean indicating whether the cell is editable.
   */
  private editable(
    data: KpiEntry
  ): (params: EditableCallbackParams) => boolean {
    return (params: EditableCallbackParams) => this.isEditable(params, data);
  }

  /**
   * Calculates the sum of deliveries and firm business for a given KPI data entry.
   *
   * @param {KpiEntry} data - The KPI data entry to calculate from.
   * @returns {number} The sum of active deliveries and firm business, defaulting to 0 if not present in the input data.
   */
  private calculateFirmBusinessAndDeliveries(data: KpiEntry): number {
    const deliveries = data.deliveriesActive || 0;
    const firmBusiness = data.firmBusinessActive || 0;

    return deliveries + firmBusiness;
  }

  /**
   * Generates a function that determines the cell style for a specific KPI data entry within AG-Grid, including background coloring based on the material classification and fix horizon settings.
   *
   * @param {KpiEntry} data - The KPI data associated with the cell to determine its style.
   * @returns {(params: CellClassParams) => CellStyle | null} A function that accepts an AG-Grid cell class parameter and returns a CellStyle object containing the desired styling for the cell, or null if no special styling is required.
   */
  private colorCell(
    data: KpiEntry
  ): (params: CellClassParams) => CellStyle | null {
    const fixHor = this.materialListEntry()?.fixHor;
    const stochasticType = this.materialListEntry()?.stochasticType;

    const isInFixZone = (fromDate: Date) => {
      let isBeforeDate: boolean;

      try {
        isBeforeDate = isBefore(
          fromDate,
          firstEditableDateForTodayInBucket(data.bucketType)
        );
      } catch {
        isBeforeDate = false;
      }

      return (
        fixHor &&
        isAfter(parseISO(fixHor), new Date()) &&
        !isBeforeDate &&
        (stochasticType === 'E' || stochasticType === 'C') &&
        !isAfter(fromDate, parseISO(fixHor))
      );
    };

    return (params: CellClassParams): CellStyle | null => {
      const parsedFloat = strictlyParseLocalFloat(
        params.value,
        ValidationHelper.getDecimalSeparatorForActiveLocale()
      );
      const rowKey =
        (params.data as DemandValidationTableColDef).key?.(
          this.filterValues()
        ) ?? null;
      const editable: boolean = this.isEditable(params, data, false);

      if (!editable) {
        return {
          backgroundColor: demandValidationNotEditableColor,
        };
      }

      if (
        isInFixZone(parseISO(data.fromDate)) &&
        rowKey === 'currentDemandPlan'
      ) {
        return { backgroundColor: demandValidationInFixZoneColor };
      } else if ((params.data as DemandValidationTableColDef).editable) {
        if (
          parsedFloat < 0 ||
          (Number.isNaN(parsedFloat) &&
            params.value !== null &&
            params.value !== '')
        ) {
          return { backgroundColor: demandValidationWrongInputColor };
        } else if (
          parsedFloat < this.calculateFirmBusinessAndDeliveries(data)
        ) {
          return { backgroundColor: demandValidationToSmallColor };
        } else if (editable) {
          return { backgroundColor: demandValidationEditableColor };
        }
      }

      return null;
    };
  }

  /**
   * Generates a function that handles value setting for the AG-Grid cell in the context of validated forecast data.
   *
   * @param {KpiEntry} data - The KPI data associated with the cell to update its value.
   * @returns {(params: ValueSetterParams) => boolean} A function that accepts an AG-Grid value setter parameter and updates the relevant data in response, returning a boolean indicating whether the operation was successful.
   */
  private validatedForecastSetter(data: KpiEntry) {
    return (params: ValueSetterParams) => {
      if (
        (params.oldValue === params.newValue && params.newValue !== '') ||
        !this.isEditable(params, data)
      ) {
        return false;
      }

      if (data.storedBucketType === 'WEEK' && data.bucketType === 'MONTH') {
        // Hint: It is not possible to use our confirm dialog here, because AG-Grid does not
        // support async value setters.
        // This is the reason why we use a browser confirm dialog.
        const result = confirm(
          translate('validation_of_demand.confirm.override_week_by_month', {
            date: format(
              data.fromDate,
              getMonthYearDateFormatByCode(
                this.localeService.getLocale() as LocaleType
              ).display.dateInput
            ),
          })
        );

        if (!result) {
          return false;
        }
      }

      return this.updateData(params);
    };
  }

  /**
   * Updates data based on new values entered into AG-Grid cells, handling validation and updating internal state as necessary.
   *
   * @param {ValueSetterParams} params - The parameters containing the old and new cell values and associated metadata.
   * @returns {boolean} True if the update was successful, false otherwise.
   */
  private updateData(params: ValueSetterParams): boolean {
    const rowKey: keyof KpiEntry = (
      params.data as DemandValidationTableColDef
    ).key(this.filterValues()) as keyof KpiEntry;

    if (!rowKey) {
      return false;
    }

    const date = params.column.getColId();
    const kpiEntryIndex: number = this.kpiData().data.findIndex(
      (entry) => entry.fromDate === date
    );

    if (kpiEntryIndex === -1) {
      return false;
    }

    const parsedValue = strictlyParseLocalFloat(
      params.newValue,
      ValidationHelper.getDecimalSeparatorForActiveLocale()
    );

    this.kpiData.update((kpiData) => {
      kpiData.data[kpiEntryIndex] = {
        ...kpiData.data[kpiEntryIndex],
        [rowKey]: Number.isNaN(parsedValue) ? params.newValue : parsedValue,
      };

      this.changedData.update((changedData) => {
        changedData[kpiData.data[kpiEntryIndex].fromDate] = {
          fromDate: kpiData.data[kpiEntryIndex].fromDate,
          bucketType: kpiData.data[kpiEntryIndex].bucketType,
          [rowKey]: kpiData.data[kpiEntryIndex][rowKey],
        } as unknown as WriteKpiEntry;

        return { ...changedData };
      });

      return { ...kpiData };
    });

    this.valuesChanged.emit({
      materialNumber: this.kpiData().materialNumber,
      customerNumber: this.kpiData().customerNumber,
      kpiEntries: Object.values(this.changedData()),
    });

    return true;
  }

  /**
   * Handles header click events in AG-Grid and updates KPI date exceptions based on the selected period.
   *
   * @param {KpiEntry} entry - The KPI data associated with the clicked header.
   */
  private onHeaderClick(entry: KpiEntry): void {
    if (!this.confirmContinueAndLooseUnsavedChanges()()) {
      return;
    }

    // An exception describes a full month and never a part of the month.
    // Therefore, we use the start of month date to identify the exception.
    const startOfMonthPeriod: Date = startOfMonth(parseISO(entry.fromDate));

    const index: number = this.kpiDateExceptions()
      ?.map(Number)
      .indexOf(+startOfMonthPeriod);
    const newKpiRangeExceptions: Date[] = [...this.kpiDateExceptions()];

    if (index < 0) {
      newKpiRangeExceptions?.push(startOfMonthPeriod);
    } else {
      newKpiRangeExceptions?.splice(index, 1);
    }

    this.kpiDateExceptions.set(newKpiRangeExceptions);
  }
}
