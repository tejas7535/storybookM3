import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { SharedModule } from '../../shared/shared.module';
import { UserSettingsComponent } from './user-settings.component';
import { UserSettingsDialogModule } from './user-settings-dialog/user-settings-dialog.module';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    LanguageSelectModule,
    UserSettingsDialogModule,
    RolesAndRightsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
