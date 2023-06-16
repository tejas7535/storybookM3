import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PcmBadgeComponent } from './pcm-badge.component';

@NgModule({
  imports: [SharedTranslocoModule, CommonModule, MatTooltipModule],
  declarations: [PcmBadgeComponent],
  exports: [PcmBadgeComponent],
})
export class PcmBadgeModule {}
