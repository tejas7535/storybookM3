import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of, Subject } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import { assignDialogValues } from '@mac/testing/mocks/msd/mock-input-dialog-values.mocks';

import * as en from '../../../../../../../../assets/i18n/en.json';
import { DialogControlsService } from '../../services';
import { CopperInputDialogComponent } from './copper-input-dialog.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

@Injectable()
class MockDialogFacade extends DialogFacade {
  fetchCastingDiameters = jest.fn();
  addCustomReferenceDocument = jest.fn();
  addCustomCastingDiameter = jest.fn();
  updateCreateMaterialDialogValues = jest.fn();
  materialDialogConfirmed = jest.fn();
}

const getMockControl = (disabled: boolean): FormControl =>
  new FormControl({ value: undefined, disabled });

describe('CopperInputDialogComponent', () => {
  let component: CopperInputDialogComponent;
  let spectator: Spectator<CopperInputDialogComponent>;
  let dialogFacade: DialogFacade;

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
          productionProcesses: ['1'],
          productionProcessesLoading: true,
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
  const matDialogData = {};

  const createComponent = createComponentFactory({
    component: CopperInputDialogComponent,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      MockModule(SelectModule),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      MockProvider(DialogControlsService, {
        getCopperNumberControl: jest.fn((_, disabled) =>
          getMockControl(disabled)
        ),
        getRequiredControl: jest.fn((_, disabled) => getMockControl(disabled)),
        getControl: jest.fn((_, disabled) => getMockControl(disabled)),
        getNumberControl: jest.fn((_, disabled) => getMockControl(disabled)),
      }),
      mockProvider(MsdDialogService),
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
      destroy$: new Subject<void>(),
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

      expect(component.createMaterialForm).toBeTruthy();
    });

    it('should disable referenceDocumentControl', () => {
      expect(component.referenceDocumentControl.disabled).toBe(false);

      const dialogData = {
        editDialogInformation: {
          selectedRows: [{ id: 1 }, { id: 2 }],
        },
      };
      Object.defineProperty(component, 'dialogData', {
        value: dialogData,
      });

      component.ngOnInit();

      expect(component.referenceDocumentControl.disabled).toBe(true);
    });

    it('should enable casting Mode', () => {
      component['castingModesControl'].disable();
      expect(component['castingModesControl'].enabled).toBeFalsy();
      const val = {} as StringOption;
      component['supplierCountryControl'].setValue(val);
      expect(component['castingModesControl'].enabled).toBeTruthy();
    });

    it('should disable casting Mode', () => {
      component['castingModesControl'].disable();
      expect(component['castingModesControl'].enabled).toBeFalsy();
      // enable
      const val = {} as StringOption;
      component['supplierCountryControl'].setValue(val);
      expect(component['castingModesControl'].enabled).toBeTruthy();
      // disable
      component['supplierCountryControl'].reset();
      expect(component['castingModesControl'].enabled).toBeFalsy();
    });

    it('should disable casting Diameter', () => {
      component['castingDiameterControl'].reset = jest.fn();
      component['castingDiameterControl'].disable = jest.fn();

      component['castingModesControl'].enable();
      component['castingModesControl'].setValue('X', { emitEvent: false });
      component['castingModesControl'].reset();

      expect(component['castingDiameterControl'].reset).toHaveBeenCalled();
      expect(component['castingDiameterControl'].disable).toHaveBeenCalled();
    });

    it('should enable casting Diameter', () => {
      component['castingDiameterControl'].disable();
      expect(component['castingDiameterControl'].enabled).toBeFalsy();
      component['castingModesControl'].enable();
      component['castingModesControl'].setValue('mode');

      expect(component['castingDiameterControl'].enabled).toBeTruthy();
      expect(dialogFacade.fetchCastingDiameters).not.toHaveBeenCalledWith(
        undefined,
        'mode'
      );
    });

    it('should enable casting Diameter and fetch them', () => {
      component['castingModesControl'].enable();
      component['castingDiameterControl'].disable();
      expect(component['castingDiameterControl'].enabled).toBeFalsy();
      const castingMode = 'mode';
      const supplierId = 1;

      component['castingModesControl'].setValue(castingMode, {
        emitEvent: false,
      });
      component['manufacturerSupplierIdControl'].setValue(supplierId);

      expect(component['castingDiameterControl'].enabled).toBeTruthy();
      expect(dialogFacade.fetchCastingDiameters).toHaveBeenCalledWith(
        supplierId,
        castingMode
      );
    });
  });

  describe('updateCreateMaterialDialogValues', () => {
    it('should assign the material form', () => {
      component.co2Scope1Control.setValue(99);

      expect(
        dialogFacade.updateCreateMaterialDialogValues
      ).toHaveBeenCalledWith(component.createMaterialForm.value);
    });
  });

  describe('addReferenceDocument', () => {
    it('should add values to select', () => {
      const referenceDocument = 'string';
      component.addReferenceDocument(referenceDocument);
      expect(dialogFacade.addCustomReferenceDocument).toHaveBeenCalledWith(
        referenceDocument
      );
    });
  });

  describe('addCastingDiameter', () => {
    it('should add values to select', () => {
      const castingDiameter = 'string';
      component.addCastingDiameter(castingDiameter);
      expect(dialogFacade.addCustomCastingDiameter).toHaveBeenCalledWith(
        castingDiameter
      );
    });
  });

  describe('openReferenceDocumentBulkEditDialog', () => {
    it('should close steel dialog and open reference document dialog', () => {
      const dialogData = {
        editDialogInformation: {
          selectedRows: [{ id: 1 }, { id: 2 }],
        },
      };
      Object.defineProperty(component, 'dialogData', {
        value: dialogData,
      });

      component.openReferenceDocumentBulkEditDialog();

      expect(component.dialogRef.close).toHaveBeenCalled();
      expect(
        component['dialogService'].openReferenceDocumentBulkEditDialog
      ).toHaveBeenCalledWith(dialogData.editDialogInformation.selectedRows);
    });
  });
});
