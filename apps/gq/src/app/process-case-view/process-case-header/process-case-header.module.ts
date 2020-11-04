import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { CustomerDetailsModule } from '../../shared/customer-details/customer-details.module';
import { ProcessCaseHeaderComponent } from './process-case-header.component';

@NgModule({
  declarations: [ProcessCaseHeaderComponent],
  imports: [
    SharedModule,
    MatIconModule,
    RouterModule,
    IconsModule,
    MatButtonModule,
    SharedTranslocoModule,
    CustomerDetailsModule,
  ],
  exports: [ProcessCaseHeaderComponent],
})
export class ProcessCaseHeaderModule {}
