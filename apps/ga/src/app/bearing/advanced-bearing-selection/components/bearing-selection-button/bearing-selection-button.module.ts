import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSelectionButtonComponent } from './bearing-selection-button.component';

@NgModule({
  declarations: [BearingSelectionButtonComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  exports: [BearingSelectionButtonComponent],
})
export class BearingSelectionButtonModule {}
