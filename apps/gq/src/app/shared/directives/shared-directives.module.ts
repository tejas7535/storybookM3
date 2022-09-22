import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { isTextTruncatedDirective } from './show-tooltip-when-truncated/show-tooltip-when-truncated.directive';

@NgModule({
  declarations: [isTextTruncatedDirective],
  imports: [CommonModule],
  exports: [isTextTruncatedDirective],
})
export class SharedDirectivesModule {}
