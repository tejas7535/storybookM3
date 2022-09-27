import { Component } from '@angular/core';

import { take } from 'rxjs';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import {
  DialogFacade,
  fetchMaterials,
  materialDialogCanceled,
  materialDialogOpened,
  minimizeDialog,
  openDialog,
  openEditDialog,
} from '@mac/msd/store';

import { EditCellRendererParams } from './edit-cell-renderer-params.model';

@Component({
  selector: 'mac-edit-cell-renderer',
  templateUrl: './edit-cell-renderer.component.html',
})
export class EditCellRendererComponent implements ICellRendererAngularComp {
  public params: EditCellRendererParams;
  public hovered = false;

  constructor(
    private readonly dialogService: MsdDialogService,
    private readonly dialogFacade: DialogFacade
  ) {}

  public agInit(params: EditCellRendererParams): void {
    this.params = params;
  }

  public refresh(): boolean {
    return false;
  }

  public setHovered(hovered: boolean): void {
    this.hovered = hovered;
  }

  public onEditClick(): void {
    this.dialogFacade.dispatch(openDialog());
    const dialogRef = this.dialogService.openDialog(false, {
      row: this.params.data as DataResult,
      column: this.params.column.getColId(),
    });

    dialogRef
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        this.dialogFacade.dispatch(materialDialogOpened());
        this.dialogFacade.dispatch(
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
          this.dialogFacade.dispatch(fetchMaterials());
        }
        if (minimize) {
          this.dialogFacade.dispatch(minimizeDialog(minimize));
        } else if (!reload) {
          this.dialogFacade.dispatch(materialDialogCanceled());
        }
      });
  }
}
