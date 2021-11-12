import { DataFilter, DataResult } from '../../models';
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
      const materialClass = { id: 0, name: 'gibt net' };
      const productCategory = [{ id: 0, name: 'gibt net' }];
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

    it('should set filtered rows', () => {
      const filteredResult: DataResult[] = [];
      const action = DataActions.setFilteredRows({ filteredResult });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filteredResult,
      });
    });

    it('should set the list filters if defined', () => {
      const filters: {
        materialStandardMaterialName: string[];
        materialStandardStandardDocument: string[];
        materialNumber: string[];
      } = {
        materialStandardMaterialName: ['some material'],
        materialStandardStandardDocument: ['some document'],
        materialNumber: ['some number'],
      };
      const action = DataActions.setListFilters(filters);
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          listFilters: {
            ...initialState.filter.listFilters,
            materialName: filters.materialStandardMaterialName[0],
            standardDocument: filters.materialStandardStandardDocument[0],
            materialNumber: filters.materialNumber[0],
          },
        },
      });
    });

    it('should set the list filters to undeifned if not defined', () => {
      const filters: {
        materialStandardMaterialName: string[];
        materialStandardStandardDocument: string[];
        materialNumber: string[];
      } = {
        materialStandardMaterialName: undefined,
        materialStandardStandardDocument: undefined,
        materialNumber: undefined,
      };
      const action = DataActions.setListFilters(filters);
      const newState = dataReducer(
        {
          ...state,
          filter: {
            ...state.filter,
            listFilters: {
              ...state.filter.listFilters,
              materialName: 'value',
              standardDocument: 'value',
              materialNumber: 'value',
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          listFilters: {
            ...initialState.filter.listFilters,
            materialName: undefined,
            standardDocument: undefined,
            materialNumber: undefined,
          },
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
      const materialClassOptions: DataFilter[] = [];
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
      const productCategoryOptions: DataFilter[] = [];
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
  });
});
