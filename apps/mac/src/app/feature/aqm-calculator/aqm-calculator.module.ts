import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    PushPipe,
    LetDirective,
    SharedTranslocoModule,
    SelectModule,
  ],
})
export class AqmCalculatorModule {}
