import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelValueModule } from '../label-value/label-value.module';
import { DimensionsWidgetComponent } from './dimensions-widget.component';

@NgModule({
  declarations: [DimensionsWidgetComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LabelValueModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [DimensionsWidgetComponent],
})
export class DimensionsWidgetModule {}
