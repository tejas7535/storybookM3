import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { SharedModule } from '../../shared';
import { CaseHeaderModule } from '../../shared/header/case-header/case-header.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { DetailViewRoutingModule } from './detail-view-routing.module';
import { DetailViewComponent } from './detail-view.component';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

@NgModule({
  declarations: [DetailViewComponent],
  imports: [
    CaseHeaderModule,
    DetailViewRoutingModule,
    FilterPricingModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    SharedPipesModule,
    SharedModule,
    PricingDetailsModule,
    LoadingSpinnerModule,
  ],
})
export class DetailViewModule {}
