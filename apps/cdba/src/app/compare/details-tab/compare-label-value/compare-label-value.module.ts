import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushModule } from '@ngrx/component';

import { CompareLabelValueComponent } from './compare-label-value.component';

@NgModule({
  declarations: [CompareLabelValueComponent],
  imports: [CommonModule, PushModule, MatTooltipModule],
  exports: [CompareLabelValueComponent],
})
export class CompareLabelValueModule {}
