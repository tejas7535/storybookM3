import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutePath } from './app-route-path.enum';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    loadChildren: async () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: AppRoutePath.GreaseCalculationPath,
    loadChildren: async () =>
      import('./grease-calculation/grease-calculation.module').then(
        (m) => m.GreaseCalculationModule
      ),
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
