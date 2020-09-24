import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InputSectionComponent } from './input-section.component';
import { MultiSelectInputModule } from './multi-select-input/multi-select-input.module';
import { MultipleInputDialogModule } from './multiple-input-dialog/multiple-input-dialog.module';

@NgModule({
  declarations: [InputSectionComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MultipleInputDialogModule,
    MatChipsModule,
    MatIconModule,
    MultiSelectInputModule,
    SharedTranslocoModule,
    MultiSelectInputModule,
    SharedTranslocoModule,
  ],
  exports: [InputSectionComponent],
})
export class InputSectionModule {}
