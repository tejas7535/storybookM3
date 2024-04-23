import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { RolesDescriptionModule } from './roles-description/roles-description.module';
import { RolesRightsComponent } from './roles-rights.component';

@NgModule({
  declarations: [RolesRightsComponent],
  imports: [CommonModule, TranslocoModule, RolesDescriptionModule, PushPipe],
  exports: [RolesRightsComponent],
})
export class RolesRightsModule {}
