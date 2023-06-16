import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { InfoIconComponent } from './info-icon.component';

@NgModule({
  declarations: [InfoIconComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [InfoIconComponent],
})
export class InfoIconModule {}
