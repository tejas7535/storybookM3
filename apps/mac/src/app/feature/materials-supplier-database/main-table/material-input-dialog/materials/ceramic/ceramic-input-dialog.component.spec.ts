import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
import { PushModule } from '@ngrx/component';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  CreateMaterialErrorState,
  CreateMaterialRecord,
} from '@mac/msd/models';
import { materialDialogConfirmed } from '@mac/msd/store/actions/dialog';
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
import { CeramicInputDialogComponent } from './ceramic-input-dialog.component';

describe('CeramicInputDialogComponent', () => {
  let component: CeramicInputDialogComponent;
  let spectator: Spectator<CeramicInputDialogComponent>;

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
    component: CeramicInputDialogComponent,
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

      expect(component.createMaterialForm).toBeTruthy();
    });
  });

  describe('confirmMaterial', () => {
    beforeEach(() => {
      component.supplierPlantControl.enable({ emitEvent: false });
      component.supplierCountryControl.enable({ emitEvent: false });
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
      component.closeDialog = jest.fn();
      component.showInSnackbar = jest.fn();
    });
    it('should close dialog on successful confirm', () => {
      const values = createMaterialFormValue(MaterialClass.CERAMIC);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(false);
      expect(component.closeDialog).toBeCalledWith(true);
      expect(component.showInSnackbar).toBeCalled();
    });

    it('should close dialog on successful confirm with empty material number', () => {
      const baseValues = createMaterialFormValue(MaterialClass.CERAMIC);
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
      expect(component.closeDialog).toBeCalledWith(true);
      expect(component.showInSnackbar).toBeCalled();
    });
    it('should not close dialog on successful confirm with createAnother', () => {
      const values = createMaterialFormValue(MaterialClass.CERAMIC);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(true);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(false);
      expect(component.closeDialog).not.toHaveBeenCalled();
      expect(component.showInSnackbar).toBeCalled();
    });
    it('should keep the dialog open on error', () => {
      const values = createMaterialFormValue(MaterialClass.CERAMIC);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(false);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(true);
      expect(component.closeDialog).not.toBeCalled();
      expect(component.showInSnackbar).toBeCalled();
    });
    it('should keep the dialog open on error with createAnother', () => {
      const values = createMaterialFormValue(MaterialClass.CERAMIC);
      component.createMaterialForm.patchValue(values, { emitEvent: false });

      component.confirmMaterial(true);
      expect(store.dispatch).toBeCalledWith(
        materialDialogConfirmed(transformAsMaterialRequest(values))
      );

      // backend response
      update(true);
      expect(component.closeDialog).not.toBeCalled();
      expect(component.showInSnackbar).toBeCalled();
    });
  });
});
