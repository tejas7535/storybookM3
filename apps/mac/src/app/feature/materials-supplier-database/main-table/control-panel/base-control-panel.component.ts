import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ColumnApi, ColumnState, GridApi } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { ACTION, HISTORY, RECENT_STATUS } from '@mac/msd/constants';
import { MsdAgGridReadyService, MsdDialogService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-base-control-panel',
  template: '',
  standalone: true,
})
export abstract class BaseControlPanelComponent implements OnInit, OnDestroy {
  public navigation$ = this.dataFacade.navigation$;
  public resetFormDisabled = true;
  protected agGridApi: GridApi;
  protected agGridColumnApi: ColumnApi;

  protected readonly NON_EXCEL_COLUMNS = new Set([
    '',
    RECENT_STATUS,
    HISTORY,
    ACTION,
  ]);

  private readonly destroy$ = new Subject<void>();

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly datePipe: DatePipe,
    protected readonly applicationInsightsService: ApplicationInsightsService,
    protected readonly dialogService: MsdDialogService
  ) {}

  public ngOnInit(): void {
    this.agGridReadyService.agGridApi$
      .pipe(
        takeUntil(this.destroy$),
        filter((subject) => !!subject)
      )
      .subscribe(({ gridApi, columnApi }) => {
        this.agGridApi = gridApi;
        this.agGridColumnApi = columnApi;
      });

    this.dataFacade.agGridFilter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((agGridFilter: any) => {
        this.resetFormDisabled = Object.keys(agGridFilter || {}).length === 0;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public resetForm(): void {
    this.agGridApi.setFilterModel({});
    this.agGridApi.onFilterChanged();
  }

  protected getVisibleColumns(): string[] {
    return this.agGridColumnApi
      .getColumnState()
      .filter((columnState: ColumnState) => !columnState.hide)
      .map((columnState: ColumnState) => columnState.colId);
  }

  public abstract reload(): void;
}
