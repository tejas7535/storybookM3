import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BomOverlayComponent } from './bom-overlay.component';

@NgModule({
  declarations: [BomOverlayComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatIconModule,
    MatRippleModule,
  ],
  exports: [BomOverlayComponent],
})
export class BomOverlayModule {}
