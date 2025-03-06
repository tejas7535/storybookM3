import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { of } from 'rxjs';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  MockComponent,
  MockDirective,
  MockModule,
  MockPipe,
  MockProvider,
} from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  ManufacturerSupplier,
  ManufacturerSupplierFormValue,
  SteelMaterialFormValue,
} from '@mac/feature/materials-supplier-database/models';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import { createMaterialFormValue } from '@mac/testing/mocks/msd/material-generator.mock';
import { assignDialogValues } from '@mac/testing/mocks/msd/mock-input-dialog-values.mocks';

import * as en from '../../../../../../../assets/i18n/en.json';
import { ManufacturerSupplierComponent } from '../components/manufacturer-supplier/manufacturer-supplier.component';
import { DialogControlsService } from '../services';
import { ManufacturerSupplierInputDialogComponent } from './manufacturersupplier-input-dialog.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

@Injectable()
class MockDialogFacade extends DialogFacade {
  manufacturerSupplierDialogOpened = jest.fn();
  manufacturerSupplierDialogConfirmed = jest.fn();
  addCustomSupplierBusinessPartnerId = jest.fn();
}

jest.mock(
  '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component'
);

describe('ManufacturerSupplierInputDialogComponent', () => {
  let component: ManufacturerSupplierInputDialogComponent;
  let spectator: Spectator<ManufacturerSupplierInputDialogComponent>;
  let dialogFacade: DialogFacade;

  const initialState = {
    msd: {
      data: {
        ...initialDataState,
        navigation: {
          materialClass: MaterialClass.STEEL,
        },
      },
      dialog: {
        ...initialDialogState,
        dialogOptions: {
          ...initialDialogState.dialogOptions,
          materialStandards: mockMaterialStandards,
          materialStandardsLoading: true,
          manufacturerSuppliers: mockSuppliers,
          manufacturerSuppliersLoading: true,
          ratings: ['1'],
          ratingsLoading: true,
          steelMakingProcesses: ['1'],
          steelMakingProcessesLoading: true,
          co2Classifications: ['1'],
          co2ClassificationsLoading: true,
          castingModes: ['1'],
          castingModesLoading: true,
          loading: true,
        },
        createMaterial: {
          ...initialDialogState.createMaterial,
          createMaterialLoading: true,
          createMaterialSuccess: true,
        },
      },
    },
  };
  const matDialogData = { materialClass: MaterialClass.STEEL };

  const createComponent = createComponentFactory({
    component: ManufacturerSupplierInputDialogComponent,
    imports: [
      MockPipe(PushPipe),
      MockModule(FormsModule),
      MockModule(ReactiveFormsModule),
      MockModule(MatFormFieldModule),
      MockComponent(ManufacturerSupplierComponent),
      MockModule(SelectModule),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      MockProvider(DialogControlsService, {
        getControl: jest.fn(() => new FormControl()),
        getRequiredControl: jest.fn(() => new FormControl()),
      }),
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: matDialogData,
      },
      MockProvider(DialogFacade, MockDialogFacade, 'useClass'),
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    assignDialogValues(component, {
      awaitMaterialComplete: jest.fn(),
      materialClass: MaterialClass.STEEL,
      isCopy: false,
    });

    spectator.detectChanges();

    dialogFacade = spectator.inject(DialogFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should assign the material form', () => {
      component.createMaterialForm = undefined;

      component.ngOnInit();
      component.enableEditFields();
      expect(component.createMaterialForm).toBeTruthy();
    });
    it('should enable manufacturer controlsfor steel', () => {
      component.materialClass = MaterialClass.STEEL;
      component.ngOnInit();
      component.enableEditFields();

      expect(component.isManufacturerControl.enabled).toBe(true);
      expect(component.supplierControl.enabled).toBe(true);
      expect(component.supplierPlantControl.enabled).toBe(true);
      expect(component.supplierCountryControl.enabled).toBe(true);
    });
    it('should disable manufacturer controls for aluminum', () => {
      component.materialClass = MaterialClass.ALUMINUM;
      component.ngOnInit();
      component.enableEditFields();

      expect(component.isManufacturerControl.disabled).toBe(true);
      expect(component.supplierControl.enabled).toBe(true);
      expect(component.supplierPlantControl.enabled).toBe(true);
      expect(component.supplierCountryControl.enabled).toBe(true);
    });
  });

  describe('confirmMaterial', () => {
    it('should close dialog on successful confirm', () => {
      const values = createMaterialFormValue(
        MaterialClass.STEEL
      ) as SteelMaterialFormValue;
      component.materialId = values.manufacturerSupplierId;
      component.patchFields(values);
      const expected: ManufacturerSupplier = {
        id: values.manufacturerSupplierId,
        name: values.supplier.title,
        plant: values.supplierPlant.title,
        country: values.supplierCountry.id as string,
        manufacturer: values.manufacturer,
        businessPartnerIds: undefined,
      };

      component.confirmMaterial(false);
      expect(
        dialogFacade.manufacturerSupplierDialogConfirmed
      ).toHaveBeenCalledWith(expected);
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(false);
    });

    it('should not close dialog on successful confirm with createAnother', () => {
      const values = createMaterialFormValue(
        MaterialClass.STEEL
      ) as SteelMaterialFormValue;
      component.materialId = values.manufacturerSupplierId;
      component.patchFields(values);
      const expected: ManufacturerSupplier = {
        id: values.manufacturerSupplierId,
        name: values.supplier.title,
        plant: values.supplierPlant.title,
        country: values.supplierCountry.id as string,
        manufacturer: values.manufacturer,
        businessPartnerIds: undefined,
      };

      component.confirmMaterial(true);
      expect(
        dialogFacade.manufacturerSupplierDialogConfirmed
      ).toHaveBeenCalledWith(expected);
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(true);
    });

    it('should keep the dialog open on error', () => {
      const values = createMaterialFormValue(
        MaterialClass.STEEL
      ) as SteelMaterialFormValue;
      component.materialId = values.manufacturerSupplierId;
      component.patchFields(values);
      const supplier: ManufacturerSupplier = {
        id: values.manufacturerSupplierId,
        name: values.supplier.title,
        plant: values.supplierPlant.title,
        country: values.supplierCountry.id as string,
        manufacturer: values.manufacturer,
        businessPartnerIds: undefined,
      };

      component.confirmMaterial(false);
      expect(
        dialogFacade.manufacturerSupplierDialogConfirmed
      ).toHaveBeenCalledWith(supplier);
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(false);
    });

    it('should keep the dialog open on error with createAnother', () => {
      const values = createMaterialFormValue(
        MaterialClass.STEEL
      ) as SteelMaterialFormValue;
      component.materialId = values.manufacturerSupplierId;
      component.patchFields(values);
      const supplier: ManufacturerSupplier = {
        id: values.manufacturerSupplierId,
        name: values.supplier.title,
        plant: values.supplierPlant.title,
        country: values.supplierCountry.id as string,
        manufacturer: values.manufacturer,
        businessPartnerIds: undefined,
      };

      component.confirmMaterial(true);
      expect(
        dialogFacade.manufacturerSupplierDialogConfirmed
      ).toHaveBeenCalledWith(supplier);
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(true);
    });
  });

  describe('getTitle', () => {
    it('should return the update title', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => false);

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.updateManufacturerSupplierTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.st' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.updateManufacturerSupplierTitle'
      );
    });

    it('should return the add title', () => {
      component.isEditDialog = jest.fn(() => false);
      component.isCopyDialog = jest.fn(() => false);

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.addManufacturerSupplierTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.st' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.addManufacturerSupplierTitle'
      );
    });

    it('should return the add title if dialog is a copy', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => true);

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.addManufacturerSupplierTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.st' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.addManufacturerSupplierTitle'
      );
    });
  });

  describe('minimizeDialog', () => {
    it('should transform the form value', () => {
      const mockValue: ManufacturerSupplierFormValue = {
        name: { title: 'name' } as StringOption,
        plant: { title: 'plant' } as StringOption,
        country: { title: 'country' } as StringOption,
        manufacturer: false,
        businessPartnerIds: [{ title: '#1' } as StringOption],
      };
      component.createMaterialForm.patchValue(mockValue, { emitEvent: false });

      component.minimizeDialog();

      expect(component.dialogRef.close).toHaveBeenCalledWith({
        minimize: {
          id: undefined,
          value: {
            supplier: { title: 'name' } as StringOption,
            supplierPlant: { title: 'plant' } as StringOption,
            supplierCountry: { title: 'country' } as StringOption,
            businessPartnerIds: [{ title: '#1' }],
            manufacturer: false,
          },
          isCopy: false,
        },
      });
    });
  });
});
