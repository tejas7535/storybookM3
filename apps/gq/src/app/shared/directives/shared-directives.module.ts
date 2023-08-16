import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureToggleDirective } from './feature-toggle/feature-toggle.directive';
import { HideIfQuotationNotActiveDirective } from './hide-if-quotation-not-active/hide-if-quotation-not-active.directive';
import { PinDropDownDirective } from './pin-drop-down/pin-drop-down.directive';
import { isTextTruncatedDirective } from './show-tooltip-when-truncated/show-tooltip-when-truncated.directive';

@NgModule({
  declarations: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationNotActiveDirective,
    PinDropDownDirective,
  ],
  imports: [CommonModule],
  exports: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationNotActiveDirective,
    PinDropDownDirective,
  ],
})
export class SharedDirectivesModule {}
