import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared.module';
import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    ReactiveFormsModule,

    SharedModule,
    SharedTranslocoModule,

    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
