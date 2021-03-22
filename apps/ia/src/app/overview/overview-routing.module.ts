import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { OverviewComponent } from './overview.component';

const routes: Routes = [
  { path: '', component: OverviewComponent, canActivate: [MsalGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewRoutingModule {}
