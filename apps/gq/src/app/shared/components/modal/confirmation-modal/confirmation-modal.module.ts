import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { InfoBannerComponent } from '../../info-banner/info-banner.component';
import { ConfirmationModalComponent } from './confirmation-modal.component';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [
    InfoBannerComponent,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [ConfirmationModalComponent],
})
export class ConfirmationModalModule {}
