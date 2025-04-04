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
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

import { catchError, EMPTY, filter, finalize, map, take, tap } from 'rxjs';

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
  ITooltipParams,
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
  KpiBucketTypeEnum,
  KpiData,
  KpiDateRanges,
  KpiEntry,
  KpiType,
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
import {
  DemandValidationUserSettingsKey,
  UserSettingsKey,
} from '../../../../shared/models/user-settings.model';
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
  getCustomTreeDataAutoGroupColumnDef,
  getDefaultColDef,
} from './../../../../shared/ag-grid/grid-defaults';
import { GridTooltipComponent } from './../../../../shared/components/ag-grid/grid-tooltip/grid-tooltip.component';
import { UserService } from './../../../../shared/services/user.service';
import {
  demandValidationEditableColor,
  demandValidationInFixZoneColor,
  demandValidationNotEditableColor,
  demandValidationToSmallColor,
  demandValidationWrongInputColor,
} from './../../../../shared/styles/colors';
import { getCellClass } from './cell-style';
import {
  CustomTreeDataAutoGroupColumnDef,
  FilterValues,
  getColumnDefinitions,
} from './column-definitions';
import { LegendsComponent } from './legends/legends.component';
import { MoreInformationComponent } from './more-information/more-information.component';

@Component({
  selector: 'd360-demand-validation-table',
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
    MatButtonModule,
    MoreInformationComponent,
  ],
  templateUrl: './demand-validation-table.component.html',
  styleUrl: './demand-validation-table.component.scss',
})
export class DemandValidationTableComponent implements OnInit {
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  protected readonly localeService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  private readonly demandValidationService: DemandValidationService = inject(
    DemandValidationService
  );
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly store: Store = inject(Store);
  private readonly userService: UserService = inject(UserService);

  private columnDefinitions: CustomTreeDataAutoGroupColumnDef[] = [];

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

  public KpiType: typeof KpiType = KpiType;

  protected filterValues: WritableSignal<FilterValues> = signal({
    [KpiType.Deliveries]: true,
    [KpiType.FirmBusiness]: true,
    [KpiType.ForecastProposal]: true,
    [KpiType.ForecastProposalDemandPlanner]: true,
    [KpiType.ValidatedForecast]: true,
    [KpiType.DemandRelevantSales]: true,
    [KpiType.SalesAmbition]: true,
    [KpiType.Opportunities]: true,
    [KpiType.SalesPlan]: true,
  });

  /**
   * This is needed, so the keyvalue pipe returns the original order.
   *
   * @protected
   * @memberof DemandValidationTableComponent
   */
  protected originalOrder = (): number => 0;

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
      this.updateColumnDefs(this.kpiData());
      this.updateRowData();
    },

    ...getCustomTreeDataAutoGroupColumnDef<CustomTreeDataAutoGroupColumnDef>({
      getDataPath: (data: CustomTreeDataAutoGroupColumnDef) => data.path,
      autoGroupColumnDef: {
        headerName: '',
        valueGetter: (params: ValueGetterParams): string =>
          params.data
            ? translateOr(
                (params.data as CustomTreeDataAutoGroupColumnDef).title({
                  ...this.filterValues(),
                  expanded: params.node.expanded,
                }),
                undefined,
                ''
              )
            : '',
        cellRenderer: TextWithDotCellRendererComponent,
        pinned: true,
        width: 300,
      },
    }),
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
        )
    );

    effect(() => {
      // set and update column defs
      if (this.filterValues() || this.materialListEntry() || this.kpiData()) {
        this.updateColumnDefs(this.kpiData());
      }

      // set and update row data
      if (this.planningView() || this.filterValues()) {
        this.updateRowData();
      }
    });
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    this.setPersistedKPIs();
  }

  /**
   * Sets the persisted KPIs by subscribing to the user settings loaded observable.
   * Once the settings are loaded, it updates the filter values with the persisted
   * workbench settings for demand validation.
   *
   * The method performs the following steps:
   * 1. Waits for the user settings to be loaded.
   * 2. Takes the first emitted value indicating the settings are loaded.
   * 3. Maps the user settings to the demand validation workbench settings.
   * 4. Updates the filter values with the persisted workbench settings, ensuring
   *    the validated forecast KPI is retained.
   * 5. Completes the subscription when the component is destroyed.
   *
   * @private
   * @returns {void}
   * @memberof DemandValidationTableComponent
   */
  private setPersistedKPIs(): void {
    this.userService.settingsLoaded$
      .pipe(
        filter((loaded: boolean) => loaded),
        take(1),
        map(
          () =>
            this.userService.userSettings()?.[
              UserSettingsKey.DemandValidation
            ]?.[DemandValidationUserSettingsKey.Workbench]
        ),
        tap((filterValues) =>
          this.filterValues.update((current) => ({
            ...current,
            ...(filterValues || ({} as any)),
            [KpiType.ValidatedForecast]: current.validatedForecast,
          }))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Updates row data based on current planning view value and filter values.
   *
   * @private
   * @memberof DemandValidationTableComponent
   */
  private updateRowData(): void {
    this.columnDefinitions = getColumnDefinitions({
      planningView: this.planningView(),
    });

    this.gridApi?.setGridOption(
      'rowData',
      [...this.columnDefinitions].filter((row) =>
        row.visible(this.filterValues())
      )
    );
  }

  private isValueNoNumberOrTooSmall(value: string | number): boolean {
    const parsedFloat = strictlyParseLocalFloat(
      value,
      ValidationHelper.getDecimalSeparatorForActiveLocale()
    );

    return (
      parsedFloat < 0 ||
      (Number.isNaN(parsedFloat) && value !== null && value !== '')
    );
  }

  private isSmallerFirmBusinessAndDeliveries(
    value: string | number,
    data: KpiEntry
  ): boolean {
    const parsedFloat = strictlyParseLocalFloat(
      value,
      ValidationHelper.getDecimalSeparatorForActiveLocale()
    );

    return parsedFloat < this.calculateFirmBusinessAndDeliveries(data);
  }

  /**
   * Updates column definitions based on current filter values and material classification.
   *
   * @private
   * @param {KpiData} kpiData
   * @memberof DemandValidationTableComponent
   */
  private updateColumnDefs(kpiData: KpiData): void {
    this.gridApi?.setGridOption('columnDefs', [
      ...((kpiData?.data?.map((data: KpiEntry) => {
        const getKey = (
          params: ValueGetterParams | ITooltipParams
        ): string | null =>
          (params.data as CustomTreeDataAutoGroupColumnDef)?.key?.({
            ...this.filterValues(),
            expanded: params.node.expanded,
          }) ?? null;

        return {
          ...getDefaultColDef(this.translocoLocaleService.getLocale()),
          editable: this.editable(data),
          key: data.fromDate,
          colId: data.fromDate,
          valueGetter: (params: ValueGetterParams) =>
            getKey(params) ? data[getKey(params) as keyof KpiEntry] : undefined,
          valueFormatter: (params: ValueFormatterParams) =>
            this.parseAndFormatNumber(params),
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
          tooltipComponent: GridTooltipComponent,
          tooltipValueGetter: (params: ITooltipParams) => {
            if (getKey(params) === KpiType.ValidatedForecast) {
              if (this.isValueNoNumberOrTooSmall(params.value)) {
                return translate('error.valueTooSmall');
              } else if (
                this.isSmallerFirmBusinessAndDeliveries(params.value, data)
              ) {
                return translate('error.valueSmallerFirmBusiness');
              }
            }

            return null;
          },
          headerComponentParams: {
            kpiEntry: data,
            onClickHeader: this.onHeaderClick.bind(this),
          },
        };
      }) as ColDef[]) || []),
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

    const newSettings = this.filterValues();
    delete newSettings[KpiType.ValidatedForecast];

    this.userService.updateDemandValidationUserSettings(
      DemandValidationUserSettingsKey.Workbench,
      newSettings
    );
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
      const rowKey =
        (params.data as CustomTreeDataAutoGroupColumnDef)?.key?.({
          ...this.filterValues(),
          expanded: params.node.expanded,
        }) ?? null;

      const editable: boolean = this.isEditable(params, data, false);

      if (
        !editable ||
        (this.planningView() === PlanningView.CONFIRMED &&
          rowKey === KpiType.ValidatedForecast)
      ) {
        return {
          backgroundColor: demandValidationNotEditableColor,
        };
      }

      if (
        isInFixZone(parseISO(data.fromDate)) &&
        rowKey === KpiType.DemandRelevantSales
      ) {
        return { backgroundColor: demandValidationInFixZoneColor };
      } else if ((params.data as CustomTreeDataAutoGroupColumnDef)?.editable) {
        if (this.isValueNoNumberOrTooSmall(params.value)) {
          return { backgroundColor: demandValidationWrongInputColor };
        } else if (
          this.isSmallerFirmBusinessAndDeliveries(params.value, data)
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
  private validatedForecastSetter(
    data: KpiEntry
  ): (params: ValueSetterParams) => boolean {
    return (params: ValueSetterParams) => {
      if (
        (params.oldValue === params.newValue && params.newValue !== '') ||
        !this.isEditable(params, data)
      ) {
        return false;
      }

      if (
        data.storedBucketType === KpiBucketTypeEnum.WEEK &&
        data.bucketType === KpiBucketTypeEnum.MONTH
      ) {
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
      params.data as CustomTreeDataAutoGroupColumnDef
    ).key({
      ...this.filterValues(),
      expanded: params.node.expanded,
    }) as keyof KpiEntry;

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
        [rowKey]: Number.isNaN(parsedValue)
          ? params.newValue
          : // only integer are allowed, so we parse them here
            Number.parseInt(String(parsedValue), 10),
      };

      this.changedData.update((changedData) => {
        changedData[kpiData.data[kpiEntryIndex].fromDate] = {
          fromDate: kpiData.data[kpiEntryIndex].fromDate,
          bucketType: kpiData.data[kpiEntryIndex].bucketType,
          [rowKey]: kpiData.data[kpiEntryIndex][rowKey],
        } as unknown as WriteKpiEntry;

        return { ...changedData };
      });

      return { ...kpiData, data: [...kpiData.data] };
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
