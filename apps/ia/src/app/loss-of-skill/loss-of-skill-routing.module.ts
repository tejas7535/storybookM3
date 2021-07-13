import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { LossOfSkillComponent } from './loss-of-skill.component';

const routes: Routes = [
  { path: '', component: LossOfSkillComponent, canActivate: [MsalGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LossOfSkillRoutingModule {}
