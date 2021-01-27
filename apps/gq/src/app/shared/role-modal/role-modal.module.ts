import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared.module';
import { RoleDescModule } from './role-desc/role-desc.module';
import { RoleModalComponent } from './role-modal.component';

@NgModule({
  declarations: [RoleModalComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    SharedTranslocoModule,
    MatIconModule,
    ReactiveComponentModule,
    RoleDescModule,
  ],
  exports: [RoleModalComponent],
})
export class RoleModalModule {}
