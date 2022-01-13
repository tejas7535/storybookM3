import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DashboardMoreInfoDialogComponent } from './dashboard-more-info-dialog/dashboard-more-info-dialog.component';
import { PreviewContainerComponent } from './preview-container/preview-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [
    CommonModule,
    PreviewContainerComponent,
    SharedTranslocoModule,
    DashboardMoreInfoDialogComponent,
  ],
  declarations: [PreviewContainerComponent, DashboardMoreInfoDialogComponent],
})
export class SharedModule {}
