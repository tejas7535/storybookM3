import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureToggleDirective } from './feature-toggle/feature-toggle.directive';
import { isTextTruncatedDirective } from './show-tooltip-when-truncated/show-tooltip-when-truncated.directive';

@NgModule({
  declarations: [isTextTruncatedDirective, FeatureToggleDirective],
  imports: [CommonModule],
  exports: [isTextTruncatedDirective, FeatureToggleDirective],
})
export class SharedDirectivesModule {}
