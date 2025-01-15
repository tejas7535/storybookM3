import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, Subject, tap } from 'rxjs';

import { GridApi, IServerSideDatasource } from 'ag-grid-enterprise';

import { formatFilterModelForBackend } from '../../../../shared/ag-grid/grid-filter-model';
import {
  applyColumnSettings,
  getColumnSettingsFromGrid,
} from '../../../../shared/ag-grid/grid-utils';
import {
  AbstractColumnSettingsService,
  ColumnDefinition,
  ColumnSetting,
} from '../../../../shared/services/abstract-column-settings.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { columnDefinitions } from '../column-definition';
import {
  LAYOUT_IDS,
  LayoutId,
  LOCALSTORAGE_LAYOUT,
} from '../components/column-layout-management-modal/column-layout-management-modal.model';

@Injectable({
  providedIn: null,
})
export class MaterialCustomerTableService<
  COLUMN_KEYS extends string,
  COLDEF extends ColumnDefinition<COLUMN_KEYS>,
> extends AbstractColumnSettingsService<COLUMN_KEYS, COLDEF> {
  private readonly agGridLocalizationService: AgGridLocalizationService;

  private readonly dataFetchedEvent = new Subject<{
    totalRowCount: number;
  }>();
  private readonly fetchErrorEvent = new Subject<any>();

  tableName = 'customer-material-1';

  constructor(
    httpClient: HttpClient,
    agGridLocalizationService: AgGridLocalizationService
  ) {
    super(httpClient, columnDefinitions(agGridLocalizationService));
    this.agGridLocalizationService = agGridLocalizationService;
  }

  private getStoredLayout(): LayoutId | null {
    const storedLayout = localStorage.getItem(LOCALSTORAGE_LAYOUT);

    return storedLayout && LAYOUT_IDS.includes(storedLayout as LayoutId)
      ? (storedLayout as LayoutId)
      : null;
  }

  public useMaterialCustomerColumnLayouts(gridApi: GridApi) {
    const currentLayoutId: LayoutId = this.getStoredLayout() || '1';
    this.tableName = `customer-material-${currentLayoutId}`;

    this.loadColumnSettings$()
      .pipe(
        tap((settings) => {
          if (settings) {
            applyColumnSettings(gridApi, settings);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    return {
      resetLayout: (newLayoutId: LayoutId) => {
        this.tableName = `customer-material-${newLayoutId}`;
        applyColumnSettings(gridApi, this.getDefaultColumnSettings());

        return this.saveColumnSettings$(this.getDefaultColumnSettings())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      },
      saveLayout: (newLayoutId: LayoutId) => {
        this.tableName = `customer-material-${newLayoutId}`;

        return this.saveColumnSettings$(
          getColumnSettingsFromGrid<COLUMN_KEYS>(gridApi)
        )
          .pipe(
            tap(() => localStorage.setItem(LOCALSTORAGE_LAYOUT, newLayoutId)),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      },
      loadLayout: (newLayoutId: LayoutId) => {
        this.tableName = `customer-material-${newLayoutId}`;

        this.loadColumnSettings$()
          .pipe(
            tap((settings) => {
              if (settings) {
                applyColumnSettings(gridApi, settings);
              } else {
                applyColumnSettings(gridApi, this.getDefaultColumnSettings());
              }
              localStorage.setItem(LOCALSTORAGE_LAYOUT, newLayoutId);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      },
    };
  }

  createEmptyDatasource(): IServerSideDatasource {
    return {
      getRows: (params) => {
        this.dataFetchedEvent.next({ totalRowCount: 0 });
        params.success({ rowData: [], rowCount: 0 });
      },
    };
  }

  createMaterialCustomerDatasource(
    selectionFilters: any,
    predefinedColumnFilters: any
  ): IServerSideDatasource {
    const httpClient = this.http;

    return {
      getRows: (params) => {
        const { startRow, endRow, sortModel, filterModel } = params.request;
        const columnFilters = formatFilterModelForBackend(filterModel);

        // subsequent data loading by AgGrid won't change the totalRowCount as we're only
        // interested in the first data request for the totalRowCount display
        if (startRow === 0) {
          this.dataFetchedEvent.next({ totalRowCount: 0 });
        }

        httpClient
          .post('api/material-customer', {
            startRow,
            endRow,
            sortModel,
            selectionFilters,
            columnFilters: [predefinedColumnFilters, columnFilters].filter(
              (x) => x && Object.keys(x).length > 0
            ),
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (data: any) => {
              params.success({ rowData: data.rows, rowCount: data.rowCount });
              this.dataFetchedEvent.next({
                totalRowCount: data.rowCount,
              });
            },
            error: (e) => {
              params.fail();
              this.fetchErrorEvent.next(e);
            },
          });
      },
    };
  }

  getDataFetchedEvent(): Observable<{
    totalRowCount: number;
  }> {
    return this.dataFetchedEvent.asObservable();
  }

  getFetchErrorEvent(): Observable<any> {
    return this.fetchErrorEvent.asObservable();
  }

  private getDefaultColumnSettings(): ColumnSetting<COLUMN_KEYS>[] {
    return columnDefinitions(this.agGridLocalizationService).map(
      ({ colId, visible }) => ({
        colId: colId as COLUMN_KEYS,
        visible,
      })
    );
  }
}
