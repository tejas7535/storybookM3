import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { CompareLabelValueModule } from '../compare-label-value';
import { DimensionsWidgetComponent } from './dimensions-widget.component';

@NgModule({
  declarations: [DimensionsWidgetComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    CompareLabelValueModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [DimensionsWidgetComponent],
})
export class DimensionsWidgetModule {}
