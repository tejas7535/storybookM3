import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerDetailsTabComponent } from './customer-details-tab.component';

const routes: Routes = [{ path: '', component: CustomerDetailsTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailsTabRoutingModule {}
