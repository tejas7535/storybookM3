import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@schaeffler/shared/empty-states';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./overview/overview.module').then(m => m.OverviewModule)
  },
  {
    path: 'tagging',
    loadChildren: () =>
      import('./auto-tagging/auto-tagging.module').then(
        m => m.AutoTaggingModule
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
