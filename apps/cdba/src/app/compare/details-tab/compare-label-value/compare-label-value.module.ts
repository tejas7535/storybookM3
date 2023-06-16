import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { PushPipe } from '@ngrx/component';

import { CompareLabelValueComponent } from './compare-label-value.component';

@NgModule({
  declarations: [CompareLabelValueComponent],
  imports: [CommonModule, PushPipe, MatTooltipModule],
  exports: [CompareLabelValueComponent],
})
export class CompareLabelValueModule {}
