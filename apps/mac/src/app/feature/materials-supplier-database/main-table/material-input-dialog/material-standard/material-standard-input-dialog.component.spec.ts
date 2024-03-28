import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  MaterialStandard,
  SteelMaterialFormValue,
} from '@mac/feature/materials-supplier-database/models';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { MaterialStandardInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-standard/material-standard-input-dialog.component';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import { createMaterialFormValue } from '@mac/testing/mocks/msd/material-generator.mock';
import { assignDialogValues } from '@mac/testing/mocks/msd/mock-input-dialog-values.mocks';

import * as en from '../../../../../../assets/i18n/en.json';
import { DialogControlsService } from '../services';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

@Injectable()
class MockDialogFacade extends DialogFacade {
  materialStandardDialogOpened = jest.fn();
  materialStandardDialogConfirmed = jest.fn();
}

jest.mock(
  '@mac/msd/main-table/material-input-dialog/material-input-dialog.component'
);

describe('MaterialstandardInputDialogComponent', () => {
  let component: MaterialStandardInputDialogComponent;
  let spectator: Spectator<MaterialStandardInputDialogComponent>;
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
    component: MaterialStandardInputDialogComponent,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      MockProvider(DialogControlsService, {
        getSteelNumberControl: jest.fn(() => new FormControl()),
        getCopperNumberControl: jest.fn(() => new FormControl()),
        getControl: jest.fn(() => new FormControl()),
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    assignDialogValues(component, {
      materialClass: MaterialClass.STEEL,
      awaitMaterialComplete: jest.fn(),
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
      expect(dialogFacade.materialStandardDialogConfirmed).toBeCalledWith(
        standard
      );
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(false);
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
      expect(dialogFacade.materialStandardDialogConfirmed).toBeCalledWith(
        standard
      );
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(false);
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
      expect(dialogFacade.materialStandardDialogConfirmed).toBeCalledWith(
        standard
      );
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(true);
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
      expect(dialogFacade.materialStandardDialogConfirmed).toBeCalledWith(
        standard
      );
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(false);
    });
  });

  describe('showMaterialNumber', () => {
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
