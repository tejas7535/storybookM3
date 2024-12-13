/* eslint-disable max-lines */
import { createAction, props } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandard,
  ProductCategoryRule,
  SapMaterialsDatabaseUploadStatusResponse,
  SapMaterialsUpload,
} from '@mac/msd/models';

export const materialDialogOpened = createAction(
  '[MSD - Dialog] Material Dialog Opened'
);

export const materialDialogCanceled = createAction(
  '[MSD - Dialog] Material Dialog Canceled'
);

export const materialDialogConfirmed = createAction(
  '[MSD - Dialog] Material Confirmed',
  props<{
    standard: MaterialStandard;
    supplier: ManufacturerSupplier;
    material: MaterialRequest;
    isBulkEdit?: boolean;
  }>()
);

export const materialStandardDialogOpened = createAction(
  '[MSD - Dialog] MaterialStandard Dialog Opened'
);

export const materialStandardDialogCanceled = createAction(
  '[MSD - Dialog] MaterialStandard Dialog Canceled'
);

export const materialStandardDialogConfirmed = createAction(
  '[MSD - Dialog] MaterialStandard Confirmed',
  props<{
    standard: MaterialStandard;
  }>()
);

export const manufacturerSupplierDialogOpened = createAction(
  '[MSD - Dialog] ManufacturerSupplier Dialog Opened'
);

export const manufacturerSupplierDialogCanceled = createAction(
  '[MSD - Dialog] ManufacturerSupplier Dialog Canceled'
);

export const manufacturerSupplierDialogConfirmed = createAction(
  '[MSD - Dialog] ManufacturerSupplier Confirmed',
  props<{
    supplier: ManufacturerSupplier;
  }>()
);

export const sapMaterialsUploadDialogOpened = createAction(
  '[MSD - Dialog] SAP Materials Dialog Opened'
);

export const fetchMaterialStandards = createAction(
  '[MSD - Dialog] Fetch Material Standards'
);

export const fetchMaterialStandardsSuccess = createAction(
  '[MSD - Dialog] Fetch Material Standards Success',
  props<{ materialStandards: MaterialStandard[] }>()
);

export const fetchMaterialStandardsFailure = createAction(
  '[MSD - Dialog] Fetch Material Standards Failure'
);

export const fetchManufacturerSuppliers = createAction(
  '[MSD - Dialog] Fetch Manufacturer Suppliers'
);

export const fetchManufacturerSuppliersSuccess = createAction(
  '[MSD - Dialog] Fetch Manufacturer Suppliers Success',
  props<{ manufacturerSuppliers: ManufacturerSupplier[] }>()
);

export const fetchManufacturerSuppliersFailure = createAction(
  '[MSD - Dialog] Fetch Manufacturer Suppliers Failure'
);

export const fetchRatings = createAction('[MSD - Dialog] Fetch Ratings');

export const fetchRatingsSuccess = createAction(
  '[MSD - Dialog] Fetch Ratings Success',
  props<{ ratings: string[] }>()
);

export const fetchRatingsFailure = createAction(
  '[MSD - Dialog] Fetch Ratings Failure'
);

export const fetchCo2Classifications = createAction(
  '[MSD - Dialog] Fetch CO2 Classifications'
);

export const fetchCo2ClassificationsSuccess = createAction(
  '[MSD - Dialog] Fetch CO2 Classifications Success',
  props<{ co2Classifications: StringOption[] }>()
);

export const fetchCo2ClassificationsFailure = createAction(
  '[MSD - Dialog] Fetch CO2 Classifications Failure'
);

export const fetchSteelMakingProcesses = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes'
);

export const fetchSteelMakingProcessesSuccess = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes Success',
  props<{ steelMakingProcesses: string[] }>()
);

export const fetchSteelMakingProcessesFailure = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes Failure'
);

export const fetchProductionProcesses = createAction(
  '[MSD - Dialog] Fetch Production Processes'
);

export const fetchProductionProcessesSuccess = createAction(
  '[MSD - Dialog] Fetch Production Processes Success',
  props<{ productionProcesses: StringOption[] }>()
);

export const fetchProductionProcessesFailure = createAction(
  '[MSD - Dialog] Fetch Production Processes Failure'
);

export const fetchCastingModes = createAction(
  '[MSD - Dialog] Fetch Casting Modes'
);

export const fetchCastingModesSuccess = createAction(
  '[MSD - Dialog] Fetch Casting Modes Success',
  props<{ castingModes: string[] }>()
);

export const fetchCastingModesFailure = createAction(
  '[MSD - Dialog] Fetch Casting Modes Failure'
);

export const fetchConditions = createAction('[MSD - Dialog] Fetch Conditions');

export const fetchConditionsSuccess = createAction(
  '[MSD - Dialog] Fetch Conditions Success',
  props<{ conditions: StringOption[] }>()
);

export const fetchConditionsFailure = createAction(
  '[MSD - Dialog] Fetch Conditions Failure'
);

export const createMaterialComplete = createAction(
  '[MSD - Dialog] Create Material Complete',
  props<{ record: CreateMaterialRecord }>()
);

export const resetMaterialRecord = createAction(
  '[MSD - Dialog] Reset Material Record',
  props<{ error: boolean; createAnother: boolean }>()
);

export const resetDialogOptions = createAction(
  '[MSD - Dialog] Reset Dialog Options'
);

export const fetchProductCategories = createAction(
  '[MSD - Dialog] Fetch Product Categories'
);

export const fetchProductCategoriesSuccess = createAction(
  '[MSD - Dialog] Fetch Product Categories Success',
  props<{ productCategories: StringOption[] }>()
);

export const fetchProductCategoriesFailure = createAction(
  '[MSD - Dialog] Fetch Product Categories Failure'
);

export const fetchCastingDiameters = createAction(
  '[MSD - Dialog] Fetch Casting Diameters',
  props<{ supplierId: number; castingMode: string }>()
);

export const fetchCastingDiametersSuccess = createAction(
  '[MSD - Dialog] Fetch Casting Diameters Success',
  props<{ castingDiameters: string[] }>()
);

export const fetchCastingDiametersFailure = createAction(
  '[MSD - Dialog] Fetch Casting Diameters Failure'
);

export const fetchReferenceDocuments = createAction(
  '[MSD - Dialog] Fetch Reference Documents'
);

export const fetchReferenceDocumentsSuccess = createAction(
  '[MSD - Dialog] Fetch Reference Documents Success',
  props<{ referenceDocuments: string[] }>()
);

export const fetchReferenceDocumentsFailure = createAction(
  '[MSD - Dialog] Fetch Reference Documents Failure'
);

export const addCustomCastingDiameter = createAction(
  '[MSD - Dialog] Add Custom Casting Diameter',
  props<{ castingDiameter: string }>()
);

export const addCustomReferenceDocument = createAction(
  '[MSD - Dialog] Add Custom Reference Document',
  props<{ referenceDocument: string }>()
);

export const addCustomMaterialStandardName = createAction(
  '[MSD - Dialog] Add Custom Material Standard Name',
  props<{ materialName: string }>()
);

export const addCustomMaterialStandardDocument = createAction(
  '[MSD - Dialog] Add Custom Material Standard Document',
  props<{ standardDocument: string }>()
);

export const addCustomSupplierName = createAction(
  '[MSD - Dialog] Add Custom Supplier Name',
  props<{ supplierName: string }>()
);

export const addCustomSupplierPlant = createAction(
  '[MSD - Dialog] Add Custom Supplier Plant',
  props<{ supplierPlant: string }>()
);

export const addCustomSupplierBusinessPartnerId = createAction(
  '[MSD - Dialog] Add Custom Supplier Business Partner ID',
  props<{ supplierBusinessPartnerId: number }>()
);

export const addCustomDataOwner = createAction(
  '[MSD - Dialog] Add Custom Data Owner',
  props<{ dataOwner: string }>()
);

export const addCustomCo2Standard = createAction(
  '[MSD - Dialog] Add Custom CO2 Standard',
  props<{ co2Standard: string }>()
);

export const postMaterial = createAction(
  '[MSD - Dialog] Post Material',
  props<{ record: CreateMaterialRecord }>()
);

export const postBulkMaterial = createAction(
  '[MSD - Dialog] Post Bulk Material',
  props<{ record: CreateMaterialRecord }>()
);

export const postMaterialStandard = createAction(
  '[MSD - Dialog] Post Material standard',
  props<{ record: CreateMaterialRecord }>()
);

export const postManufacturerSupplier = createAction(
  '[MSD - Dialog] Post Manufacturer Supplier',
  props<{ record: CreateMaterialRecord }>()
);

export const openEditDialog = createAction(
  '[MSD - Dialog] Open Edit Dialog',
  props<{
    row: DataResult;
    column: string;
    isCopy?: boolean;
    isBulkEdit?: boolean;
  }>()
);

export const openMultiEditDialog = createAction(
  '[MSD - Dialog] Open Multi Edit Dialog',
  props<{ rows: DataResult[]; combinedRows: DataResult }>()
);

export const fetchEditStandardDocumentData = createAction(
  '[MSD - Dialog] Fetch Edit Standard Document Data',
  props<{ standardDocument: string }>()
);

export const fetchEditStandardDocumentDataSuccess = createAction(
  '[MSD - Dialog] Fetch Edit Standard Document Data Success',
  props<{ materialNames: { id: number; materialName: string }[] }>()
);

export const fetchEditStandardDocumentDataFailure = createAction(
  '[MSD - Dialog] Fetch Edit Standard Document Data Failure'
);

export const fetchEditMaterialNameData = createAction(
  '[MSD - Dialog] Fetch Edit Material Name Data',
  props<{ materialName: string }>()
);

export const fetchEditMaterialNameDataSuccess = createAction(
  '[MSD - Dialog] Fetch Edit Material Name Data Success',
  props<{ standardDocuments: { id: number; standardDocument: string }[] }>()
);

export const fetchEditMaterialNameDataFailure = createAction(
  '[MSD - Dialog] Fetch Edit Material Name Data Failure'
);

export const fetchEditMaterialSuppliers = createAction(
  '[MSD - Dialog] Fetch Edit Material Suppliers',
  props<{ supplierName: string }>()
);

export const fetchEditMaterialSuppliersSuccess = createAction(
  '[MSD - Dialog] Fetch Edit Material Suppliers Success',
  props<{ supplierIds: number[] }>()
);

export const fetchEditMaterialSuppliersFailure = createAction(
  '[MSD - Dialog] Fetch Edit Material Suppliers Failure'
);

export const fetchDataOwners = createAction('[MSD - Dialog] Fetch Data Owners');

export const fetchDataOwnersSuccess = createAction(
  '[MSD - Dialog] Fetch Data Owners Success',
  props<{ dataOwners: string[] }>()
);

export const fetchDataOwnersFailure = createAction(
  '[MSD - Dialog] Fetch Data Owners Failure'
);

export const fetchProductCategoryRules = createAction(
  '[MSD - Dialog] Fetch Product Category Rules'
);

export const fetchProductCategoryRulesSuccess = createAction(
  '[MSD - Dialog] Fetch Product Category Rules Success',
  props<{ productCategoryRules: ProductCategoryRule[] }>()
);

export const fetchProductCategoryRulesFailure = createAction(
  '[MSD - Dialog] Fetch Product Category Rules Failure'
);

export const fetchCo2Standards = createAction(
  '[MSD - Dialog] Fetch CO2 Standards'
);

export const fetchCo2StandardsSuccess = createAction(
  '[MSD - Dialog] Fetch CO2 Standards Success',
  props<{ co2Standards: string[] }>()
);

export const fetchCo2StandardsFailure = createAction(
  '[MSD - Dialog] Fetch CO2 Standards Failure'
);

export const editDialogLoadingFailure = createAction(
  '[MSD - Dialog] Edit Dialog Loading Failure'
);

export const editDialogLoadingComplete = createAction(
  '[MSD - Dialog] Edit Dialog Loading Complete'
);

export const parseMaterialFormValue = createAction(
  '[MSD - Dialog] Parse Material Form Value'
);

export const setMaterialFormValue = createAction(
  '[MSD - Dialog] Set Material Form Value',
  props<{ parsedMaterial: Partial<MaterialFormValue> }>()
);

export const cleanMinimizeDialog = createAction(
  '[MSD - Dialog] clean Minimize Dialog'
);

export const minimizeDialog = createAction(
  '[MSD - Dialog] Minimize Dialog',
  props<{
    id?: number;
    value: Partial<MaterialFormValue>;
    isCopy?: boolean;
    isBulkEdit?: boolean;
  }>()
);

export const fetchSteelMakingProcessesInUse = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes In Use',
  props<{ supplierId: number; castingMode: string; castingDiameter: string }>()
);

export const fetchSteelMakingProcessesInUseSuccess = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes In Use Success',
  props<{ steelMakingProcessesInUse: string[] }>()
);

export const fetchSteelMakingProcessesInUseFailure = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes In Use Failure'
);

export const resetSteelMakingProcessInUse = createAction(
  '[MSD - Dialog] Reset Steel Making Processes In Use'
);

export const fetchCo2ValuesForSupplierSteelMakingProcess = createAction(
  '[MSD - Dialog] Fetch CO2 Values For Supplier Steel Making Process',
  props<{
    supplierId: number;
    steelMakingProcess: string;
    productCategory: string;
  }>()
);

export const fetchCo2ValuesForSupplierSteelMakingProcessSuccess = createAction(
  '[MSD - Dialog] Fetch CO2 Values For Supplier Steel Making Process Success',
  props<{
    co2Values: {
      co2PerTon: number;
      co2Scope1: number;
      co2Scope2: number;
      co2Scope3: number;
      co2Classification: string;
    }[];
  }>()
);

export const fetchCo2ValuesForSupplierSteelMakingProcessFailure = createAction(
  '[MSD - Dialog] Fetch CO2 Values For Supplier Steel Making Process Failure'
);

export const resetCo2ValuesForSupplierSteelMakingProcess = createAction(
  '[MSD - Dialog] Reset CO2 Values For Supplier Steel Making Process'
);

export const updateCreateMaterialDialogValues = createAction(
  '[MSD - Dialog] Update create material dialog values',
  props<{ form: MaterialFormValue }>()
);

export const openDialog = createAction('[MSD - Dialog] Open Dialog');

export const uploadSapMaterials = createAction(
  '[MSD - Dialog] Upload SAP Materials',
  props<{ upload: SapMaterialsUpload }>()
);

export const setSapMaterialsFileUploadProgress = createAction(
  '[MSD - Dialog] Set SAP Materials File Upload Progress',
  props<{ fileUploadProgress: number }>()
);

export const uploadSapMaterialsSuccess = createAction(
  '[MSD - Dialog] Upload SAP Materials Success',
  props<{
    uploadId: string;
  }>()
);

export const uploadSapMaterialsFailure = createAction(
  '[MSD - Dialog] Upload SAP Materials Failure'
);

export const startPollingSapMaterialsDatabaseUploadStatus = createAction(
  '[MSD - Dialog] Start Polling SAP Materials Database Upload Status',
  props<{
    uploadId: string;
  }>()
);

export const stopPollingSapMaterialsDatabaseUploadStatus = createAction(
  '[MSD - Dialog] Stop Polling SAP Materials Database Upload Status'
);

export const getSapMaterialsDatabaseUploadStatusSuccess = createAction(
  '[MSD - Dialog] Get SAP Materials Database Upload Status Success',
  props<{
    databaseUploadStatus: SapMaterialsDatabaseUploadStatusResponse;
  }>()
);

export const getSapMaterialsDatabaseUploadStatusFailure = createAction(
  '[MSD - Dialog] Get SAP Materials Database Upload Status Failure'
);

export const sapMaterialsUploadStatusReset = createAction(
  '[MSD - Dialog] SAP Materials Upload Status Reset'
);

export const downloadRejectedSapMaterials = createAction(
  '[MSD - Dialog] Download Rejected SAP Materials'
);

export const downloadRejectedSapMaterialsSuccess = createAction(
  '[MSD - Dialog] Download Rejected SAP Materials Success'
);

export const downloadRejectedSapMaterialsFailure = createAction(
  '[MSD - Dialog] Download Rejected SAP Materials Failure'
);

export const clearRejectedSapMaterials = createAction(
  '[MSD - Dialog] Clear Rejected SAP Materials'
);

export const clearRejectedSapMaterialsSuccess = createAction(
  '[MSD - Dialog] Clear Rejected SAP Materials Success'
);

export const clearRejectedSapMaterialsFailure = createAction(
  '[MSD - Dialog] Clear Rejected SAP Materials Failure'
);

export const bulkEditMaterials = createAction(
  '[MSD - Dialog] Bulk Edit Materials',
  props<{ materials: MaterialRequest[] }>()
);

export const bulkEditMaterialsSuccess = createAction(
  '[MSD - Dialog] Bulk Edit Materials Success'
);

export const bulkEditMaterialsFailure = createAction(
  '[MSD - Dialog] Bulk Edit Materials Failure'
);

export const uploadPcrMaterialDocument = createAction(
  '[MSD - Dialog] upload pcrMaterial Document',
  props<{
    standard: MaterialStandard;
    supplier: ManufacturerSupplier;
    material: MaterialRequest;
    isBulkEdit?: boolean;
  }>()
);

export const checkForBulkEdit = createAction(
  '[MSD - Dialog] check for Bulk Edit',
  props<{
    standard: MaterialStandard;
    supplier: ManufacturerSupplier;
    material: MaterialRequest;
    isBulkEdit?: boolean;
  }>()
);
