/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';

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
  GridOptions,
  NewColumnsLoadedEvent,
  ValueGetterParams,
  ValueSetterParams,
} from 'ag-grid-community';
import { isAfter, isBefore, parseISO } from 'date-fns';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { firstEditableDateForBucket } from '../../../../feature/demand-validation/limits';
import {
  ForecastInfo,
  KpiData,
  KpiDateRanges,
  KpiEntry,
  MaterialListEntry,
} from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import {
  clientSideTableDefaultProps,
  getDefaultColDef,
} from '../../../../shared/ag-grid/grid-defaults';
import { DataHintComponent } from '../../../../shared/components/data-hint/data-hint.component';
import { StyledGridSectionComponent } from '../../../../shared/components/styled-grid-section/styled-grid-section.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import {
  demandValidationEditableColor,
  demandValidationInFixZoneColor,
  demandValidationPartialWeekColor,
  demandValidationToSmallColor,
  demandValidationWrongInputColor,
} from '../../../../shared/styles/colors';
import {
  checkRoles,
  demandValidationChangeAllowedRoles,
} from '../../../../shared/utils/auth/roles';
import { DemandValidationKpiHeaderComponent } from '../demand-validation-kpi-header/demand-validation-kpi-header.component';
import { getCellStyleFunc } from './cell-style';
import {
  FilterValues,
  kpiColumnDefinitionsConfirmed,
  kpiColumnDefinitionsRequested,
} from './column-definitions';

@Component({
  selector: 'app-demand-validation-table',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    DataHintComponent,
    StyledGridSectionComponent,
    AgGridModule,
  ],
  templateUrl: './demand-validation-table.component.html',
  styleUrl: './demand-validation-table.component.scss',
})
export class DemandValidationTableComponent {
  kpiData = signal<KpiData>(null);
  // kpiError = input<string>();
  materialListEntry = input.required<MaterialListEntry>();
  // @Input({required: true}) contentGridApi: GridApi;
  planningView = input.required<PlanningView>();
  kpiDateRange = input.required<KpiDateRanges>();
  dateExceptions = input.required<Date[]>();
  forecastInfo = signal<ForecastInfo>(null);
  dataLoaded = computed(
    () => Boolean(this.kpiData) && Boolean(this.forecastInfo)
  );
  protected readonly Boolean = Boolean;
  kpiError = signal<string>(null); // TODO check if this is necessary, because kpiData is fetched in this component

  protected filterValues = {
    deliveries: true,
    firmBusiness: true,
    opportunities: true,
    forecastProposal: true,
    forecastProposalDemandPlanner: true,
    indicativeDemandPlanning: true,
    currentDemandPlan: true,
    activeAndPredecessor: false,
  };

  columnDefinitions = computed(() =>
    this.planningView() === PlanningView.REQUESTED
      ? kpiColumnDefinitionsRequested
      : kpiColumnDefinitionsConfirmed
  );

  protected gridOptions: GridOptions = {
    ...clientSideTableDefaultProps,
    suppressCsvExport: true,
    onFirstDataRendered(event: FirstDataRenderedEvent) {
      event.columnApi.autoSizeAllColumns();
    },
    onNewColumnsLoaded(event: NewColumnsLoadedEvent) {
      event.columnApi.autoSizeAllColumns();
    },
  };
  defaultColDef: ColDef = {
    sortable: false,
    suppressMovable: true,
    suppressMenu: true,
    headerComponent: DemandValidationKpiHeaderComponent,
  };
  private authorizedToChange: boolean;
  protected columnDefs: ColDef[] = [];
  protected rowData: (ColDef & {
    key: (options: FilterValues, materialClassification?: string) => string;
    title: (options: FilterValues, materialClassification?: string) => string;
    visible: (
      options: FilterValues,
      materialClassification?: string
    ) => boolean;
    titleStyle: () => string;
    color?: (materialClassification?: string) => string;
  })[];

  constructor(
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly store: Store,
    private readonly demandValidationService: DemandValidationService,
    protected readonly agGridLocalizationService: AgGridLocalizationService
  ) {
    // eslint-disable-next-line ngrx/no-store-subscription
    this.store.select(getBackendRoles).subscribe((roles) => {
      this.authorizedToChange = checkRoles(
        roles,
        demandValidationChangeAllowedRoles
      );
    });

    effect(() => {
      this.rowData = [...this.columnDefinitions()].filter((row) =>
        row.visible(this.filterValues)
      );
    });

    effect(() => {
      if (this.materialListEntry()) {
        this.demandValidationService
          .getForecastInfo(
            this.materialListEntry()?.customerNumber,
            this.materialListEntry()?.materialNumber
          )
          .subscribe((forecastInfo) => {
            this.forecastInfo.set(forecastInfo);
          });
      }
    });

    effect(() => {
      if (
        this.materialListEntry() &&
        this.kpiDateRange() &&
        this.dateExceptions()
      ) {
        this.demandValidationService
          .getKpiData(
            this.materialListEntry(),
            this.kpiDateRange(),
            this.dateExceptions()
          )
          .subscribe((kpiData) => {
            this.kpiData.set(kpiData);
          });
      }
    });

    effect(() => {
      const def = [
        {
          ...getDefaultColDef(),
          headerName: translate('validation_of_demand.planning_table.kpi', {}),
          valueGetter: (params: ValueGetterParams) => {
            const title = (params.data as any).title(
              this.materialListEntry()?.materialClassification
            );

            return translate(title, {});
          },
          // valueGetter: (params: ValueGetterParams) => {
          //   const title = (params.data as (typeof this.columnDefinitions())[number]).title(
          //     this.materialListEntry()?.materialClassification,
          //   );

          //   return translate(title, {});
          // },
          //       cellRenderer: (params: ICellRendererParams) => (
          //         <TitleRenderer
          //           { ...params }
          //       materialClassification = { materialListEntry?.materialClassification,
          //     }
          //     columnDefinitions = { columnDefinitions }
          //     />
          // ),
          pinned: true,
          width: 300,
        },
        ...((this.kpiData()?.data.map((data) => ({
          ...getDefaultColDef(),
          editable: this.editable(data),
          key: data.fromDate,
          colId: data.fromDate,
          // valueGetter: (params: ValueGetterParams) => {
          //   const index = (params.data as (typeof columnDefinitions)[number]).key(
          //     this.materialListEntry()?.materialClassification,
          //   );
          //
          //   return index ? data[index] : undefined;
          // },
          valueFormatter: this.agGridLocalizationService.numberFormatter, // TODO check if this formatter is ok
          // valueSetter: this.validatedForecastSetter(this.kpiData(), data),
          cellStyle: (params: CellClassParams) => ({
            ...this.colorCell(data)(params),
            ...getCellStyleFunc(
              data.bucketType,
              this.materialListEntry()?.currentRLTSchaeffler,
              this.materialListEntry()?.materialClassification,
              this.forecastInfo()
            )(params),
          }),
          headerComponentParams: {
            kpiEntry: data,
            // onClickHeader: onClickHeader, // TODO implement
          },
        })) as ColDef[]) || []),
      ];
      this.columnDefs = def;
    });
  }

  private isEditable(
    params: EditableCallbackParams | CellClassParams | ValueSetterParams,
    data: KpiEntry
  ): boolean {
    if (this.materialListEntry()?.materialClassification === 'OP') {
      return false;
    }
    if (!this.authorizedToChange) {
      return false;
    }
    if (!(params.data as any).editable) {
      return false;
    }

    const fromDateCurrentColumn = parseISO(data.fromDate);

    return !isBefore(
      fromDateCurrentColumn,
      firstEditableDateForBucket(data.bucketType)
    );
  }

  editable = (data: KpiEntry) => (params: EditableCallbackParams) =>
    this.isEditable(params, data);

  calculateFirmBusinessAndDeliveries(data: KpiEntry): number {
    const deliveries = data.deliveriesActive || 0;
    const firmBusiness = data.firmBusinessActive || 0;

    return deliveries + firmBusiness;
  }

  colorCell =
    (data: KpiEntry) =>
    (params: CellClassParams): CellStyle | null => {
      const editable = this.isEditable(params, data);
      const fromDateCurrentColumn = parseISO(data.fromDate);
      const inFixZone =
        this.materialListEntry()?.fixHor &&
        isAfter(parseISO(this.materialListEntry()?.fixHor), new Date()) &&
        !isBefore(
          fromDateCurrentColumn,
          firstEditableDateForBucket(data.bucketType)
        ) &&
        (this.materialListEntry()?.stochasticType === 'E' ||
          this.materialListEntry()?.stochasticType === 'C') &&
        !isAfter(
          fromDateCurrentColumn,
          parseISO(this.materialListEntry()?.fixHor)
        );
      const parsedFloat = params.value; // TODO parse Float strictlyParseFloat(params.value);
      const isPositiveFloat = parsedFloat >= 0;
      const forecastTooSmall =
        parsedFloat < this.calculateFirmBusinessAndDeliveries(data);
      const rowKey = (params.data as any).key(this.filterValues);

      if (inFixZone && rowKey === 'currentDemandPlan') {
        return {
          backgroundColor: demandValidationInFixZoneColor,
        };
      }
      if ((params.data as any).editable) {
        if (params.value && !isPositiveFloat) {
          return {
            backgroundColor: demandValidationWrongInputColor,
          };
        }
        if (forecastTooSmall) {
          return {
            backgroundColor: demandValidationToSmallColor,
          };
        }
        if (editable) {
          return {
            backgroundColor: demandValidationEditableColor,
          };
        }
      }
      if (data.bucketType === 'PARTIAL_WEEK') {
        return {
          backgroundColor: demandValidationPartialWeekColor,
        };
      }

      return null;
    };

  validatedForecastSetter(kpiData: KpiData, data: KpiEntry) {
    return (params: ValueSetterParams) => {
      if (params.oldValue === params.newValue && params.newValue !== '') {
        return false;
      }
      if (!this.isEditable(params, data)) {
        return false;
      }

      if (data.storedBucketType === 'WEEK' && data.bucketType === 'MONTH') {
        const result = confirm(
          translate('validation_of_demand.confirm.override_week_by_month', {
            date: this.translocoLocaleService.localizeDate(
              data.fromDate,
              this.translocoLocaleService.getLocale(),
              {}
            ), // TODO check if this date format is right, the former one was: format(parseISO(data.fromDate), preferredDateFormatWithoutDay),
          })
        );
        if (!result) {
          return false;
        }
      }

      const updated = this.updateData(params, kpiData);

      return updated;
    };
  }

  updateData(params: ValueSetterParams, kpiData: KpiData): boolean {
    // const d = (typeof this.columnDefinitions())[number].key(this.filterValues);
    const rowKey: keyof KpiEntry = (
      params.data as (typeof kpiColumnDefinitionsRequested)[number]
    ).key(this.filterValues) as keyof KpiEntry;
    if (!rowKey) {
      return false;
    }

    const date = params.column.getColId();
    const kpiEntryIndex = kpiData.data.findIndex(
      (entry) => entry.fromDate === date
    );
    if (kpiEntryIndex === -1) {
      return false;
    }
    const parsedValue = params.newValue; // TODO parse float strictlyParseFloat(params.newValue);

    // @ts-expect-error assignment of a value to a possibly undefined property
    kpiData.data[kpiEntryIndex][rowKey] = parsedValue ?? params.newValue;

    return true;
  }
}
