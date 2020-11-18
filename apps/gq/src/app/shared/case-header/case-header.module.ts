import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { CustomerDetailsModule } from '../customer-details/customer-details.module';
import { CaseHeaderComponent } from './case-header.component';

@NgModule({
  declarations: [CaseHeaderComponent],
  imports: [
    SharedModule,
    MatIconModule,
    RouterModule,
    IconsModule,
    MatCardModule,
    MatButtonModule,
    SharedTranslocoModule,
    CustomerDetailsModule,
  ],
  exports: [CaseHeaderComponent],
})
export class CaseHeaderModule {}
