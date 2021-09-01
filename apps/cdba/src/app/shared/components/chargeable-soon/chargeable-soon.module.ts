import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ChargeableSoonBadgeComponent } from './chargeable-soon-badge/chargeable-soon-badge.component';
import { ChargeableSoonDialogComponent } from './chargeable-soon-dialog/chargeable-soon-dialog.component';
import { ChargeableSoonConfirmationComponent } from './chargeable-soon-confirmation/chargeable-soon-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,

    SharedTranslocoModule,
  ],
  declarations: [
    ChargeableSoonBadgeComponent,
    ChargeableSoonDialogComponent,
    ChargeableSoonConfirmationComponent,
  ],
  exports: [ChargeableSoonBadgeComponent],
})
export class ChargeableSoonModule {}
