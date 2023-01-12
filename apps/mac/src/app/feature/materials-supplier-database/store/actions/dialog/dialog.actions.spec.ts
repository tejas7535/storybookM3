import {
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  ManufacturerSupplierV2,
  Material,
  MaterialFormValue,
  MaterialStandard,
  MaterialStandardV2,
} from '@mac/msd/models';

import {
  addCustomCastingDiameter,
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
  addCustomReferenceDocument,
  addCustomSupplierName,
  addCustomSupplierPlant,
  createMaterialComplete,
  editDialogLoadingComplete,
  editDialogLoadingFailure,
  fetchCastingDiameters,
  fetchCastingDiametersFailure,
  fetchCastingDiametersSuccess,
  fetchCastingModes,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCo2Classifications,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchCo2ValuesForSupplierSteelMakingProcess,
  fetchCo2ValuesForSupplierSteelMakingProcessFailure,
  fetchCo2ValuesForSupplierSteelMakingProcessSuccess,
  fetchEditMaterialNameData,
  fetchEditMaterialNameDataFailure,
  fetchEditMaterialNameDataSuccess,
  fetchEditMaterialSuppliers,
  fetchEditMaterialSuppliersFailure,
  fetchEditMaterialSuppliersSuccess,
  fetchEditStandardDocumentData,
  fetchEditStandardDocumentDataFailure,
  fetchEditStandardDocumentDataSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchProductCategories,
  fetchProductCategoriesFailure,
  fetchProductCategoriesSuccess,
  fetchRatings,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchReferenceDocuments,
  fetchReferenceDocumentsFailure,
  fetchReferenceDocumentsSuccess,
  fetchSteelMakingProcesses,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesInUse,
  fetchSteelMakingProcessesInUseFailure,
  fetchSteelMakingProcessesInUseSuccess,
  fetchSteelMakingProcessesSuccess,
  manufacturerSupplierDialogCanceled,
  manufacturerSupplierDialogConfirmed,
  manufacturerSupplierDialogOpened,
  materialDialogCanceled,
  materialDialogConfirmed,
  materialDialogOpened,
  materialstandardDialogCanceled,
  materialstandardDialogConfirmed,
  materialstandardDialogOpened,
  minimizeDialog,
  openDialog,
  openEditDialog,
  parseMaterialFormValue,
  postManufacturerSupplier,
  postMaterial,
  postMaterialStandard,
  resetCo2ValuesForSupplierSteelMakingProcess,
  resetDialogOptions,
  resetMaterialRecord,
  resetSteelMakingProcessInUse,
  setMaterialFormValue,
} from './dialog.actions';

describe('Dialog Actions', () => {
  describe('Material Dialog Opened', () => {
    it('materialDialogOpened', () => {
      const action = materialDialogOpened();

      expect(action).toEqual({
        type: '[MSD - Dialog] Material Dialog Opened',
      });
    });
    it('materialstandardDialogOpened', () => {
      const action = materialstandardDialogOpened();

      expect(action).toEqual({
        type: '[MSD - Dialog] MaterialStandard Dialog Opened',
      });
    });
    it('manufacturerSupplierDialogOpened', () => {
      const action = manufacturerSupplierDialogOpened();

      expect(action).toEqual({
        type: '[MSD - Dialog] ManufacturerSupplier Dialog Opened',
      });
    });
  });

  describe('Add Material Dialog Canceled', () => {
    it('materialDialogCanceled', () => {
      const action = materialDialogCanceled();

      expect(action).toEqual({
        type: '[MSD - Dialog] Material Dialog Canceled',
      });
    });
    it('materialstandardDialogCanceled', () => {
      const action = materialstandardDialogCanceled();

      expect(action).toEqual({
        type: '[MSD - Dialog] MaterialStandard Dialog Canceled',
      });
    });
    it('manufacturerSupplierDialogCanceled', () => {
      const action = manufacturerSupplierDialogCanceled();

      expect(action).toEqual({
        type: '[MSD - Dialog] ManufacturerSupplier Dialog Canceled',
      });
    });
  });

  describe('Add Material Confirmed', () => {
    it('materialDialogConfirmed', () => {
      const mockMaterial = {} as Material;
      const mockStandard = {} as MaterialStandard;
      const mockSupplier = {} as ManufacturerSupplier;
      const action = materialDialogConfirmed({
        material: mockMaterial,
        standard: mockStandard,
        supplier: mockSupplier,
      });

      expect(action).toEqual({
        material: mockMaterial,
        standard: mockStandard,
        supplier: mockSupplier,
        type: '[MSD - Dialog] Material Confirmed',
      });
    });
    it('materialstandardDialogConfirmed', () => {
      const mockStandard = {} as MaterialStandard;
      const action = materialstandardDialogConfirmed({
        standard: mockStandard,
      });

      expect(action).toEqual({
        standard: mockStandard,
        type: '[MSD - Dialog] MaterialStandard Confirmed',
      });
    });
    it('manufacturerSupplierDialogConfirmed', () => {
      const mockSupplier = {} as ManufacturerSupplier;
      const action = manufacturerSupplierDialogConfirmed({
        supplier: mockSupplier,
      });

      expect(action).toEqual({
        supplier: mockSupplier,
        type: '[MSD - Dialog] ManufacturerSupplier Confirmed',
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
      const mockMaterialStandards = [{} as MaterialStandardV2];
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
      const mockManufacturerSuppliers = [{} as ManufacturerSupplierV2];
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
      const mockRecord = {} as CreateMaterialRecord;
      const action = createMaterialComplete({ record: mockRecord });

      expect(action).toEqual({
        type: '[MSD - Dialog] Create Material Complete',
        record: mockRecord,
      });
    });
  });

  describe('reset Material Dialog', () => {
    it('reset material record', () => {
      const action = resetMaterialRecord({ closeDialog: true });

      expect(action).toEqual({
        type: '[MSD - Dialog] Reset Material Record',
        closeDialog: true,
      });
    });
    it('reset dialog options', () => {
      const action = resetDialogOptions();

      expect(action).toEqual({
        type: '[MSD - Dialog] Reset Dialog Options',
      });
    });
  });

  describe('Fetch Product Categories', () => {
    it('fetchProductCategories', () => {
      const action = fetchProductCategories();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Product Categories',
      });
    });
  });

  describe('Fetch Product Categories Success', () => {
    it('fetchProductCategoriesSuccess', () => {
      const action = fetchProductCategoriesSuccess({ productCategories: [] });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Product Categories Success',
        productCategories: [],
      });
    });
  });

  describe('Fetch Product Categories Failure', () => {
    it('fetchProductCategories', () => {
      const action = fetchProductCategoriesFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Product Categories Failure',
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

  describe('Fetch Reference Documents', () => {
    it('fetchReferenceDocuments', () => {
      const action = fetchReferenceDocuments({
        materialStandardId: 1,
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Reference Documents',
        materialStandardId: 1,
      });
    });
  });

  describe('Fetch Reference Documents Success', () => {
    it('fetchReferenceDocumentsSuccess', () => {
      const mockReferenceDocuments = ['doc'];
      const action = fetchReferenceDocumentsSuccess({
        referenceDocuments: mockReferenceDocuments,
      });

      expect(action).toEqual({
        referenceDocuments: mockReferenceDocuments,
        type: '[MSD - Dialog] Fetch Reference Documents Success',
      });
    });
  });

  describe('Fetch Reference Documents Failure', () => {
    it('fetchReferenceDocumentsFailure', () => {
      const action = fetchReferenceDocumentsFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Reference Documents Failure',
      });
    });
  });

  describe('Add Custom Casting Diameter', () => {
    it('addCustomCastingDiameter', () => {
      const action = addCustomCastingDiameter({ castingDiameter: '200x200' });

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Custom Casting Diameter',
        castingDiameter: '200x200',
      });
    });
  });

  describe('Add Custom Reference Document', () => {
    it('addCustomReferenceDocument', () => {
      const action = addCustomReferenceDocument({
        referenceDocument: 'document',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Custom Reference Document',
        referenceDocument: 'document',
      });
    });
  });

  describe('Add Custom Material standard', () => {
    it('Standard Document', () => {
      const action = addCustomMaterialStandardDocument({
        standardDocument: 'doc',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Custom Material Standard Document',
        standardDocument: 'doc',
      });
    });

    it('material name', () => {
      const action = addCustomMaterialStandardName({ materialName: 'name' });

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Custom Material Standard Name',
        materialName: 'name',
      });
    });
  });

  describe('Add Custom Supplier', () => {
    it('Name', () => {
      const action = addCustomSupplierName({
        supplierName: 'name',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Custom Supplier Name',
        supplierName: 'name',
      });
    });

    it('Plant', () => {
      const action = addCustomSupplierPlant({ supplierPlant: 'plant' });

      expect(action).toEqual({
        type: '[MSD - Dialog] Add Custom Supplier Plant',
        supplierPlant: 'plant',
      });
    });
  });

  describe('Post Material', () => {
    it('MaterialName', () => {
      const record = {} as CreateMaterialRecord;
      const action = postMaterial({ record });

      expect(action).toEqual({
        type: '[MSD - Dialog] Post Material',
        record,
      });
    });

    it('Material standard', () => {
      const record = {} as CreateMaterialRecord;
      const action = postMaterialStandard({ record });

      expect(action).toEqual({
        type: '[MSD - Dialog] Post Material standard',
        record,
      });
    });

    it('Manufacturer Supplier', () => {
      const record = {} as CreateMaterialRecord;
      const action = postManufacturerSupplier({ record });

      expect(action).toEqual({
        type: '[MSD - Dialog] Post Manufacturer Supplier',
        record,
      });
    });
  });

  describe('Open Edit Dialog', () => {
    it('openEditDialog', () => {
      const mockMaterial = {} as DataResult;
      const action = openEditDialog({
        row: mockMaterial,
        column: 'column',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Open Edit Dialog',
        row: mockMaterial,
        column: 'column',
      });
    });
  });

  describe('Fetch Edit Standard Document Data', () => {
    it('fetchEditStandardDocumentData', () => {
      const action = fetchEditStandardDocumentData({
        standardDocument: 'document',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Standard Document Data',
        standardDocument: 'document',
      });
    });
  });

  describe('Fetch Edit Standard Document Data Success', () => {
    it('fetchEditStandardDocumentDataSuccess', () => {
      const action = fetchEditStandardDocumentDataSuccess({
        materialNames: [{ id: 1, materialName: 'material' }],
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Standard Document Data Success',
        materialNames: [{ id: 1, materialName: 'material' }],
      });
    });
  });

  describe('Fetch Edit Standard Document Data Failure', () => {
    it('fetchEditStandardDocumentDataFailure', () => {
      const action = fetchEditStandardDocumentDataFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Standard Document Data Failure',
      });
    });
  });

  describe('Fetch Edit Material Name Data', () => {
    it('fetchEditMaterialNameData', () => {
      const action = fetchEditMaterialNameData({ materialName: 'material' });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Material Name Data',
        materialName: 'material',
      });
    });
  });

  describe('Fetch Edit Material Name Data Success', () => {
    it('fetchEditMaterialNameDataSuccess', () => {
      const action = fetchEditMaterialNameDataSuccess({
        standardDocuments: [{ id: 1, standardDocument: 'document' }],
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Material Name Data Success',
        standardDocuments: [{ id: 1, standardDocument: 'document' }],
      });
    });
  });

  describe('Fetch Edit Material Name Data Failure', () => {
    it('fetchEditMaterialNameDataFailure', () => {
      const action = fetchEditMaterialNameDataFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Material Name Data Failure',
      });
    });
  });

  describe('Fetch Edit Suppliers Data', () => {
    it('fetchEditMaterialSuppliersData', () => {
      const action = fetchEditMaterialSuppliers({ supplierName: 'supplier' });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Material Suppliers',
        supplierName: 'supplier',
      });
    });
  });

  describe('Fetch Edit Suppliers Success', () => {
    it('fetchEditMaterialSuppliersSuccess', () => {
      const action = fetchEditMaterialSuppliersSuccess({ supplierIds: [1, 2] });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Material Suppliers Success',
        supplierIds: [1, 2],
      });
    });
  });

  describe('Fetch Edit Suppliers Failure', () => {
    it('fetchEditMaterialSuppliersFailure', () => {
      const action = fetchEditMaterialSuppliersFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Edit Material Suppliers Failure',
      });
    });
  });

  describe('Edit Dialog Loading Failure', () => {
    it('editDialogLoadingFailure', () => {
      const action = editDialogLoadingFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Edit Dialog Loading Failure',
      });
    });
  });

  describe('Edit Dialog Loading Complete', () => {
    it('editDialogLoadingComplete', () => {
      const action = editDialogLoadingComplete();

      expect(action).toEqual({
        type: '[MSD - Dialog] Edit Dialog Loading Complete',
      });
    });
  });

  describe('Parse Material Form Value', () => {
    it('parseMaterialFormValue', () => {
      const action = parseMaterialFormValue();

      expect(action).toEqual({
        type: '[MSD - Dialog] Parse Material Form Value',
      });
    });
  });

  describe('Set Material Form Value', () => {
    it('setMaterialFormValue', () => {
      const action = setMaterialFormValue({
        parsedMaterial: {} as MaterialFormValue,
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Set Material Form Value',
        parsedMaterial: {} as MaterialFormValue,
      });
    });
  });

  describe('Minimize Dialog', () => {
    it('minimizeDialog', () => {
      const action = minimizeDialog({
        id: 1,
        value: {} as MaterialFormValue,
        isCopy: false,
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Minimize Dialog',
        id: 1,
        value: {} as MaterialFormValue,
        isCopy: false,
      });
    });
  });

  describe('Fetch Steel Making Processes In Use', () => {
    it('fetchSteelMakingPcessesInUse', () => {
      const action = fetchSteelMakingProcessesInUse({
        supplierId: 1,
        castingMode: 'ESR',
        castingDiameter: '1x1',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Steel Making Processes In Use',
        supplierId: 1,
        castingMode: 'ESR',
        castingDiameter: '1x1',
      });
    });
  });

  describe('Fetch Steel Making Processes In Use Success', () => {
    it('fetchSteelMakingPcessesInUseSuccess', () => {
      const action = fetchSteelMakingProcessesInUseSuccess({
        steelMakingProcessesInUse: ['BF+BOF'],
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Steel Making Processes In Use Success',
        steelMakingProcessesInUse: ['BF+BOF'],
      });
    });
  });

  describe('Fetch Steel Making Processes In Use Failure', () => {
    it('fetchSteelMakingPcessesInUseFailure', () => {
      const action = fetchSteelMakingProcessesInUseFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch Steel Making Processes In Use Failure',
      });
    });
  });

  describe('Reset Fetch Steel Making Processes In Use', () => {
    it('resetSteelMakingPcessesInUse', () => {
      const action = resetSteelMakingProcessInUse();

      expect(action).toEqual({
        type: '[MSD - Dialog] Reset Steel Making Processes In Use',
      });
    });
  });

  describe('Fetch CO2 Values For Supplier Steel Making Process', () => {
    it('fetchCo2ValuesForSupplierSteelMakingProcess', () => {
      const action = fetchCo2ValuesForSupplierSteelMakingProcess({
        supplierId: 1,
        steelMakingProcess: 'BF+BOF',
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch CO2 Values For Supplier Steel Making Process',
        supplierId: 1,
        steelMakingProcess: 'BF+BOF',
      });
    });
  });

  describe('Fetch CO2 Values For Supplier Steel Making Process Success', () => {
    it('fetchCo2ValuesForSupplierSteelMakingProcessSuccess', () => {
      const action = fetchCo2ValuesForSupplierSteelMakingProcessSuccess({
        co2Values: [
          {
            co2PerTon: 3,
            co2Scope1: 1,
            co2Scope2: 1,
            co2Scope3: 1,
            co2Classification: 'c1',
          },
        ],
      });

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch CO2 Values For Supplier Steel Making Process Success',
        co2Values: [
          {
            co2PerTon: 3,
            co2Scope1: 1,
            co2Scope2: 1,
            co2Scope3: 1,
            co2Classification: 'c1',
          },
        ],
      });
    });
  });

  describe('Fetch CO2 Values For Supplier Steel Making Process Failure', () => {
    it('fetchCo2ValuesForSupplierSteelMakingProcessFailure', () => {
      const action = fetchCo2ValuesForSupplierSteelMakingProcessFailure();

      expect(action).toEqual({
        type: '[MSD - Dialog] Fetch CO2 Values For Supplier Steel Making Process Failure',
      });
    });
  });
  describe('Reset CO2 Values For Supplier Steel Making Process', () => {
    it('resetCo2ValuesForSupplierSteelMakingProcess', () => {
      const action = resetCo2ValuesForSupplierSteelMakingProcess();

      expect(action).toEqual({
        type: '[MSD - Dialog] Reset CO2 Values For Supplier Steel Making Process',
      });
    });
  });

  describe('Open Dialog', () => {
    it('openDialog', () => {
      const action = openDialog();

      expect(action).toEqual({
        type: '[MSD - Dialog] Open Dialog',
      });
    });
  });
});
