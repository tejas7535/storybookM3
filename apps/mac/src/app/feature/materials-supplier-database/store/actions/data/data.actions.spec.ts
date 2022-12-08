import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  MaterialStandardTableValue,
} from '@mac/msd/models';

import {
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
  fetchResult,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
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
  describe('Fetch Materials Failure', () => {
    it('fetchMaterialsSuccess', () => {
      const action = fetchMaterialsFailure();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Materials Failure',
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
});
