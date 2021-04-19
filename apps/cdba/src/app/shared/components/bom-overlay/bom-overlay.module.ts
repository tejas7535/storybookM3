import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';

import { BomOverlayComponent } from './bom-overlay.component';

@NgModule({
  declarations: [BomOverlayComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatIconModule,
    MatRippleModule,
  ],
  exports: [BomOverlayComponent],
})
export class BomOverlayModule {}
