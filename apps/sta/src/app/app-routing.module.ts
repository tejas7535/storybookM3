import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/auth.guard';
import { ServiceType } from './shared/result/models';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/overview/overview.module').then(
        (m) => m.OverviewModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tagging',
    loadChildren: () =>
      import('./feature/auto-tagging/auto-tagging.module').then(
        (m) => m.AutoTaggingModule
      ),
    data: { service: ServiceType.TAGGING },
  },
  {
    path: 'translation',
    loadChildren: () =>
      import('./feature/translation/translation.module').then(
        (m) => m.TranslationModule
      ),
    data: { service: ServiceType.TRANSLATION },
  },
  {
    path: 'question-answering',
    loadChildren: () =>
      import('./feature/question-answering/question-answering.module').then(
        (m) => m.QuestionAnsweringModule
      ),
    data: { service: ServiceType.QUESTION_ANSWERING },
  },
  {
    path: 'drei-d-master',
    loadChildren: () =>
      import('./feature/drei-d-master/drei-d-master.module').then(
        (m) => m.DreiDMasterModule
      ),
    data: { service: ServiceType.DREI_D_MASTER },
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
