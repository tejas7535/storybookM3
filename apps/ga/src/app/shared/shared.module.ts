import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InputComponent } from './components/input/input/input.component';
import { SelectComponent } from './components/select/select.component';

@NgModule({
  declarations: [InputComponent, SelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,

    // Translation
    SharedTranslocoModule,
  ],
  exports: [InputComponent, SelectComponent],
})
export class SharedModule {}
