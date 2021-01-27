import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../..';
import { RoleDescComponent } from './role-desc.component';

@NgModule({
  declarations: [RoleDescComponent],
  imports: [SharedModule, SharedTranslocoModule],
  exports: [RoleDescComponent],
})
export class RoleDescModule {}
