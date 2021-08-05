import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { ReasonsAndCounterMeasuresComponent } from './reasons-and-counter-measures.component';

const routes: Routes = [
  {
    path: '',
    component: ReasonsAndCounterMeasuresComponent,
    canActivate: [MsalGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReasonsAndCounterMeasuresRoutingModule {}
