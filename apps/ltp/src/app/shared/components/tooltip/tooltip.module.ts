import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TooltipComponent } from './tooltip.component';

@NgModule({
  declarations: [TooltipComponent],
  imports: [CommonModule, MatTooltipModule, MatButtonModule, MatIconModule],
  exports: [TooltipComponent]
})
export class TooltipModule {}
