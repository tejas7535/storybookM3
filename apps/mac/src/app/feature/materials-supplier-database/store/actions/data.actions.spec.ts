import { StringOption } from '@schaeffler/inputs';

import { DataResult, Material, MaterialStandard } from '../../models';
import { ManufacturerSupplier } from './../../models/data/manufacturer-supplier.model';
import {
  addMaterialDialogCanceled,
  addMaterialDialogConfirmed,
  addMaterialDialogOpened,
  createMaterialComplete,
  createMaterialFailure,
  fetchCastingModes,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCo2Classifications,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchRatings,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchSteelMakingProcesses,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setFilter,
} from './data.actions';

describe('Data Actions', () => {
  describe('Set Filter', () => {
    it('setFilter', () => {
      const materialClass: StringOption = {
        id: 'id',
        title: 'very classy material',
      };
      const productCategory: StringOption[] = [
        {
          id: 'id',
          title: 'category a',
        },
      ];
      const action = setFilter({ materialClass, productCategory });

      expect(action).toEqual({
        materialClass,
        productCategory,
        type: '[MSD - Data] Set Filter',
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

  describe('Add Material Dialog Opened', () => {
    it('addMaterialDialogOpened', () => {
      const action = addMaterialDialogOpened();

      expect(action).toEqual({
        type: '[MSD - Add Material] Add Material Dialog Opened',
      });
    });
  });

  describe('Add Material Dialog Canceled', () => {
    it('addMaterialDialogOpened', () => {
      const action = addMaterialDialogCanceled();

      expect(action).toEqual({
        type: '[MSD - Add Material] Add Material Dialog Canceled',
      });
    });
  });

  describe('Add Material Confirmed', () => {
    it('addMaterialDialogConfirmed', () => {
      const mockMaterial = {} as Material;
      const action = addMaterialDialogConfirmed({ material: mockMaterial });

      expect(action).toEqual({
        material: mockMaterial,
        type: '[MSD - Add Material] Add Material Confirmed',
      });
    });
  });

  describe('Fetch Material Standards', () => {
    it('fetchMaterialStandards', () => {
      const action = fetchMaterialStandards();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Material Standards',
      });
    });
  });

  describe('Fetch Material Standards Success', () => {
    it('fetchMaterialStandardsSuccess', () => {
      const mockMaterialStandards = [{} as MaterialStandard];
      const action = fetchMaterialStandardsSuccess({
        materialStandards: mockMaterialStandards,
      });

      expect(action).toEqual({
        materialStandards: mockMaterialStandards,
        type: '[MSD - Add Material] Fetch Material Standards Success',
      });
    });
  });

  describe('Fetch Material Standards Failure', () => {
    it('fetchMaterialStandardsFailure', () => {
      const action = fetchMaterialStandardsFailure();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Material Standards Failure',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers', () => {
    it('fetchManufacturerSuppliers', () => {
      const action = fetchManufacturerSuppliers();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Manufacturer Suppliers',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers Success', () => {
    it('fetchManufacturerSuppliersSuccess', () => {
      const mockManufacturerSuppliers = [{} as ManufacturerSupplier];
      const action = fetchManufacturerSuppliersSuccess({
        manufacturerSuppliers: mockManufacturerSuppliers,
      });

      expect(action).toEqual({
        manufacturerSuppliers: mockManufacturerSuppliers,
        type: '[MSD - Add Material] Fetch Manufacturer Suppliers Success',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers Failure', () => {
    it('fetchManufacturerSuppliersFailure', () => {
      const action = fetchManufacturerSuppliersFailure();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Manufacturer Suppliers Failure',
      });
    });
  });

  describe('Fetch Ratings', () => {
    it('fetchRatings', () => {
      const action = fetchRatings();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Ratings',
      });
    });
  });

  describe('Fetch Ratings Success', () => {
    it('fetchManufacturerSuppliersSuccess', () => {
      const mockRatings = ['1', '2'];
      const action = fetchRatingsSuccess({ ratings: mockRatings });

      expect(action).toEqual({
        ratings: mockRatings,
        type: '[MSD - Add Material] Fetch Ratings Success',
      });
    });
  });

  describe('Fetch Ratings Failure', () => {
    it('fetchRatingsFailure', () => {
      const action = fetchRatingsFailure();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Ratings Failure',
      });
    });
  });

  describe('Fetch CO2 Classifications', () => {
    it('fetchCo2Classifications', () => {
      const action = fetchCo2Classifications();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch CO2 Classifications',
      });
    });
  });

  describe('Fetch CO2 Classifications Success', () => {
    it('fetchCo2ClassificationsSuccess', () => {
      const mockCo2Classifications = [
        { id: 'c1', title: '1' },
        { id: 'c2', title: '2' },
      ];
      const action = fetchCo2ClassificationsSuccess({
        co2Classifications: mockCo2Classifications,
      });

      expect(action).toEqual({
        co2Classifications: mockCo2Classifications,
        type: '[MSD - Add Material] Fetch CO2 Classifications Success',
      });
    });
  });

  describe('Fetch CO2 Classifications Failure', () => {
    it('fetchCo2ClassificationsFailure', () => {
      const action = fetchCo2ClassificationsFailure();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch CO2 Classifications Failure',
      });
    });
  });

  describe('Fetch Steel Making Processes', () => {
    it('fetchSteelMakingProcesses', () => {
      const action = fetchSteelMakingProcesses();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Steel Making Processes',
      });
    });
  });

  describe('Fetch Steel Making Processes Success', () => {
    it('fetchSteelMakingProcessesSuccess', () => {
      const mockSteelMakingProcesses = ['1', '2'];
      const action = fetchSteelMakingProcessesSuccess({
        steelMakingProcesses: mockSteelMakingProcesses,
      });

      expect(action).toEqual({
        steelMakingProcesses: mockSteelMakingProcesses,
        type: '[MSD - Add Material] Fetch Steel Making Processes Success',
      });
    });
  });

  describe('Fetch Steel Making Processes Failure', () => {
    it('fetchCo2ClassificationsFailure', () => {
      const action = fetchSteelMakingProcessesFailure();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Steel Making Processes Failure',
      });
    });
  });

  describe('Fetch Casting Modes', () => {
    it('fetchCastingModes', () => {
      const action = fetchCastingModes();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Casting Modes',
      });
    });
  });

  describe('Fetch Casting Modes Success', () => {
    it('fetchCastingModesSuccess', () => {
      const mockCastingModes = ['1', '2'];
      const action = fetchCastingModesSuccess({
        castingModes: mockCastingModes,
      });

      expect(action).toEqual({
        castingModes: mockCastingModes,
        type: '[MSD - Add Material] Fetch Casting Modes Success',
      });
    });
  });

  describe('Fetch Casting Modes Failure', () => {
    it('fetchCastingModesFailure', () => {
      const action = fetchCastingModesFailure();

      expect(action).toEqual({
        type: '[MSD - Add Material] Fetch Casting Modes Failure',
      });
    });
  });

  describe('Create Material Success', () => {
    it('createMaterialSuccess', () => {
      const action = createMaterialComplete({ success: true });

      expect(action).toEqual({
        type: '[MSD - Add Material] Create Material Complete',
        success: true,
      });
    });
  });

  describe('Create Material Failure', () => {
    it('createMaterialFailure', () => {
      const action = createMaterialFailure();

      expect(action).toEqual({
        type: '[MSD - Add Material] Create Material Failure',
      });
    });
  });
});
