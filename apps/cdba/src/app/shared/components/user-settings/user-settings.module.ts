import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared.module';
import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    // angular modules
    ReactiveFormsModule,

    // shared modules
    SharedModule,
    SharedTranslocoModule,

    // ui modules
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
