import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import moment from 'moment';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import {
  addCustomDataOwner,
  materialDialogCanceled,
  sapMaterialsUploadDialogOpened,
  uploadSapMaterials,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import * as en from '../../../../../../../assets/i18n/en.json';
import * as util from '../../util';
import { SapMaterialsUploadDialogComponent } from './sap-materials-upload-dialog.component';
import { ExcelValidatorService } from './sap-materials-upload-dialog-validation/excel-validation/excel-validator.service';
import {
  COLUMN_HEADER_FIELDS,
  MANDATORY_COLUMNS,
} from './sap-materials-upload-dialog-validation/excel-validation/excel-validator-config';
import { SapMaterialsUploadStatus } from './sap-materials-upload-status.enum';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

jest.mock('../../util', () => ({
  ...jest.requireActual<TranslocoModule>('../../util'),
  filterFn: jest.fn(),
}));

describe('SapMaterialsUploadDialogComponent', () => {
  let component: SapMaterialsUploadDialogComponent;
  let spectator: Spectator<SapMaterialsUploadDialogComponent>;

  const createComponent = createComponentFactory({
    component: SapMaterialsUploadDialogComponent,
    imports: [provideTranslocoTestingModule({ en })],
    declarations: [SapMaterialsUploadDialogComponent],
    providers: [
      { provide: MatDialogRef, useValue: { close: jest.fn() } },
      FormBuilder,
      mockProvider(DialogFacade, {
        dispatch: jest.fn(),
        sapMaterialsDataOwners$: of(),
        uploadSapMaterialsSucceeded$: of(),
        sapMaterialsFileUploadProgress$: of(),
      }),
      mockProvider(DataFacade, {
        username$: of(),
      }),
      mockProvider(ExcelValidatorService, {
        validate: jest.fn(() => of(undefined as any)),
      }),
      mockProvider(MsdDialogService),
      mockProvider(MsdAgGridReadyService, {
        agGridApi$: of({ gridApi: {}, columnApi: {} }),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should dispatch sapMaterialsUploadDialogOpened', () => {
      component['initFormGroup'] = jest.fn();
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();

      component.ngOnInit();

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        sapMaterialsUploadDialogOpened()
      );
    });

    test('should init formGroup', () => {
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();

      component.ngOnInit();

      expect(component.formGroup).toBeDefined();
    });

    test('owner should not be valid', () => {
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();

      component.ngOnInit();

      const uploadFormData = {
        owner: { title: 'Tester' } as StringOption,
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.xlsx'),
        disclaimerAccepted: true,
      };

      component.formGroup.setValue(uploadFormData);

      expect(component.formGroup.get('owner').valid).toBe(false);
    });

    test('owner should be valid', () => {
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();

      component.ngOnInit();

      const uploadFormData = {
        owner: { title: 'Mustermann, Max XX/YAZ-FF2B' } as StringOption,
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.xlsx'),
        disclaimerAccepted: true,
      };

      component.formGroup.setValue(uploadFormData);

      expect(component.formGroup.get('owner').valid).toBe(true);
    });

    test('file should be valid', () => {
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();

      component.ngOnInit();

      const uploadFormData = {
        owner: { title: 'Mustermann, Max XX/YAZ-FF2B' } as StringOption,
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.xlsx'),
        disclaimerAccepted: true,
      };

      component.formGroup.setValue(uploadFormData);
      expect(component.formGroup.get('file').valid).toBe(true);
    });

    test('file should not be valid', () => {
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();

      component.ngOnInit();

      const uploadFormData = {
        owner: { title: 'Mustermann, Max XX/YAZ-FF2B' } as StringOption,
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.json'),
        disclaimerAccepted: true,
      };

      component.formGroup.setValue(uploadFormData);

      expect(component.formGroup.get('file').valid).toBe(false);
    });

    test('should set user as a default owner', () => {
      component['handleUploadSucceeded'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();

      const username = 'Mustermann, Max XX/YAZ-FF2B';
      const user: StringOption = { id: 1, title: username };

      component['dataFacade'].username$ = of(username);
      component.dataOwners$ = of([
        user,
        { id: 2, title: 'Testermann, Tester AA/BB-ZZ' },
      ]);

      component.ngOnInit();

      expect(component.formGroup.get('owner').value).toBe(user);
    });

    test('should close dialog and open uploadStatusDialog on uploadSucceeded', () => {
      component['initFormGroup'] = jest.fn();
      component['setDefaultOwner'] = jest.fn();
      component['handleFileUploadProgressChanges'] = jest.fn();
      component['dialogService'].openSapMaterialsUploadStatusDialog = jest.fn();
      component.close = jest.fn();
      component['dialogFacade'].uploadSapMaterialsSucceeded$ = of(true as any);

      component.ngOnInit();

      expect(component.close).toHaveBeenCalledTimes(1);
      expect(
        component['dialogService'].openSapMaterialsUploadStatusDialog
      ).toHaveBeenCalledTimes(1);
    });

    test('should show file upload progress in upload button label', () => {
      const fileUploadProgress = 25;

      component.uploadButtonLabel = undefined;
      component['initFormGroup'] = jest.fn();
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['dialogFacade'].sapMaterialsFileUploadProgress$ =
        of(fileUploadProgress);

      component.ngOnInit();

      expect(component.uploadButtonLabel).toBe(`upload ${fileUploadProgress}%`);
      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.uploadDialog.upload'
      );
    });

    test('should not show file upload progress in upload button label', () => {
      component.uploadButtonLabel = undefined;
      component['initFormGroup'] = jest.fn();
      component['setDefaultOwner'] = jest.fn();
      component['handleUploadSucceeded'] = jest.fn();
      component['dialogFacade'].sapMaterialsFileUploadProgress$ = of(
        undefined as any
      );

      component.ngOnInit();

      expect(component.uploadButtonLabel).toBe('upload');
      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.uploadDialog.upload'
      );
    });
  });

  test('should emit on destroy', () => {
    component['destroy$'].next = jest.fn();
    component['destroy$'].complete = jest.fn();

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  describe('ownerFilterFnFactory', () => {
    test('should filter owner list', () => {
      const filterFnSpy = jest.spyOn(util, 'filterFn');
      filterFnSpy.mockImplementation();

      const option: StringOption = {
        id: 1,
        title: 'Tester',
      };
      const value = 'te';

      component.ownerFilterFnFactory(option, value);

      expect(filterFnSpy).toHaveBeenCalledWith(option, value);
    });
  });

  describe('addNewOwner', () => {
    test('should add a new owner', () => {
      const dataOwner = 'Mustermann, Max XX/YAZ-FF2B';

      component.addNewOwner(dataOwner);

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomDataOwner({ dataOwner })
      );
    });
  });

  describe('downloadDataTemplate', () => {
    test('should download template', () => {
      const hidden: ColDef = { hide: true, colId: '1' };
      const other: ColDef = { hide: false, colId: '2' };
      const mandatory: ColDef = { hide: false, colId: MANDATORY_COLUMNS[0] };
      const optional: ColDef = { hide: false, colId: 'incoterms' };

      const mockGridApi = {
        getColumnDef: jest.fn((key) => ({ headerTooltip: key } as ColDef)),
        exportDataAsExcel: jest.fn(),
      } as unknown as GridApi;
      const mockColumnApi = {
        getColumnState: jest.fn(() => [hidden, other, mandatory, optional]),
      } as unknown as ColumnApi;
      component['agGridApi'] = mockGridApi;
      component['columnApi'] = mockColumnApi;

      component.downloadDataTemplate();

      expect(mockGridApi.exportDataAsExcel).toHaveBeenCalledWith(
        expect.objectContaining({
          columnKeys: expect.arrayContaining(COLUMN_HEADER_FIELDS),
          appendContent: expect.any(Object),
        })
      );
    });
  });

  describe('openFileChooser', () => {
    test('should open file chooser', () => {
      const click = jest.fn();

      component.ngOnInit();

      component.fileChooserRef = {
        nativeElement: {
          click,
        },
      } as ElementRef;

      component.openFileChooser();

      expect(click).toBeCalledTimes(1);
    });
  });

  describe('setFile', () => {
    beforeEach(() => {
      component['initFormGroup']();
    });

    test('should set the chosen valid file', () => {
      const testFile = new File([''], 'test.xlsx');

      component.setFile(testFile);

      expect(component.formGroup.value.file).toBe(testFile);
      expect(component.uploadStatus).toBe(SapMaterialsUploadStatus.SUCCEEDED);
    });

    test('should set the chosen invalid file', () => {
      const testFile = new File([''], 'test.json');

      component.setFile(testFile);

      expect(component.formGroup.value.file).toBe(testFile);
      expect(component.uploadStatus).toBe(SapMaterialsUploadStatus.FAILED);
    });

    test('should remove the chosen file', () => {
      const fileName = 'test.xlsx';
      component.formGroup.get('file').setValue(new File([''], fileName));
      component.fileChooserRef = {
        nativeElement: {
          value: fileName,
        },
      };

      component.setFile(undefined as File);

      expect(component.formGroup.value.file).toBeUndefined();
      expect(component.uploadStatus).toBeUndefined();
      expect(component.fileChooserRef.nativeElement.value).toBe('');
    });
  });

  describe('upload', () => {
    test('should upload SAP materials', () => {
      const uploadFormData = {
        owner: { title: 'Mustermann, Max XX/YAZ-FF2B' } as StringOption,
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.xlsx'),
        disclaimerAccepted: true,
      };

      component.ngOnInit();
      component.formGroup.setValue(uploadFormData);

      component.upload();

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        uploadSapMaterials({
          upload: {
            owner: uploadFormData.owner.title,
            maturity: uploadFormData.maturity,
            date: uploadFormData.date,
            file: uploadFormData.file,
          },
        })
      );
    });
  });

  describe('close', () => {
    test('should close the dialog', () => {
      component.close();

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        materialDialogCanceled()
      );
      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('determineUploadStatus', () => {
    test('should init be valid', () => {
      component.ngOnInit();
      component.formGroup.get('file').setValue(new File([''], 'test.xlsx'));

      expect(component.uploadStatus).toBe(SapMaterialsUploadStatus.SUCCEEDED);
    });

    test('should init be invalid', () => {
      component.ngOnInit();

      const file = component.formGroup.get('file');
      file.addAsyncValidators(() => of({ error: 1 }));
      file.setValue(new File([''], 'test.xlsx'));

      expect(component.uploadStatus).toBe(SapMaterialsUploadStatus.FAILED);
    });

    test('should init be in progress', () => {
      // creating an async validator that will just wait for two seconds to trigger 'in progress'
      const asyncFkt: AsyncValidatorFn =
        async (): Promise<ValidationErrors | null> => {
          await new Promise((f) => setTimeout(f, 2000));

          return of(undefined as any);
        };

      component.ngOnInit();
      const file = component.formGroup.get('file');
      file.addAsyncValidators(asyncFkt);
      file.setValue(new File([''], 'test.xlsx'));

      expect(component.uploadStatus).toBe(SapMaterialsUploadStatus.IN_PROGRESS);
    });
  });

  describe('getErrorMessage', () => {
    it.each([
      'required',
      'missingColumn',
      'invalidValue',
      'invalidPcfValue',
      'missingPcfValue',
      'invalidPcfSupplierEmissions',
      'unsupportedFileFormat',
      'generic',
    ])('should init be valid', (value: string) => {
      expect(component['getErrorMessage']({ [value]: true, params: {} })).toBe(
        value
      );
    });
  });
});
