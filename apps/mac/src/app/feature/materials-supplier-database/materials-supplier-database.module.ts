import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { SubheaderModule } from '@schaeffler/subheader';

import { MaterialsSupplierDatabaseComponent } from './materials-supplier-database.component';
import { MaterialsSupplierDatabaseRoutingModule } from './materials-supplier-database-routing.module';
import { DataEffects } from './store/effects/data.effects';
import { reducers } from './store/reducers';

@NgModule({
  declarations: [MaterialsSupplierDatabaseComponent],
  imports: [
    CommonModule,
    MaterialsSupplierDatabaseRoutingModule,
    NgrxStoreModule.forFeature('msd', reducers),
    EffectsModule.forFeature([DataEffects]),
    SubheaderModule,
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
})
export class MaterialsSupplierDatabaseModule {}
