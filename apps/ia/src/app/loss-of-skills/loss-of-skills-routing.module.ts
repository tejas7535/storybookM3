import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { LossOfSkillsComponent } from './loss-of-skills.component';

const routes: Routes = [
  { path: '', component: LossOfSkillsComponent, canActivate: [MsalGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LossOfSkillsRoutingModule {}
