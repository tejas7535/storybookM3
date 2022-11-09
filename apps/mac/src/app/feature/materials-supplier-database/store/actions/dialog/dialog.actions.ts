import { createAction, props } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  Material,
  MaterialFormValue,
  MaterialStandard,
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
    material: Material;
  }>()
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

export const createMaterialComplete = createAction(
  '[MSD - Dialog] Create Material Complete',
  props<{ record: CreateMaterialRecord }>()
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
  '[MSD - Dialog] Fetch Reference Documents',
  props<{ materialStandardId: number }>()
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

export const addCustomSupplierCountry = createAction(
  '[MSD - Dialog] Add Custom Supplier Country',
  props<{ supplierCountry: string }>()
);

export const postMaterial = createAction(
  '[MSD - Dialog] Post Material',
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
  props<{ row: DataResult; column: string }>()
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

export const minimizeDialog = createAction(
  '[MSD - Dialog] Minimize Dialog',
  props<{ id?: number; value: Partial<MaterialFormValue> }>()
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
  props<{ supplierId: number; steelMakingProcess: string }>()
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

export const openDialog = createAction('[MSD - Dialog] Open Dialog');
