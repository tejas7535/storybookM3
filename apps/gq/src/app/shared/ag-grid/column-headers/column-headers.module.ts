import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EditableColumnHeaderComponent } from './editable-column-header/editable-column-header.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    SharedTranslocoModule,
  ],
  declarations: [EditableColumnHeaderComponent],
  exports: [EditableColumnHeaderComponent],
})
export class ColumnHeadersModule {}
