import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    MatCheckboxModule,
    PushPipe,
    SharedTranslocoModule,
  ],
  exports: [BaseDialogComponent],
  providers: [MsdDialogService],
})
export class BaseDialogModule {}
