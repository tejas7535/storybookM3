import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { HardnessConverterRoutingModule } from './hardness-converter-routing.module';
import { HardnessConverterComponent } from './hardness-converter.component';

@NgModule({
  declarations: [HardnessConverterComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    HardnessConverterRoutingModule,
  ],
})
export class HardnessConverterModule {}
