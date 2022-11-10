import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/msd/constants';
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
          result: [],
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
          result: [],
          materials: {
            aluminumMaterials: undefined,
            steelMaterials: [],
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
          result: undefined,
          materials: {
            aluminumMaterials: [],
            steelMaterials: undefined,
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
  });
});
