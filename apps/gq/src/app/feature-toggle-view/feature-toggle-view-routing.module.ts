import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleViewComponent } from './feature-toggle-view.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureToggleViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureToggleViewRoutingModule {}
