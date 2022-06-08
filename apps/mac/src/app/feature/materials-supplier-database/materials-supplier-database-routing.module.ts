import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaterialsSupplierDatabaseComponent } from './materials-supplier-database.component';

export enum MSDRoutePaths {
  BasePath = '',
  MainTablePath = 'main-table',
}

const routes: Routes = [
  {
    path: MSDRoutePaths.BasePath,
    redirectTo: MSDRoutePaths.MainTablePath,
    pathMatch: 'full',
  },
  {
    path: MSDRoutePaths.BasePath,
    component: MaterialsSupplierDatabaseComponent,
    children: [
      {
        path: MSDRoutePaths.MainTablePath,
        loadChildren: () =>
          import('./main-table/main-table.module').then(
            (m) => m.MainTableModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialsSupplierDatabaseRoutingModule {}
