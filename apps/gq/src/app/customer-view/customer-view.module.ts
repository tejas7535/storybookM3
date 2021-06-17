import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
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
    MatCardModule,
    MatSidenavModule,
    SharedModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
  ],
  exports: [CustomerViewComponent],
})
export class CustomerViewModule {}
