import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/overview/overview.module').then(m => m.OverviewModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'tagging',
    loadChildren: () =>
      import('./feature/auto-tagging/auto-tagging.module').then(
        m => m.AutoTaggingModule
      ),
    canLoad: [AuthGuard]
  },
  {
    path: 'translation',
    loadChildren: () =>
      import('./feature/translation/translation.module').then(
        m => m.TranslationModule
      ),
    canLoad: [AuthGuard]
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
      initialNavigation: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
