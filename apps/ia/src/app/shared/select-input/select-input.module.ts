import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { SelectInputComponent } from './select-input.component';

@NgModule({
  declarations: [SelectInputComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule.withConfig({
      callSetDisabledState: 'whenDisabledForLegacyCode',
    }),
    ReactiveFormsModule,
  ],
  exports: [SelectInputComponent],
})
export class SelectInputModule {}
