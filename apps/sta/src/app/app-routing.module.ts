import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@schaeffler/shared/empty-states';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/overview/overview.module').then(m => m.OverviewModule)
  },
  {
    path: 'tagging',
    loadChildren: () =>
      import('./feature/auto-tagging/auto-tagging.module').then(
        m => m.AutoTaggingModule
      )
  },
  {
    path: 'translation',
    loadChildren: () =>
      import('./feature/translation/translation.module').then(
        m => m.TranslationModule
      )
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
