import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared.module';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';

@NgModule({
  declarations: [EmployeeListDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    MatIconModule,
    SharedTranslocoModule,
    ScrollingModule,
    LoadingSpinnerModule,
  ],
  exports: [EmployeeListDialogComponent],
})
export class EmployeeListDialogModule {}
