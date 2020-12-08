import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { CustomerDetailsModule } from '../customer-details/customer-details.module';
import { CaseHeaderComponent } from './case-header.component';
import { MaterialInfoPipe } from './pipes/material-info.pipe';
import { SapQuotationPipe } from './pipes/sap-quotation.pipe';

@NgModule({
  declarations: [CaseHeaderComponent, SapQuotationPipe, MaterialInfoPipe],
  imports: [
    SharedModule,
    MatIconModule,
    RouterModule,
    IconsModule,
    MatButtonModule,
    SharedTranslocoModule,
    CustomerDetailsModule,
  ],
  exports: [CaseHeaderComponent],
})
export class CaseHeaderModule {}
