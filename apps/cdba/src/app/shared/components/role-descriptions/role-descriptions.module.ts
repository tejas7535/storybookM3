import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RoleDescriptionsComponent } from './role-descriptions/role-descriptions.component';
import { RoleDescriptionsDialogComponent } from './role-descriptions-dialog/role-descriptions-dialog.component';

@NgModule({
  imports: [
    // angular modules
    CommonModule,
    MatDialogModule,
    MatIconModule,

    // shared functional modules
    SharedTranslocoModule,

    // ui modules
    RolesAndRightsModule,
  ],
  declarations: [RoleDescriptionsComponent, RoleDescriptionsDialogComponent],
  exports: [RoleDescriptionsComponent],
})
export class RoleDescriptionsModule {}
