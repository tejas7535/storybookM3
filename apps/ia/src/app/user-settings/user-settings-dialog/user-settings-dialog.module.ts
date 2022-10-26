import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { SelectInputModule } from '../../shared/select-input/select-input.module';
import { SharedModule } from '../../shared/shared.module';
import { UserSettingsDialogComponent } from './user-settings-dialog.component';

@NgModule({
  declarations: [UserSettingsDialogComponent],

  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    AutocompleteInputModule,
    SharedTranslocoModule,
    SelectInputModule,
  ],
})
export class UserSettingsDialogModule {}
