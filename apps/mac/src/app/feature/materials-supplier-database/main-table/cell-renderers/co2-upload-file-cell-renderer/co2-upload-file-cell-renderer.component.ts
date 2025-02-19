import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';

import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';

@Component({
  selector: 'mac-co2-upload-file-cell-renderer',
  templateUrl: './co2-upload-file-cell-renderer.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // anuglar material
    MatIconModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class Co2UploadFileCellRendererComponent
  implements ICellRendererAngularComp
{
  public params: EditCellRendererParams;
  public active: boolean;

  constructor(protected readonly dialogService: MsdDialogService) {}

  public agInit(params: EditCellRendererParams): void {
    this.params = params;
    this.active = !!this.params.value && this.params.hasEditorRole;
  }

  public refresh(): boolean {
    return false;
  }

  public openPdf(): void {
    if (this.active) {
      this.dialogService.openPdfDialog(this.params.value);
    }
  }
}
