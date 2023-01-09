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

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  CreateMaterialErrorState,
  CreateMaterialRecord,
  MaterialStandardV2,
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
      component.closeDialog = jest.fn();
      component.showInSnackbar = jest.fn();

      component.enableEditFields();
    });
    it('should close dialog on successful confirm', () => {
      const values = createMaterialFormValue(MaterialClass.STEEL);
      component.materialId = values.materialStandardId;
      component.patchFields(values);
      const standard: MaterialStandardV2 = {
        id: values.materialStandardId,
        materialName: values.materialName.title,
        standardDocument: values.standardDocument.title,
        // steel only
        materialNumber: [values.materialNumber],
      };

      component.confirmMaterial();
      expect(store.dispatch).toBeCalledWith(
        materialstandardDialogConfirmed({ standard })
      );

      // backend response
      update(false);
      expect(component.closeDialog).toBeCalledWith(true);
      expect(component.showInSnackbar).toBeCalled();
    });
    it('should keep the dialog open on error', () => {
      const values = createMaterialFormValue(MaterialClass.STEEL);
      component.materialId = values.materialStandardId;
      component.patchFields(values);
      const standard: MaterialStandardV2 = {
        id: values.materialStandardId,
        materialName: values.materialName.title,
        standardDocument: values.standardDocument.title,
        // steel only
        materialNumber: [values.materialNumber],
      };

      component.confirmMaterial();
      expect(store.dispatch).toBeCalledWith(
        materialstandardDialogConfirmed({ standard })
      );

      // backend response
      update(true);
      expect(component.closeDialog).not.toBeCalled();
      expect(component.showInSnackbar).toBeCalled();
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
});
