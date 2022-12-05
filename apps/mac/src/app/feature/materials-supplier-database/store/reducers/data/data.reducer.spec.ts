import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DataResult } from '@mac/msd/models';
import * as DataActions from '@mac/msd/store/actions/data';

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

    it('should set Navigation on setNavigation', () => {
      const materialClass = MaterialClass.ALUMINUM;
      const navigationLevel = NavigationLevel.SUPPLIER;
      const action = DataActions.setNavigation({
        materialClass,
        navigationLevel,
      });

      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        navigation: {
          ...initialState.navigation,
          materialClass,
          navigationLevel,
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

    describe('fetchMaterialsSuccess', () => {
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
          materials: {
            aluminumMaterials: undefined,
            steelMaterials: [],
          },
        });
      });

      it('should set result on fetchMaterialsSuccess for steel', () => {
        const result: DataResult[] = [];
        const action = DataActions.fetchMaterialsSuccess({
          materialClass: MaterialClass.STEEL,
          result,
        });
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
          materials: {
            aluminumMaterials: undefined,
            steelMaterials: [],
            polymerMaterials: undefined,
          },
        });
      });

      it('should set result on fetchMaterialsSuccess for aluminum', () => {
        const result: DataResult[] = [];
        const action = DataActions.fetchMaterialsSuccess({
          materialClass: MaterialClass.ALUMINUM,
          result,
        });
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
          materials: {
            aluminumMaterials: [],
            steelMaterials: undefined,
            polymerMaterials: undefined,
          },
        });
      });

      it('should set result on fetchMaterialsSuccess for polymer', () => {
        const result: DataResult[] = [];
        const action = DataActions.fetchMaterialsSuccess({
          materialClass: MaterialClass.POLYMER,
          result,
        });
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
          materials: {
            aluminumMaterials: undefined,
            steelMaterials: undefined,
            polymerMaterials: [],
          },
        });
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
      const action = DataActions.fetchClassOptions();
      const newState = dataReducer(
        {
          ...state,
          materialClassLoading: false,
          materialClasses: [],
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        materialClassLoading: true,
        materialClasses: undefined,
      });
    });

    it('should set materialClass loading state and options', () => {
      const materialClasses: MaterialClass[] = [MaterialClass.STEEL];
      const action = DataActions.fetchClassOptionsSuccess({
        materialClasses,
      });
      const newState = dataReducer(
        {
          ...state,
          materialClassLoading: true,
          materialClasses: undefined,
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        materialClassLoading: false,
        materialClasses: [MaterialClass.STEEL],
      });
    });

    it('should set materialClass loading state and reset options', () => {
      const action = DataActions.fetchClassOptionsFailure();
      const newState = dataReducer(
        {
          ...state,
          materialClassLoading: true,
          materialClasses: [],
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        materialClassLoading: false,
        materialClasses: undefined,
      });
    });

    it('should reset result', () => {
      const action = DataActions.resetResult();
      const newState = dataReducer(
        {
          ...state,
          materials: {
            aluminumMaterials: [],
            steelMaterials: [],
            polymerMaterials: [],
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        materials: {
          aluminumMaterials: undefined,
          steelMaterials: undefined,
          polymerMaterials: undefined,
        },
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
  });
});
