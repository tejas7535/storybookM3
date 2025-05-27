import { TranslocoModule } from '@jsverse/transloco';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  MaterialStandardTableValue,
  SAPMaterialsRequest,
  ServerSideMaterialsRequest,
} from '@mac/msd/models';
import * as DataActions from '@mac/msd/store/actions/data';

import { dataReducer, DataState, initialState } from './data.reducer';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

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

    it('should reset result on fetchSAPMaterials', () => {
      const action = DataActions.fetchSAPMaterials({
        request: {} as SAPMaterialsRequest,
      });
      const newState = dataReducer(
        {
          ...state,
          sapMaterialsRows: {
            startRow: 0,
          },
          result: {
            ...state.result,
            [MaterialClass.SAP_MATERIAL]: {
              materials: [],
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        sapMaterialsRows: {
          lastRow: undefined,
          startRow: undefined,
        },
        result: {
          ...initialState.result,
          [MaterialClass.SAP_MATERIAL]: {
            materials: undefined,
          },
        },
      });
    });

    describe('fetchVitescoMaterials', () => {
      it('should reset result on fetchVitescoMaterials', () => {
        const action = DataActions.fetchVitescoMaterials({
          request: {} as ServerSideMaterialsRequest,
        });
        const newState = dataReducer(
          {
            ...state,
            vitescoMaterialsRows: {
              startRow: 0,
            },
            result: {
              ...state.result,
              [MaterialClass.VITESCO]: {
                materials: [],
              },
            },
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          vitescoMaterialsRows: {
            lastRow: undefined,
            startRow: undefined,
          },
          result: {
            ...initialState.result,
            [MaterialClass.VITESCO]: {
              materials: undefined,
            },
          },
        });
      });

      it('should set vitescoMaterialRows and result', () => {
        const action = DataActions.fetchVitescoMaterialsSuccess({
          data: [],
          lastRow: -1,
          totalRows: 300,
          subTotalRows: 100,
          startRow: 0,
        });
        const newState = dataReducer({ ...state }, action);

        expect(newState).toEqual({
          ...initialState,
          vitescoMaterialsRows: {
            lastRow: -1,
            totalRows: 300,
            subTotalRows: 100,
            startRow: 0,
          },
          result: {
            ...initialState.result,
            [MaterialClass.VITESCO]: {
              ...initialState.result[MaterialClass.VITESCO],
              materials: [],
            },
          },
        });
      });

      it('should set the startRow and unset the result', () => {
        const action = DataActions.fetchVitescoMaterialsFailure({
          startRow: 0,
          errorCode: 1,
          retryCount: 2,
        });
        const newState = dataReducer(
          {
            ...state,
            vitescoMaterialsRows: {
              startRow: 100,
              lastRow: 100,
              totalRows: 100,
              subTotalRows: 100,
            },
            result: {
              ...state.result,
              [MaterialClass.VITESCO]: {
                materials: [],
              },
            },
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          vitescoMaterialsRows: {
            startRow: 0,
            errorCode: 1,
            retryCount: 2,
          },
          result: {
            [MaterialClass.VITESCO]: {
              materials: undefined,
            },
          },
        });
      });
    });

    describe('fetchEstimationMatrix', () => {
      it('should reset result on fetchEstimationMatrix', () => {
        const action = DataActions.fetchEstimationMatrix({
          request: {} as ServerSideMaterialsRequest,
        });
        const newState = dataReducer(
          {
            ...state,
            estimationMatrixRows: {
              startRow: 0,
            },
            result: {
              ...state.result,
              [MaterialClass.DS_ESTIMATIONMATRIX]: {
                materials: [],
              },
            },
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          estimationMatrixRows: {
            lastRow: undefined,
            startRow: undefined,
          },
          result: {
            ...initialState.result,
            [MaterialClass.DS_ESTIMATIONMATRIX]: {
              materials: undefined,
            },
          },
        });
      });

      it('should set estimationMatrixRows and result', () => {
        const action = DataActions.fetchEstimationMatrixSuccess({
          data: [],
          lastRow: -1,
          totalRows: 300,
          subTotalRows: 100,
          startRow: 0,
        });
        const newState = dataReducer({ ...state }, action);

        expect(newState).toEqual({
          ...initialState,
          estimationMatrixRows: {
            lastRow: -1,
            totalRows: 300,
            subTotalRows: 100,
            startRow: 0,
          },
          result: {
            ...initialState.result,
            [MaterialClass.DS_ESTIMATIONMATRIX]: {
              ...initialState.result[MaterialClass.DS_ESTIMATIONMATRIX],
              materials: [],
            },
          },
        });
      });

      it('should set the startRow and unset the result', () => {
        const action = DataActions.fetchEstimationMatrixFailure({
          startRow: 0,
          errorCode: 1,
          retryCount: 2,
        });
        const newState = dataReducer(
          {
            ...state,
            estimationMatrixRows: {
              startRow: 100,
              lastRow: 100,
              totalRows: 100,
              subTotalRows: 100,
            },
            result: {
              ...state.result,
              [MaterialClass.DS_ESTIMATIONMATRIX]: {
                materials: [],
              },
            },
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          estimationMatrixRows: {
            startRow: 0,
            errorCode: 1,
            retryCount: 2,
          },
          result: {
            [MaterialClass.DS_ESTIMATIONMATRIX]: {
              materials: undefined,
            },
          },
        });
      });
    });

    describe('fetchMaterialsSuccess', () => {
      it.each([
        [MaterialClass.STEEL, [] as DataResult[]],
        [MaterialClass.ALUMINUM, [] as DataResult[]],
        [MaterialClass.POLYMER, [] as DataResult[]],
      ])(
        'should set result on fetchMaterialsSuccess for %s',
        (materialClass, result) => {
          const action = DataActions.fetchMaterialsSuccess({
            materialClass,
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
            result: {
              ...initialState.result,
              [materialClass]: {
                ...initialState.result[materialClass],
                materials: result,
              },
            },
          });
        }
      );
    });

    it('should set sapMaterialRows and result', () => {
      const action = DataActions.fetchSAPMaterialsSuccess({
        data: [],
        lastRow: -1,
        totalRows: 300,
        subTotalRows: 100,
        startRow: 0,
      });
      const newState = dataReducer({ ...state }, action);

      expect(newState).toEqual({
        ...initialState,
        sapMaterialsRows: {
          lastRow: -1,
          totalRows: 300,
          subTotalRows: 100,
          startRow: 0,
        },
        result: {
          ...initialState.result,
          [MaterialClass.SAP_MATERIAL]: {
            ...initialState.result[MaterialClass.SAP_MATERIAL],
            materials: [],
          },
        },
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

    it('should set the startRow and unset the result', () => {
      const action = DataActions.fetchSAPMaterialsFailure({
        startRow: 0,
        errorCode: 1,
        retryCount: 2,
      });
      const newState = dataReducer(
        {
          ...state,
          sapMaterialsRows: {
            startRow: 100,
            lastRow: 100,
            totalRows: 100,
            subTotalRows: 100,
          },
          result: {
            ...state.result,
            [MaterialClass.SAP_MATERIAL]: {
              materials: [],
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        sapMaterialsRows: {
          startRow: 0,
          errorCode: 1,
          retryCount: 2,
        },
        result: {
          [MaterialClass.SAP_MATERIAL]: {
            materials: undefined,
          },
        },
      });
    });

    it('should set loading on fetchManufacturerSuppliers', () => {
      const action = DataActions.fetchManufacturerSuppliers();
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          loading: true,
        },
      });
    });
    describe('fetchManufacturerSuppliersSuccess', () => {
      it.each([
        [MaterialClass.STEEL, [] as ManufacturerSupplierTableValue[]],
        [MaterialClass.ALUMINUM, [] as ManufacturerSupplierTableValue[]],
        [MaterialClass.POLYMER, [] as ManufacturerSupplierTableValue[]],
      ])(
        'should set result on fetchMaterialsSuccess for %s',
        (materialClass, manufacturerSuppliers) => {
          const action = DataActions.fetchManufacturerSuppliersSuccess({
            materialClass,
            manufacturerSuppliers,
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
            result: {
              ...initialState.result,
              [materialClass]: {
                ...initialState.result[materialClass],
                suppliers: manufacturerSuppliers,
              },
            },
          });
        }
      );
    });

    it('should set loading to false on fetchManufacturerSuppliersFailure', () => {
      const action = DataActions.fetchManufacturerSuppliersFailure();
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
    it('should set loading on fetchMaterialStandards', () => {
      const action = DataActions.fetchMaterialStandards();
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          loading: true,
        },
      });
    });
    describe('fetchMaterialStandardsSuccess', () => {
      it.each([
        [MaterialClass.STEEL, [] as MaterialStandardTableValue[]],
        [MaterialClass.ALUMINUM, [] as MaterialStandardTableValue[]],
        [MaterialClass.POLYMER, [] as MaterialStandardTableValue[]],
      ])(
        'should set result on fetchMaterialStandardsSuccess for %s',
        (materialClass, materialStandards) => {
          const action = DataActions.fetchMaterialStandardsSuccess({
            materialClass,
            materialStandards,
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
            result: {
              ...initialState.result,
              [materialClass]: {
                ...initialState.result[materialClass],
                materialStandards,
              },
            },
          });
        }
      );
    });

    it('should set loading to false on fetchMaterialStandardsFailure', () => {
      const action = DataActions.fetchMaterialStandardsFailure();
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
    it('should set loading on fetchProductCategoryRules', () => {
      const action = DataActions.fetchProductCategoryRules();
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          loading: true,
        },
      });
    });
    it('should set product category rules on fetchProductCategoryRulesSuccess', () => {
      const action = DataActions.fetchProductCategoryRulesSuccess({
        materialClass: MaterialClass.STEEL,
        productCategoryRules: [],
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
        result: {
          ...initialState.result,
          [MaterialClass.STEEL]: {
            ...initialState.result[MaterialClass.STEEL],
            productCategoryRules: [],
          },
        },
      });
    });

    it('should set loading to false on fetchProductCategoryRulesFailure', () => {
      const action = DataActions.fetchProductCategoryRulesFailure();
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

    it('should set string value of ag grid filter for given navigation if filterModel is defined', () => {
      const filterModel = {
        someKey: 'someValue',
      };
      const action = DataActions.setAgGridFilterForNavigation({
        filterModel,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });
      const newState = dataReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          agGridFilter: {
            ...initialState.filter.agGridFilter,
            [MaterialClass.STEEL]: {
              ...initialState.filter.agGridFilter[MaterialClass.STEEL],
              [NavigationLevel.MATERIAL]: JSON.stringify(filterModel),
            },
          },
        },
      });
    });

    it('should set string value of empty filterModel for given navigation if it is not defined', () => {
      const action = DataActions.setAgGridFilterForNavigation({
        filterModel: undefined,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });
      const newState = dataReducer(
        {
          ...state,
          filter: {
            ...state.filter,
            agGridFilter: {
              ...state.filter.agGridFilter,
              [MaterialClass.STEEL]: {
                ...state.filter.agGridFilter[MaterialClass.STEEL],
                [NavigationLevel.MATERIAL]: '{ "something": "something" }',
              },
            },
          },
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        filter: {
          ...initialState.filter,
          agGridFilter: {
            ...initialState.filter.agGridFilter,
            [MaterialClass.STEEL]: {
              ...initialState.filter.agGridFilter[MaterialClass.STEEL],
              [NavigationLevel.MATERIAL]: JSON.stringify({}),
            },
          },
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
          result: {
            st: {},
            al: {},
            px: {},
          },
        },
        action
      );

      expect(newState).toEqual({
        ...state,
        result: {},
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
