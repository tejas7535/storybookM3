import { CommonModule } from '@angular/common';
import { QueryList } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

import { StringOption } from '@schaeffler/inputs';
import { SelectComponent, SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  CreateMaterialErrorState,
  CreateMaterialRecord,
  SteelMaterialFormValue,
} from '@mac/msd/models';
import {
  addCustomCastingDiameter,
  addCustomReferenceDocument,
  fetchCastingDiameters,
  fetchCo2ValuesForSupplierSteelMakingProcess,
  fetchReferenceDocuments,
  fetchSteelMakingProcessesInUse,
  materialDialogConfirmed,
  resetSteelMakingProcessInUse,
} from '@mac/msd/store/actions/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  getCreateMaterialRecord,
  getHighestCo2Values,
  getSteelMakingProcessesInUse,
} from '@mac/msd/store/selectors';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import {
  createMaterialFormValue,
  createOption,
  transformAsMaterialRequest,
} from '@mac/testing/mocks/msd/material-generator.mock';

import * as en from '../../../../../../../assets/i18n/en.json';
import { BaseDialogModule } from '../../base-dialog/base-dialog.module';
import { MaterialInputDialogModule } from '../../material-input-dialog.module';
import { DialogControlsService } from '../../services';
import { ReleaseDateViewMode } from './constants/release-date-view-mode.enum';
import { SteelInputDialogComponent } from './steel-input-dialog.component';

describe('SteelInputDialogComponent', () => {
  let component: SteelInputDialogComponent;
  let spectator: Spectator<SteelInputDialogComponent>;

  const setSilent = <T>(control: FormControl<T> | FormGroup, value?: T) =>
    control.setValue(value, { emitEvent: false });

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
  let matDialogData = {};
  let store: MockStore;
  let smpSpy: MemoizedSelector<any, string[], DefaultProjectorFn<string[]>>;
  let co2Spy: MemoizedSelector<any, any, DefaultProjectorFn<any>>;
  let createMaterialSpy: MemoizedSelector<any, any, DefaultProjectorFn<any>>;

  const createComponent = createComponentFactory({
    component: SteelInputDialogComponent,
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
    co2Spy = spy.overrideSelector(getHighestCo2Values, {});
    smpSpy = spy.overrideSelector(getSteelMakingProcessesInUse, []);
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
    describe('static', () => {
      it('should create an array of months with length 12', () => {
        expect(component.months).toHaveLength(12);
      });
      it('should create an array of months with all months', () => {
        expect(component.months).toEqual(
          expect.arrayContaining([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        );
      });
      it('should create an array of years starting 2000', () => {
        const curYear = new Date().getFullYear();
        expect(component.years).toEqual(
          expect.arrayContaining([2000, curYear])
        );
      });
      it('should create an array of years ending current year', () => {
        const curYear = new Date().getFullYear();
        expect(component.years).toEqual(
          expect.not.arrayContaining([1999, curYear + 1])
        );
      });
    });
  });

  describe('modify rating', () => {
    beforeEach(() => {
      component.ratingsControl.reset(undefined, { emitEvent: false });
    });
    it('ratingChangeComment should be disabled after init', () => {
      expect(component.ratingChangeCommentControl.disabled).toBeTruthy();
    });
    it('ratingChangeComment should be enabled when rating has been set', () => {
      component.ratingsControl.setValue(createOption('', 1));

      expect(component.ratingChangeCommentControl.disabled).toBeFalsy();
    });
    it('ratingChangeComment should be disabled when rating is reset', () => {
      // set and reset
      component.ratingsControl.setValue(createOption('title'));
      component.ratingsControl.reset();

      expect(component.ratingChangeCommentControl.disabled).toBeTruthy();
      expect(component.ratingChangeCommentControl.getRawValue()).toBe(
        undefined
      );
    });

    describe('with editData', () => {
      beforeEach(() => {
        matDialogData = {
          editDialogInformation: {
            row: {
              rating: 7,
            },
          },
        };
        component.ratingsControl.setValue(createOption('title', 7), {
          emitEvent: false,
        });
      });
      it('ratingChangeComment should be disabled on init', () => {
        expect(component.ratingChangeCommentControl.disabled).toBeTruthy();
      });
      it('ratingChangeComment should be enabled when rating has been modified', () => {
        component.ratingsControl.setValue({
          id: 1,
          title: 'title',
        } as StringOption);

        expect(component.ratingChangeCommentControl.disabled).toBeFalsy();
      });
    });
  });

  describe('isManufacturerControl', () => {
    beforeEach(() => {
      component.supplierPlantControl.patchValue(
        createOption('plant', 1, { manufacturer: true })
      );
    });
    it('should unset and disable manufacturer with empty supplier data', () => {
      component.supplierPlantControl.reset();
      expect(component.isManufacturerControl.enabled).toBeFalsy();
      expect(component.isManufacturerControl.value).toBeFalsy();
    });
    it('should set and disable manufacturer for existing supplier', () => {
      const option = createOption('plant', 2, { manufacturer: true });
      component.supplierPlantControl.patchValue(option);
      expect(component.isManufacturerControl.enabled).toBeFalsy();
      expect(component.isManufacturerControl.value).toBeTruthy();
    });
    it('should unset and disable manufacturer for existing supplier', () => {
      const option = createOption('plant', 2, { manufacturer: false });
      component.supplierPlantControl.patchValue(option);
      expect(component.isManufacturerControl.enabled).toBeFalsy();
      expect(component.isManufacturerControl.value).toBeFalsy();
    });
    it('should enable manufacturerControl for new supplier', () => {
      const option = createOption('plant');
      component.supplierPlantControl.patchValue(option);
      expect(component.isManufacturerControl.enabled).toBeTruthy();
      expect(component.isManufacturerControl.value).toBeFalsy();
    });
  });

  describe('casting mode', () => {
    it('should be disable after init', () => {
      expect(component.castingModesControl.disabled).toBeTruthy();
    });
    it('should enable if supplier data has been set', () => {
      component.supplierCountryControl.setValue(createOption('some'));

      expect(component.castingModesControl.enabled).toBeTruthy();
    });
    it('should be disable if supplier data has not been set', () => {
      component.supplierCountryControl.setValue(createOption('some'));
      component.supplierCountryControl.reset();

      expect(component.castingModesControl.disabled).toBeTruthy();
    });
  });

  describe('castingMode / supplier dependencies', () => {
    beforeEach(() => {
      component.castingModesControl.enable();
      setSilent(component.castingDiameterDep, {
        supplierId: 11,
        castingMode: 'sth',
      });
    });
    it('should enable castingDiameter with new casting mode', () => {
      component.castingDiameterDep.patchValue({
        castingMode: 'new',
      });
      expect(component.castingDiameterControl.enabled).toBeTruthy();
      expect(store.dispatch).toBeCalledWith(resetSteelMakingProcessInUse());
    });
    it('should disable castingDiameter with casting mode reset', () => {
      component.castingDiameterDep.patchValue({
        castingMode: undefined,
      });
      expect(component.castingDiameterControl.disabled).toBeTruthy();
      expect(store.dispatch).toBeCalledWith(resetSteelMakingProcessInUse());
    });
    it('should fetchCastingDiameters', () => {
      component.castingDiameterDep.setValue({
        supplierId: 99,
        castingMode: 'new',
      });
      expect(store.dispatch).toBeCalledWith(resetSteelMakingProcessInUse());
      expect(store.dispatch).toBeCalledWith(
        fetchCastingDiameters({ supplierId: 99, castingMode: 'new' })
      );
    });
    it('should not fetchCastingDiameters without castingMode', () => {
      component.castingDiameterDep.patchValue({
        castingMode: undefined,
      });
      expect(store.dispatch).toBeCalledWith(resetSteelMakingProcessInUse());
      expect(store.dispatch).not.toBeCalledWith(
        fetchCastingDiameters({ supplierId: 99, castingMode: undefined })
      );
    });
    it('should not fetchCastingDiameters without supplierId', () => {
      component.castingDiameterDep.patchValue({
        supplierId: undefined,
      });

      expect(store.dispatch).toBeCalledWith(resetSteelMakingProcessInUse());
      expect(store.dispatch).not.toBeCalledWith(
        fetchCastingDiameters({ supplierId: 99, castingMode: undefined })
      );
    });
  });

  describe('castingDiameter update', () => {
    const supplierId = 3;
    const castingMode = 'ignot';
    let castingDiameter = '1x1';
    beforeEach(() => {
      component.castingDiameterControl.enable();
      setSilent(
        component.castingDiameterControl,
        createOption(castingDiameter)
      );
      setSilent(component.manufacturerSupplierIdControl, supplierId);
      setSilent(component.castingModesControl, castingMode);
    });
    it('should fetch steelMakingProcesses', () => {
      castingDiameter = '2x2';
      component.castingDiameterControl.setValue(createOption(castingDiameter));
      expect(store.dispatch).toBeCalledWith(
        fetchSteelMakingProcessesInUse({
          supplierId,
          castingMode,
          castingDiameter,
        })
      );
    });
    it('should not fetch processes with empty diameter', () => {
      component.castingDiameterControl.reset();
      expect(store.dispatch).not.toBeCalled();
    });
    it('should not fetch processes with empty casting mode', () => {
      setSilent(component.castingModesControl);
      component.castingDiameterControl.setValue(createOption('test'));
      expect(store.dispatch).not.toBeCalled();
    });
    it('should not fetch processes with empty id', () => {
      setSilent(component.manufacturerSupplierIdControl);
      component.castingDiameterControl.setValue(createOption('test'));
      expect(store.dispatch).not.toBeCalled();
    });
  });

  describe('co2Dependencies', () => {
    beforeEach(() => {
      component.steelMakingProcessControl.enable();
      setSilent(component.manufacturerSupplierIdControl, 1);
      setSilent(component.steelMakingProcessControl, createOption('initial'));
    });
    it('should dispatch the fetch action on update of SMP', () => {
      component.createMaterialForm.updateValueAndValidity = jest.fn();

      component.steelMakingProcessControl.setValue(createOption('BF+BOF'));

      expect(store.dispatch).toHaveBeenCalledWith(
        fetchCo2ValuesForSupplierSteelMakingProcess({
          supplierId: 1,
          steelMakingProcess: 'BF+BOF',
        })
      );
      expect(
        component.createMaterialForm.updateValueAndValidity
      ).toHaveBeenCalled();
    });
    it('should dispatch the fetch action on update of SupplierId', () => {
      component.createMaterialForm.updateValueAndValidity = jest.fn();

      component.manufacturerSupplierIdControl.setValue(7);
      component.steelMakingProcessControl.setValue(createOption('initial'));

      expect(store.dispatch).toHaveBeenCalledWith(
        fetchCo2ValuesForSupplierSteelMakingProcess({
          supplierId: 7,
          steelMakingProcess: 'initial',
        })
      );
      expect(
        component.createMaterialForm.updateValueAndValidity
      ).toHaveBeenCalled();
    });
    it('should not dispatch the fetch action with no SMP', () => {
      component.steelMakingProcessControl.reset();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
    it('should not dispatch the fetch action with no supplierId', () => {
      setSilent(component.manufacturerSupplierIdControl);
      component.steelMakingProcessControl.setValue({ id: 0, title: 'process' });

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('modify material standard', () => {
    it('should dispatch fetch action for reference documents on material standard id change', () => {
      component.materialStandardIdControl.setValue(5);

      expect(store.dispatch).toHaveBeenCalledWith(
        fetchReferenceDocuments({ materialStandardId: 5 })
      );
    });
    it('should not dispatch action with no id number', () => {
      component.materialStandardIdControl.reset();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('steelmakingProcessesInUse', () => {
    const sc = new SelectComponent();
    const update = (arr?: string[]) => {
      smpSpy.setResult(arr);
      store.refreshState();
    };
    beforeEach(() => {
      const ql = Object.assign(new QueryList(), {
        first: sc,
      }) as QueryList<SelectComponent>;
      Object.assign(component['steelMakingProcessSelectQueryList'], ql);
    });
    it('should set initialSearchValue to "inuseFilter"', () => {
      update(['1']);
      expect(sc.searchControl.value).not.toBe('');
    });
    it('should set initialSearchValue to empty filter', () => {
      update([]);
      expect(sc.searchControl.value).toBe('');
    });
    it('should set initialSearchValue to', () => {
      update();
      expect(sc.searchControl.value).toBe('');
    });
  });

  describe('co2ValuesForSupplierSteelMakingProcess', () => {
    beforeEach(() => {
      setSilent(component.co2Scope1Control);
      setSilent(component.co2Scope2Control);
      setSilent(component.co2Scope3Control);
      setSilent(component.co2TotalControl);
      setSilent(component.co2ClassificationControl);
      component.co2ClassificationControl.disable();
      component['snackbar'].open = jest.fn();
    });
    const update = (
      arr?: number[],
      co2Classification?: string,
      otherValues = 0
    ) => {
      if (arr) {
        co2Spy.setResult({
          co2Values: {
            co2Scope1: arr[0],
            co2Scope2: arr[1],
            co2Scope3: arr[2],
            co2PerTon: arr[3],
            co2Classification,
          },
          otherValues,
        });
      } else {
        co2Spy.setResult({});
      }
      store.refreshState();
    };
    it('should update co2Dialog values', () => {
      update([1, 2, 3, 4], 'yes', 8);

      expect(component['snackbar'].open).toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(true);
      expect(component.co2ClassificationControl.value).toBe('yes');
      expect(component.co2Scope1Control.value).toBe(1);
      expect(component.co2Scope2Control.value).toBe(2);
      expect(component.co2Scope3Control.value).toBe(3);
      expect(component.co2TotalControl.value).toBe(4);
    });
    it('should partial update co2Dialog values', () => {
      update([1, undefined, undefined, 4]);

      expect(component['snackbar'].open).toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(true);
      expect(component.co2ClassificationControl.value).toBeFalsy();
      expect(component.co2Scope1Control.value).toBe(1);
      expect(component.co2Scope2Control.value).toBeFalsy();
      expect(component.co2Scope3Control.value).toBeFalsy();
      expect(component.co2TotalControl.value).toBe(4);
    });
    it('should not update co2Dialog values with no values given', () => {
      update();

      expect(component['snackbar'].open).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for scope1', () => {
      setSilent(component.co2Scope1Control, 400);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].open).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for scope2', () => {
      setSilent(component.co2Scope2Control, 99);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].open).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for scope3', () => {
      setSilent(component.co2Scope3Control, 66);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].open).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for co2Total given', () => {
      setSilent(component.co2TotalControl, 3);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].open).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
  });

  describe('selectReleaseDateView', () => {
    beforeEach(() => {
      component.isEditDialog = jest.fn(() => false);
      component.isCopyDialog = jest.fn(() => false);
      component.releaseMonthControl.enable();
      component.releaseYearControl.enable();
    });
    it('should return NEW for ADD Dialog', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => false);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.DEFAULT
      );
    });
    it('should return NEW for COPY Dialog', () => {
      component.isCopyDialog = jest.fn(() => true);
      component.isEditDialog = jest.fn(() => true);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.DEFAULT
      );
    });
    it('should return READONLY for EDIT Dialog', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => true);
      component.releaseMonthControl.setValue(1);
      component.releaseYearControl.setValue(33);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.READONLY
      );
    });
    it('should return HISTORIC for EDIT Dialog without full release date (month)', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => true);
      component.releaseMonthControl.reset();
      component.releaseYearControl.setValue(33);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.HISTORIC
      );
    });
    it('should return HISTORIC for EDIT Dialog without full release date (Year)', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => true);
      component.releaseMonthControl.setValue(1);
      component.releaseYearControl.reset();
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.HISTORIC
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

  describe('steelMakingProcessFilterFn', () => {
    it('should return the false', () => {
      const result = component.steelMakingProcessFilterFn(
        { id: 'BF+BOF', title: 'BF+BOF' },
        'a'
      );

      expect(result).toBe(false);
    });

    it('should return the true', () => {
      const result = component.steelMakingProcessFilterFn(
        { id: 'BF+BOF', title: 'BF+BOF' },
        'bof'
      );

      expect(result).toBe(true);
    });

    it('should return true if the title is within the used processes', () => {
      component['steelMakingProcessesInUse'] = ['BF+BOF'];
      const result = component.steelMakingProcessFilterFn(
        { id: 'BF+BOF', title: 'BF+BOF' },
        'in use by supplier'
      );

      expect(result).toBe(true);
    });
  });

  describe('confirmMaterial', () => {
    beforeEach(() => {
      component.supplierPlantControl.enable({ emitEvent: false });
      component.supplierCountryControl.enable({ emitEvent: false });
      component.castingDiameterControl.enable({ emitEvent: false });
      component.castingModesControl.enable({ emitEvent: false });
      component.co2ClassificationControl.enable({ emitEvent: false });
      component.ratingChangeCommentControl.enable({ emitEvent: false });
      component.isManufacturerControl.enable({ emitEvent: false });
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
      const values = createMaterialFormValue(MaterialClass.STEEL);
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
      const baseValues = createMaterialFormValue(MaterialClass.STEEL);
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
      const values = createMaterialFormValue(MaterialClass.STEEL);
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
      const values = createMaterialFormValue(MaterialClass.STEEL);
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
      const values = createMaterialFormValue(MaterialClass.STEEL);
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

  describe('enableEditFields', () => {
    beforeEach(() => {
      component.releaseMonthControl.removeValidators = jest.fn();
      component.releaseYearControl.removeValidators = jest.fn();
    });
    it('should call the parent function and do nothing if a release date is present', () => {
      const mockFormValue = {
        releaseDateMonth: 1,
        releaseDateYear: 1,
      } as SteelMaterialFormValue;

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).not.toHaveBeenCalled();
      expect(
        component.releaseYearControl.removeValidators
      ).not.toHaveBeenCalled();
    });

    it('should call the parent function and remove the required validators if no release date month is present', () => {
      const mockFormValue = {
        releaseDateMonth: undefined,
        releaseDateYear: 1,
      } as SteelMaterialFormValue;

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
      expect(
        component.releaseYearControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
    });

    it('should call the parent function and remove the required validators if no release date year is present', () => {
      const mockFormValue = {
        releaseDateMonth: 1,
        releaseDateYear: undefined,
      } as SteelMaterialFormValue;

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
      expect(
        component.releaseYearControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
    });

    it('should call the parent function and not remove the validators in copy dialog', () => {
      const mockFormValue = {
        releaseDateMonth: 1,
        releaseDateYear: 1,
      } as SteelMaterialFormValue;
      component.isCopyDialog = jest.fn(() => true);

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).not.toHaveBeenCalled();
      expect(
        component.releaseYearControl.removeValidators
      ).not.toHaveBeenCalled();
    });
  });
});
