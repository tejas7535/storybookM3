import { Component } from '@angular/core';

import { filter, take } from 'rxjs';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { deleteEntity, fetchResult } from '@mac/msd/store/actions/data';
import {
  materialDialogCanceled,
  minimizeDialog,
  openDialog,
  openEditDialog,
} from '@mac/msd/store/actions/dialog';
import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  public params: ICellRendererParams<any, DataResult>;

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
    this.dataFacade.dispatch(openDialog());
    const dialogRef = this.dialogService.openDialog(false, {
      row: this.params.data as DataResult,
      column: this.params.column.getColId(),
      isCopy: true,
    });

    dialogRef
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        this.dataFacade.dispatch(
          openEditDialog({
            row: this.params.data as DataResult,
            column: this.params.column.getColId(),
          })
        );
      });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(({ reload, minimize }) => {
        if (reload) {
          this.dataFacade.dispatch(fetchResult());
        }
        if (minimize) {
          this.dataFacade.dispatch(minimizeDialog(minimize));
        } else if (!reload) {
          this.dataFacade.dispatch(materialDialogCanceled());
        }
      });
  }

  private onConfirmDelete(): void {
    const id = this.params.data.id;
    this.dataFacade.dispatch(deleteEntity({ id }));
  }
}
