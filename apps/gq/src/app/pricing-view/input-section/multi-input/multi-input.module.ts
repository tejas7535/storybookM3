import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MultiInputComponent } from './multi-input.component';

@NgModule({
  declarations: [MultiInputComponent],
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FlexModule,
    SharedTranslocoModule,
  ],
})
export class MultiInputModule {}
