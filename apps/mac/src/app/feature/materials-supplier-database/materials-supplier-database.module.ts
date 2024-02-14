import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialsSupplierDatabaseComponent } from '@mac/msd/materials-supplier-database.component';
import { MaterialsSupplierDatabaseRoutingModule } from '@mac/msd/materials-supplier-database-routing.module';
import {
  DataEffects,
  DialogEffects,
  QuickFilterEffects,
} from '@mac/msd/store/effects';
import { reducers } from '@mac/msd/store/reducers';

import { ContactDialogComponent } from './main-table/contact-dialog/contact-dialog.component';
import { MaterialDialogsModule } from './main-table/material-input-dialog/materials/materials.module';
import { MsdDialogService } from './services';

@NgModule({
  declarations: [MaterialsSupplierDatabaseComponent, ContactDialogComponent],
  imports: [
    CommonModule,
    MaterialsSupplierDatabaseRoutingModule,
    NgrxStoreModule.forFeature('msd', reducers),
    EffectsModule.forFeature([DataEffects, DialogEffects, QuickFilterEffects]),
    SubheaderModule,
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    SharedTranslocoModule,

    MatDialogModule,
    MaterialDialogsModule,
  ],
  providers: [MsdDialogService],
})
export class MaterialsSupplierDatabaseModule {}
