/* eslint-disable max-lines */

import { Action, createReducer, on } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialStandard,
  ProductCategoryRule,
  SapMaterialsDatabaseUploadStatus,
  SapMaterialsDatabaseUploadStatusResponse,
} from '@mac/msd/models';
import * as DialogActions from '@mac/msd/store/actions/dialog';

export interface DialogState {
  manufacturerSupplier: {
    name: string;
    plant: string;
    country: string;
  };
  materialStandard: {
    materialName: string;
    standardDocument: string;
    materialNumber: string[];
  };
  dialogOptions: {
    materialStandards: MaterialStandard[];
    customMaterialStandardNames: string[];
    customMaterialStandardDocuments: string[];
    materialStandardsLoading: boolean;
    manufacturerSuppliers: ManufacturerSupplier[];
    customManufacturerSupplierNames: string[];
    customManufacturerSupplierPlants: string[];
    customManufacturerSupplierBusinessPartnerIds: number[];
    manufacturerSuppliersLoading: boolean;
    conditions: StringOption[];
    conditionsLoading: boolean;
    productCategories: StringOption[];
    productCategoriesLoading: boolean;
    productionProcesses: StringOption[];
    productionProcessesLoading: boolean;
    referenceDocuments: string[];
    referenceDocumentsLoading: boolean;
    customReferenceDocuments: string[];
    ratings: string[];
    ratingsLoading: boolean;
    steelMakingProcesses: string[];
    steelMakingProcessesLoading: boolean;
    co2Classifications: StringOption[];
    co2ClassificationsLoading: boolean;
    castingModes: string[];
    castingModesLoading: boolean;
    castingDiameters: string[];
    castingDiametersLoading: boolean;
    customCastingDiameters: string[];
    dataOwnersLoading: boolean;
    dataOwners: string[];
    productCategoryRules: ProductCategoryRule[];
    productCategoryRulesLoading: boolean;
    co2Standards: string[];
    customCo2Standards: string[];
    co2StandardsLoading: boolean;
    co2Values: {
      co2PerTon: number;
      co2Scope1: number;
      co2Scope2: number;
      co2Scope3: number;
      co2Classification: string;
    }[];
    steelMakingProcessesInUse: string[];
    loading: boolean;
    error: boolean;
  };
  createMaterial: {
    createMaterialLoading: boolean;
    createMaterialRecord: CreateMaterialRecord;
  };
  bulkEditMaterials: {
    updateLoading: boolean;
  };
  uploadSapMaterials: {
    uploadLoading: boolean; // indicate that the file is being uploaded to the BE, not that the data is uploaded into the DB!
    fileUploadProgress: number; // file upload progress in percent
    databaseUploadStatus: SapMaterialsDatabaseUploadStatusResponse;
  };
  selectedMaterial?: {
    rows: DataResult[];
    combinedRows: DataResult;
    form?: any;
  };
  editMaterial?: {
    row: DataResult;
    parsedMaterial: Partial<MaterialFormValue>;
    column: string;
    standardDocuments: { id: number; standardDocument: string }[];
    standardDocumentsLoading: boolean;
    materialNames: { id: number; materialName: string }[];
    materialNamesLoading: boolean;
    supplierIds: number[];
    supplierIdsLoading: boolean;
    loadingComplete: boolean;
  };
  minimizedDialog?: {
    id?: number;
    value: Partial<MaterialFormValue>;
    isCopy?: boolean;
    isBulkEdit?: boolean;
  };
}

export const initialState: DialogState = {
  manufacturerSupplier: undefined,
  materialStandard: undefined,
  dialogOptions: undefined,
  createMaterial: undefined,
  bulkEditMaterials: undefined,
  uploadSapMaterials: undefined,
  editMaterial: undefined,
  selectedMaterial: undefined,
  minimizedDialog: undefined,
};

export const dialogReducer = createReducer(
  initialState,
  on(
    DialogActions.materialDialogCanceled,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandards: undefined,
        manufacturerSuppliers: undefined,
        ratings: undefined,
        steelMakingProcesses: undefined,
        productionProcesses: undefined,
        productCategories: undefined,
        co2Classifications: undefined,
        castingModes: undefined,
        castingDiameters: undefined,
        referenceDocuments: undefined,
        dataOwners: undefined,
        co2Values: undefined,
        steelMakingProcessesInUse: [],
        productCategoryRules: undefined,
        co2Standards: undefined,
        error: undefined,
      },
      editMaterial: undefined,
      selectedMaterial: undefined,
      minimizedDialog: undefined,
    })
  ),
  // open dialog will be called for every dialog
  // this is still required to set the loading spinner!
  on(
    DialogActions.openDialog,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandardsLoading: true,
        manufacturerSuppliersLoading: true,
        co2ClassificationsLoading: true,
        error: undefined,
      },
    })
  ),
  on(
    DialogActions.materialStandardDialogOpened,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandardsLoading: true,
        manufacturerSuppliersLoading: false,
        co2ClassificationsLoading: false,
        error: undefined,
      },
    })
  ),
  on(
    DialogActions.manufacturerSupplierDialogOpened,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandardsLoading: false,
        manufacturerSuppliersLoading: true,
        co2ClassificationsLoading: false,
        error: undefined,
      },
    })
  ),

  on(
    DialogActions.fetchRatings,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        ratingsLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchSteelMakingProcesses,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchProductionProcesses,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productionProcessesLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchCastingModes,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingModesLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchMaterialStandardsSuccess,
    (state, { materialStandards }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandards,
        materialStandardsLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchMaterialStandardsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        materialStandards: undefined,
        materialStandardsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchManufacturerSuppliersSuccess,
    (state, { manufacturerSuppliers }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        manufacturerSuppliers,
        manufacturerSuppliersLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchManufacturerSuppliersFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        manufacturerSuppliers: undefined,
        manufacturerSuppliersLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchProductCategories,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategories: undefined,
        productCategoriesLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchProductCategoriesSuccess,
    (state, { productCategories }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategories,
        productCategoriesLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchProductCategoriesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategories: undefined,
        productCategoriesLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchCastingDiameters,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingDiameters: [],
        castingDiametersLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchCastingDiametersSuccess,
    (state, { castingDiameters }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingDiameters,
        castingDiametersLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchCastingDiametersFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingDiameters: [],
        castingDiametersLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchReferenceDocuments,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        referenceDocuments: [],
        referenceDocumentsLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchReferenceDocumentsSuccess,
    (state, { referenceDocuments }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        referenceDocuments,
        referenceDocumentsLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchReferenceDocumentsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        referenceDocuments: [],
        referenceDocumentsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchRatingsSuccess,
    (state, { ratings }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        ratings,
        ratingsLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchRatingsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        ratings: undefined,
        ratingsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchSteelMakingProcessesSuccess,
    (state, { steelMakingProcesses }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcesses,
        steelMakingProcessesLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchSteelMakingProcessesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcesses: undefined,
        steelMakingProcessesLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchProductionProcessesSuccess,
    (state, { productionProcesses }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productionProcesses,
        productionProcessesLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchProductionProcessesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productionProcesses: undefined,
        productionProcessesLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchCo2ClassificationsSuccess,
    (state, { co2Classifications }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Classifications,
        co2ClassificationsLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchCo2ClassificationsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Classifications: undefined,
        co2ClassificationsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchCastingModesSuccess,
    (state, { castingModes }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingModes,
        castingModesLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchCastingModesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        castingModes: undefined,
        castingModesLoading: undefined,
        error: true,
      },
    })
  ),

  on(
    DialogActions.fetchConditions,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        conditions: undefined,
        conditionsLoading: true,
      },
    })
  ),
  on(
    DialogActions.fetchConditionsSuccess,
    (state, { conditions }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        conditions,
        conditionsLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchConditionsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        conditions: undefined,
        conditionsLoading: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.fetchDataOwners,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        dataOwnersLoading: true,
        dataOwners: undefined,
        error: false,
      },
    })
  ),
  on(
    DialogActions.fetchDataOwnersSuccess,
    (state, { dataOwners }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        dataOwners,
        dataOwnersLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchDataOwnersFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        dataOwners: undefined,
        dataOwnersLoading: undefined,
        error: true,
      },
    })
  ),

  on(
    DialogActions.fetchProductCategoryRules,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategoryRulesLoading: true,
        productCategoryRules: undefined,
      },
    })
  ),
  on(
    DialogActions.fetchProductCategoryRulesSuccess,
    (state, { productCategoryRules }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategoryRules,
        productCategoryRulesLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchProductCategoryRulesFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        productCategoryRules: undefined,
        productCategoryRulesLoading: undefined,
        error: true,
      },
    })
  ),

  on(
    DialogActions.fetchCo2Standards,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2StandardsLoading: true,
        co2Standards: undefined,
      },
    })
  ),
  on(
    DialogActions.fetchCo2StandardsSuccess,
    (state, { co2Standards }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Standards,
        co2StandardsLoading: false,
      },
    })
  ),
  on(
    DialogActions.fetchCo2StandardsFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Standards: undefined,
        co2StandardsLoading: undefined,
        error: true,
      },
    })
  ),

  on(
    DialogActions.materialDialogConfirmed,
    (state): DialogState => ({
      ...state,
      createMaterial: {
        createMaterialLoading: true,
        createMaterialRecord: undefined,
      },
    })
  ),
  on(
    DialogActions.postManufacturerSupplier,
    (state): DialogState => ({
      // successfully create material Standard
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customMaterialStandardNames: undefined,
        customMaterialStandardDocuments: undefined,
      },
    })
  ),
  on(
    DialogActions.postMaterial,
    (state): DialogState => ({
      // successfully create manufacturer Supplier
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        customManufacturerSupplierNames: undefined,
        customManufacturerSupplierPlants: undefined,
        customManufacturerSupplierBusinessPartnerIds: undefined,
      },
    })
  ),
  // either error while creating or successfully created materiel record
  on(
    DialogActions.createMaterialComplete,
    (state, { record }): DialogState => ({
      // reset loading state
      ...state,
      createMaterial: {
        createMaterialLoading: false,
        createMaterialRecord: record,
      },
    })
  ),

  on(
    DialogActions.resetMaterialRecord,
    (state): DialogState => ({
      ...state,
      createMaterial: undefined,
    })
  ),

  on(
    DialogActions.resetDialogOptions,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        // reset custom fields
        customCastingDiameters: undefined,
        customReferenceDocuments: undefined,
        customMaterialStandardDocuments: undefined,
        customManufacturerSupplierNames: undefined,
        customManufacturerSupplierPlants: undefined,
        customManufacturerSupplierBusinessPartnerIds: undefined,
        customMaterialStandardNames: undefined,
        customCo2Standards: undefined,
        // reset loading fields
        co2Values: undefined,
        steelMakingProcessesInUse: [],
        castingDiameters: undefined,
        referenceDocuments: undefined,
        productCategoryRules: undefined,
        co2Standards: undefined,
        error: undefined,
      },
      // other fields
      editMaterial: undefined,
      selectedMaterial: undefined,
      minimizedDialog: undefined,
    })
  ),

  on(
    DialogActions.addCustomCastingDiameter,
    (state, { castingDiameter }): DialogState => {
      const customCastingDiameters = state.dialogOptions.customCastingDiameters
        ? [...state.dialogOptions.customCastingDiameters]
        : [];
      customCastingDiameters.unshift(castingDiameter);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customCastingDiameters,
        },
      };
    }
  ),

  on(
    DialogActions.addCustomReferenceDocument,
    (state, { referenceDocument }): DialogState => {
      const customReferenceDocuments = state.dialogOptions
        .customReferenceDocuments
        ? [...state.dialogOptions.customReferenceDocuments]
        : [];
      customReferenceDocuments.unshift(referenceDocument);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customReferenceDocuments,
        },
      };
    }
  ),

  on(
    DialogActions.addCustomMaterialStandardDocument,
    (state, { standardDocument }): DialogState => {
      const stdDoc = state.dialogOptions.customMaterialStandardDocuments
        ? [...state.dialogOptions.customMaterialStandardDocuments]
        : [];
      stdDoc.unshift(standardDocument);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customMaterialStandardDocuments: stdDoc,
        },
      };
    }
  ),

  on(
    DialogActions.addCustomMaterialStandardName,
    (state, { materialName }): DialogState => {
      const matNames = state.dialogOptions.customMaterialStandardNames
        ? [...state.dialogOptions.customMaterialStandardNames]
        : [];
      matNames.unshift(materialName);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customMaterialStandardNames: matNames,
        },
      };
    }
  ),

  on(
    DialogActions.addCustomSupplierName,
    (state, { supplierName }): DialogState => {
      const manufNames = state.dialogOptions.customManufacturerSupplierNames
        ? [...state.dialogOptions.customManufacturerSupplierNames]
        : [];
      manufNames.unshift(supplierName);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierNames: manufNames,
        },
      };
    }
  ),

  on(
    DialogActions.addCustomSupplierPlant,
    (state, { supplierPlant }): DialogState => {
      const manufPlants = state.dialogOptions.customManufacturerSupplierPlants
        ? [...state.dialogOptions.customManufacturerSupplierPlants]
        : [];
      manufPlants.unshift(supplierPlant);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierPlants: manufPlants,
        },
      };
    }
  ),

  on(
    DialogActions.addCustomSupplierBusinessPartnerId,
    (state, { supplierBusinessPartnerId }): DialogState => {
      const manufBpIds = state.dialogOptions
        .customManufacturerSupplierBusinessPartnerIds
        ? [...state.dialogOptions.customManufacturerSupplierBusinessPartnerIds]
        : [];
      manufBpIds.unshift(supplierBusinessPartnerId);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierBusinessPartnerIds: manufBpIds,
        },
      };
    }
  ),

  on(DialogActions.addCustomDataOwner, (state, { dataOwner }): DialogState => {
    const dataOwners = state.dialogOptions.dataOwners
      ? [...state.dialogOptions.dataOwners]
      : [];
    dataOwners.unshift(dataOwner.replaceAll(/\s+/g, ' '));

    return {
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        dataOwners,
      },
    };
  }),

  on(
    DialogActions.addCustomCo2Standard,
    (state, { co2Standard }): DialogState => {
      const co2Standards = state.dialogOptions.customCo2Standards
        ? [...state.dialogOptions.customCo2Standards]
        : [];

      co2Standards.unshift(co2Standard);

      return {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customCo2Standards: co2Standards,
        },
      };
    }
  ),

  on(
    DialogActions.openEditDialog,
    (state, { row, column }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        row,
        column,
        materialNames: undefined,
        materialNamesLoading: true,
        standardDocuments: undefined,
        standardDocumentsLoading: true,
        supplierIds: undefined,
        supplierIdsLoading: true,
        loadingComplete: false,
      },
    })
  ),

  on(
    DialogActions.openMultiEditDialog,
    (state, { rows, combinedRows }): DialogState => ({
      ...state,
      selectedMaterial: {
        rows,
        combinedRows,
        form: undefined,
      },
    })
  ),

  on(
    DialogActions.updateCreateMaterialDialogValues,
    (state, { form }): DialogState => ({
      ...state,
      selectedMaterial: {
        ...state.selectedMaterial,
        form,
      },
    })
  ),

  on(
    DialogActions.setMaterialFormValue,
    (state, { parsedMaterial }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        parsedMaterial,
      },
    })
  ),

  on(
    DialogActions.fetchEditMaterialNameDataSuccess,
    (state, { standardDocuments }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        standardDocuments,
        standardDocumentsLoading: false,
      },
    })
  ),

  on(
    DialogActions.fetchEditMaterialNameDataFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        error: true,
      },
      editMaterial: {
        ...state.editMaterial,
        standardDocuments: undefined,
        standardDocumentsLoading: undefined,
      },
    })
  ),

  on(
    DialogActions.fetchEditStandardDocumentDataSuccess,
    (state, { materialNames }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        materialNames,
        materialNamesLoading: false,
      },
    })
  ),

  on(
    DialogActions.fetchEditStandardDocumentDataFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        error: true,
      },
      editMaterial: {
        ...state.editMaterial,
        materialNames: undefined,
        materialNamesLoading: undefined,
      },
    })
  ),

  on(
    DialogActions.fetchEditMaterialSuppliersSuccess,
    (state, { supplierIds }): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        supplierIds,
        supplierIdsLoading: false,
      },
    })
  ),

  on(
    DialogActions.fetchEditMaterialSuppliersFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        error: true,
      },
      editMaterial: {
        ...state.editMaterial,
        supplierIds: undefined,
        supplierIdsLoading: undefined,
      },
    })
  ),

  on(
    DialogActions.editDialogLoadingComplete,
    (state): DialogState => ({
      ...state,
      editMaterial: {
        ...state.editMaterial,
        loadingComplete: true,
      },
    })
  ),

  on(
    DialogActions.minimizeDialog,
    (state, { id, value, isCopy, isBulkEdit }): DialogState => ({
      ...state,
      minimizedDialog: {
        id,
        value,
        isCopy,
        isBulkEdit,
      },
    })
  ),

  on(
    DialogActions.cleanMinimizeDialog,
    (state): DialogState => ({
      ...state,
      minimizedDialog: undefined,
    })
  ),

  on(
    DialogActions.fetchSteelMakingProcessesInUseSuccess,
    (state, { steelMakingProcessesInUse }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesInUse,
      },
    })
  ),
  on(
    DialogActions.fetchSteelMakingProcessesInUseFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesInUse: [],
        error: true,
      },
    })
  ),
  on(
    DialogActions.resetSteelMakingProcessInUse,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        steelMakingProcessesInUse: [],
      },
    })
  ),

  on(
    DialogActions.fetchCo2ValuesForSupplierSteelMakingProcessSuccess,
    (state, { co2Values }): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Values,
      },
    })
  ),
  on(
    DialogActions.fetchCo2ValuesForSupplierSteelMakingProcessFailure,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Values: undefined,
        error: true,
      },
    })
  ),
  on(
    DialogActions.resetCo2ValuesForSupplierSteelMakingProcess,
    (state): DialogState => ({
      ...state,
      dialogOptions: {
        ...state.dialogOptions,
        co2Values: undefined,
      },
    })
  ),
  on(
    DialogActions.uploadSapMaterials,
    (state): DialogState => ({
      ...state,
      uploadSapMaterials: {
        ...state.uploadSapMaterials,
        uploadLoading: true,
      },
    })
  ),
  on(
    DialogActions.setSapMaterialsFileUploadProgress,
    (state, { fileUploadProgress }): DialogState => ({
      ...state,
      uploadSapMaterials: {
        ...state.uploadSapMaterials,
        fileUploadProgress,
      },
    })
  ),
  on(
    DialogActions.uploadSapMaterialsSuccess,
    (state): DialogState => ({
      ...state,
      uploadSapMaterials: {
        ...state.uploadSapMaterials,
        uploadLoading: false,
        databaseUploadStatus: {
          status: SapMaterialsDatabaseUploadStatus.RUNNING,
        },
        fileUploadProgress: undefined,
      },
    })
  ),
  on(
    DialogActions.uploadSapMaterialsFailure,
    (state): DialogState => ({
      ...state,
      uploadSapMaterials: {
        ...state.uploadSapMaterials,
        uploadLoading: false,
        fileUploadProgress: undefined,
      },
    })
  ),
  on(
    DialogActions.getSapMaterialsDatabaseUploadStatusSuccess,
    (state, { databaseUploadStatus }): DialogState => ({
      ...state,
      uploadSapMaterials: {
        ...state.uploadSapMaterials,
        databaseUploadStatus,
      },
    })
  ),
  on(
    DialogActions.sapMaterialsUploadStatusReset,
    (state): DialogState => ({
      ...state,
      uploadSapMaterials: {
        ...state.uploadSapMaterials,
        databaseUploadStatus: undefined,
      },
    })
  ),
  on(
    DialogActions.bulkEditMaterials,
    (state): DialogState => ({
      ...state,
      bulkEditMaterials: {
        ...state.bulkEditMaterials,
        updateLoading: true,
      },
    })
  ),
  on(
    DialogActions.bulkEditMaterialsSuccess,
    (state): DialogState => ({
      ...state,
      bulkEditMaterials: {
        ...state.bulkEditMaterials,
        updateLoading: false,
      },
    })
  ),
  on(
    DialogActions.bulkEditMaterialsFailure,
    (state): DialogState => ({
      ...state,
      bulkEditMaterials: {
        ...state.bulkEditMaterials,
        updateLoading: false,
      },
    })
  )
);

export function reducer(state: DialogState, action: Action): DialogState {
  return dialogReducer(state, action);
}
