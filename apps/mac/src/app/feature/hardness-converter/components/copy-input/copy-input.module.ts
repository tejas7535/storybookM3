import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CopyInputComponent } from './copy-input.component';

@NgModule({
  declarations: [CopyInputComponent],
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  exports: [CopyInputComponent],
  providers: [DecimalPipe],
})
export class CopyInputModule {}
