import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  MaterialStandardTableValue,
  ProductCategoryRuleTableValue,
  SAPMaterialsRequest,
} from '@mac/msd/models';

import {
  errorSnackBar,
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchProductCategoryRules,
  fetchProductCategoryRulesFailure,
  fetchProductCategoryRulesSuccess,
  fetchResult,
  fetchSAPMaterials,
  fetchSAPMaterialsFailure,
  fetchSAPMaterialsSuccess,
  infoSnackBar,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setAgGridFilterForNavigation,
  setNavigation,
} from './data.actions';

describe('Data Actions', () => {
  describe('Set Navigation', () => {
    it('setNavigation', () => {
      const action = setNavigation({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });

      expect(action).toEqual({
        type: '[MSD - Data] Set Navigation',
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });
    });
  });

  describe('Fetch Material Classes', () => {
    it('fetchClassOptions', () => {
      const action = fetchClassOptions();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Material Classes',
      });
    });
  });

  describe('Fetch Material Classes Success', () => {
    it('fetchClassOptionsSuccess', () => {
      const action = fetchClassOptionsSuccess({ materialClasses: [] });

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Class Options Success',
        materialClasses: [],
      });
    });
  });

  describe('Fetch Material Classes Failure', () => {
    it('fetchClassOptionsFailure', () => {
      const action = fetchClassOptionsFailure();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Class Options Failure',
      });
    });
  });

  describe('Fetch Result', () => {
    it('fetchResult', () => {
      const action = fetchResult();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Result',
      });
    });
  });

  describe('Fetch Materials', () => {
    it('fetchMaterials', () => {
      const action = fetchMaterials();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Materials',
      });
    });
  });

  describe('Fetch SAP Materials', () => {
    it('fetchSAPMaterials', () => {
      const action = fetchSAPMaterials({ request: {} as SAPMaterialsRequest });

      expect(action).toEqual({
        type: '[MSD - Data] Fetch SAP Materials',
        request: {} as SAPMaterialsRequest,
      });
    });
  });
  describe('Fetch Materials Success', () => {
    it('fetchMaterialsSuccess', () => {
      const result: DataResult[] = [{} as DataResult];
      const action = fetchMaterialsSuccess({ result });

      expect(action).toEqual({
        materialClass: undefined,
        result,
        type: '[MSD - Data] Fetch Materials Success',
      });
    });

    it('fetchMaterialsSuccess with materialClass', () => {
      const result: DataResult[] = [{} as DataResult];
      const action = fetchMaterialsSuccess({
        materialClass: MaterialClass.ALUMINUM,
        result,
      });

      expect(action).toEqual({
        materialClass: MaterialClass.ALUMINUM,
        result,
        type: '[MSD - Data] Fetch Materials Success',
      });
    });
  });

  describe('Fetch SAP Materials Success', () => {
    it('fetchSAPMaterials', () => {
      const action = fetchSAPMaterialsSuccess({
        data: [],
        lastRow: -1,
        totalRows: 300,
        subTotalRows: 100,
        startRow: 0,
      });

      expect(action).toEqual({
        type: '[MSD - Data] Fetch SAP Materials Success',
        data: [],
        lastRow: -1,
        totalRows: 300,
        subTotalRows: 100,
        startRow: 0,
      });
    });
  });
  describe('Fetch Materials Failure', () => {
    it('fetchMaterialsSuccess', () => {
      const action = fetchMaterialsFailure();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Materials Failure',
      });
    });
  });
  describe('Fetch SAP Materials Failure', () => {
    it('fetchSAPMaterialsSuccess', () => {
      const action = fetchSAPMaterialsFailure({ startRow: 0 });

      expect(action).toEqual({
        type: '[MSD - Data] Fetch SAP Materials Failure',
        startRow: 0,
      });
    });
  });
  describe('Set AgGrid Filter', () => {
    it('setAgGridFilter', () => {
      const action = setAgGridFilter({ filterModel: {} });

      expect(action).toEqual({
        filterModel: {},
        type: '[MSD - Data] Set AgGrid Filter',
      });
    });
  });
  describe('Set AgGrid Filter For Navigation', () => {
    it('setAgGridFilter', () => {
      const action = setAgGridFilterForNavigation({
        filterModel: {},
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });

      expect(action).toEqual({
        filterModel: {},
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        type: '[MSD - Data] Set AgGrid Filter For Navigation',
      });
    });
  });
  describe('Reset Result', () => {
    it('resetResult', () => {
      const action = resetResult();

      expect(action).toEqual({
        type: '[MSD - Data] Reset Result',
      });
    });
  });

  describe('Set Ag Grid Columns', () => {
    it('setAgGridColumns', () => {
      const action = setAgGridColumns({ agGridColumns: 'columns' });

      expect(action).toEqual({
        agGridColumns: 'columns',
        type: '[MSD - Data] Set Ag Grid Columns',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers', () => {
    it('fetchManufacturerSuppliers', () => {
      const action = fetchManufacturerSuppliers();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Manufacturer Suppliers',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers Success', () => {
    it('fetchManufacturerSuppliersSuccess', () => {
      const mockManufacturerSuppliers = [{} as ManufacturerSupplierTableValue];
      const action = fetchManufacturerSuppliersSuccess({
        materialClass: MaterialClass.STEEL,
        manufacturerSuppliers: mockManufacturerSuppliers,
      });

      expect(action).toEqual({
        materialClass: MaterialClass.STEEL,
        manufacturerSuppliers: mockManufacturerSuppliers,
        type: '[MSD - Data] Fetch Manufacturer Suppliers Success',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers Failure', () => {
    it('fetchManufacturerSuppliersFailure', () => {
      const action = fetchManufacturerSuppliersFailure();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Manufacturer Suppliers Failure',
      });
    });
  });

  describe('Fetch Material Standards', () => {
    it('fetchMaterialStandards', () => {
      const action = fetchMaterialStandards();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Material Standards',
      });
    });
  });

  describe('Fetch Material Standards Success', () => {
    it('fetchMaterialStandardsSuccess', () => {
      const mockMaterialStandards = [{} as MaterialStandardTableValue];
      const action = fetchMaterialStandardsSuccess({
        materialClass: MaterialClass.STEEL,
        materialStandards: mockMaterialStandards,
      });

      expect(action).toEqual({
        materialClass: MaterialClass.STEEL,
        materialStandards: mockMaterialStandards,
        type: '[MSD - Data] Fetch Material Standards Success',
      });
    });
  });

  describe('Fetch Material Standards Failure', () => {
    it('fetchMaterialStandardsFailure', () => {
      const action = fetchMaterialStandardsFailure();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Material Standards Failure',
      });
    });
  });
  describe('Fetch Product Category Rules', () => {
    it('fetchProductCategoryRules', () => {
      const action = fetchProductCategoryRules();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Product Category Rules',
      });
    });
  });

  describe('Fetch Product Category Rules Success', () => {
    it('fetchProductCategoryRulesSuccess', () => {
      const mockProductCategoryRules = [{} as ProductCategoryRuleTableValue];
      const action = fetchProductCategoryRulesSuccess({
        materialClass: MaterialClass.STEEL,
        productCategoryRules: mockProductCategoryRules,
      });

      expect(action).toEqual({
        materialClass: MaterialClass.STEEL,
        productCategoryRules: mockProductCategoryRules,
        type: '[MSD - Data] Fetch Product Category Rules Success',
      });
    });
  });

  describe('Fetch Product Category Rules Failure', () => {
    it('fetchProductCategoryRulesFailure', () => {
      const action = fetchProductCategoryRulesFailure();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Product Category Rules Failure',
      });
    });
  });

  describe('Open snack bar', () => {
    it('infoSnackBar', () => {
      const action = infoSnackBar({ message: 'test' });

      expect(action).toEqual({
        message: 'test',
        type: '[MSD - Data] info snackbar',
      });
    });
    it('errorSnackBar', () => {
      const action = errorSnackBar({ message: 'test' });

      expect(action).toEqual({
        message: 'test',
        type: '[MSD - Data] error snackbar',
      });
    });
  });
});
