import { StringOption } from '@schaeffler/inputs';

import {
  DataResult,
  ManufacturerSupplier,
  MaterialStandard,
} from '../../models';
import * as DataActions from '../actions';
import { dataReducer, DataState, initialState } from './data.reducer';

describe('dataReducer', () => {
  describe('reducer', () => {
    let state: DataState;

    beforeEach(() => {
      state = initialState;
    });

    it('should return initial state', () => {
      const action: any = {};
      const newState = dataReducer(undefined, action);

      expect(newState).toEqual(initialState);
    });

    it('should set filter on setFilter', () => {
      const materialClass = { id: 'id', title: 'gibt net' };
      const productCategory = [{ id: 'id', title: 'gibt net' }];
      const action = DataActions.setFilter({ materialClass, productCategory });

      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          materialClass,
          productCategory,
        },
      });
    });

    it('should set loading on fetchMaterials', () => {
      const action = DataActions.fetchMaterials();
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          loading: true,
        },
      });
    });

    it('should set result on fetchMaterialsSuccess', () => {
      const result: DataResult[] = [];
      const action = DataActions.fetchMaterialsSuccess({ result });
      const newState = dataReducer(
        { ...state, filter: { ...state.filter, loading: true } },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          loading: false,
        },
        result: [],
      });
    });

    it('should set loading to false on fetchMaterialsFailure', () => {
      const action = DataActions.fetchMaterialsFailure();
      const newState = dataReducer(
        {
          ...state,
          filter: { ...state.filter, loading: true },
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        filter: { ...initialState.filter, loading: false },
      });
    });

    it('should set string value of ag grid filter if filterModel is defined', () => {
      const filterModel = {
        someKey: 'someValue',
      };
      const action = DataActions.setAgGridFilter({ filterModel });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          agGridFilter: JSON.stringify(filterModel),
        },
      });
    });

    it('should set string value of empty filterModel if it is not defined', () => {
      const action = DataActions.setAgGridFilter({ filterModel: undefined });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          agGridFilter: JSON.stringify({}),
        },
      });
    });

    it('should set loading states and reset options', () => {
      const action = DataActions.fetchClassAndCategoryOptions();
      const newState = dataReducer(
        {
          ...state,
          materialClassLoading: false,
          productCategoryLoading: false,
          materialClassOptions: [],
          productCategoryOptions: [],
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        materialClassLoading: true,
        productCategoryLoading: true,
        materialClassOptions: undefined,
        productCategoryOptions: undefined,
      });
    });

    it('should set materialClass loading state and options', () => {
      const materialClassOptions: StringOption[] = [];
      const action = DataActions.fetchClassOptionsSuccess({
        materialClassOptions,
      });
      const newState = dataReducer(
        {
          ...state,
          materialClassLoading: true,
          materialClassOptions: undefined,
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        materialClassLoading: false,
        materialClassOptions: [],
      });
    });

    it('should set materialClass loading state and reset options', () => {
      const action = DataActions.fetchClassOptionsFailure();
      const newState = dataReducer(
        {
          ...state,
          materialClassLoading: true,
          materialClassOptions: [],
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        materialClassLoading: false,
        materialClassOptions: undefined,
      });
    });

    it('should set productCategory loading state and options', () => {
      const productCategoryOptions: StringOption[] = [];
      const action = DataActions.fetchCategoryOptionsSuccess({
        productCategoryOptions,
      });
      const newState = dataReducer(
        {
          ...state,
          productCategoryLoading: true,
          productCategoryOptions: undefined,
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        productCategoryLoading: false,
        productCategoryOptions: [],
      });
    });

    it('should set productCategory loading state and reset options', () => {
      const action = DataActions.fetchCategoryOptionsFailure();
      const newState = dataReducer(
        {
          ...state,
          productCategoryLoading: true,
          productCategoryOptions: [],
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        productCategoryLoading: false,
        productCategoryOptions: undefined,
      });
    });

    it('should reset result', () => {
      const action = DataActions.resetResult();
      const newState = dataReducer(
        {
          ...state,
          result: [],
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        result: undefined,
      });
    });

    it('should set ag grid columns', () => {
      const action = DataActions.setAgGridColumns({ agGridColumns: 'columns' });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        agGridColumns: 'columns',
      });
    });

    it('should reset the dialogOptions', () => {
      const action = DataActions.addMaterialDialogCanceled();
      const mockState = {
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            materialStandards: [{} as MaterialStandard],
            manufacturerSuppliers: [{} as ManufacturerSupplier],
            ratings: ['1'],
            steelMakingProcesses: ['1'],
            co2Classifications: [{ id: 'c1', title: '1' }],
            castingModes: ['1'],
          },
        },
      };

      const newState = dataReducer(mockState, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            materialStandards: undefined,
            manufacturerSuppliers: undefined,
            ratings: undefined,
            steelMakingProcesses: undefined,
            co2Classifications: undefined,
            castingModes: undefined,
          },
        },
      });
    });

    it('should set the loading state for the dialog to true', () => {
      const action = DataActions.addMaterialDialogOpened();
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            materialStandardsLoading: true,
            manufacturerSuppliersLoading: true,
            ratingsLoading: true,
            steelMakingProcessesLoading: true,
            co2ClassificationsLoading: true,
            castingModesLoading: true,
          },
        },
      });
    });

    it('should set the material standards', () => {
      const materialStandards = [{} as MaterialStandard];
      const action = DataActions.fetchMaterialStandardsSuccess({
        materialStandards,
      });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            materialStandards,
            materialStandardsLoading: false,
          },
        },
      });
    });

    it('should set the material standards and the loading state to undefined', () => {
      const materialStandards = [{} as MaterialStandard];
      const action = DataActions.fetchMaterialStandardsFailure();
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              materialStandards,
              materialStandardsLoading: true,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            materialStandards: undefined,
            materialStandardsLoading: undefined,
          },
        },
      });
    });

    it('should set the manufacturer suppliers', () => {
      const manufacturerSuppliers = [{} as ManufacturerSupplier];
      const action = DataActions.fetchManufacturerSuppliersSuccess({
        manufacturerSuppliers,
      });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            manufacturerSuppliers,
            manufacturerSuppliersLoading: false,
          },
        },
      });
    });

    it('should set the manufacturer suppliers and the loading state to undefined', () => {
      const manufacturerSuppliers = [{} as ManufacturerSupplier];
      const action = DataActions.fetchManufacturerSuppliersFailure();
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              manufacturerSuppliers,
              manufacturerSuppliersLoading: false,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            manufacturerSuppliers: undefined,
            manufacturerSuppliersLoading: undefined,
          },
        },
      });
    });

    it('should reset the castingDiameters and set the loading state to true', () => {
      const supplierId = 1;
      const action = DataActions.fetchCastingDiameters({
        supplierId,
      });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            castingDiameters: [],
            castingDiametersLoading: true,
          },
        },
      });
    });

    it('should set the castingDiameters', () => {
      const castingDiameters = ['200x200'];
      const action = DataActions.fetchCastingDiametersSuccess({
        castingDiameters,
      });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            castingDiameters,
            castingDiametersLoading: false,
          },
        },
      });
    });

    it('should set the castingDiameters and the loading state to undefined', () => {
      const action = DataActions.fetchCastingDiametersFailure();
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            castingDiameters: [],
            castingDiametersLoading: undefined,
          },
        },
      });
    });

    it('should set the ratings', () => {
      const ratings = ['1', '2'];
      const action = DataActions.fetchRatingsSuccess({ ratings });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            ratings,
            ratingsLoading: false,
          },
        },
      });
    });

    it('should set the ratings and the loading state to undefined', () => {
      const ratings = ['1', '2'];
      const action = DataActions.fetchRatingsFailure();
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              ratings,
              ratingsLoading: false,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            ratings: undefined,
            ratingsLoading: undefined,
          },
        },
      });
    });

    it('should set the steel making processes', () => {
      const steelMakingProcesses = ['1', '2'];
      const action = DataActions.fetchSteelMakingProcessesSuccess({
        steelMakingProcesses,
      });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            steelMakingProcesses,
            steelMakingProcessesLoading: false,
          },
        },
      });
    });

    it('should set the steel making processes and the loading state to undefined', () => {
      const steelMakingProcesses = ['1', '2'];
      const action = DataActions.fetchSteelMakingProcessesFailure();
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              steelMakingProcesses,
              steelMakingProcessesLoading: false,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            steelMakingProcesses: undefined,
            steelMakingProcessesLoading: undefined,
          },
        },
      });
    });

    it('should set the co2 classifications', () => {
      const co2Classifications = [
        { id: 'c1', title: '1' },
        { id: 'c2', title: '2' },
      ];
      const action = DataActions.fetchCo2ClassificationsSuccess({
        co2Classifications,
      });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            co2Classifications,
            co2ClassificationsLoading: false,
          },
        },
      });
    });

    it('should set the co2 classifications and the loading state to undefined', () => {
      const co2Classifications = [
        { id: 'c1', title: '1' },
        { id: 'c2', title: '2' },
      ];
      const action = DataActions.fetchCo2ClassificationsFailure();
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              co2Classifications,
              co2ClassificationsLoading: false,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            co2Classifications: undefined,
            co2ClassificationsLoading: undefined,
          },
        },
      });
    });

    it('should set the casting modes', () => {
      const castingModes = ['1', '2'];
      const action = DataActions.fetchCastingModesSuccess({ castingModes });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            castingModes,
            castingModesLoading: false,
          },
        },
      });
    });

    it('should set the casting modes and the loading state to undefined', () => {
      const castingModes = ['1', '2'];
      const action = DataActions.fetchCastingModesFailure();
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              castingModes,
              castingModesLoading: false,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            castingModes: undefined,
            castingModesLoading: undefined,
          },
        },
      });
    });

    it('should set the createMaterialLoading and createMaterialSuccess state', () => {
      const action = DataActions.addMaterialDialogConfirmed({
        material: undefined,
      });
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          createMaterial: {
            createMaterialLoading: true,
            createMaterialSuccess: undefined,
          },
        },
      });
    });

    it('should set the createMaterialLoading and createMaterialSuccess state after creation', () => {
      const action = DataActions.createMaterialComplete({ success: true });
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            createMaterial: {
              createMaterialLoading: true,
              createMaterialSuccess: undefined,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          createMaterial: {
            createMaterialLoading: false,
            createMaterialSuccess: true,
          },
        },
      });
    });

    it('should set the custom diameters if they are not defined', () => {
      const action = DataActions.addCustomCastingDiameter({
        castingDiameter: 'new',
      });
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              customCastingDiameters: undefined,
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            customCastingDiameters: ['new'],
          },
        },
      });
    });

    it('should add a custom diameter', () => {
      const action = DataActions.addCustomCastingDiameter({
        castingDiameter: 'new',
      });
      const newState = dataReducer(
        {
          ...state,
          addMaterialDialog: {
            ...state.addMaterialDialog,
            dialogOptions: {
              ...state.addMaterialDialog.dialogOptions,
              customCastingDiameters: ['old'],
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        addMaterialDialog: {
          ...state.addMaterialDialog,
          dialogOptions: {
            ...state.addMaterialDialog.dialogOptions,
            customCastingDiameters: ['new', 'old'],
          },
        },
      });
    });
  });
});
