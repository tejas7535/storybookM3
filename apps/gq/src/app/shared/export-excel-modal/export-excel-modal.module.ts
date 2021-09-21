import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExportExcelModalComponent } from './export-excel-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ReactiveComponentModule } from '@ngrx/component';
import { DialogHeaderModule } from '../header/dialog-header/dialog-header.module';

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
    LoadingSpinnerModule,
    ReactiveComponentModule,
    DialogHeaderModule,
  ],
  exports: [ExportExcelModalComponent],
})
export class ExportExcelModalModule {}
