import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PricingViewComponent } from './pricing-view.component';

const routes: Routes = [
  {
    path: '',
    component: PricingViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PricingViewRoutingModule {}
