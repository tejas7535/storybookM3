import { ManufacturerSupplier, MaterialStandard } from '@mac/msd/models';
import * as DataActions from '@mac/msd/store/actions/dialog';

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
      const action = DataActions.addMaterialDialogCanceled();
      const mockState = {
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          materialStandards: [{} as MaterialStandard],
          manufacturerSuppliers: [{} as ManufacturerSupplier],
          ratings: ['1'],
          steelMakingProcesses: ['1'],
          co2Classifications: [{ id: 'c1', title: '1' }],
          castingModes: ['1'],
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
          co2Classifications: undefined,
          castingModes: undefined,
        },
      });
    });

    it('should set the loading state for the dialog to true', () => {
      const action = DataActions.addMaterialDialogOpened();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          materialStandardsLoading: true,
          manufacturerSuppliersLoading: true,
          ratingsLoading: true,
          steelMakingProcessesLoading: true,
          co2ClassificationsLoading: true,
          castingModesLoading: true,
        },
      });
    });

    it('should set the material standards', () => {
      const materialStandards = [{} as MaterialStandard];
      const action = DataActions.fetchMaterialStandardsSuccess({
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
      const action = DataActions.fetchMaterialStandardsFailure();
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
        },
      });
    });

    it('should set the manufacturer suppliers', () => {
      const manufacturerSuppliers = [{} as ManufacturerSupplier];
      const action = DataActions.fetchManufacturerSuppliersSuccess({
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
      const action = DataActions.fetchManufacturerSuppliersFailure();
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
        },
      });
    });

    it('should reset the castingDiameters and set the loading state to true', () => {
      const supplierId = 1;
      const castingMode = 'ingot';
      const action = DataActions.fetchCastingDiameters({
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
      const action = DataActions.fetchCastingDiametersSuccess({
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
      const action = DataActions.fetchCastingDiametersFailure();
      const newState = dialogReducer(state, action);

      expect(newState).toEqual({
        ...state,
        dialogOptions: {
          ...state.dialogOptions,
          castingDiameters: [],
          castingDiametersLoading: undefined,
        },
      });
    });

    it('should set the ratings', () => {
      const ratings = ['1', '2'];
      const action = DataActions.fetchRatingsSuccess({ ratings });
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
      const action = DataActions.fetchRatingsFailure();
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
        },
      });
    });

    it('should set the steel making processes', () => {
      const steelMakingProcesses = ['1', '2'];
      const action = DataActions.fetchSteelMakingProcessesSuccess({
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
      const action = DataActions.fetchSteelMakingProcessesFailure();
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
      const action = DataActions.fetchCo2ClassificationsFailure();
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
        },
      });
    });

    it('should set the casting modes', () => {
      const castingModes = ['1', '2'];
      const action = DataActions.fetchCastingModesSuccess({ castingModes });
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
      const action = DataActions.fetchCastingModesFailure();
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
        },
      });
    });

    it('should set the createMaterialLoading and createMaterialSuccess state', () => {
      const action = DataActions.addMaterialDialogConfirmed({
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
          createMaterialSuccess: undefined,
        },
      });
    });

    it('should set the createMaterialLoading and createMaterialSuccess state after creation', () => {
      const action = DataActions.createMaterialComplete({ success: true });
      const newState = dialogReducer(
        {
          ...state,
          createMaterial: {
            createMaterialLoading: true,
            createMaterialSuccess: undefined,
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        createMaterial: {
          createMaterialLoading: false,
          createMaterialSuccess: true,
        },
      });
    });

    it('should set the custom diameters if they are not defined', () => {
      const action = DataActions.addCustomCastingDiameter({
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
      const action = DataActions.addCustomCastingDiameter({
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
  });
});
