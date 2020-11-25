import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutoTaggingComponent } from './auto-tagging.component';

import { AuthGuard } from '../../core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AutoTaggingComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoTaggingRoutingModule {}
