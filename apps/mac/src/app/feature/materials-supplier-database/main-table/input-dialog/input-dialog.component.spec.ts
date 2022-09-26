import { CommonModule } from '@angular/common';
import { ElementRef, QueryList } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
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

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CreateMaterialRecord,
  DataResult,
  DialogData,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialStandard,
} from '@mac/msd/models';
import {
  addCustomCastingDiameter,
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
  addCustomReferenceDocument,
  addCustomSupplierName,
  addCustomSupplierPlant,
  fetchCastingDiameters,
  fetchCo2ValuesForSupplierSteelMakingProcess,
  fetchReferenceDocuments,
} from '@mac/msd/store';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as en from '../../../../../assets/i18n/en.json';
import { InputDialogComponent } from './input-dialog.component';
import { DialogControlsService } from './services';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('InputDialogComponent', () => {
  let component: InputDialogComponent;
  let spectator: Spectator<InputDialogComponent>;

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
      selfCertified: true,
    },
    {
      id: 2,
      name: 'supplier2',
      plant: 'plant2',
      selfCertified: false,
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
  const createOption = (title: string, data?: any) =>
    ({ id: 2, title, data } as StringOption);

  const mockDialogData: DialogData = {
    editMaterial: {
      row: {
        id: 1,
        materialClass: 'st',
        materialClassText: 'Steel',
        materialStandardId: 1,
        materialStandardMaterialName: 'material',
        materialStandardStandardDocument: 'document',
        manufacturerSupplierId: 1,
        manufacturerSupplierName: 'supplier',
        manufacturerSupplierPlant: 'plant',
        productCategory: 'brightBar',
        productCategoryText: 'Bright Bar',
        referenceDoc: '["reference"]',
        co2Scope1: 1,
        co2Scope2: 1,
        co2Scope3: 1,
        co2PerTon: 3,
        co2Classification: 'C1',
        releaseDateYear: 1,
        releaseDateMonth: 1,
        releaseRestrictions: 'restriction',
        blocked: false,
        castingMode: 'mode',
        castingDiameter: 'diameter',
        minDimension: 1,
        maxDimension: 1,
        steelMakingProcess: 'process',
        rating: 'rating',
        ratingRemark: 'remark',
        ratingChangeComment: 'comment',
      } as DataResult,
      column: 'column',
      parsedMaterial: {
        manufacturerSupplierId: 1,
        materialStandardId: 1,
        productCategory: {
          id: 'brightBar',
          title: undefined,
        },
        referenceDoc: [{ id: 'reference', title: 'reference' }],
        co2Scope1: 1,
        co2Scope2: 1,
        co2Scope3: 1,
        co2PerTon: 3,
        materialNumber: undefined,
        co2Classification: {
          id: 'C1',
          title: undefined,
        },
        releaseDateYear: 1,
        releaseDateMonth: 1,
        releaseRestrictions: 'restriction',
        blocked: false,
        castingMode: 'mode',
        castingDiameter: { id: 'diameter', title: 'diameter' },
        maxDimension: 1,
        minDimension: 1,
        steelMakingProcess: {
          id: 'process',
          title: 'process',
        },
        rating: { id: 'rating', title: 'rating' },
        ratingRemark: 'remark',
        standardDocument: {
          id: 1,
          title: 'document',
        },
        materialName: {
          id: 1,
          title: 'material',
        },
        supplier: {
          id: 1,
          title: 'supplier',
        },
        supplierPlant: {
          id: 'plant',
          title: 'plant',
          data: {
            supplierId: 1,
            supplierName: 'supplier',
          },
        },
      },
      materialNames: [],
      standardDocuments: [],
    },
  };

  const mockDialogDataPartial: DialogData = {
    editMaterial: {
      row: {
        id: 1,
        materialClass: 'st',
        materialClassText: 'Steel',
        materialStandardId: 1,
        materialStandardMaterialName: 'material',
        materialStandardStandardDocument: 'document',
        manufacturerSupplierId: 1,
        manufacturerSupplierName: 'supplier',
        manufacturerSupplierPlant: 'plant',
        productCategory: 'brightBar',
        productCategoryText: 'Bright Bar',
        referenceDoc: 'reference',
        releaseDateYear: 1,
        releaseDateMonth: 1,
        releaseRestrictions: 'restriction',
        blocked: false,
        castingMode: 'mode',
        minDimension: 1,
        maxDimension: 1,
        ratingRemark: 'remark',
        ratingChangeComment: 'comment',
      } as DataResult,
      parsedMaterial: {
        manufacturerSupplierId: 1,
        materialStandardId: 1,
        productCategory: {
          id: 'brightBar',
          title: undefined,
        },
        referenceDoc: [{ id: 'reference', title: 'reference' }],
        co2Scope1: undefined,
        co2Scope2: undefined,
        co2Scope3: undefined,
        co2PerTon: undefined,
        materialNumber: undefined,
        co2Classification: undefined,
        releaseDateYear: 1,
        releaseDateMonth: 1,
        releaseRestrictions: 'restriction',
        blocked: false,
        castingMode: 'mode',
        castingDiameter: undefined,
        maxDimension: 1,
        minDimension: 1,
        steelMakingProcess: undefined,
        rating: { id: undefined, title: undefined },
        ratingRemark: 'remark',
        standardDocument: {
          id: 1,
          title: 'document',
        },
        materialName: {
          id: 1,
          title: 'material',
        },
        supplier: {
          id: 1,
          title: 'supplier',
        },
        supplierPlant: {
          id: 'plant',
          title: 'plant',
          data: {
            supplierId: 1,
            supplierName: 'supplier',
          },
        },
      },
      column: 'column',
      materialNames: [],
      standardDocuments: [],
    },
  };

  const mockDialogDataMinimized: DialogData = {
    minimizedDialog: {
      id: 1,
      value: {
        manufacturerSupplierId: 1,
        materialStandardId: 1,
        productCategory: {
          id: 'brightBar',
          title: undefined,
        },
        referenceDoc: [{ id: 'reference', title: 'reference' }],
        co2Scope1: undefined,
        co2Scope2: undefined,
        co2Scope3: undefined,
        co2PerTon: undefined,
        materialNumber: undefined,
        co2Classification: undefined,
        releaseDateYear: 1,
        releaseDateMonth: 1,
        releaseRestrictions: 'restriction',
        blocked: false,
        maxDimension: 1,
        minDimension: 1,
        steelMakingProcess: undefined,
        rating: { id: undefined, title: undefined },
        ratingRemark: 'remark',
        standardDocument: {
          id: 1,
          title: 'document',
        },
        materialName: {
          id: 1,
          title: 'material',
        },
        supplier: {
          id: 1,
          title: 'supplier',
        },
        supplierPlant: {
          id: 'plant',
          title: 'plant',
          data: {
            supplierId: 1,
            supplierName: 'supplier',
          },
        },
      },
    },
  };

  const minimizeValue: Partial<MaterialFormValue> = {
    manufacturerSupplierId: 1,
    materialStandardId: 1,
    productCategory: {
      id: 'brightBar',
      title: undefined,
    },
    referenceDoc: [{ id: 'reference', title: 'reference' }],
    co2Scope1: 1,
    co2Scope2: 1,
    co2Scope3: 1,
    co2PerTon: 3,
    materialNumber: '1.1234',
    releaseDateYear: 1,
    releaseDateMonth: 1,
    releaseRestrictions: 'restriction',
    blocked: false,
    castingMode: 'mode',
    maxDimension: 1,
    minDimension: 1,
    steelMakingProcess: {
      id: 'process',
      title: 'process',
    },
    rating: { id: 'rating', title: 'rating' },
    ratingRemark: 'remark',
    standardDocument: {
      id: 1,
      title: 'document',
    },
    materialName: {
      id: 1,
      title: 'material',
    },
    supplier: {
      id: 1,
      title: 'supplier',
    },
    supplierPlant: {
      id: 'plant',
      title: 'plant',
      data: {
        supplierId: 1,
        supplierName: 'supplier',
      },
    },
  };

  const mockValue: Partial<MaterialFormValue> = {
    manufacturerSupplierId: 1,
    materialStandardId: 1,
    productCategory: {
      id: 'brightBar',
      title: undefined,
    },
    referenceDoc: [{ id: 'reference', title: 'reference' }],
    co2Scope1: undefined,
    co2Scope2: undefined,
    co2Scope3: undefined,
    co2PerTon: undefined,
    materialNumber: undefined,
    co2Classification: undefined,
    releaseDateYear: 1,
    releaseDateMonth: 1,
    releaseRestrictions: 'restriction',
    blocked: false,
    maxDimension: 1,
    minDimension: 1,
    steelMakingProcess: undefined,
    rating: { id: undefined, title: undefined },
    ratingRemark: 'remark',
    standardDocument: {
      id: 1,
      title: 'document',
    },
    materialName: {
      id: 1,
      title: 'material',
    },
    supplier: {
      id: 1,
      title: 'supplier',
    },
    supplierPlant: {
      id: 'plant',
      title: 'plant',
      data: {
        supplierId: 1,
        supplierName: 'supplier',
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
      DialogControlsService,
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
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

        it('should patch createMaterialForm and NOT reset materialNames with custom material name', () => {
          // prepare
          component.materialNamesControl.setValue(
            {
              id: undefined,
              title: 'customMatName',
            } as StringOption,
            {
              emitEvent: false,
            }
          );
          // mock
          component.materialNamesControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.standardDocumentsControl.setValue(stdDocOption);

          expect(component.materialNamesControl.reset).not.toHaveBeenCalled();
          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            materialStandardId: undefined,
          });
        });

        it('should patch createMaterialForm and NOT reset materialNames with custom standard document', () => {
          // prepare
          component.materialNamesControl.setValue(matNameOption, {
            emitEvent: false,
          });
          // mock
          component.materialNamesControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.standardDocumentsControl.setValue({
            id: undefined,
            title: 'custom standard document',
          } as StringOption);

          expect(component.materialNamesControl.reset).not.toHaveBeenCalled();
          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            materialStandardId: undefined,
          });
        });

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

      describe('modify material name', () => {
        it('should patch createMaterialForm and NOT reset stdDoc with equal data', () => {
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
          } as StringOption);

          expect(
            component.standardDocumentsControl.reset
          ).not.toHaveBeenCalled();
          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            materialStandardId: 100,
          });
        });

        it('should patch createMaterialForm and NOT reset stdDoc with custom std doc', () => {
          // prepare
          component.standardDocumentsControl.setValue(
            { id: undefined, title: 'customStdDoc' } as StringOption,
            {
              emitEvent: false,
            }
          );
          // mock
          component.standardDocumentsControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.materialNamesControl.setValue(matNameOption);

          expect(
            component.standardDocumentsControl.reset
          ).not.toHaveBeenCalled();
          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            materialStandardId: undefined,
          });
        });

        it('should patch createMaterialForm and NOT reset stdDoc with custom matName', () => {
          // prepare
          component.standardDocumentsControl.setValue(stdDocOption, {
            emitEvent: false,
          });
          // mock
          component.standardDocumentsControl.reset = jest.fn();
          component.createMaterialForm.patchValue = jest.fn();
          // start patch
          component.materialNamesControl.setValue({
            id: undefined,
            title: 'customMatName',
          } as StringOption);

          expect(
            component.standardDocumentsControl.reset
          ).not.toHaveBeenCalled();
          expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith({
            materialStandardId: undefined,
          });
        });

        describe('modify supplierPlants', () => {
          it('should set and disable selfCertified on true SC', () => {
            const option: StringOption = {
              id: 1,
              title: 'title',
              data: {
                selfCertified: true,
              },
            };
            component['supplierPlantsControl'].patchValue(option);
            expect(component.selfCertifiedControl.enabled).not.toBeTruthy();
            expect(component.selfCertifiedControl.value).toBeTruthy();
          });

          it('should set and disable selfCertified on false SC', () => {
            const option: StringOption = {
              id: 1,
              title: 'title',
              data: {
                selfCertified: false,
              },
            };
            component['supplierPlantsControl'].patchValue(option);
            expect(component.selfCertifiedControl.enabled).not.toBeTruthy();
            expect(component.selfCertifiedControl.value).not.toBeTruthy();
          });
          it('should enable selfCertified on new supplier', () => {
            // new supplier do not have an id or data element
            const option: StringOption = {
              id: undefined,
              title: 'title',
            };
            component['supplierPlantsControl'].patchValue(option);
            expect(component.selfCertifiedControl.enabled).toBeTruthy();
            expect(component.selfCertifiedControl.value).not.toBeTruthy();
          });
        });

        describe('modify casting supplier dependencies', () => {
          it('should disable castingDiameter if supplierId is not defined', () => {
            component.castingDiameterControl.disable = jest.fn();
            component.castingModesControl.reset = jest.fn();

            component['suppliersDependencies'].patchValue({
              supplierName: undefined,
              castingMode: 'ingot',
            });

            expect(component.castingDiameterControl.disable).toHaveBeenCalled();
            expect(component.castingModesControl.reset).toHaveBeenCalled();
          });

          it('should disable castingDiameter if castingMode is not defined', () => {
            component.castingModesControl.enable = jest.fn();
            component.castingDiameterControl.disable = jest.fn();

            component.suppliersControl.setValue(createOption('supplierA'));
            component.supplierPlantsControl.setValue(
              createOption('plant', { supplierName: 'supplierA' })
            );

            expect(component.castingDiameterControl.disable).toHaveBeenCalled();
            expect(component.castingModesControl.enable).toHaveBeenCalled();
          });

          it('should enable castingDiameter and fetch if supplier and castingMode are defined', () => {
            component.castingDiameterControl.enable = jest.fn();
            component['dialogFacade'].dispatch = jest.fn();

            component.suppliersControl.setValue(createOption('supplierA'));
            component.supplierPlantsControl.setValue(
              createOption('plant', {
                supplierName: 'supplierA',
                supplierId: 1,
              })
            );
            component.castingModesControl.patchValue('ingot');

            expect(component.castingDiameterControl.enable).toHaveBeenCalled();
            expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
              fetchCastingDiameters({ supplierId: 1, castingMode: 'ingot' })
            );
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
            expect(
              component.materialStandardIdControl.reset
            ).toHaveBeenCalled();
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
            expect(
              component.createMaterialForm.patchValue
            ).toHaveBeenCalledWith({
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
          const supplierOption = {
            id: '89',
            title: 'supplier',
          } as StringOption;
          const supplierPlantOption = {
            id: '32',
            title: 'supplierPlant',
            data: { supplierName: 'supplier' },
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

            expect(
              component.supplierPlantsControl.enable
            ).not.toHaveBeenCalled();
            expect(component.supplierPlantsControl.disable).toHaveBeenCalled();
            expect(component.supplierPlantsControl.reset).toHaveBeenCalled();
          });

          it('should patch createMaterialForm and reset supplier plants', () => {
            // prepare
            component.suppliersControl.patchValue(supplierOption);
            component.supplierPlantsControl.setValue(supplierPlantOption);
            // mock
            component.supplierPlantsControl.disable = jest.fn();
            component.supplierPlantsControl.enable = jest.fn();
            component.supplierPlantsControl.reset = jest.fn();
            // start patch
            component.suppliersControl.patchValue(
              createOption('other supplier')
            );

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
            expect(
              component.supplierPlantsControl.reset
            ).not.toHaveBeenCalled();
          });
        });
        describe('modify supplier plant', () => {
          const supplier: StringOption = createOption('supplier');
          const plant: StringOption = {
            ...createOption('plant'),
            data: {
              supplierId: 22,
              supplierName: 'supplier',
            },
          };

          it('should patch createMaterialForm', () => {
            component.manufacturerSupplierIdControl.patchValue = jest.fn();
            // start patch
            component.suppliersControl.patchValue(supplier);
            component.supplierPlantsControl.patchValue(plant);

            expect(
              component.manufacturerSupplierIdControl.patchValue
            ).toHaveBeenCalledWith(plant.data.supplierId);
          });

          it('should reset createMaterialForm if plant is undefined', () => {
            component.suppliersControl.patchValue(supplier, {
              emitEvent: false,
            });
            component.supplierPlantsControl.setValue(plant, {
              emitEvent: false,
            });
            component.manufacturerSupplierIdControl.reset = jest.fn();
            // start patch
            // eslint-disable-next-line unicorn/no-useless-undefined
            component.supplierPlantsControl.setValue(undefined);

            expect(
              component.manufacturerSupplierIdControl.reset
            ).toHaveBeenCalled();
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
            expect(
              component.co2ClassificationControl.enable
            ).toHaveBeenCalled();
          });
          it('co2Classification should be disabled when co2Total has no value', () => {
            component.co2ClassificationControl.enable = jest.fn();
            component.co2ClassificationControl.disable = jest.fn();

            // eslint-disable-next-line unicorn/no-useless-undefined
            component.co2TotalControl.setValue(undefined);

            expect(
              component.co2ClassificationControl.disable
            ).toHaveBeenCalled();
            expect(
              component.co2ClassificationControl.enable
            ).not.toHaveBeenCalled();
          });
        });

        describe('modify rating', () => {
          it('ratingChangeComment should be enabled when rating has a value', () => {
            component.ratingChangeCommentControl.enable = jest.fn();
            component.ratingChangeCommentControl.disable = jest.fn();

            component.ratingsControl.setValue({
              id: 1,
              title: 'title',
            } as StringOption);

            expect(
              component.ratingChangeCommentControl.disable
            ).not.toHaveBeenCalled();
            expect(
              component.ratingChangeCommentControl.enable
            ).toHaveBeenCalled();
          });
          it('co2Classification should be disabled when co2Total has no value', () => {
            component.ratingChangeCommentControl.enable = jest.fn();
            component.ratingChangeCommentControl.disable = jest.fn();

            // eslint-disable-next-line unicorn/no-useless-undefined
            component.ratingsControl.setValue({
              id: undefined,
              title: 'None',
            } as StringOption);

            expect(
              component.ratingChangeCommentControl.disable
            ).toHaveBeenCalled();
            expect(
              component.ratingChangeCommentControl.enable
            ).not.toHaveBeenCalled();
            expect(component.ratingChangeCommentControl.value).toBe(undefined);
          });
        });

        describe('modify material standard', () => {
          it('should dispatch fetch action for reference documents on material standard id change', () => {
            component['dialogFacade'].dispatch = jest.fn();
            component.materialStandardIdControl.patchValue(5);

            expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
              fetchReferenceDocuments({ materialStandardId: 5 })
            );
          });
        });

        describe('modify co2Dependencies', () => {
          it('should dispatch the fetch action if both values are set', () => {
            component['dialogFacade'].dispatch = jest.fn();
            component.manufacturerSupplierIdControl.setValue(1, {
              emitEvent: false,
            });
            component.steelMakingProcessControl.setValue({
              id: 'BF+BOF',
              title: 'BF+BOF',
            });

            expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
              fetchCo2ValuesForSupplierSteelMakingProcess({
                supplierId: 1,
                steelMakingProcess: 'BF+BOF',
              })
            );
          });
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

  describe('ngAfterViewInit', () => {
    describe('with full material', () => {
      beforeEach(() => {
        component['dialogData'].editMaterial = mockDialogData.editMaterial;
      });

      it('should prepare the form', () => {
        component['dialogFacade'].dispatch = jest.fn();

        component.supplierPlantsControl.enable = jest.fn();
        component.castingModesControl.enable = jest.fn();
        component.castingDiameterControl.enable = jest.fn();

        component.ratingChangeCommentControl.disable = jest.fn();

        component.co2ClassificationControl.enable = jest.fn();

        component.createMaterialForm.patchValue = jest.fn();
        component.createMaterialForm.markAllAsTouched = jest.fn();

        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        component.ngAfterViewInit();

        expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
          fetchReferenceDocuments({ materialStandardId: 1 })
        );
        expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
          fetchCastingDiameters({ supplierId: 1, castingMode: 'mode' })
        );
        expect(component.supplierPlantsControl.enable).toHaveBeenCalled();
        expect(component.castingModesControl.enable).toHaveBeenCalled();
        expect(component.castingDiameterControl.enable).toHaveBeenCalled();
        expect(component.ratingChangeCommentControl.disable).toHaveBeenCalled();
        expect(component.co2ClassificationControl.enable).toHaveBeenCalled();
        expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith(
          mockDialogData.editMaterial.parsedMaterial
        );
        expect(
          component.createMaterialForm.markAllAsTouched
        ).toHaveBeenCalled();

        expect(component['cdRef'].markForCheck).toHaveBeenCalled();
        expect(component['cdRef'].detectChanges).toHaveBeenCalled();
      });
    });

    describe('focusSelectedElement', () => {
      const editMaterial = {
        row: undefined as DataResult,
        parsedMaterial: undefined as Partial<MaterialFormValue>,
        materialNames: [{ id: 1, materialName: 'name' }],
        standardDocuments: [{ id: 1, standardDocument: 'doc' }],
        column: 'lookup',
      };
      const nameMatch = {
        name: 'lookup',
        focus: jest.fn(),
      };
      const htmlMatch = {
        outerHTML: 'name="lookup"',
        focus: jest.fn(),
        querySelector: jest.fn(),
        scrollIntoView: jest.fn(),
      };
      it('should focus matching by name', () => {
        component['dialogData'].editMaterial = editMaterial;
        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        const changes = new Array<ElementRef>(
          new ElementRef({ name: 'nomatch' }),
          new ElementRef(nameMatch)
        );

        component['focusSelectedElement'](
          changes as unknown as QueryList<ElementRef>
        );

        expect(nameMatch.focus).toBeCalled();
        expect(component['cdRef'].markForCheck).toBeCalled();
        expect(component['cdRef'].detectChanges).toBeCalled();
      });
      it('should focus matching html element', () => {
        component['dialogData'].editMaterial = editMaterial;
        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        const changes = new Array<ElementRef>(
          new ElementRef({ outerHTML: 'nomatch' }),
          new ElementRef(htmlMatch)
        );

        component['focusSelectedElement'](
          changes as unknown as QueryList<ElementRef>
        );

        expect(htmlMatch.focus).toBeCalled();
        expect(htmlMatch.scrollIntoView).toBeCalled();
        expect(htmlMatch.querySelector).toHaveBeenCalledWith('mat-select');
        expect(htmlMatch.querySelector).toHaveBeenCalledWith('input');
        expect(component['cdRef'].markForCheck).toBeCalled();
        expect(component['cdRef'].detectChanges).toBeCalled();
      });

      it('should focus html child element mat-select', () => {
        component['dialogData'].editMaterial = editMaterial;
        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();
        const result = { focus: jest.fn() };
        htmlMatch.querySelector = jest.fn((s: string) =>
          s === 'mat-select' ? result : undefined
        );

        const changes = new Array<ElementRef>(
          new ElementRef({ outerHTML: 'nomatch' }),
          new ElementRef(htmlMatch)
        );

        component['focusSelectedElement'](
          changes as unknown as QueryList<ElementRef>
        );

        expect(result.focus).toBeCalled();
        expect(htmlMatch.scrollIntoView).toBeCalled();
        expect(htmlMatch.querySelector).toHaveBeenCalledWith('mat-select');
        expect(htmlMatch.querySelector).toHaveBeenCalledWith('input');
        expect(htmlMatch.focus).not.toBeCalled();
        expect(component['cdRef'].markForCheck).toBeCalled();
        expect(component['cdRef'].detectChanges).toBeCalled();
      });

      it('should focus html child element input', () => {
        component['dialogData'].editMaterial = editMaterial;
        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();
        const result = { focus: jest.fn() };
        htmlMatch.querySelector = jest.fn((s: string) =>
          s === 'input' ? result : undefined
        );

        const changes = new Array<ElementRef>(
          new ElementRef({ outerHTML: 'nomatch' }),
          new ElementRef(htmlMatch)
        );

        component['focusSelectedElement'](
          changes as unknown as QueryList<ElementRef>
        );

        expect(result.focus).toBeCalled();
        expect(htmlMatch.scrollIntoView).toBeCalled();
        expect(htmlMatch.querySelector).toHaveBeenCalledWith('mat-select');
        expect(htmlMatch.querySelector).toHaveBeenCalledWith('input');
        expect(htmlMatch.focus).not.toBeCalled();
        expect(component['cdRef'].markForCheck).toBeCalled();
        expect(component['cdRef'].detectChanges).toBeCalled();
      });
    });

    describe('without co2 value and parsable reference document', () => {
      beforeEach(() => {
        component['dialogData'].editMaterial =
          mockDialogDataPartial.editMaterial;
      });

      it('should prepare the form', () => {
        component['dialogFacade'].dispatch = jest.fn();

        component.supplierPlantsControl.enable = jest.fn();
        component.castingModesControl.enable = jest.fn();
        component.castingDiameterControl.enable = jest.fn();

        component.ratingChangeCommentControl.disable = jest.fn();

        component.co2ClassificationControl.enable = jest.fn();

        component.createMaterialForm.patchValue = jest.fn();
        component.createMaterialForm.markAllAsTouched = jest.fn();

        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        component.ngAfterViewInit();

        expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
          fetchReferenceDocuments({ materialStandardId: 1 })
        );
        expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
          fetchCastingDiameters({ supplierId: 1, castingMode: 'mode' })
        );
        expect(component.supplierPlantsControl.enable).toHaveBeenCalled();
        expect(component.castingModesControl.enable).toHaveBeenCalled();
        expect(component.castingDiameterControl.enable).toHaveBeenCalled();
        expect(component.ratingChangeCommentControl.disable).toHaveBeenCalled();
        expect(
          component.co2ClassificationControl.enable
        ).not.toHaveBeenCalled();
        expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith(
          mockDialogDataPartial.editMaterial.parsedMaterial
        );
        expect(
          component.createMaterialForm.markAllAsTouched
        ).toHaveBeenCalled();

        expect(component['cdRef'].markForCheck).toHaveBeenCalled();
        expect(component['cdRef'].detectChanges).toHaveBeenCalled();
      });
    });

    describe('with minimized dialog', () => {
      beforeEach(() => {
        component['dialogData'].minimizedDialog =
          mockDialogDataMinimized.minimizedDialog;
      });

      it('should prepare the form', () => {
        component['dialogFacade'].dispatch = jest.fn();

        component.supplierPlantsControl.enable = jest.fn();
        component.castingModesControl.enable = jest.fn();
        component.castingDiameterControl.enable = jest.fn();

        component.ratingChangeCommentControl.disable = jest.fn();

        component.co2ClassificationControl.enable = jest.fn();

        component.createMaterialForm.patchValue = jest.fn();
        component.createMaterialForm.markAllAsTouched = jest.fn();

        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        component.ngAfterViewInit();

        expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
          fetchReferenceDocuments({ materialStandardId: 1 })
        );
        expect(component['dialogFacade'].dispatch).not.toHaveBeenCalledWith(
          fetchCastingDiameters({ supplierId: 1, castingMode: 'mode' })
        );
        expect(component.supplierPlantsControl.enable).toHaveBeenCalled();
        expect(component.castingModesControl.enable).toHaveBeenCalled();
        expect(component.ratingChangeCommentControl.disable).toHaveBeenCalled();
        expect(
          component.co2ClassificationControl.enable
        ).not.toHaveBeenCalled();
        expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith(
          mockValue
        );
        expect(
          component.createMaterialForm.markAllAsTouched
        ).toHaveBeenCalled();

        expect(component['cdRef'].markForCheck).toHaveBeenCalled();
        expect(component['cdRef'].detectChanges).toHaveBeenCalled();
      });
    });
  });

  describe('addMaterial', () => {
    const option: StringOption = { id: 1, title: 'title' };
    const supplierOption = { id: '89', title: 'supplier' } as StringOption;
    const supplierPlantOption = {
      id: '32',
      title: 'supplierPlant',
      data: { supplierName: 'supplier' },
    } as StringOption;

    const material = {
      manufacturerSupplierId: 1,
      selfCertified: false,
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
      ratingChangeComment: '',
      referenceDoc: [option],
      releaseDateMonth: 12,
      releaseDateYear: 1223,
      releaseRestrictions: '',
      standardDocument: option,
      steelMakingProcess: option,
      supplier: supplierOption,
      supplierPlant: supplierPlantOption,
      materialNumber: '1.1234',
    };
    it('store material and open snackbar with success?', () => {
      const mockSubject = new Subject<CreateMaterialRecord>();
      component['dialogFacade'].dispatch = jest.fn();
      component['dialogFacade'].createMaterialRecord$ = mockSubject;
      component['snackbar'].open = jest.fn();
      component.closeDialog = jest.fn();
      const createMaterialRecord = {
        error: false,
      } as CreateMaterialRecord;

      component.suppliersControl.setValue(supplierOption);
      component.supplierPlantsControl.setValue(supplierPlantOption);
      component.castingModesControl.setValue('sth');
      component.castingDiameterControl.setValue(option);
      component.createMaterialForm.setValue(material, { emitEvent: false });

      component.confirmMaterial();
      mockSubject.next(createMaterialRecord);

      expect(component['dialogFacade'].dispatch).toBeCalled();
      expect(component['snackbar'].open).toBeCalled();
      expect(component.closeDialog).toHaveBeenCalledWith(true);
    });
    it('stores material and open snackbar with failure?', () => {
      const mockSubject = new Subject<CreateMaterialRecord>();
      component['dialogFacade'].dispatch = jest.fn();
      component['dialogFacade'].createMaterialRecord$ = mockSubject;
      component['snackbar'].open = jest.fn();
      component.closeDialog = jest.fn();
      const createMaterialRecord = {
        error: true,
      } as CreateMaterialRecord;

      component.suppliersControl.setValue(supplierOption);
      component.supplierPlantsControl.setValue(supplierPlantOption);
      component.castingModesControl.setValue('sth');
      component.castingDiameterControl.setValue(option);
      component.createMaterialForm.setValue(material, { emitEvent: false });

      component.confirmMaterial();
      mockSubject.next(createMaterialRecord);

      expect(component['snackbar'].open).toBeCalled();
      expect(component.closeDialog).not.toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog with reload', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog(true);

      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        reload: true,
      });
    });
  });

  describe('cancelDialog', () => {
    it('should call closeDialog with false', () => {
      component.closeDialog = jest.fn();

      component.cancelDialog();

      expect(component.closeDialog).toHaveBeenCalledWith(false);
    });
  });

  describe('minimizeDialog', () => {
    it('should close the dialog with the minimize data', () => {
      component['dialogRef'].close = jest.fn();
      component.materialId = 1;
      component.createMaterialForm.patchValue(minimizeValue, {
        emitEvent: false,
      });

      component.minimizeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        minimize: { id: 1, value: minimizeValue },
      });
    });
  });

  describe('addReferenceDocument', () => {
    it('should add values to select', () => {
      const referenceDocument = 'string';
      component['dialogFacade'].dispatch = jest.fn();
      component.addReferenceDocument(referenceDocument);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomReferenceDocument({ referenceDocument })
      );
    });
  });

  describe('addCastingDiameter', () => {
    it('should add values to select', () => {
      const castingDiameter = 'string';
      component['dialogFacade'].dispatch = jest.fn();
      component.addCastingDiameter(castingDiameter);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomCastingDiameter({ castingDiameter })
      );
    });
  });

  describe('addStandardDocument', () => {
    it('should add values to select', () => {
      const standardDocument = 'string';
      component['dialogFacade'].dispatch = jest.fn();
      component.addStandardDocument(standardDocument);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomMaterialStandardDocument({ standardDocument })
      );
    });
  });

  describe('addMaterialName', () => {
    it('should add values to select', () => {
      const materialName = 'string';
      component['dialogFacade'].dispatch = jest.fn();
      component.addMaterialName(materialName);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomMaterialStandardName({ materialName })
      );
    });
  });
  describe('addSupplierName', () => {
    it('should add values to select', () => {
      const supplierName = 'string';
      component['dialogFacade'].dispatch = jest.fn();
      component.addSupplierName(supplierName);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomSupplierName({ supplierName })
      );
    });
  });
  describe('addSupplierPlant', () => {
    it('should add values to select', () => {
      const supplierPlant = 'string';
      component['dialogFacade'].dispatch = jest.fn();
      component.addSupplierPlant(supplierPlant);
      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomSupplierPlant({ supplierPlant })
      );
    });
  });

  describe('compareWithId', () => {
    it('should return true if the id is equal', () => {
      const mockOption1 = { id: 1, title: 'a' };
      const mockOption2 = { id: 1, title: 'b' };

      expect(component.compareWithId(mockOption1, mockOption2)).toBe(true);
    });

    it('should return false if the id is not equal', () => {
      const mockOption1 = { id: 1, title: 'a' };
      const mockOption2 = { id: 2, title: 'b' };

      expect(component.compareWithId(mockOption1, mockOption2)).toBe(false);
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
});
