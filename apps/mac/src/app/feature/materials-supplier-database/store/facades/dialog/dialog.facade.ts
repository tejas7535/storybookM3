import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { Action, Store } from '@ngrx/store';

import {
  getAddMaterialDialogCastingDiametersLoading,
  getAddMaterialDialogCastingDiameterStringOptions,
  getAddMaterialDialogCastingModes,
  getAddMaterialDialogCo2Classifications,
  getAddMaterialDialogOptionsLoading,
  getAddMaterialDialogRatings,
  getAddMaterialDialogSteelMakingProcesses,
  getCreateMaterialLoading,
  getCreateMaterialSuccess,
  getMaterialNameStringOptionsMerged,
  getMaterialStandardDocumentStringOptionsMerged,
  getProductCategoryOptions,
  getStringOptions,
  getSupplierPlantStringOptions,
  getSupplierStringOptions,
  getUniqueStringOptions,
} from '@mac/msd/store';

@Injectable({
  providedIn: 'root',
})
export class DialogFacade {
  dialogLoading$ = this.store.select(getAddMaterialDialogOptionsLoading);
  createMaterialLoading$ = this.store.select(getCreateMaterialLoading);

  standardDocuments$ = this.store.select(
    getUniqueStringOptions(getMaterialStandardDocumentStringOptionsMerged)
  );

  materialNames$ = this.store.select(
    getUniqueStringOptions(getMaterialNameStringOptionsMerged)
  );
  suppliers$ = this.store.select(
    getUniqueStringOptions(getSupplierStringOptions)
  );
  supplierPlants$ = this.store.select(getSupplierPlantStringOptions);
  castingModes$ = this.store.select(getAddMaterialDialogCastingModes);
  co2Classification$ = this.store.select(
    getAddMaterialDialogCo2Classifications
  );
  ratings$ = this.store.select(
    getStringOptions(getAddMaterialDialogRatings, [
      {
        id: undefined,
        title: translate('materialsSupplierDatabase.mainTable.dialog.none'),
      },
    ])
  );
  steelMakingProcess$ = this.store.select(
    getStringOptions(getAddMaterialDialogSteelMakingProcesses)
  );
  categories$ = this.store.select(
    getUniqueStringOptions(getProductCategoryOptions)
  );
  castingDiameters$ = this.store.select(
    getAddMaterialDialogCastingDiameterStringOptions
  );
  castingDiametersLoading$ = this.store.select(
    getAddMaterialDialogCastingDiametersLoading
  );

  createMaterialSuccess$ = this.store.select(getCreateMaterialSuccess);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
