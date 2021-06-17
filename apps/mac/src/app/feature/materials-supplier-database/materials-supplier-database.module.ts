import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { MaterialsSupplierDatabaseRoutingModule } from './materials-supplier-database-routing.module';
import { MaterialsSupplierDatabaseComponent } from './materials-supplier-database.component';

@NgModule({
  declarations: [MaterialsSupplierDatabaseComponent],
  imports: [
    CommonModule,
    MaterialsSupplierDatabaseRoutingModule,
    UnderConstructionModule,
  ],
})
export class MaterialsSupplierDatabaseModule {}
