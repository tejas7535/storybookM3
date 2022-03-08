import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveComponentModule } from '@ngrx/component';

import { CompareLabelValueComponent } from './compare-label-value.component';

@NgModule({
  declarations: [CompareLabelValueComponent],
  imports: [CommonModule, ReactiveComponentModule, MatTooltipModule],
  exports: [CompareLabelValueComponent],
})
export class CompareLabelValueModule {}
