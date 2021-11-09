import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';

import { RoleDescriptionsComponent } from './role-descriptions.component';

@NgModule({
  declarations: [RoleDescriptionsComponent],
  imports: [
    // angular modules
    CommonModule,

    // shared functional modules
    SharedTranslocoModule,

    // ui modules
    RolesAndRightsModule,
  ],
  exports: [RoleDescriptionsComponent],
})
export class RoleDescriptionsModule {}
