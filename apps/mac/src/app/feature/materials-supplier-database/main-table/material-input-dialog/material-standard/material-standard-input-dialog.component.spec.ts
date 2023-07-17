import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  CreateMaterialErrorState,
  CreateMaterialRecord,
  MaterialStandard,
  SteelMaterialFormValue,
} from '@mac/feature/materials-supplier-database/models';
import { getCreateMaterialRecord } from '@mac/feature/materials-supplier-database/store';
import { materialstandardDialogConfirmed } from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { MaterialStandardInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-standard/material-standard-input-dialog.component';
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

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MaterialstandardInputDialogComponent', () => {
  let component: MaterialStandardInputDialogComponent;
  let spectator: Spectator<MaterialStandardInputDialogComponent>;

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
  let store: MockStore;
  let createMaterialSpy: MemoizedSelector<any, any, DefaultProjectorFn<any>>;

  const createComponent = createComponentFactory({
    component: MaterialStandardInputDialogComponent,
    imports: [
      CommonModule,
      MatProgressSpinnerModule,
      PushModule,
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
  });

  describe('createMaterialNumberControl', () => {
    it('should get a steel number control', () => {
      component.materialClass = MaterialClass.STEEL;
      const mockControl = new FormControl<string>('');
      component['controlsService'].getSteelNumberControl = jest.fn(
        () => mockControl
      );

      const result = component['createMaterialNumberControl']();

      expect(result).toEqual(mockControl);
      expect(
        component['controlsService'].getSteelNumberControl
      ).toHaveBeenCalled();
    });

    it('should get a copper number control', () => {
      component.materialClass = MaterialClass.COPPER;
      const mockControl = new FormControl<string>('');
      component['controlsService'].getCopperNumberControl = jest.fn(
        () => mockControl
      );

      const result = component['createMaterialNumberControl']();

      expect(result).toEqual(mockControl);
      expect(
        component['controlsService'].getCopperNumberControl
      ).toHaveBeenCalled();
    });

    it('should get a default control', () => {
      component.materialClass = MaterialClass.ALUMINUM;
      const mockControl = new FormControl(undefined);
      component['controlsService'].getControl = jest.fn(() => mockControl);

      const result = component['createMaterialNumberControl']();

      expect(result).toEqual(mockControl);
      expect(component['controlsService'].getControl).toHaveBeenCalledWith(
        undefined,
        true
      );
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
      component['closeDialog'] = jest.fn();

      component.enableEditFields();
    });
    it('should close dialog on successful confirm', () => {
      const values = createMaterialFormValue(
        MaterialClass.STEEL
      ) as SteelMaterialFormValue;
      component.materialId = values.materialStandardId;
      component.patchFields(values);
      const standard: MaterialStandard = {
        id: values.materialStandardId,
        materialName: values.materialName.title,
        standardDocument: values.standardDocument.title,
        // steel only
        materialNumber: [values.materialNumber],
      };

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialstandardDialogConfirmed({ standard })
      );

      // backend response
      update(false);
      expect(component['closeDialog']).toBeCalled();
    });
    it('should close dialog on successful confirm with empty material number', () => {
      const baseValues = createMaterialFormValue(MaterialClass.STEEL);
      const values = {
        ...baseValues,
        materialNumber: '',
      };
      component.materialId = values.materialStandardId;
      component.patchFields(values);
      const standard: MaterialStandard = {
        id: values.materialStandardId,
        materialName: values.materialName.title,
        standardDocument: values.standardDocument.title,
        // steel only
        materialNumber: undefined,
      };

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialstandardDialogConfirmed({ standard })
      );

      // backend response
      update(false);
      expect(component['closeDialog']).toBeCalled();
    });
    it('should not close dialog on successful confirm with createAnother', () => {
      const values = createMaterialFormValue(
        MaterialClass.STEEL
      ) as SteelMaterialFormValue;
      component.materialId = values.materialStandardId;
      component.patchFields(values);
      const standard: MaterialStandard = {
        id: values.materialStandardId,
        materialName: values.materialName.title,
        standardDocument: values.standardDocument.title,
        // steel only
        materialNumber: [values.materialNumber],
      };

      component.confirmMaterial(true);
      expect(store.dispatch).toBeCalledWith(
        materialstandardDialogConfirmed({ standard })
      );

      // backend response
      update(false);
      expect(component['closeDialog']).not.toHaveBeenCalled();
    });
    it('should keep the dialog open on error', () => {
      const values = createMaterialFormValue(
        MaterialClass.STEEL
      ) as SteelMaterialFormValue;
      component.materialId = values.materialStandardId;
      component.patchFields(values);
      const standard: MaterialStandard = {
        id: values.materialStandardId,
        materialName: values.materialName.title,
        standardDocument: values.standardDocument.title,
        // steel only
        materialNumber: [values.materialNumber],
      };

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialstandardDialogConfirmed({ standard })
      );

      // backend response
      update(true);
      expect(component['closeDialog']).not.toBeCalled();
    });
  });

  describe('show is manufacturer', () => {
    it('should be true', () => {
      expect(component.showMaterialNumber()).toBe(true);
    });
    it('should be false', () => {
      component.materialNumberControl.disable();
      expect(component.showMaterialNumber()).toBe(false);
    });
  });

  describe('getTitle', () => {
    it('should return the update title', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => false);

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.updateMaterialStandardTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.st' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.updateMaterialStandardTitle'
      );
    });

    it('should return the add title', () => {
      component.isEditDialog = jest.fn(() => false);
      component.isCopyDialog = jest.fn(() => false);

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.addMaterialStandardTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.st' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.addMaterialStandardTitle'
      );
    });

    it('should return the add title if dialog is a copy', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => true);

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.addMaterialStandardTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.st' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.addMaterialStandardTitle'
      );
    });
  });

  describe('getMaterialNumberTranslationKey', () => {
    it('should return steel key', () => {
      component.materialClass = MaterialClass.STEEL;
      const result = component.getMaterialNumberTranslationKey();

      expect(result).toEqual('steelNumber');
    });

    it('should return copper key', () => {
      component.materialClass = MaterialClass.COPPER;
      const result = component.getMaterialNumberTranslationKey();

      expect(result).toEqual('copperNumber');
    });

    it('should return default key', () => {
      component.materialClass = MaterialClass.ALUMINUM;
      const result = component.getMaterialNumberTranslationKey();

      expect(result).toEqual('');
    });
  });

  describe('getMaterialNumberPlaceholder', () => {
    it('should return steel placeholder', () => {
      component.materialClass = MaterialClass.STEEL;
      const result = component.getMaterialNumberPlaceholder();

      expect(result).toEqual('1.1234');
    });

    it('should return copper placeholder', () => {
      component.materialClass = MaterialClass.COPPER;
      const result = component.getMaterialNumberPlaceholder();

      expect(result).toEqual('2.1234');
    });

    it('should return default placeholder', () => {
      component.materialClass = MaterialClass.ALUMINUM;
      const result = component.getMaterialNumberPlaceholder();

      expect(result).toEqual('');
    });
  });
});
