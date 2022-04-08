import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InfoIconComponent } from './info-icon.component';

@NgModule({
  declarations: [InfoIconComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [InfoIconComponent],
})
export class InfoIconModule {}
