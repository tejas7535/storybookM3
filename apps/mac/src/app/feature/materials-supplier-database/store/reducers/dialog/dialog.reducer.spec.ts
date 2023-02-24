import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialStandard,
} from '@mac/msd/models';
import * as DialogActions from '@mac/msd/store/actions/dialog';

import { dialogReducer, DialogState, initialState } from './dialog.reducer';

describe('dialogReducer', () => {
  describe('reducer', () => {
    let state: DialogState;

    beforeEach(() => {
      state = initialState;
    });

    it('should return initial state', () => {
      const action: any = {};
      const newState = dialogReducer(undefined, action);

      expect(newState).toEqual(initialState);
    });

    it('should reset the dialogOptions', () => {
      const action = DialogActions.materialDialogCanceled();
      const mockState: DialogState = {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          materialStandards: [{} as MaterialStandard],
          manufacturerSuppliers: [{} as ManufacturerSupplier],
          ratings: ['1'],
          steelMakingProcesses: ['1'],
          productionProcesses: [{ id: '1', title: '1' }],
          productCategories: [{ id: 'raw', title: 'raw' }],
          co2Classifications: [{ id: 'c1', title: '1' }],
          castingModes: ['1'],
          referenceDocuments: ['reference'],
        },
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: true,
          standardDocuments: undefined,
          standardDocumentsLoading: true,
          supplierIds: undefined,
          supplierIdsLoading: true,
          loadingComplete: false,
        },
      };

      const newState = dialogReducer(mockState, action);

      expect(newState).toEqual({
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
          referenceDocuments: undefined,
          co2Values: undefined,
          steelMakingProcessesInUse: [],
          error: undefined,
        },
        editMaterial: undefined,
      });
    });

    it('should set the loading state for the dialog to true', () => {
      const action = DialogActions.openDialog();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          materialStandardsLoading: true,
          manufacturerSuppliersLoading: true,
          co2ClassificationsLoading: true,
          error: undefined,
        },
      });
    });

    it('should set the loading state for the ratings to true', () => {
      const action = DialogActions.fetchRatings();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          ratingsLoading: true,
          error: undefined,
        },
      });
    });

    it('should set the loading state for the steelMakingProcesses to true', () => {
      const action = DialogActions.fetchSteelMakingProcesses();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          steelMakingProcessesLoading: true,
          error: undefined,
        },
      });
    });

    it('should set the loading state for the productionProcesses to true', () => {
      const action = DialogActions.fetchProductionProcesses();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          productionProcessesLoading: true,
          error: undefined,
        },
      });
    });

    it('should set the loading state for the castingModes to true', () => {
      const action = DialogActions.fetchCastingModes();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          castingModesLoading: true,
          error: undefined,
        },
      });
    });

    it('should set the material standards', () => {
      const materialStandards = [{} as MaterialStandard];
      const action = DialogActions.fetchMaterialStandardsSuccess({
        materialStandards,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          materialStandards,
          materialStandardsLoading: false,
        },
      });
    });

    it('should set the material standards and the loading state to undefined', () => {
      const materialStandards = [{} as MaterialStandard];
      const action = DialogActions.fetchMaterialStandardsFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            materialStandards,
            materialStandardsLoading: true,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          materialStandards: undefined,
          materialStandardsLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the manufacturer suppliers', () => {
      const manufacturerSuppliers = [{} as ManufacturerSupplier];
      const action = DialogActions.fetchManufacturerSuppliersSuccess({
        manufacturerSuppliers,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          manufacturerSuppliers,
          manufacturerSuppliersLoading: false,
        },
      });
    });

    it('should set the manufacturer suppliers and the loading state to undefined', () => {
      const manufacturerSuppliers = [{} as ManufacturerSupplier];
      const action = DialogActions.fetchManufacturerSuppliersFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            manufacturerSuppliers,
            manufacturerSuppliersLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          manufacturerSuppliers: undefined,
          manufacturerSuppliersLoading: undefined,
          error: true,
        },
      });
    });

    it('should reset the productCategories and set the loading state to true', () => {
      const action = DialogActions.fetchProductCategories();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          productCategories: undefined,
          productCategoriesLoading: true,
        },
      });
    });

    it('should set the productCategories', () => {
      const productCategories = [{ id: 'raw', title: 'raw' }];
      const action = DialogActions.fetchProductCategoriesSuccess({
        productCategories,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          productCategories,
          productCategoriesLoading: false,
        },
      });
    });

    it('should set the productCategories and the loading state to undefined', () => {
      const action = DialogActions.fetchProductCategoriesFailure();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          productCategories: undefined,
          productCategoriesLoading: undefined,
          error: true,
        },
      });
    });

    it('should reset the castingDiameters and set the loading state to true', () => {
      const supplierId = 1;
      const castingMode = 'ingot';
      const action = DialogActions.fetchCastingDiameters({
        supplierId,
        castingMode,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          castingDiameters: [],
          castingDiametersLoading: true,
        },
      });
    });

    it('should set the castingDiameters', () => {
      const castingDiameters = ['200x200'];
      const action = DialogActions.fetchCastingDiametersSuccess({
        castingDiameters,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          castingDiameters,
          castingDiametersLoading: false,
        },
      });
    });

    it('should set the castingDiameters and the loading state to undefined', () => {
      const action = DialogActions.fetchCastingDiametersFailure();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          castingDiameters: [],
          castingDiametersLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the ratings', () => {
      const ratings = ['1', '2'];
      const action = DialogActions.fetchRatingsSuccess({ ratings });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          ratings,
          ratingsLoading: false,
        },
      });
    });

    it('should set the ratings and the loading state to undefined', () => {
      const ratings = ['1', '2'];
      const action = DialogActions.fetchRatingsFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            ratings,
            ratingsLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          ratings: undefined,
          ratingsLoading: undefined,
          error: true,
        },
      });
    });

    it('should reset the referenceDocuments and set the loading state to true', () => {
      const referenceDocuments = ['reference', 'reference2'];
      const action = DialogActions.fetchReferenceDocuments({
        materialStandardId: 1,
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            referenceDocuments,
            referenceDocumentsLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          referenceDocuments: [],
          referenceDocumentsLoading: true,
        },
      });
    });

    it('should set the referenceDocuments', () => {
      const referenceDocuments = ['reference', 'reference2'];
      const action = DialogActions.fetchReferenceDocumentsSuccess({
        referenceDocuments,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          referenceDocuments,
          referenceDocumentsLoading: false,
        },
      });
    });

    it('should set the referenceDocuments and the loading state to undefined', () => {
      const referenceDocuments = ['reference', 'reference2'];
      const action = DialogActions.fetchReferenceDocumentsFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            referenceDocuments,
            referenceDocumentsLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          referenceDocuments: [],
          referenceDocumentsLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the steel making processes', () => {
      const steelMakingProcesses = ['1', '2'];
      const action = DialogActions.fetchSteelMakingProcessesSuccess({
        steelMakingProcesses,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          steelMakingProcesses,
          steelMakingProcessesLoading: false,
        },
      });
    });

    it('should set the steel making processes and the loading state to undefined', () => {
      const steelMakingProcesses = ['1', '2'];
      const action = DialogActions.fetchSteelMakingProcessesFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            steelMakingProcesses,
            steelMakingProcessesLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          steelMakingProcesses: undefined,
          steelMakingProcessesLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the production processes', () => {
      const productionProcesses = [
        { id: '1', title: '1' },
        { id: '2', title: '2' },
      ];
      const action = DialogActions.fetchProductionProcessesSuccess({
        productionProcesses,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          productionProcesses,
          productionProcessesLoading: false,
        },
      });
    });

    it('should set the production processes and the loading state to undefined', () => {
      const productionProcesses = [
        { id: '1', title: '1' },
        { id: '2', title: '2' },
      ];
      const action = DialogActions.fetchProductionProcessesFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            productionProcesses,
            productionProcessesLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          steelMakingProcesses: undefined,
          steelMakingProcessesLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the co2 classifications', () => {
      const co2Classifications = [
        { id: 'c1', title: '1' },
        { id: 'c2', title: '2' },
      ];
      const action = DialogActions.fetchCo2ClassificationsSuccess({
        co2Classifications,
      });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          co2Classifications,
          co2ClassificationsLoading: false,
        },
      });
    });

    it('should set the co2 classifications and the loading state to undefined', () => {
      const co2Classifications = [
        { id: 'c1', title: '1' },
        { id: 'c2', title: '2' },
      ];
      const action = DialogActions.fetchCo2ClassificationsFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            co2Classifications,
            co2ClassificationsLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          co2Classifications: undefined,
          co2ClassificationsLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the casting modes', () => {
      const castingModes = ['1', '2'];
      const action = DialogActions.fetchCastingModesSuccess({ castingModes });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          castingModes,
          castingModesLoading: false,
        },
      });
    });

    it('should set the casting modes and the loading state to undefined', () => {
      const castingModes = ['1', '2'];
      const action = DialogActions.fetchCastingModesFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            castingModes,
            castingModesLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          castingModes: undefined,
          castingModesLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the createMaterialLoading and createMaterialSuccess state', () => {
      const action = DialogActions.materialDialogConfirmed({
        standard: undefined,
        supplier: undefined,
        material: undefined,
      });
      const newState = dialogReducer(
        {
          ...state,
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        createMaterial: {
          createMaterialLoading: true,
          createMaterialRecord: undefined,
        },
        editMaterial: undefined,
      });
    });

    it('postManufacturerSupplier should reset custom options for MaterialStandard', () => {
      const action = DialogActions.postManufacturerSupplier({
        record: undefined,
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customMaterialStandardDocuments: ['1'],
            customMaterialStandardNames: ['1'],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          // reset custom options
          customMaterialStandardDocuments: undefined,
          customMaterialStandardNames: undefined,
        },
      });
    });

    it('postMaterial should reset custom options for ManufacturerSupplier', () => {
      const action = DialogActions.postMaterial({ record: undefined });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customManufacturerSupplierNames: ['1'],
            customManufacturerSupplierPlants: ['1'],
            customManufacturerSupplierCountries: ['1'],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          // reset custom options
          customManufacturerSupplierNames: undefined,
          customManufacturerSupplierPlants: undefined,
          customManufacturerSupplierCountries: undefined,
        },
      });
    });

    it('should set the createMaterialLoading and createMaterialRecord state', () => {
      const mockRecord = {} as CreateMaterialRecord;
      const action = DialogActions.createMaterialComplete({
        record: mockRecord,
      });
      const newState = dialogReducer(
        {
          ...state,
          createMaterial: {
            createMaterialLoading: true,
            createMaterialRecord: undefined,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        createMaterial: {
          createMaterialLoading: false,
          createMaterialRecord: mockRecord,
        },
      });
    });
    it('should reset materialRecord state', () => {
      const action = DialogActions.resetMaterialRecord({
        error: true,
        createAnother: false,
      });
      const newState = dialogReducer(
        {
          ...state,
          createMaterial: {
            createMaterialLoading: true,
            createMaterialRecord: {} as CreateMaterialRecord,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        createMaterial: undefined,
      });
    });

    it('should reset dialog options', () => {
      const action = DialogActions.resetDialogOptions();
      const preState: DialogState = {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customCastingDiameters: ['1'],
          customReferenceDocuments: ['1'],
          customManufacturerSupplierCountries: ['1'],
          customMaterialStandardDocuments: ['1'],
          customManufacturerSupplierNames: ['1'],
          customManufacturerSupplierPlants: ['1'],
          customMaterialStandardNames: ['1'],
          // reset loading fields
          co2Values: [
            {
              co2Scope1: 1,
              co2Scope2: 2,
              co2Scope3: 3,
              co2PerTon: 3,
              co2Classification: 's',
            },
          ],
          steelMakingProcessesInUse: ['1'],
          castingDiameters: ['1'],
          referenceDocuments: ['1'],
          error: true,
        },
      };
      const newState = dialogReducer(preState, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          customCastingDiameters: undefined,
          customReferenceDocuments: undefined,
          customManufacturerSupplierCountries: undefined,
          customMaterialStandardDocuments: undefined,
          customManufacturerSupplierNames: undefined,
          customManufacturerSupplierPlants: undefined,
          customMaterialStandardNames: undefined,
          // reset loading fields
          co2Values: undefined,
          steelMakingProcessesInUse: [],
          castingDiameters: undefined,
          referenceDocuments: undefined,
          error: undefined,
        },
        // other fields
        editMaterial: undefined,
        minimizedDialog: undefined,
      });
    });

    it('should set the custom diameters if they are not defined', () => {
      const action = DialogActions.addCustomCastingDiameter({
        castingDiameter: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customCastingDiameters: undefined,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customCastingDiameters: ['new'],
        },
      });
    });

    it('should add a custom diameter', () => {
      const action = DialogActions.addCustomCastingDiameter({
        castingDiameter: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customCastingDiameters: ['old'],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customCastingDiameters: ['new', 'old'],
        },
      });
    });

    it('should set the custom reference documents if they are not defined', () => {
      const action = DialogActions.addCustomReferenceDocument({
        referenceDocument: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customReferenceDocuments: undefined,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customReferenceDocuments: ['new'],
        },
      });
    });

    it('should add a custom reference document', () => {
      const action = DialogActions.addCustomReferenceDocument({
        referenceDocument: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customReferenceDocuments: ['old'],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customReferenceDocuments: ['new', 'old'],
        },
      });
    });

    it('should set the custom std doc if they are not defined', () => {
      const action = DialogActions.addCustomMaterialStandardDocument({
        standardDocument: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customMaterialStandardDocuments: undefined,
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customMaterialStandardDocuments: ['new'],
        },
      });
    });

    it('should add a custom standard document', () => {
      const action = DialogActions.addCustomMaterialStandardDocument({
        standardDocument: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customMaterialStandardDocuments: ['old'],
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customMaterialStandardDocuments: ['new', 'old'],
        },
      });
    });

    it('should set the custom material name if they are not defined', () => {
      const action = DialogActions.addCustomMaterialStandardName({
        materialName: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customMaterialStandardNames: undefined,
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customMaterialStandardNames: ['new'],
        },
      });
    });

    it('should add a custom material name', () => {
      const action = DialogActions.addCustomMaterialStandardName({
        materialName: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customMaterialStandardNames: ['old'],
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customMaterialStandardNames: ['new', 'old'],
        },
      });
    });

    it('should set the custom supplier names if they are not defined', () => {
      const action = DialogActions.addCustomSupplierName({
        supplierName: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customManufacturerSupplierNames: undefined,
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierNames: ['new'],
        },
      });
    });

    it('should add a custom supplier name', () => {
      const action = DialogActions.addCustomSupplierName({
        supplierName: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customManufacturerSupplierNames: ['old'],
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierNames: ['new', 'old'],
        },
      });
    });

    it('should set the custom supplier plant if they are not defined', () => {
      const action = DialogActions.addCustomSupplierPlant({
        supplierPlant: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customManufacturerSupplierPlants: undefined,
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierPlants: ['new'],
        },
      });
    });

    it('should add a custom supplier plant', () => {
      const action = DialogActions.addCustomSupplierPlant({
        supplierPlant: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customManufacturerSupplierPlants: ['old'],
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierPlants: ['new', 'old'],
        },
      });
    });

    it('should set the custom supplier country if they are not defined', () => {
      const action = DialogActions.addCustomSupplierCountry({
        supplierCountry: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customManufacturerSupplierCountries: undefined,
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierCountries: ['new'],
        },
      });
    });

    it('should add a custom supplier country', () => {
      const action = DialogActions.addCustomSupplierCountry({
        supplierCountry: 'new',
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            customManufacturerSupplierCountries: ['old'],
          },
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          customManufacturerSupplierCountries: ['new', 'old'],
        },
      });
    });

    it('should set the editMaterial', () => {
      const action = DialogActions.openEditDialog({
        row: {} as DataResult,
        column: 'column',
      });
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: undefined,
        },
        action
      );
      expect(newState).toEqual({
        ...state,
        editMaterial: {
          row: {} as DataResult,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: true,
          standardDocuments: undefined,
          standardDocumentsLoading: true,
          supplierIds: undefined,
          supplierIdsLoading: true,
          loadingComplete: false,
        },
      });
    });

    it('should set the standard documents', () => {
      const action = DialogActions.fetchEditMaterialNameDataSuccess({
        standardDocuments: [],
      });
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: undefined,
            materialNamesLoading: true,
            standardDocuments: undefined,
            standardDocumentsLoading: true,
            supplierIds: undefined,
            supplierIdsLoading: true,
            loadingComplete: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: true,
          standardDocuments: [],
          standardDocumentsLoading: false,
          supplierIds: undefined,
          supplierIdsLoading: true,
          loadingComplete: false,
        },
      });
    });

    it('should reset the standard documents', () => {
      const action = DialogActions.fetchEditMaterialNameDataFailure();
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: undefined,
            materialNamesLoading: true,
            standardDocuments: undefined,
            standardDocumentsLoading: true,
            supplierIds: undefined,
            supplierIdsLoading: true,
            loadingComplete: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          error: true,
        },
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: true,
          standardDocuments: undefined,
          standardDocumentsLoading: undefined,
          supplierIds: undefined,
          supplierIdsLoading: true,
          loadingComplete: false,
        },
      });
    });

    it('should set the material names', () => {
      const action = DialogActions.fetchEditStandardDocumentDataSuccess({
        materialNames: [],
      });
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: undefined,
            materialNamesLoading: true,
            standardDocuments: undefined,
            standardDocumentsLoading: true,
            supplierIds: undefined,
            supplierIdsLoading: true,
            loadingComplete: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: [],
          materialNamesLoading: false,
          standardDocuments: undefined,
          standardDocumentsLoading: true,
          supplierIds: undefined,
          supplierIdsLoading: true,
          loadingComplete: false,
        },
      });
    });

    it('should reset the material names', () => {
      const action = DialogActions.fetchEditStandardDocumentDataFailure();
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: undefined,
            materialNamesLoading: true,
            standardDocuments: undefined,
            standardDocumentsLoading: true,
            supplierIds: undefined,
            supplierIdsLoading: true,
            loadingComplete: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          error: true,
        },
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: undefined,
          standardDocuments: undefined,
          standardDocumentsLoading: true,
          supplierIds: undefined,
          supplierIdsLoading: true,
          loadingComplete: false,
        },
      });
    });

    it('should set the supplierIds', () => {
      const action = DialogActions.fetchEditMaterialSuppliersSuccess({
        supplierIds: [],
      });
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: undefined,
            materialNamesLoading: true,
            standardDocuments: undefined,
            standardDocumentsLoading: true,
            supplierIds: undefined,
            supplierIdsLoading: true,
            loadingComplete: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: true,
          standardDocuments: undefined,
          standardDocumentsLoading: true,
          supplierIds: [],
          supplierIdsLoading: false,
          loadingComplete: false,
        },
      });
    });

    it('should reset the supplierIds', () => {
      const action = DialogActions.fetchEditMaterialSuppliersFailure();
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: undefined,
            materialNamesLoading: true,
            standardDocuments: undefined,
            standardDocumentsLoading: true,
            supplierIds: undefined,
            supplierIdsLoading: true,
            loadingComplete: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          error: true,
        },
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: true,
          standardDocuments: undefined,
          standardDocumentsLoading: true,
          supplierIds: undefined,
          supplierIdsLoading: undefined,
          loadingComplete: false,
        },
      });
    });

    it('should set loading complete', () => {
      const action = DialogActions.editDialogLoadingComplete();
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: undefined,
            materialNamesLoading: true,
            standardDocuments: undefined,
            standardDocumentsLoading: true,
            supplierIds: undefined,
            supplierIdsLoading: true,
            loadingComplete: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        editMaterial: {
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: undefined,
          materialNamesLoading: true,
          standardDocuments: undefined,
          standardDocumentsLoading: true,
          supplierIds: undefined,
          supplierIdsLoading: true,
          loadingComplete: true,
        },
      });
    });

    it('should set the material form value', () => {
      const action = DialogActions.setMaterialFormValue({
        parsedMaterial: {} as MaterialFormValue,
      });
      const newState = dialogReducer(
        {
          ...state,
          editMaterial: {
            ...state.editMaterial,
            parsedMaterial: undefined,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        editMaterial: {
          ...state.editMaterial,
          parsedMaterial: {} as MaterialFormValue,
        },
      });
    });

    it('should set minimized dialog', () => {
      const action = DialogActions.minimizeDialog({
        id: 1,
        value: {} as MaterialFormValue,
        isCopy: true,
      });
      const newState = dialogReducer(
        {
          ...state,
          minimizedDialog: undefined,
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        minimizedDialog: {
          id: 1,
          value: {} as MaterialFormValue,
          isCopy: true,
        },
      });
    });

    it('should clean minimize dialog data', () => {
      const action = DialogActions.cleanMinimizeDialog();
      const preState = {
        ...state,
        minimizedDialog: {
          id: 1,
          value: {} as MaterialFormValue,
        },
      };
      const newState = dialogReducer(preState, action);
      expect(newState).toEqual({
        ...state,
        minimizedDialog: undefined,
      });
    });

    it('should set the steel making processes in use', () => {
      const action = DialogActions.fetchSteelMakingProcessesInUseSuccess({
        steelMakingProcessesInUse: ['BF+BOF'],
      });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            steelMakingProcessesInUse: undefined,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          steelMakingProcessesInUse: ['BF+BOF'],
        },
      });
    });

    it('should set the steel making processes in use on failure', () => {
      const action = DialogActions.fetchSteelMakingProcessesInUseFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            steelMakingProcessesInUse: ['BF+BOF'],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          steelMakingProcessesInUse: [],
          error: true,
        },
      });
    });

    it('should reset the steel making processes in use', () => {
      const action = DialogActions.resetSteelMakingProcessInUse();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            steelMakingProcessesInUse: ['BF+BOF'],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          steelMakingProcessesInUse: [],
        },
      });
    });

    it('should set the co2 values', () => {
      const mockCo2Values = {
        co2PerTon: 3,
        co2Scope1: 1,
        co2Scope2: 1,
        co2Scope3: 1,
        co2Classification: 'c1',
      };
      const action =
        DialogActions.fetchCo2ValuesForSupplierSteelMakingProcessSuccess({
          co2Values: [mockCo2Values],
        });
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            co2Values: undefined,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          co2Values: [mockCo2Values],
        },
      });
    });

    it('should set the co2 values on failure', () => {
      const mockCo2Values = {
        co2PerTon: 3,
        co2Scope1: 1,
        co2Scope2: 1,
        co2Scope3: 1,
        co2Classification: 'c1',
      };
      const action =
        DialogActions.fetchCo2ValuesForSupplierSteelMakingProcessFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            co2Values: [mockCo2Values],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          co2Values: undefined,
          error: true,
        },
      });
    });

    it('should reset the co2 values', () => {
      const mockCo2Values = {
        co2PerTon: 3,
        co2Scope1: 1,
        co2Scope2: 1,
        co2Scope3: 1,
        co2Classification: 'c1',
      };
      const action =
        DialogActions.resetCo2ValuesForSupplierSteelMakingProcess();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            co2Values: [mockCo2Values],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          co2Values: undefined,
        },
      });
    });

    it('should set the loading state for the conditions to true', () => {
      const action = DialogActions.fetchConditions();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          conditionsLoading: true,
          error: undefined,
        },
      });
    });

    it('should set the conditions', () => {
      const conditions = [{} as StringOption];
      const action = DialogActions.fetchConditionsSuccess({ conditions });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          conditions,
          conditionsLoading: false,
        },
      });
    });

    it('should set the conditions modes and the loading state to undefined', () => {
      const conditions = [{} as StringOption];
      const action = DialogActions.fetchConditionsFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            conditions,
            conditionsLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          conditions: undefined,
          conditionsLoading: undefined,
          error: true,
        },
      });
    });

    it('should set the loading state for the coatings to true', () => {
      const action = DialogActions.fetchCoatings();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          coatings: undefined,
          coatingsLoading: true,
          error: undefined,
        },
      });
    });

    it('should set the coatings', () => {
      const coatings = [{} as StringOption];
      const action = DialogActions.fetchCoatingsSuccess({ coatings });
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          coatings,
          coatingsLoading: false,
        },
      });
    });

    it('should set the coatings and the loading state to undefined', () => {
      const coatings = [{} as StringOption];
      const action = DialogActions.fetchCoatingsFailure();
      const newState = dialogReducer(
        {
          ...state,
          dialogOptions: {
            ...state.dialogOptions,
            coatings,
            coatingsLoading: false,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          coatings: undefined,
          coatingsLoading: undefined,
          error: true,
        },
      });
    });
  });
});
