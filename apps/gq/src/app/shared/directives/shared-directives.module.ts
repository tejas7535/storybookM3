import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureToggleDirective } from './feature-toggle/feature-toggle.directive';
import { HideIfQuotationNotActiveOrPendingDirective } from './hide-if-quotation-not-active-or-pending/hide-if-quotation-not-active-or-pending.directive';
import { PinDropDownDirective } from './pin-drop-down/pin-drop-down.directive';
import { isTextTruncatedDirective } from './show-tooltip-when-truncated/show-tooltip-when-truncated.directive';

@NgModule({
  declarations: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationNotActiveOrPendingDirective,
    PinDropDownDirective,
  ],
  imports: [CommonModule],
  exports: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationNotActiveOrPendingDirective,
    PinDropDownDirective,
  ],
})
export class SharedDirectivesModule {}
