import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
