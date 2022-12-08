import { Component } from '@angular/core';

import { take } from 'rxjs';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { MaterialClass } from '@mac/msd/constants';
import { EDITABLE_MATERIAL_CLASSES } from '@mac/msd/constants/editable-material-classes';
import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { fetchResult } from '@mac/msd/store/actions/data';
import {
  materialDialogCanceled,
  materialDialogOpened,
  minimizeDialog,
  openDialog,
  openEditDialog,
} from '@mac/msd/store/actions/dialog';
import { DataFacade } from '@mac/msd/store/facades/data';

import { EditCellRendererParams } from './edit-cell-renderer-params.model';

@Component({
  selector: 'mac-edit-cell-renderer',
  templateUrl: './edit-cell-renderer.component.html',
})
export class EditCellRendererComponent implements ICellRendererAngularComp {
  public params: EditCellRendererParams;
  public hovered = false;

  public materialClass$ = this.dataFacade.materialClass$;

  constructor(
    private readonly dialogService: MsdDialogService,
    private readonly dataFacade: DataFacade
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

  public editableClass = (materialClass: MaterialClass): boolean =>
    EDITABLE_MATERIAL_CLASSES.includes(materialClass);

  public onEditClick(): void {
    this.dataFacade.dispatch(openDialog());
    const dialogRef = this.dialogService.openDialog(
      false,
      {
        row: this.params.data as DataResult,
        column: this.params.column.getColId(),
      },
      this.params.data.materialClass as MaterialClass
    );

    dialogRef
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        this.dataFacade.dispatch(materialDialogOpened());
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
}
