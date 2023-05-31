import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureToggleDirective } from './feature-toggle/feature-toggle.directive';
import { HideIfQuotationHasStatusDirective } from './hide-if-quotation-has-status/hide-if-quotation-has-status.directive';
import { PinDropDownDirective } from './pin-drop-down/pin-drop-down.directive';
import { isTextTruncatedDirective } from './show-tooltip-when-truncated/show-tooltip-when-truncated.directive';

@NgModule({
  declarations: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationHasStatusDirective,
    PinDropDownDirective,
  ],
  imports: [CommonModule],
  exports: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationHasStatusDirective,
    PinDropDownDirective,
  ],
})
export class SharedDirectivesModule {}
