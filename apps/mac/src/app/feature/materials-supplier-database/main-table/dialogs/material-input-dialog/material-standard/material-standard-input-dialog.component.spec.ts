import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MaterialStandardInputDialogComponent } from '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-standard/material-standard-input-dialog.component';
import {
  MaterialStandard,
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
import { DialogControlsService } from '../services';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

@Injectable()
class MockDialogFacade extends DialogFacade {
  materialStandardDialogOpened = jest.fn();
  materialStandardDialogConfirmed = jest.fn();
}

jest.mock(
  '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component'
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
      MockModule(FormsModule),
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
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
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
      component['buildMaterialStandard'] = jest.fn(() => standard);

      component.confirmMaterial(false);
      expect(dialogFacade.materialStandardDialogConfirmed).toHaveBeenCalledWith(
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
      component['buildMaterialStandard'] = jest.fn(() => standard);

      component.confirmMaterial(false);
      expect(dialogFacade.materialStandardDialogConfirmed).toHaveBeenCalledWith(
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
      component['buildMaterialStandard'] = jest.fn(() => standard);

      component.confirmMaterial(true);
      expect(dialogFacade.materialStandardDialogConfirmed).toHaveBeenCalledWith(
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
      component['buildMaterialStandard'] = jest.fn(() => standard);

      component.confirmMaterial(false);
      expect(dialogFacade.materialStandardDialogConfirmed).toHaveBeenCalledWith(
        standard
      );
      expect(component.awaitMaterialComplete).toHaveBeenCalledWith(false);
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
});
