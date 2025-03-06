import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { filter, take } from 'rxjs';

import { PushPipe } from '@ngrx/component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
  imports: [
    // default
    CommonModule,
    // angular material
    MatButtonModule,
    MatIconModule,
    // ngrx
    PushPipe,
  ],
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  public params: ICellRendererParams<any, DataResult>;
  public isBulkEditAllowed$ = this.dataFacade.isBulkEditAllowed$;

  constructor(
    private readonly dialogService: MsdDialogService,
    private readonly dataFacade: DataFacade
  ) {}

  public agInit(params: ICellRendererParams<any, DataResult>): void {
    this.params = params;
  }

  public refresh(): boolean {
    return false;
  }

  public isSelected(): boolean {
    return this.params?.node.isSelected();
  }

  public onSelectClick(): void {
    this.params.node.setSelected(!this.params.node.isSelected());
  }

  public activeSelectionOnGrid(): boolean {
    return this.params?.api.getSelectedRows().length > 0;
  }

  public onDeleteClick(): void {
    const dialogRef = this.dialogService.openConfirmDeleteDialog();
    dialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.onConfirmDelete();
      });

    // TODO catch Error
  }

  public onCopyClick(): void {
    this.dialogService.openDialog(false, {
      row: this.params.data as DataResult,
      column: this.params.column.getColId(),
      isCopy: true,
    });
  }

  private onConfirmDelete(): void {
    this.dataFacade.deleteEntity(this.params.data.id);
  }
}
