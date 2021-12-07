import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelValueModule } from '../label-value/label-value.module';
import { AdditionalInformationWidgetComponent } from './additional-information-widget.component';

@NgModule({
  declarations: [AdditionalInformationWidgetComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LabelValueModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [AdditionalInformationWidgetComponent],
})
export class AdditionalInformationWidgetModule {}
