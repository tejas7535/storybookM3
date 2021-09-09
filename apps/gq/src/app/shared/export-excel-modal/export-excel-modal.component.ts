import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportExcel } from './export-excel.enum';

@Component({
  templateUrl: './export-excel-modal.component.html',
})
export class ExportExcelModalComponent {
  exportExcelOption = ExportExcel.BASIC_DOWNLOAD;
  ExportExcel = ExportExcel;

  constructor(public dialogRef: MatDialogRef<ExportExcelModalComponent>) {}

  closeDialog() {
    this.dialogRef.close(this.exportExcelOption);
  }
}
