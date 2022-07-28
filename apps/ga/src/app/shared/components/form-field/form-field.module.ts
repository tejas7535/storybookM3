import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InputComponent } from './input';
import { SelectComponent } from './select';

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
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  exports: [InputComponent, SelectComponent],
})
export class FormFieldModule {}
