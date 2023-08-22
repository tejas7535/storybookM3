import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DimensionFilterModule } from '../../../shared/dimension-filter/dimension-filter.module';
import { SharedModule } from '../../../shared/shared.module';
import { UserSettingsDialogComponent } from './user-settings-dialog.component';

@NgModule({
  declarations: [UserSettingsDialogComponent],

  imports: [
    SharedModule,
    DimensionFilterModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
  ],
})
export class UserSettingsDialogModule {}
