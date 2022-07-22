import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { HashMap, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ManufacturerSupplier, MaterialStandard } from '@mac/msd/models';
import { addCustomCastingDiameter } from '@mac/msd/store';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as en from '../../../../../assets/i18n/en.json';
import { InputDialogComponent } from './input-dialog.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('InputDialogComponent', () => {
  let component: InputDialogComponent;
  let spectator: Spectator<InputDialogComponent>;
  let store: MockStore;

  const mockMaterialStandards: MaterialStandard[] = [
    {
      id: 1,
      materialName: 'material1',
      standardDocument: 'S 1',
      materialNumber: '1.1234',
    },
    {
      id: 2,
      materialName: 'material2',
      standardDocument: 'S 2',
      materialNumber: '1.1234',
    },
  ];
  const mockSuppliers: ManufacturerSupplier[] = [
    {
      id: 1,
      name: 'supplier1',
      plant: 'plant1',
    },
    {
      id: 2,
      name: 'supplier2',
      plant: 'plant2',
    },
  ];

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

  const createComponent = createComponentFactory({
    component: InputDialogComponent,
    imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule,
      MatDividerModule,
      MatInputModule,
      MatSelectModule,
      MatOptionModule,
      MatCheckboxModule,
      SelectModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      PushModule,
      MatGridListModule,
      MatTooltipModule,
      SharedTranslocoModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.select = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
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
    describe('formControls', () => {
      // prepared values
      const matNameOption: StringOption = {
        id: 77,
        title: 'matName',
        data: {
          standardDocuments: [
            { id: 1, standardDocument: 'standard documents' },
          ],
        },
      } as StringOption;
      const stdDocOption: StringOption = {
        id: 42,
        title: 'stdDoc',
        data: {
          materialNames: [{ id: 1, materialName: 'materialName value' }],
        },
      } as StringOption;
      describe('modify standard documents', () => {
        it('should patch createMaterialForm and reset materialNames when stdDoc is undefined', () => {
          // prepare
          component.materialNamesControl.setValue(matNameOption, {
            emitEvent: false,
          });
          component.standardDocumentsControl.setValue(stdDocOption, {
            emitEvent: false,
          });
          // mock
          component.materialNamesControl.reset = jest.fn();
          component.materialStandardIdControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          // eslint-disable-next-line unicorn/no-useless-undefined
          component.standardDocumentsControl.setValue(undefined);

          expect(component.materialNamesControl.reset).toHaveBeenCalled();
          expect(component.materialStandardIdControl.reset).toHaveBeenCalled();
          expect(
            component.createMaterialForm.patchValue
          ).not.toHaveBeenCalled();
        });

        it('should patch createMaterialForm and reset materialNames', () => {
          // prepare
          component.materialNamesControl.setValue(matNameOption, {
            emitEvent: false,
          });
          // mock
          component.materialNamesControl.reset = jest.fn();
          // start patch
          component.standardDocumentsControl.patchValue(stdDocOption);

          expect(component.materialNamesControl.reset).toHaveBeenCalled();
        });

        it('should patch createMaterialForm and NOT reset materialNames with equal data', () => {
          // prepare
          component.materialNamesControl.setValue(matNameOption, {
            emitEvent: false,
          });
          // mock
          component.materialNamesControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.standardDocumentsControl.patchValue({
            ...stdDocOption,
            data: {
              materialNames: [{ id: 100, materialName: matNameOption.title }],
            },
          } as StringOption);

          expect(component.materialNamesControl.reset).not.toHaveBeenCalled();
          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            materialStandardId: 100,
          });
        });

        it('should NOT patch createMaterialForm and NOT reset materialNames with matName not set', () => {
          // mock
          component.materialNamesControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.standardDocumentsControl.patchValue(stdDocOption);

          expect(component.materialNamesControl.reset).not.toHaveBeenCalled();
          expect(
            component.createMaterialForm.patchValue
          ).not.toHaveBeenCalled();
        });
      });

      describe('modify material names', () => {
        it('should ignore updates if value is undefined', () => {
          // mock
          component.standardDocumentsControl.reset = jest.fn();
          component.materialStandardIdControl.reset = jest.fn();
          // start patch with undefined value
          // eslint-disable-next-line unicorn/no-useless-undefined
          component.materialNamesControl.patchValue(undefined);
          expect(component.standardDocumentsControl.reset).toHaveBeenCalled();
          expect(component.materialStandardIdControl.reset).toHaveBeenCalled();
        });

        it('should patch createMaterialForm and reset standardDoc', () => {
          // prepare
          component.standardDocumentsControl.setValue(stdDocOption, {
            emitEvent: false,
          });
          // mock
          component.standardDocumentsControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.materialNamesControl.patchValue(matNameOption);

          expect(component.standardDocumentsControl.reset).toHaveBeenCalled();
          expect(
            component.createMaterialForm.patchValue
          ).not.toHaveBeenCalled();
        });

        it('should NOT patch createMaterialForm and NOT reset standardDoc with equal data', () => {
          // prepare
          component.standardDocumentsControl.setValue(stdDocOption, {
            emitEvent: false,
          });
          // mock
          component.standardDocumentsControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.materialNamesControl.patchValue({
            ...matNameOption,
            data: {
              standardDocuments: [
                { id: 100, standardDocument: stdDocOption.title },
              ],
            },
          });

          expect(
            component.standardDocumentsControl.reset
          ).not.toHaveBeenCalled();
          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            materialStandardId: 100,
          });
        });

        it('should patch createMaterialForm and NOT reset standardDoc with matName not set', () => {
          // mock
          component.standardDocumentsControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.materialNamesControl.patchValue(matNameOption);

          expect(
            component.standardDocumentsControl.reset
          ).not.toHaveBeenCalled();
          expect(
            component.createMaterialForm.patchValue
          ).not.toHaveBeenCalled();
        });
      });

      describe('modify supplier', () => {
        const supplierOption = { id: '89', title: 'supplier' } as StringOption;
        const supplierPlantOption = {
          id: '32',
          title: 'supplierPlant',
          data: { supplierName: 'some supplier name' },
        } as StringOption;

        it('should disable plant selection with undefined supplier', async () => {
          // prepare
          component.supplierPlantsControl.setValue(supplierPlantOption, {
            emitEvent: false,
          });
          component.suppliersControl.setValue(supplierOption, {
            emitEvent: false,
          });
          // mock
          component.supplierPlantsControl.reset = jest.fn();
          component.supplierPlantsControl.enable = jest.fn();
          component.supplierPlantsControl.disable = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          // eslint-disable-next-line unicorn/no-useless-undefined
          component.suppliersControl.patchValue(undefined);

          expect(component.supplierPlantsControl.enable).not.toHaveBeenCalled();
          expect(component.supplierPlantsControl.disable).toHaveBeenCalled();
          expect(component.supplierPlantsControl.reset).toHaveBeenCalled();
        });

        it('should patch createMaterialForm and reset supplier plants', () => {
          // prepare
          component.supplierPlantsControl.setValue(supplierPlantOption);
          // mock
          component.supplierPlantsControl.disable = jest.fn();
          component.supplierPlantsControl.enable = jest.fn();
          component.supplierPlantsControl.reset = jest.fn();
          // start patch
          component.suppliersControl.patchValue(supplierOption);

          expect(
            component.supplierPlantsControl.disable
          ).not.toHaveBeenCalled();
          expect(component.supplierPlantsControl.enable).toHaveBeenCalled();
          expect(component.supplierPlantsControl.reset).toHaveBeenCalled();
        });

        it('should patch createMaterialForm and NOT reset supplier plants with equal title', () => {
          // prepare
          component.supplierPlantsControl.setValue({
            ...supplierPlantOption,
            data: {
              supplierName: supplierOption.title,
            },
          });
          // mock
          component.supplierPlantsControl.disable = jest.fn();
          component.supplierPlantsControl.enable = jest.fn();
          component.supplierPlantsControl.reset = jest.fn();
          // start patch
          component.suppliersControl.patchValue(supplierOption);

          expect(
            component.supplierPlantsControl.disable
          ).not.toHaveBeenCalled();
          expect(component.supplierPlantsControl.enable).toHaveBeenCalled();
          expect(component.supplierPlantsControl.reset).not.toHaveBeenCalled();
        });
      });
      describe('modify supplier plant', () => {
        const plantData: StringOption = {
          id: '11',
          title: '',
          data: { supplierId: 53 },
        };

        it('should patch createMaterialForm', () => {
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.supplierPlantsControl.patchValue(plantData);

          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            manufacturerSupplierId: plantData.data.supplierId,
          });
        });

        it('should reset createMaterialForm if plant is undefined', () => {
          component.supplierPlantsControl.setValue(plantData, {
            emitEvent: false,
          });
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          // eslint-disable-next-line unicorn/no-useless-undefined
          component.supplierPlantsControl.setValue(undefined);

          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            manufacturerSupplierId: undefined,
          });
        });
      });

      describe('modify Co2ScopeX', () => {
        it('should call validator with scope1', () => {
          component.co2TotalControl.updateValueAndValidity = jest.fn();
          component.co2Scope1Control.patchValue(7);
          expect(
            component.co2TotalControl.updateValueAndValidity
          ).toHaveBeenCalled();
        });
        it('should call validator with scope2', () => {
          component.co2TotalControl.updateValueAndValidity = jest.fn();
          component.co2Scope2Control.patchValue(7);
          expect(
            component.co2TotalControl.updateValueAndValidity
          ).toHaveBeenCalled();
        });

        it('should call validator with scope3', () => {
          component.co2TotalControl.updateValueAndValidity = jest.fn();
          component.co2Scope3Control.patchValue(7);
          expect(
            component.co2TotalControl.updateValueAndValidity
          ).toHaveBeenCalled();
        });

        it('should call validator with co2Total', () => {
          component.co2TotalControl.updateValueAndValidity = jest.fn();
          component.co2TotalControl.patchValue(7);
          expect(
            component.co2TotalControl.updateValueAndValidity
          ).toHaveBeenCalled();
        });
      });

      describe('modify co2TotalControl', () => {
        it('co2Classification should be enabled when co2Total has a value', () => {
          component.co2ClassificationControl.enable = jest.fn();
          component.co2ClassificationControl.disable = jest.fn();

          component.co2TotalControl.setValue(1);

          expect(
            component.co2ClassificationControl.disable
          ).not.toHaveBeenCalled();
          expect(component.co2ClassificationControl.enable).toHaveBeenCalled();
        });
        it('co2Classification should be disabled when co2Total has no value', () => {
          component.co2ClassificationControl.enable = jest.fn();
          component.co2ClassificationControl.disable = jest.fn();

          // eslint-disable-next-line unicorn/no-useless-undefined
          component.co2TotalControl.setValue(undefined);

          expect(component.co2ClassificationControl.disable).toHaveBeenCalled();
          expect(
            component.co2ClassificationControl.enable
          ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('ngOnDestory', () => {
    it('should complete the observable', () => {
      component.destroy$.next = jest.fn();
      component.destroy$.complete = jest.fn();

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('filterFn', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH ' };
    it('should return true with matching string', () => {
      expect(component.filterFn(option, option.title)).toBe(true);
    });
    it('should return true with undefined option', () => {
      expect(component.filterFn(undefined, option.title)).toBe(undefined);
    });
    it('should return true with undefined option title', () => {
      expect(
        component.filterFn({ id: 1, title: undefined }, option.title)
      ).toBe(undefined);
    });
    it('should Skip filter with undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component.filterFn(option, undefined)).toBe(true);
    });
    it('should accept with lowercase match', () => {
      expect(component.filterFn(option, option.title.toLowerCase())).toBe(true);
    });
    it('should accept with uppercase match', () => {
      expect(component.filterFn(option, option.title.toUpperCase())).toBe(true);
    });
    it('should accept with partial match', () => {
      expect(component.filterFn(option, option.title.slice(2, 7))).toBe(true);
    });
    it('should accept with empty string', () => {
      expect(component.filterFn(option, '')).toBe(true);
    });
    it('should accept with trailing whitespace', () => {
      expect(component.filterFn(option, `${option.title}    `)).toBe(true);
    });
    it('should accept with starting whitespace', () => {
      expect(component.filterFn(option, `    ${option.title}`)).toBe(true);
    });
  });

  describe('materialNameFilterFnFactory', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH' };

    it('should return true with no std doc set', () => {
      component.standardDocumentsControl.setValue(undefined, {
        emitEvent: false,
      });
      component.filterFn = jest.fn(() => true);
      expect(
        component.materialNameFilterFnFactory()(option, option.title)
      ).toBe(true);
      expect(component.filterFn).toHaveBeenCalledWith(option, option.title);
    });

    it('should return true with no "data" in  std doc set', () => {
      const stdDoc: StringOption = {
        id: 11,
        title: 'aBcDeFgH',
      };
      component.standardDocumentsControl.setValue(stdDoc, {
        emitEvent: false,
      });
      component.filterFn = jest.fn(() => true);
      expect(
        component.materialNameFilterFnFactory()(option, option.title)
      ).toBe(true);
      expect(component.filterFn).toHaveBeenCalledWith(option, option.title);
    });

    it('should return true with matching materialName', () => {
      const stdDoc: StringOption = {
        id: 24,
        title: 'aBcDeFgH',
        data: { materialNames: [{ id: 1, materialName: option.title }] },
      };
      component.filterFn = jest.fn(() => true);
      component.standardDocumentsControl.setValue(stdDoc, {
        emitEvent: false,
      });
      expect(component.materialNameFilterFnFactory()(option)).toBe(true);
      expect(component.filterFn).toHaveBeenCalledWith(option, undefined);
    });

    it('should return false with not matching materialname', () => {
      const stdDoc: StringOption = {
        id: 78,
        title: 'aBcDeFgH',
        data: { materialNames: [{ id: 1, materialName: 'other matName' }] },
      };
      component.filterFn = jest.fn(() => true);
      component.standardDocumentsControl.setValue(stdDoc, {
        emitEvent: false,
      });
      expect(
        component.materialNameFilterFnFactory()(option, option.title)
      ).toBeFalsy();
      expect(component.filterFn).not.toHaveBeenCalled();
    });
  });

  describe('standardDocumentFilterFnFactory', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH' };

    it('should return true with no material name set', () => {
      component.materialNamesControl.setValue(undefined, {
        emitEvent: false,
      });
      component.filterFn = jest.fn(() => true);
      expect(
        component.standardDocumentFilterFnFactory()(option, option.title)
      ).toBe(true);
      expect(component.filterFn).toHaveBeenCalledWith(option, option.title);
    });

    it('should return true with no "data" in  material name set', () => {
      const stdDoc: StringOption = {
        id: 11,
        title: 'aBcDeFgH',
      };
      component.materialNamesControl.setValue(stdDoc, {
        emitEvent: false,
      });
      component.filterFn = jest.fn(() => true);
      expect(
        component.standardDocumentFilterFnFactory()(option, option.title)
      ).toBe(true);
      expect(component.filterFn).toHaveBeenCalledWith(option, option.title);
    });

    it('should return true with matching standardDocument', () => {
      const stdDoc: StringOption = {
        id: 24,
        title: 'aBcDeFgH',
        data: {
          standardDocuments: [{ id: 1, standardDocument: option.title }],
        },
      };
      component.filterFn = jest.fn(() => true);
      component.materialNamesControl.setValue(stdDoc, {
        emitEvent: false,
      });
      expect(component.standardDocumentFilterFnFactory()(option)).toBe(true);
      expect(component.filterFn).toHaveBeenCalledWith(option, undefined);
    });

    it('should return false with not matching standardDocument', () => {
      const stdDoc: StringOption = {
        id: 78,
        title: 'aBcDeFgH',
        data: {
          standardDocuments: [
            { id: 1, standardDocument: 'other standard document' },
          ],
        },
      };
      component.filterFn = jest.fn(() => true);
      component.materialNamesControl.setValue(stdDoc, {
        emitEvent: false,
      });
      expect(
        component.standardDocumentFilterFnFactory()(option, option.title)
      ).toBeFalsy();
      expect(component.filterFn).not.toHaveBeenCalled();
    });
  });

  describe('valueTitleToOptionKeyFilterFnFactory', () => {
    const control = new FormControl<StringOption>(undefined);
    const option: StringOption = {
      id: 78,
      title: 'aBcDeFgH',
      data: { materialName: 'matName' },
    };
    it('should return true with undefined form value', () => {
      expect(
        component.valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with undefined title of form value', () => {
      control.setValue({ id: 1, title: undefined });
      expect(
        component.valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          option,
          option.title
        )
      ).toBe(true);
    });
    it('should return true with matching title of form value', () => {
      control.setValue({
        id: 1,
        title: 'match',
      });
      expect(
        component.valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          {
            ...option,
            data: {
              match: 'match',
            },
          },
          option.title
        )
      ).toBe(true);
    });
    it('should return false with nonmatching title of form value', () => {
      control.setValue({ id: 1, title: 'nonmatch' });
      expect(
        component.valueTitleToOptionKeyFilterFnFactory(control, 'match')(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });

  describe('valueOptionKeyToTitleFilterFnFactory', () => {
    const control = new FormControl<StringOption>(undefined);
    const option: StringOption = {
      id: 78,
      title: 'aBcDeFgH',
      data: { materialName: 'matName' },
    };
    it('should return true with undefined form value', () => {
      expect(
        component.valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with undefined data of form value', () => {
      control.setValue({ id: 1, title: 'title', data: undefined });
      expect(
        component.valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBe(true);
    });
    it('should return true with matching title of form value', () => {
      control.setValue({ id: 1, title: 'title', data: { key: option.title } });
      expect(
        component.valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBe(true);
    });
    it('should return false with nonmatching title of form value', () => {
      control.setValue({ id: 1, title: 'title', data: { key: 'sth else' } });
      expect(
        component.valueOptionKeyToTitleFilterFnFactory(control, 'key')(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });
  describe('addMaterial', () => {
    const option: StringOption = { id: 1, title: 'title' };
    const material = {
      manufacturerSupplierId: 1,
      materialStandardId: 1,
      blocked: false,
      castingDiameter: option,
      castingMode: '',
      co2Classification: option,
      co2PerTon: 1,
      co2Scope1: 2,
      co2Scope2: 3,
      co2Scope3: 3,
      materialName: option,
      maxDimension: 3,
      minDimension: 4,
      productCategory: option,
      rating: option,
      ratingRemark: '',
      referenceDoc: [option],
      releaseDateMonth: 12,
      releaseDateYear: 1223,
      releaseRestrictions: '',
      standardDocument: option,
      steelMakingProcess: option,
      supplier: option,
      supplierPlant: option,
    };
    it('store material and open snackbar with success?', () => {
      const mockSubject = new Subject();
      store.select = jest.fn(() => mockSubject);
      store.dispatch = jest.fn();
      component['snackbar'].open = jest.fn();
      component.createMaterialForm.setValue(material, { emitEvent: false });
      component.closeDialog = jest.fn();

      component.addMaterial();
      mockSubject.next(true);

      expect(store.dispatch).toBeCalled();
      expect(component['snackbar'].open).toBeCalled();
      expect(component.closeDialog).toHaveBeenCalledWith(true);
    });
    it('stores material and open snackbar with failure?', () => {
      const mockSubject = new Subject();
      store.select = jest.fn(() => mockSubject);
      store.dispatch = jest.fn();
      component['snackbar'].open = jest.fn();
      component.createMaterialForm.setValue(material, { emitEvent: false });

      component.addMaterial();
      mockSubject.next(false);

      expect(store.dispatch).toBeCalled();
      expect(component['snackbar'].open).toBeCalled();
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog('test');

      expect(component['dialogRef'].close).toHaveBeenCalledWith('test');
    });
  });

  describe('addReferenceDocument', () => {
    it('should add values to select', () => {
      const s = 'string';
      component.referenceDocument.push = jest.fn();
      component.addReferenceDocument(s);
      expect(component.referenceDocument.push).toHaveBeenCalledWith({
        id: s,
        title: s,
      });
    });
  });

  describe('addCastingDiameter', () => {
    it('should add values to select', () => {
      const castingDiameter = 'string';
      store.dispatch = jest.fn();
      component.addCastingDiameter(castingDiameter);
      expect(store.dispatch).toHaveBeenCalledWith(
        addCustomCastingDiameter({ castingDiameter })
      );
    });
  });

  describe('getErrorMessage', () => {
    it('should give error message with required', () => {
      component['getTranslatedError'] = jest.fn((key) => key);
      const result = component.getErrorMessage({ required: true });
      expect(component['getTranslatedError']).toHaveBeenCalledWith('required');
      expect(result).toEqual('required');
    });
    it('should give error message with min', () => {
      component['getTranslatedError'] = jest.fn(
        (key, params: HashMap) => `${key}${params.min}`
      );
      const result = component.getErrorMessage({
        min: { min: 1234, current: 99 },
      });
      expect(component['getTranslatedError']).toHaveBeenCalledWith('min', {
        min: 1234,
      });
      expect(result).toEqual('min1234');
    });

    it('should give error message with co2', () => {
      component['getTranslatedError'] = jest.fn(
        (key, params: HashMap) => `${key}${params.min}`
      );
      const result = component.getErrorMessage({
        scopeTotalLowerThanSingleScopes: { min: 6, current: 12 },
      });
      expect(component['getTranslatedError']).toHaveBeenCalledWith(
        'co2TooLowShort',
        { min: 6 }
      );
      expect(result).toEqual('co2TooLowShort6');
    });
    it('should give error message with generic', () => {
      component['getTranslatedError'] = jest.fn((key) => key);
      const result = component.getErrorMessage({ nothing: true });
      expect(component['getTranslatedError']).toHaveBeenCalledWith('generic');
      expect(result).toEqual('generic');
    });
  });

  describe('scopeTotalValidatorFn', () => {
    it('should return undefined with all controlles correctly filled', () => {
      component.co2Scope1Control.setValue(1);
      component.co2Scope2Control.setValue(2);
      component.co2Scope3Control.setValue(3);
      const control = new FormControl<number>(6);
      expect(component['scopeTotalValidatorFn']()(control)).toBe(undefined);
    });
    it('should return undefined with all scope1 missing', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.co2Scope1Control.setValue(undefined);
      component.co2Scope2Control.setValue(6);
      component.co2Scope3Control.setValue(6);
      const control = new FormControl<number>(6);
      expect(component['scopeTotalValidatorFn']()(control)).toMatchObject({
        scopeTotalLowerThanSingleScopes: { min: 12, current: 6 },
      });
    });
    it('should return undefined with all scope2 missing', () => {
      component.co2Scope1Control.setValue(6);
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.co2Scope2Control.setValue(undefined);
      component.co2Scope3Control.setValue(6);
      const control = new FormControl<number>(6);
      expect(component['scopeTotalValidatorFn']()(control)).toMatchObject({
        scopeTotalLowerThanSingleScopes: { min: 12, current: 6 },
      });
    });
    it('should return undefined with all scope3 missing', () => {
      component.co2Scope1Control.setValue(6);
      component.co2Scope2Control.setValue(6);
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.co2Scope3Control.setValue(undefined);
      const control = new FormControl<number>(6);
      expect(component['scopeTotalValidatorFn']()(control)).toMatchObject({
        scopeTotalLowerThanSingleScopes: { min: 12, current: 6 },
      });
    });
    it('should return error with all control undefined', () => {
      component.co2Scope1Control.setValue(6);
      component.co2Scope2Control.setValue(6);
      component.co2Scope3Control.setValue(6);
      const control = new FormControl<number>(undefined);
      expect(component['scopeTotalValidatorFn']()(control)).toBe(undefined);
    });
    it('should return error with all controlles correctly filled', () => {
      component.co2Scope1Control.setValue(6);
      component.co2Scope2Control.setValue(6);
      component.co2Scope3Control.setValue(6);
      const control = new FormControl<number>(6);
      expect(component['scopeTotalValidatorFn']()(control)).not.toBe(undefined);
    });
  });
});
