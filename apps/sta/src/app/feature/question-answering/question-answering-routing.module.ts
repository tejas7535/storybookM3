import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/auth.guard';
import { QuestionAnsweringComponent } from './question-answering.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionAnsweringComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionAnsweringRoutingModule {}
