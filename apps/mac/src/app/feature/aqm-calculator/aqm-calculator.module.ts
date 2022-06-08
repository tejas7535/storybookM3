import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { PushModule } from '@ngrx/component';

import { SharedModule } from '../../shared/shared.module';
import { AqmCalculatorComponent } from './aqm-calculator.component';
import { AqmCalculatorRoutingModule } from './aqm-calculator-routing.module';

@NgModule({
  declarations: [AqmCalculatorComponent],
  imports: [
    CommonModule,
    SharedModule,
    AqmCalculatorRoutingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    PushModule,
  ],
})
export class AqmCalculatorModule {}
