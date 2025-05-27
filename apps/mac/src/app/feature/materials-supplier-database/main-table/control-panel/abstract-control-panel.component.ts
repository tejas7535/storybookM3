import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ColumnState, GridApi } from 'ag-grid-enterprise';

import { ACTION, HISTORY, RECENT_STATUS } from '@mac/msd/constants';
import { MsdAgGridReadyService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-base-control-panel',
  template: '',
})
export abstract class AbstractControlPanelComponent
  implements OnInit, OnDestroy
{
  public navigation$ = this.dataFacade.navigation$;
  protected agGridApi: GridApi;

  protected readonly NON_EXCEL_COLUMNS = new Set([
    '',
    RECENT_STATUS,
    HISTORY,
    ACTION,
  ]);

  protected readonly destroy$ = new Subject<void>();

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridReadyService: MsdAgGridReadyService
  ) {}

  public ngOnInit(): void {
    this.agGridReadyService.agGridApi$
      .pipe(
        takeUntil(this.destroy$),
        filter((subject) => !!subject)
      )
      .subscribe(({ gridApi }) => {
        this.agGridApi = gridApi;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected getVisibleColumns(): string[] {
    return this.agGridApi
      .getColumnState()
      .filter((columnState: ColumnState) => !columnState.hide)
      .map((columnState: ColumnState) => columnState.colId);
  }

  public abstract reload(): void;
}
