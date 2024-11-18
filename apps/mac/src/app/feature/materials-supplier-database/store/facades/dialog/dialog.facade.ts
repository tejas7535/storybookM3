import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandard,
  SapMaterialsUpload,
} from '@mac/feature/materials-supplier-database/models';
import * as DialogActions from '@mac/msd/store/actions/dialog/dialog.actions';
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
  getMaterialDialogCo2StandardsLoading,
  getMaterialDialogCo2StandardsStringOptions,
  getMaterialDialogOptionsLoading,
  getMaterialDialogProductCategoryRulesLoading,
  getMaterialDialogProductCategoryRulesStringOptions,
  getMaterialDialogProductionProcesses,
  getMaterialDialogRatings,
  getMaterialDialogReferenceDocumentsLoading,
  getMaterialDialogReferenceDocumentsStringOptions,
  getMaterialDialogSteelMakingProcesses,
  getMaterialNameStringOptionsMerged,
  getMaterialStandardDocumentStringOptionsMerged,
  getProductCategories,
  getResumeDialogData,
  getSapMaterialsDatabaseUploadStatus,
  getSapMaterialsDataOwners,
  getSapMaterialsFileUploadProgress,
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

import {
  getSapMaterialsDatabaseUploadStatusFailure,
  uploadSapMaterialsSuccess,
} from '../../actions/dialog';

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

  productCategoryRules$ = this.store.select(
    getMaterialDialogProductCategoryRulesStringOptions
  );
  productCategoryRulesLoading$ = this.store.select(
    getMaterialDialogProductCategoryRulesLoading
  );

  co2Standards$ = this.store.select(getMaterialDialogCo2StandardsStringOptions);
  co2StandardsLoading$ = this.store.select(
    getMaterialDialogCo2StandardsLoading
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

  uploadSapMaterialsSucceeded$ = this.actions$.pipe(
    ofType(uploadSapMaterialsSuccess)
  );

  getSapMaterialsDatabaseUploadStatusFailed$ = this.actions$.pipe(
    ofType(getSapMaterialsDatabaseUploadStatusFailure)
  );

  sapMaterialsDatabaseUploadStatus$ = this.store.select(
    getSapMaterialsDatabaseUploadStatus
  );

  sapMaterialsFileUploadProgress$ = this.store.select(
    getSapMaterialsFileUploadProgress
  );

  bulkEditMaterialsSucceeded$ = this.actions$.pipe(
    ofType(DialogActions.bulkEditMaterialsSuccess)
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}

  bulkEditMaterials(materials: MaterialRequest[]): void {
    this.store.dispatch(DialogActions.bulkEditMaterials({ materials }));
  }

  openDialog(): void {
    this.store.dispatch(DialogActions.openDialog());
  }

  openEditDialog(props: {
    row: DataResult;
    selectedRows?: DataResult[];
    column: string;
    isCopy?: boolean;
    isBulkEdit?: boolean;
  }): void {
    this.store.dispatch(DialogActions.openEditDialog(props));
  }

  materialDialogOpened(): void {
    this.store.dispatch(DialogActions.materialDialogOpened());
  }

  materialDialogCanceled(): void {
    this.store.dispatch(DialogActions.materialDialogCanceled());
  }

  materialDialogConfirmed(
    standard: MaterialStandard,
    supplier: ManufacturerSupplier,
    material: MaterialRequest,
    isBulkEdit?: boolean
  ): void {
    this.store.dispatch(
      DialogActions.materialDialogConfirmed({
        standard,
        supplier,
        material,
        isBulkEdit,
      })
    );
  }

  resetMaterialRecord(error: boolean, createAnother: boolean): void {
    this.store.dispatch(
      DialogActions.resetMaterialRecord({ error, createAnother })
    );
  }

  addCustomSupplierName(supplierName: string): void {
    this.store.dispatch(DialogActions.addCustomSupplierName({ supplierName }));
  }

  addCustomSupplierPlant(supplierPlant: string): void {
    this.store.dispatch(
      DialogActions.addCustomSupplierPlant({ supplierPlant })
    );
  }

  addCustomMaterialStandardDocument(standardDocument: string): void {
    this.store.dispatch(
      DialogActions.addCustomMaterialStandardDocument({
        standardDocument,
      })
    );
  }

  addCustomMaterialStandardName(materialName: string): void {
    this.store.dispatch(
      DialogActions.addCustomMaterialStandardName({ materialName })
    );
  }

  addCustomCo2Standard(co2Standard: string): void {
    this.store.dispatch(DialogActions.addCustomCo2Standard({ co2Standard }));
  }

  manufacturerSupplierDialogOpened(): void {
    this.store.dispatch(DialogActions.manufacturerSupplierDialogOpened());
  }

  manufacturerSupplierDialogConfirmed(supplier: ManufacturerSupplier): void {
    this.store.dispatch(
      DialogActions.manufacturerSupplierDialogConfirmed({ supplier })
    );
  }

  addCustomSupplierBusinessPartnerId(supplierBusinessPartnerId: number): void {
    this.store.dispatch(
      DialogActions.addCustomSupplierBusinessPartnerId({
        supplierBusinessPartnerId,
      })
    );
  }

  materialStandardDialogOpened(): void {
    this.store.dispatch(DialogActions.materialStandardDialogOpened());
  }

  materialStandardDialogConfirmed(standard: MaterialStandard): void {
    this.store.dispatch(
      DialogActions.materialStandardDialogConfirmed({ standard })
    );
  }

  updateCreateMaterialDialogValues(form: MaterialFormValue): void {
    this.store.dispatch(
      DialogActions.updateCreateMaterialDialogValues({ form })
    );
  }

  fetchCastingDiameters(supplierId: number, castingMode: string) {
    this.store.dispatch(
      DialogActions.fetchCastingDiameters({ supplierId, castingMode })
    );
  }

  addCustomReferenceDocument(referenceDocument: string): void {
    this.store.dispatch(
      DialogActions.addCustomReferenceDocument({ referenceDocument })
    );
  }

  addCustomCastingDiameter(castingDiameter: string): void {
    this.store.dispatch(
      DialogActions.addCustomCastingDiameter({ castingDiameter })
    );
  }

  sapMaterialsUploadDialogOpened(): void {
    this.store.dispatch(DialogActions.sapMaterialsUploadDialogOpened());
  }

  addCustomDataOwner(dataOwner: string): void {
    this.store.dispatch(DialogActions.addCustomDataOwner({ dataOwner }));
  }

  uploadSapMaterials(upload: SapMaterialsUpload): void {
    this.store.dispatch(DialogActions.uploadSapMaterials({ upload }));
  }

  clearRejectedSapMaterials(): void {
    this.store.dispatch(DialogActions.clearRejectedSapMaterials());
  }

  sapMaterialsUploadStatusReset(): void {
    this.store.dispatch(DialogActions.sapMaterialsUploadStatusReset());
  }

  downloadRejectedSapMaterials(): void {
    this.store.dispatch(DialogActions.downloadRejectedSapMaterials());
  }

  resetSteelMakingProcessInUse(): void {
    this.store.dispatch(DialogActions.resetSteelMakingProcessInUse());
  }

  fetchSteelMakingProcessesInUse(
    supplierId: number,
    castingMode: string,
    castingDiameter: string
  ): void {
    this.store.dispatch(
      DialogActions.fetchSteelMakingProcessesInUse({
        supplierId,
        castingMode,
        castingDiameter,
      })
    );
  }

  fetchCo2ValuesForSupplierSteelMakingProcess(
    supplierId: number,
    steelMakingProcess: string,
    productCategory: string
  ): void {
    this.store.dispatch(
      DialogActions.fetchCo2ValuesForSupplierSteelMakingProcess({
        supplierId,
        steelMakingProcess,
        productCategory,
      })
    );
  }

  minimizeDialog(
    id: number,
    value: Partial<MaterialFormValue>,
    isCopy: boolean,
    isBulkEdit: boolean
  ): void {
    this.store.dispatch(
      DialogActions.minimizeDialog({
        id,
        value,
        isCopy,
        isBulkEdit,
      })
    );
  }
}
