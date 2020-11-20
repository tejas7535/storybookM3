import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/case-header/case-header.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { CustomerInformationModule } from './customer-information/customer-information.module';
import { CustomerViewRoutingModule } from './customer-view-routing.module';
import { CustomerViewComponent } from './customer-view.component';

@NgModule({
  declarations: [CustomerViewComponent],
  imports: [
    CaseHeaderModule,
    CommonModule,
    CustomerInformationModule,
    CustomerViewRoutingModule,
    OfferDrawerModule,
    MatSidenavModule,
    SharedModule,
  ],
  exports: [CustomerViewComponent],
})
export class CustomerViewModule {}
