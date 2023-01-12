import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureToggleDirective } from './feature-toggle/feature-toggle.directive';
import { HideIfQuotationHasStatusDirective } from './hide-if-quotation-has-status/hide-if-quotation-has-status.directive';
import { isTextTruncatedDirective } from './show-tooltip-when-truncated/show-tooltip-when-truncated.directive';

@NgModule({
  declarations: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationHasStatusDirective,
  ],
  imports: [CommonModule],
  exports: [
    isTextTruncatedDirective,
    FeatureToggleDirective,
    HideIfQuotationHasStatusDirective,
  ],
})
export class SharedDirectivesModule {}
