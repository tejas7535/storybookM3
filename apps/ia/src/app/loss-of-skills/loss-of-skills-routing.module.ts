import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LossOfSkillsComponent } from './loss-of-skills.component';

const routes: Routes = [{ path: '', component: LossOfSkillsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LossOfSkillsRoutingModule {}
