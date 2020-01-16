import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(m => m.PageNotFoundModule)
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
