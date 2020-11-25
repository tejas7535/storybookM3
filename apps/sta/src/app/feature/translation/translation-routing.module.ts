import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TranslationComponent } from './translation.component';

import { AuthGuard } from '../../core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TranslationComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranslationRoutingModule {}
