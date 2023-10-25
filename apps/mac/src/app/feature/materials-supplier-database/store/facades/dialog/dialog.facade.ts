import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { Action, Store } from '@ngrx/store';

import {
  getConditions,
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
  getMaterialDialogProductionProcesses,
  getMaterialDialogRatings,
  getMaterialDialogReferenceDocumentsLoading,
  getMaterialDialogReferenceDocumentsStringOptions,
  getMaterialDialogSteelMakingProcesses,
  getMaterialNameStringOptionsMerged,
  getMaterialStandardDocumentStringOptionsMerged,
  getProductCategories,
  getResumeDialogData,
  getSapMaterialsDataOwners,
  getSteelMakingProcessesInUse,
  getStringOptions,
  getSupplierBusinessPartnerIdsStringOptionsMerged,
  getSupplierCountryStringOptions,
  getSupplierNameStringOptionsMerged,
  getSupplierPlantsStringOptionsMerged,
  getUniqueStringOptions,
  selectedHintData,
  validateCo2Scope,
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
  supplierCountries$ = this.store.select(getSupplierCountryStringOptions);
  businessPartnerIds$ = this.store.select(
    getSupplierBusinessPartnerIdsStringOptionsMerged
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
  productionProcesses$ = this.store.select(
    getMaterialDialogProductionProcesses
  );
  categories$ = this.store.select(getUniqueStringOptions(getProductCategories));
  conditions$ = this.store.select(getUniqueStringOptions(getConditions));
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

  sapMaterialsDataOwners$ = this.store.select(
    getStringOptions(getSapMaterialsDataOwners)
  );

  editMaterialInformation$ = this.store.pipe(getEditMaterialDataLoaded);
  editMaterial$ = this.store.select(getEditMaterialData);

  resumeDialogData$ = this.store.select(getResumeDialogData);

  createMaterialRecord$ = this.store.select(getCreateMaterialRecord);

  dialogError$ = this.store.pipe(getDialogError);

  dialogHintData$ = this.store.select(selectedHintData);
  dialogCo2Valid$ = this.store.select(validateCo2Scope);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
