import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialsSupplierDatabaseComponent } from '@mac/msd/materials-supplier-database.component';
import { MaterialsSupplierDatabaseRoutingModule } from '@mac/msd/materials-supplier-database-routing.module';
import { DataEffects } from '@mac/msd/store/effects/data/data.effects';
import { DialogEffects } from '@mac/msd/store/effects/dialog/dialog.effects';
import { reducers } from '@mac/msd/store/reducers';

@NgModule({
  declarations: [MaterialsSupplierDatabaseComponent],
  imports: [
    CommonModule,
    MaterialsSupplierDatabaseRoutingModule,
    NgrxStoreModule.forFeature('msd', reducers),
    EffectsModule.forFeature([DataEffects, DialogEffects]),
    SubheaderModule,
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
})
export class MaterialsSupplierDatabaseModule {}
