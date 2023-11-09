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
} from '@mac/msd/models';
import {
  addCustomCastingDiameter,
  addCustomReferenceDocument,
  fetchCastingDiameters,
  materialDialogConfirmed,
  updateCreateMaterialDialogValues,
} from '@mac/msd/store/actions/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import { getCreateMaterialRecord } from '@mac/msd/store/selectors';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import {
  createMaterialFormValue,
  transformAsMaterialRequest,
} from '@mac/testing/mocks/msd/material-generator.mock';

import * as en from '../../../../../../../assets/i18n/en.json';
import { BaseDialogModule } from '../../base-dialog/base-dialog.module';
import { MaterialInputDialogModule } from '../../material-input-dialog.module';
import { DialogControlsService } from '../../services';
import { CopperInputDialogComponent } from './copper-input-dialog.component';

describe('CopperInputDialogComponent', () => {
  let component: CopperInputDialogComponent;
  let spectator: Spectator<CopperInputDialogComponent>;

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
  let store: MockStore;
  let createMaterialSpy: MemoizedSelector<any, any, DefaultProjectorFn<any>>;

  const createComponent = createComponentFactory({
    component: CopperInputDialogComponent,
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

      expect(component.createMaterialForm).toBeTruthy();
    });

    it('should enable casting Mode', () => {
      expect(component['castingModesControl'].enabled).toBeFalsy();
      const val = {} as StringOption;
      component['supplierCountryControl'].setValue(val);
      expect(component['castingModesControl'].enabled).toBeTruthy();
    });

    it('should disable casting Mode', () => {
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
      expect(component['castingDiameterControl'].enabled).toBeFalsy();
      component['castingModesControl'].enable();
      component['castingModesControl'].setValue('mode');

      expect(component['castingDiameterControl'].enabled).toBeTruthy();
      expect(store.dispatch).not.toHaveBeenCalledWith(
        fetchCastingDiameters({ supplierId: undefined, castingMode: 'mode' })
      );
    });

    it('should enable casting Diameter and fetch them', () => {
      component['castingModesControl'].enable();
      expect(component['castingDiameterControl'].enabled).toBeFalsy();
      const castingMode = 'mode';
      const supplierId = 1;

      component['castingModesControl'].setValue(castingMode, {
        emitEvent: false,
      });
      component['manufacturerSupplierIdControl'].setValue(supplierId);

      expect(component['castingDiameterControl'].enabled).toBeTruthy();
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchCastingDiameters({ supplierId, castingMode })
      );
    });
  });

  describe('updateCreateMaterialDialogValues', () => {
    it('should assign the material form', () => {
      component.co2Scope1Control.setValue(99);

      expect(store.dispatch).toBeCalledWith(
        updateCreateMaterialDialogValues({
          form: component.createMaterialForm.value,
        })
      );
    });
  });

  describe('addReferenceDocument', () => {
    it('should add values to select', () => {
      const referenceDocument = 'string';
      component.addReferenceDocument(referenceDocument);
      expect(store.dispatch).toHaveBeenCalledWith(
        addCustomReferenceDocument({ referenceDocument })
      );
    });
  });

  describe('addCastingDiameter', () => {
    it('should add values to select', () => {
      const castingDiameter = 'string';
      component.addCastingDiameter(castingDiameter);
      expect(store.dispatch).toHaveBeenCalledWith(
        addCustomCastingDiameter({ castingDiameter })
      );
    });
  });

  describe('confirmMaterial', () => {
    beforeEach(() => {
      component.supplierPlantControl.enable({ emitEvent: false });
      component.supplierCountryControl.enable({ emitEvent: false });
      component.castingDiameterControl.enable({ emitEvent: false });
      component.castingModesControl.enable({ emitEvent: false });
      component.co2ClassificationControl.enable({ emitEvent: false });
    });
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
    });
    it('should close dialog on successful confirm', () => {
      const values = createMaterialFormValue(MaterialClass.COPPER);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(false);
      expect(component['closeDialog']).toBeCalled();
    });

    it('should close dialog on successful confirm with empty material number', () => {
      const baseValues = createMaterialFormValue(MaterialClass.COPPER);
      const values = {
        ...baseValues,
        materialNumber: '',
      };
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(false);
      expect(component['closeDialog']).toBeCalled();
    });
    it('should not close dialog on successful confirm with createAnother', () => {
      const values = createMaterialFormValue(MaterialClass.COPPER);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(true);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(false);
      expect(component['closeDialog']).not.toHaveBeenCalled();
    });
    it('should keep the dialog open on error', () => {
      const values = createMaterialFormValue(MaterialClass.COPPER);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(true);
      expect(component['closeDialog']).not.toBeCalled();
    });
    it('should keep the dialog open on error with createAnother', () => {
      const values = createMaterialFormValue(MaterialClass.COPPER);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(true);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(true);
      expect(component['closeDialog']).not.toBeCalled();
    });
  });
});
