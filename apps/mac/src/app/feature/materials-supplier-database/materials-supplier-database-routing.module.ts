import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaterialsSupplierDatabaseComponent } from './materials-supplier-database.component';

const routes: Routes = [
  { path: '', component: MaterialsSupplierDatabaseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialsSupplierDatabaseRoutingModule {}
