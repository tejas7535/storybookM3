import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PushModule } from '@ngrx/component';

import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';

import { BaseDialogComponent } from './base-dialog.component';

@NgModule({
  declarations: [BaseDialogComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    PushModule,
  ],
  exports: [BaseDialogComponent],
  providers: [MsdDialogService],
})
export class BaseDialogModule {}
