import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';

import { SharedModule } from '../shared';
import { ShareButtonModule } from '../shared/header/share-button/share-button.module';
import { CustomerInformationModule } from './customer-information/customer-information.module';
import { CustomerViewRoutingModule } from './customer-view-routing.module';
import { CustomerViewComponent } from './customer-view.component';

@NgModule({
  declarations: [CustomerViewComponent],
  imports: [
    CommonModule,
    CustomerInformationModule,
    CustomerViewRoutingModule,
    MatCardModule,
    MatSidenavModule,
    SharedModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
    BreadcrumbsModule,
    SubheaderModule,
    ShareButtonModule,
  ],
  exports: [CustomerViewComponent],
})
export class CustomerViewModule {}
