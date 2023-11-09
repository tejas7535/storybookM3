import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  CreateMaterialErrorState,
  CreateMaterialRecord,
  ManufacturerSupplier,
  ManufacturerSupplierFormValue,
  SteelMaterialFormValue,
} from '@mac/feature/materials-supplier-database/models';
import { getCreateMaterialRecord } from '@mac/feature/materials-supplier-database/store';
import { manufacturerSupplierDialogConfirmed } from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import { createMaterialFormValue } from '@mac/testing/mocks/msd/material-generator.mock';

import * as en from '../../../../../../assets/i18n/en.json';
import { BaseDialogModule } from '../base-dialog/base-dialog.module';
import { MaterialInputDialogModule } from '../material-input-dialog.module';
import { DialogControlsService } from '../services';
import { ManufacturerSupplierInputDialogComponent } from './manufacturersupplier-input-dialog.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('ManufacturerSupplierInputDialogComponent', () => {
  let component: ManufacturerSupplierInputDialogComponent;
  let spectator: Spectator<ManufacturerSupplierInputDialogComponent>;

  const initialState = {
    msd: {
      data: {
        ...initialDataState,
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
  let store: MockStore;
  let createMaterialSpy: MemoizedSelector<any, any, DefaultProjectorFn<any>>;

  const createComponent = createComponentFactory({
    component: ManufacturerSupplierInputDialogComponent,
    imports: [
      CommonModule,
      MatProgressSpinnerModule,
      PushPipe,
      MatIconModule,
      MatButtonModule,
      MatDividerModule,
      MatInputModule,
      MatCheckboxModule,
      MatFormFieldModule,
      SelectModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatGridListModule,
      MatSelectModule,
      MatTooltipModule,
      provideTranslocoTestingModule({ en }),
      MatSnackBarModule,
      BaseDialogModule,
      MaterialInputDialogModule,
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      DialogControlsService,
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
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    const spy = spectator.inject(MockStore);
    createMaterialSpy = spy.overrideSelector(getCreateMaterialRecord);
    store = spy;
    store.dispatch = jest.fn();
    spectator.detectChanges();
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
    const update = (error: boolean) => {
      const result = error
        ? {
            error: {
              code: 400,
              state: CreateMaterialErrorState.MaterialCreationFailed,
            },
          }
        : {};
      createMaterialSpy.setResult(result as CreateMaterialRecord);
      store.refreshState();
    };

    beforeEach(() => {
      component.materialClass = MaterialClass.STEEL;
      component.ngOnInit();
      component['closeDialog'] = jest.fn();

      component.enableEditFields();
    });
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
      expect(store.dispatch).toBeCalledWith(
        manufacturerSupplierDialogConfirmed({ supplier: expected })
      );

      // backend response
      update(false);
      expect(component['closeDialog']).toBeCalled();
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
      expect(store.dispatch).toBeCalledWith(
        manufacturerSupplierDialogConfirmed({ supplier: expected })
      );

      // backend response
      update(false);
      expect(component['closeDialog']).not.toHaveBeenCalled();
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
      expect(store.dispatch).toBeCalledWith(
        manufacturerSupplierDialogConfirmed({ supplier })
      );

      // backend response
      update(true);
      expect(component['closeDialog']).not.toBeCalled();
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
      expect(store.dispatch).toBeCalledWith(
        manufacturerSupplierDialogConfirmed({ supplier })
      );

      // backend response
      update(true);
      expect(component['closeDialog']).not.toBeCalled();
    });
  });

  describe('show is manufacturer', () => {
    beforeEach(() => {
      component.materialClass = MaterialClass.STEEL;
      component.ngOnInit();
    });
    it('should be true', () => {
      expect(component.showIsManufacturer()).toBe(true);
    });
    it('should be false', () => {
      component.isManufacturerControl.disable();
      expect(component.showIsManufacturer()).toBe(false);
    });
  });

  describe('getTitle', () => {
    it('should return the update title', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => false);

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.updateManufacturerSupplierTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.undefined' }
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
        { class: 'materialsSupplierDatabase.materialClassValues.undefined' }
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
        { class: 'materialsSupplierDatabase.materialClassValues.undefined' }
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
