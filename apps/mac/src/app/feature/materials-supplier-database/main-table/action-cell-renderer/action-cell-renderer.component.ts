import { Component } from '@angular/core';

import { filter, take } from 'rxjs';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { deleteEntity } from '@mac/msd/store/actions/data';
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

  private onConfirmDelete(): void {
    const id = this.params.data.id;
    this.dataFacade.dispatch(deleteEntity({ id }));
  }
}
