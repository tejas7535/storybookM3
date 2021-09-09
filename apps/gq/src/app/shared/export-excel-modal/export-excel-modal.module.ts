import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExportExcelModalComponent } from './export-excel-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExportExcelModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    SharedTranslocoModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
  ],
  exports: [ExportExcelModalComponent],
})
export class ExportExcelModalModule {}
