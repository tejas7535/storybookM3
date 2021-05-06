import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { TeamMemberDialogComponent } from './team-member-dialog.component';

@NgModule({
  declarations: [TeamMemberDialogComponent],
  entryComponents: [TeamMemberDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    IconsModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  exports: [TeamMemberDialogComponent],
})
export class TeamMemberDialogModule {}
