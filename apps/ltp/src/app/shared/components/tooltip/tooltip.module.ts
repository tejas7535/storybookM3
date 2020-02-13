import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IconModule } from '@schaeffler/shared/ui-components';

import { TooltipComponent } from './tooltip.component';

@NgModule({
  declarations: [TooltipComponent],
  imports: [CommonModule, MatTooltipModule, MatButtonModule, IconModule],
  exports: [TooltipComponent]
})
export class TooltipModule {}
