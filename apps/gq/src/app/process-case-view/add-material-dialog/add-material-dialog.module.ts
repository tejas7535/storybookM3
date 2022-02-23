import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddEntryModule } from '../../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/case-material/input-table/input-table.module';
import { AddMaterialDialogComponent } from './add-material-dialog.component';

@NgModule({
  declarations: [AddMaterialDialogComponent],
  imports: [
    AddEntryModule,
    InputTableModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    CommonModule,
  ],
  exports: [AddMaterialDialogComponent],
})
export class AddMaterialDialogModule {}
