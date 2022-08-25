import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { CompareLabelValueModule } from '../compare-label-value';
import { AdditionalInformationWidgetComponent } from './additional-information-widget.component';

@NgModule({
  declarations: [AdditionalInformationWidgetComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    CompareLabelValueModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [AdditionalInformationWidgetComponent],
})
export class AdditionalInformationWidgetModule {}
