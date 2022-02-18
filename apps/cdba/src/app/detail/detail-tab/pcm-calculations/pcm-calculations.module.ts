import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PcmCalculationsComponent } from './pcm-calculations.component';

@NgModule({
  declarations: [PcmCalculationsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [PcmCalculationsComponent],
})
export class PcmCalculationsModule {}
