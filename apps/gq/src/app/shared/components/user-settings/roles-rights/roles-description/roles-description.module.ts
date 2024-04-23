import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { TranslocoModule } from '@jsverse/transloco';

import { RolesDescriptionComponent } from './roles-description.component';

@NgModule({
  declarations: [RolesDescriptionComponent],
  imports: [CommonModule, MatExpansionModule, TranslocoModule],
  exports: [RolesDescriptionComponent],
})
export class RolesDescriptionModule {}
