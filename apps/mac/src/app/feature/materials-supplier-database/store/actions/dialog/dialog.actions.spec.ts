import {
  ManufacturerSupplier,
  Material,
  MaterialStandard,
} from '@mac/msd/models';

import {
  addCustomCastingDiameter,
  addMaterialDialogCanceled,
  addMaterialDialogConfirmed,
  addMaterialDialogOpened,
  createMaterialComplete,
  createMaterialFailure,
  fetchCastingDiameters,
  fetchCastingDiametersFailure,
  fetchCastingDiametersSuccess,
  fetchCastingModes,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCo2Classifications,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchRatings,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchSteelMakingProcesses,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesSuccess,
} from './dialog.actions';

describe('Dialog Actions', () => {
  describe('Add Material Dialog Opened', () => {
    it('addMaterialDialogOpened', () => {
      const action = addMaterialDialogOpened();

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Material Dialog Opened',
      });
    });
  });

  describe('Add Material Dialog Canceled', () => {
    it('addMaterialDialogOpened', () => {
      const action = addMaterialDialogCanceled();

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Material Dialog Canceled',
      });
    });
  });

  describe('Add Material Confirmed', () => {
    it('addMaterialDialogConfirmed', () => {
      const mockMaterial = {} as Material;
      const action = addMaterialDialogConfirmed({ material: mockMaterial });

      expect(action).toEqual({
        material: mockMaterial,
        type: '[MSD - Dialog] Add Material Confirmed',
      });
    });
  });

  describe('Fetch Material Standards', () => {
    it('fetchMaterialStandards', () => {
      const action = fetchMaterialStandards();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Material Standards',
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
        type: '[MSD - Dialog] Fetch Material Standards Success',
      });
    });
  });

  describe('Fetch Material Standards Failure', () => {
    it('fetchMaterialStandardsFailure', () => {
      const action = fetchMaterialStandardsFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Material Standards Failure',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers', () => {
    it('fetchManufacturerSuppliers', () => {
      const action = fetchManufacturerSuppliers();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Manufacturer Suppliers',
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
        type: '[MSD - Dialog] Fetch Manufacturer Suppliers Success',
      });
    });
  });

  describe('Fetch Manufacturer Suppliers Failure', () => {
    it('fetchManufacturerSuppliersFailure', () => {
      const action = fetchManufacturerSuppliersFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Manufacturer Suppliers Failure',
      });
    });
  });

  describe('Fetch Ratings', () => {
    it('fetchRatings', () => {
      const action = fetchRatings();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Ratings',
      });
    });
  });

  describe('Fetch Ratings Success', () => {
    it('fetchManufacturerSuppliersSuccess', () => {
      const mockRatings = ['1', '2'];
      const action = fetchRatingsSuccess({ ratings: mockRatings });

      expect(action).toEqual({
        ratings: mockRatings,
        type: '[MSD - Dialog] Fetch Ratings Success',
      });
    });
  });

  describe('Fetch Ratings Failure', () => {
    it('fetchRatingsFailure', () => {
      const action = fetchRatingsFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Ratings Failure',
      });
    });
  });

  describe('Fetch CO2 Classifications', () => {
    it('fetchCo2Classifications', () => {
      const action = fetchCo2Classifications();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch CO2 Classifications',
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
        type: '[MSD - Dialog] Fetch CO2 Classifications Success',
      });
    });
  });

  describe('Fetch CO2 Classifications Failure', () => {
    it('fetchCo2ClassificationsFailure', () => {
      const action = fetchCo2ClassificationsFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch CO2 Classifications Failure',
      });
    });
  });

  describe('Fetch Steel Making Processes', () => {
    it('fetchSteelMakingProcesses', () => {
      const action = fetchSteelMakingProcesses();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Steel Making Processes',
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
        type: '[MSD - Dialog] Fetch Steel Making Processes Success',
      });
    });
  });

  describe('Fetch Steel Making Processes Failure', () => {
    it('fetchCo2ClassificationsFailure', () => {
      const action = fetchSteelMakingProcessesFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Steel Making Processes Failure',
      });
    });
  });

  describe('Fetch Casting Modes', () => {
    it('fetchCastingModes', () => {
      const action = fetchCastingModes();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Casting Modes',
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
        type: '[MSD - Dialog] Fetch Casting Modes Success',
      });
    });
  });

  describe('Fetch Casting Modes Failure', () => {
    it('fetchCastingModesFailure', () => {
      const action = fetchCastingModesFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Casting Modes Failure',
      });
    });
  });

  describe('Create Material Success', () => {
    it('createMaterialSuccess', () => {
      const action = createMaterialComplete({ success: true });

      expect(action).toEqual({
        type: '[MSD - Dialog] Create Material Complete',
        success: true,
      });
    });
  });

  describe('Create Material Failure', () => {
    it('createMaterialFailure', () => {
      const action = createMaterialFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Create Material Failure',
      });
    });
  });

  describe('Fetch Casting Diameters', () => {
    it('fetchCastingDiameters', () => {
      const action = fetchCastingDiameters({
        supplierId: 1,
        castingMode: 'ingot',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Casting Diameters',
        supplierId: 1,
        castingMode: 'ingot',
      });
    });
  });

  describe('Fetch Casting Diameters Success', () => {
    it('fetchCastingDiametersSuccess', () => {
      const mockCastingDiameters = ['200x200'];
      const action = fetchCastingDiametersSuccess({
        castingDiameters: mockCastingDiameters,
      });

      expect(action).toEqual({
        castingDiameters: mockCastingDiameters,
        type: '[MSD - Dialog] Fetch Casting Diameters Success',
      });
    });
  });

  describe('Fetch Casting Diameters Failure', () => {
    it('fetchCastingDiametersFailure', () => {
      const action = fetchCastingDiametersFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Casting Diameters Failure',
      });
    });
  });

  describe('Add Custom Casting Diameter', () => {
    it('addCustomCastingDiameter', () => {
      const action = addCustomCastingDiameter({ castingDiameter: '200x200' });

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Custom Casting DIameter',
        castingDiameter: '200x200',
      });
    });
  });
});
