import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PcmBadgeComponent } from './pcm-badge.component';

@NgModule({
  imports: [SharedTranslocoModule, CommonModule, MatTooltipModule],
  declarations: [PcmBadgeComponent],
  exports: [PcmBadgeComponent],
})
export class PcmBadgeModule {}
