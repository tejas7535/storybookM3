import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { RolesDescriptionModule } from './roles-description/roles-description.module';
import { RolesRightsComponent } from './roles-rights.component';

@NgModule({
  declarations: [RolesRightsComponent],
  imports: [CommonModule, TranslocoModule, RolesDescriptionModule, PushModule],
  exports: [RolesRightsComponent],
})
export class RolesRightsModule {}
