import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedModule } from '../../shared/shared.module';
import { HardnessConverterComponent } from './hardness-converter.component';
import { HardnessConverterRoutingModule } from './hardness-converter-routing.module';

@NgModule({
  declarations: [HardnessConverterComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    HardnessConverterRoutingModule,
    SharedModule,
    ReactiveComponentModule,
    MatTooltipModule,
  ],
})
export class HardnessConverterModule {}
