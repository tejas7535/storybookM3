import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { take } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';
import { GridApi, RowSelectionOptions } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { BaseDatagridComponent } from '../base-datagrid.component';

@Component({
  selector: 'mac-raw-material-datagrid',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
    // ag grid
    AgGridModule,
  ],
  templateUrl: './raw-material-datagrid.component.html',
})
export class RawMaterialDatagridComponent
  extends BaseDatagridComponent
  implements OnInit, OnDestroy
{
  public rowSelection = {
    mode: 'multiRow',
    enableClickSelection: false,
    checkboxes: false,
    headerCheckbox: false,
  } as RowSelectionOptions;
  public hasEditorRole = false;
  public result$ = this.dataFacade.result$;

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridStateService: MsdAgGridStateService,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly agGridConfigService: MsdAgGridConfigService,
    protected readonly quickFilterFacade: QuickFilterFacade
  ) {
    super(
      dataFacade,
      agGridStateService,
      agGridReadyService,
      agGridConfigService,
      quickFilterFacade
    );
    this.dataFacade.hasEditorRole$
      .pipe(take(1))
      .subscribe((hasEditorRole) => (this.hasEditorRole = hasEditorRole));
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public onGridReady({ api }: { api: GridApi }): void {
    super.onGridReady({ api });
    // deselect all rows on filter changes
    this.agGridApi.addEventListener('filterChanged', () => {
      this.agGridApi.deselectAll();
    });
  }

  protected getCellRendererParams() {
    return {
      hasEditorRole: this.hasEditorRole,
    };
  }
}
