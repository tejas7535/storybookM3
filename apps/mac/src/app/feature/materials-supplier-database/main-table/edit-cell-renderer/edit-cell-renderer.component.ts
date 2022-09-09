import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { DataResult } from '@mac/msd/models';
import { DialogFacade, openEditDialog } from '@mac/msd/store';

import { EditCellRendererParams } from './edit-cell-renderer-params.model';

@Component({
  selector: 'mac-edit-cell-renderer',
  templateUrl: './edit-cell-renderer.component.html',
})
export class EditCellRendererComponent implements ICellRendererAngularComp {
  public params: EditCellRendererParams;
  public hovered = false;

  constructor(private readonly dialogFacade: DialogFacade) {}

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
    this.dialogFacade.dispatch(
      openEditDialog({
        row: this.params.data as DataResult,
        column: this.params.column.getColId(),
      })
    );
  }
}
