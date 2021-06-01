import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

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
  providers: [DecimalPipe],
  exports: [DimensionsWidgetComponent],
})
export class DimensionsWidgetModule {}
