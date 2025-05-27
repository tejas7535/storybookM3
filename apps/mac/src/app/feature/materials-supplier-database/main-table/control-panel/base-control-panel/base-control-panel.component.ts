import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { filter, Observable, Subject, takeUntil } from 'rxjs';

import { LetDirective } from '@ngrx/component';
import { GridApi } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdAgGridReadyService } from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

@Component({
  selector: 'mac-base-control-panel',
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    LetDirective,
  ],
  templateUrl: './base-control-panel.component.html',
})
export class BaseControlPanelComponent implements OnInit, OnDestroy {
  @Input() public data$: Observable<{
    totalRows: number;
    subTotalRows: number;
  }>;
  @Output() reload = new EventEmitter<void>();

  public navigation$ = this.dataFacade.navigation$;
  public resetFormDisabled = true;
  private agGridApi: GridApi;
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly dataFacade: DataFacade,
    protected readonly agGridReadyService: MsdAgGridReadyService
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.agGridReadyService.agGridApi$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe(({ gridApi }) => {
        this.agGridApi = gridApi;
      });

    this.dataFacade.agGridFilter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((agGridFilter: any) => {
        this.resetFormDisabled = Object.keys(agGridFilter || {}).length === 0;
      });
  }
  public resetForm(): void {
    this.agGridApi.setFilterModel({});
    this.agGridApi.onFilterChanged();
  }

  public fireReload(): void {
    this.reload.emit();
  }
}
