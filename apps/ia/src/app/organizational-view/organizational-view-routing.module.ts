import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { OrganizationalViewComponent } from './organizational-view.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationalViewComponent,
    canActivate: [MsalGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationalViewRoutingModule {}
