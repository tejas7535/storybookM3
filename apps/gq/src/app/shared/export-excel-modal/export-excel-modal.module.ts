import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DialogHeaderModule } from '../header/dialog-header/dialog-header.module';
import { ExportExcelModalComponent } from './export-excel-modal.component';

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
