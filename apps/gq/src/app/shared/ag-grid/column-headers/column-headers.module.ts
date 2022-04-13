import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { EditableColumnHeaderComponent } from './editable-column-header/editable-column-header.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [EditableColumnHeaderComponent],
  exports: [EditableColumnHeaderComponent],
})
export class ColumnHeadersModule {}
