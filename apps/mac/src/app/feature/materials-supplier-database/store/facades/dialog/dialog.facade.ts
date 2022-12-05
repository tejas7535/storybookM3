import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { Action, Store } from '@ngrx/store';

import {
  getCreateMaterialLoading,
  getCreateMaterialRecord,
  getDialogError,
  getEditMaterialData,
  getEditMaterialDataLoaded,
  getHighestCo2Values,
  getMaterialDialogCastingDiametersLoading,
  getMaterialDialogCastingDiameterStringOptions,
  getMaterialDialogCastingModes,
  getMaterialDialogCo2Classifications,
  getMaterialDialogOptionsLoading,
  getMaterialDialogRatings,
  getMaterialDialogReferenceDocumentsLoading,
  getMaterialDialogReferenceDocumentsStringOptions,
  getMaterialDialogSteelMakingProcesses,
  getMaterialNameStringOptionsMerged,
  getMaterialStandardDocumentStringOptionsMerged,
  getProductCategories,
  getResumeDialogData,
  getSteelMakingProcessesInUse,
  getStringOptions,
  getSupplierCountriesStringOptionsMerged,
  getSupplierNameStringOptionsMerged,
  getSupplierPlantsStringOptionsMerged,
  getUniqueStringOptions,
} from '@mac/msd/store/selectors';

@Injectable({
  providedIn: 'root',
})
export class DialogFacade {
  dialogLoading$ = this.store.select(getMaterialDialogOptionsLoading);
  createMaterialLoading$ = this.store.select(getCreateMaterialLoading);

  standardDocuments$ = this.store.select(
    getMaterialStandardDocumentStringOptionsMerged
  );

  materialNames$ = this.store.select(getMaterialNameStringOptionsMerged);
  suppliers$ = this.store.select(getSupplierNameStringOptionsMerged);
  supplierPlants$ = this.store.select(getSupplierPlantsStringOptionsMerged);
  supplierCountries$ = this.store.select(
    getSupplierCountriesStringOptionsMerged
  );
  castingModes$ = this.store.select(getMaterialDialogCastingModes);
  co2Classification$ = this.store.select(getMaterialDialogCo2Classifications);
  ratings$ = this.store.select(
    getStringOptions(getMaterialDialogRatings, [
      {
        id: undefined,
        title: translate('materialsSupplierDatabase.mainTable.dialog.none'),
      },
    ])
  );
  steelMakingProcess$ = this.store.select(
    getStringOptions(getMaterialDialogSteelMakingProcesses)
  );
  categories$ = this.store.select(getUniqueStringOptions(getProductCategories));
  castingDiameters$ = this.store.select(
    getMaterialDialogCastingDiameterStringOptions
  );
  castingDiametersLoading$ = this.store.select(
    getMaterialDialogCastingDiametersLoading
  );

  referenceDocuments$ = this.store.select(
    getMaterialDialogReferenceDocumentsStringOptions
  );
  referenceDocumentsLoading$ = this.store.select(
    getMaterialDialogReferenceDocumentsLoading
  );

  steelMakingProcessesInUse$ = this.store.select(getSteelMakingProcessesInUse);
  co2ValuesForSupplierSteelMakingProcess$ =
    this.store.select(getHighestCo2Values);

  editMaterialInformation$ = this.store.pipe(getEditMaterialDataLoaded);
  editMaterial$ = this.store.select(getEditMaterialData);

  resumeDialogData$ = this.store.select(getResumeDialogData);

  createMaterialRecord$ = this.store.select(getCreateMaterialRecord);

  dialogError$ = this.store.pipe(getDialogError);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
