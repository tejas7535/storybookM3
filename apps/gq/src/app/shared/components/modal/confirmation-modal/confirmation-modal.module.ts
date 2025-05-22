import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';

import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
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
    DragDialogDirective,
    DialogHeaderModule,
  ],
  exports: [ConfirmationModalComponent],
})
export class ConfirmationModalModule {}
