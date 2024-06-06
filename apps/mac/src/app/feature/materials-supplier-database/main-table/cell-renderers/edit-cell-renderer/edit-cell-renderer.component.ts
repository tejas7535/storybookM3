import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PushPipe } from '@ngrx/component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IRowNode } from 'ag-grid-community';

import { MaterialClass, REFERENCE_DOCUMENT } from '@mac/msd/constants';
import { EDITABLE_MATERIAL_CLASSES } from '@mac/msd/constants/editable-material-classes';
import { DataResult } from '@mac/msd/models';
import { MsdDialogService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

import { EditCellRendererParams } from './edit-cell-renderer-params.model';

@Component({
  selector: 'mac-edit-cell-renderer',
  templateUrl: './edit-cell-renderer.component.html',
  standalone: true,
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
export class EditCellRendererComponent implements ICellRendererAngularComp {
  public params: EditCellRendererParams;
  public hovered = false;

  public materialClass$ = this.dataFacade.materialClass$;

  constructor(
    protected readonly dialogService: MsdDialogService,
    protected readonly dataFacade: DataFacade
  ) {}

  public agInit(params: EditCellRendererParams): void {
    this.params = params;
  }

  public refresh(): boolean {
    return false;
  }

  public isEnabled(materialClass: MaterialClass): boolean {
    // verify if edit is possible for user and material (in general)

    if (
      this.params?.hasEditorRole &&
      EDITABLE_MATERIAL_CLASSES.includes(materialClass)
    ) {
      // edit only available to selected rows, if some are selected
      return (
        this.params.api.getSelectedNodes().length === 0 ||
        this.params.node.isSelected()
      );
    }

    return false;
  }

  public setHovered(hovered: boolean): void {
    this.hovered = hovered;
  }

  public onEditClick(): void {
    if (this.params.api.getSelectedNodes().length < 2) {
      this.dialogService.openDialog(false, {
        row: this.params.data as DataResult,
        column: this.params.column.getColId(),
      });
    } else {
      if (this.params.column.getColId() === REFERENCE_DOCUMENT) {
        this.dialogService.openReferenceDocumentBulkEditDialog(
          this.params.api.getSelectedNodes().map((node: IRowNode) => node.data)
        );
      } else {
        this.dialogService.openBulkEditDialog(
          this.params.api.getSelectedNodes(),
          this.params.column.getColId()
        );
      }
    }
  }
}
