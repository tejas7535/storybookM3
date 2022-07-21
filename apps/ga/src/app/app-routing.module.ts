import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppIsEmbeddedGuard, LanguageGuard } from '@ga/core/guards';

import { AppRoutePath } from './app-route-path.enum';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canActivate: [AppIsEmbeddedGuard],
  },
  {
    path: AppRoutePath.GreaseCalculationPath,
    loadChildren: () =>
      import('./grease-calculation/grease-calculation.module').then(
        (m) => m.GreaseCalculationModule
      ),
    canActivate: [LanguageGuard],
  },
  {
    path: AppRoutePath.LegalPath,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: '**',
    redirectTo: AppRoutePath.BasePath,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
