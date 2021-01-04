import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { CustomerDetailsModule } from '../customer-details/customer-details.module';
import { GqQuotationPipe } from '../pipes/gq-quotation.pipe';
import { MaterialInfoPipe } from '../pipes/material-info.pipe';
import { SapQuotationPipe } from '../pipes/sap-quotation.pipe';
import { CaseHeaderComponent } from './case-header.component';

@NgModule({
  declarations: [
    CaseHeaderComponent,
    SapQuotationPipe,
    MaterialInfoPipe,
    GqQuotationPipe,
  ],
  imports: [
    CustomerDetailsModule,
    IconsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [CaseHeaderComponent],
})
export class CaseHeaderModule {}
