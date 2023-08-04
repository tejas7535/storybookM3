import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { PushPipe } from '@ngrx/component';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { CopyInputModule } from './components/copy-input/copy-input.module';
import { GeometricalInformationComponent } from './components/geometrical-information/geometrical-information.component';
import { HardnessConverterComponent } from './hardness-converter.component';
import { HardnessConverterRoutingModule } from './hardness-converter-routing.module';

@NgModule({
  declarations: [HardnessConverterComponent],
  imports: [
    CommonModule,
    GeometricalInformationComponent,
    HardnessConverterRoutingModule,
    SubheaderModule,
    CopyInputModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    MatSnackBarModule,

    ReactiveFormsModule,
    PushPipe,

    SharedModule,
    SharedTranslocoModule,
  ],
})
export class HardnessConverterModule {}
