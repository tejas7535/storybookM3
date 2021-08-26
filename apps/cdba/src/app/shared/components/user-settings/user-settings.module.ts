import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TranslocoModule } from '@ngneat/transloco';

import { SharedModule } from '../../shared.module';
import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    SharedModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
