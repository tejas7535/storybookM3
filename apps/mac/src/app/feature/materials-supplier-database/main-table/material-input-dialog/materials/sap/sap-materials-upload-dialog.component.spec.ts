import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { of, Subject } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import moment from 'moment';

import { StringOption } from '@schaeffler/inputs';

import { MsdDataService } from '@mac/feature/materials-supplier-database/services';
import {
  addCustomDataOwner,
  materialDialogCanceled,
  sapMaterialsUploadDialogOpened,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import * as util from '../../util';
import { SapMaterialsUploadDialogComponent } from './sap-materials-upload-dialog.component';
import { SapMaterialsUploadStatus } from './sap-materials-upload-status-chip/sap-materials-upload-status.enum';

describe('SapMaterialsUploadDialogComponent', () => {
  let component: SapMaterialsUploadDialogComponent;
  let spectator: Spectator<SapMaterialsUploadDialogComponent>;

  const createComponent = createComponentFactory({
    component: SapMaterialsUploadDialogComponent,
    declarations: [SapMaterialsUploadDialogComponent],
    providers: [
      { provide: MatDialogRef, useValue: { close: jest.fn() } },
      FormBuilder,
      mockProvider(MsdDataService),
      mockProvider(DialogFacade, {
        dispatch: jest.fn(),
        sapMaterialsDataOwners$: of(),
      }),
      mockProvider(DataFacade, {
        username$: of(),
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

      component.ngOnInit();

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        sapMaterialsUploadDialogOpened()
      );
    });

    test('should init formGroup', () => {
      component['setDefaultOwner'] = jest.fn();

      component.ngOnInit();

      expect(component.formGroup).toBeDefined();
    });

    test('owner should not be valid', () => {
      component['setDefaultOwner'] = jest.fn();

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
      Object.defineProperty(window, 'open', {
        value: jest.fn(),
      });

      component.downloadDataTemplate();

      expect(window.open).toHaveBeenCalledWith(
        '/assets/templates/matnr_upload_template.xlsx',
        '_blank'
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
      expect(component.uploadStatus).toBe(SapMaterialsUploadStatus.SUCCEED);
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
      const uploadSapMaterialsMock = jest.fn();
      uploadSapMaterialsMock.mockReturnValue(of());

      component['dataService'].uploadSapMaterials = uploadSapMaterialsMock;
      component.ngOnInit();
      component.formGroup.setValue(uploadFormData);

      component.upload();

      expect(uploadSapMaterialsMock).toHaveBeenCalledWith({
        owner: uploadFormData.owner.title,
        maturity: uploadFormData.maturity,
        date: uploadFormData.date,
        file: uploadFormData.file,
      });
    });

    test('should reset loading and close dialog', () => {
      component.formGroup = {
        value: {
          owner: { title: 'Mustermann, Max XX/YAZ-FF2B' } as StringOption,
          maturity: 8,
          date: moment(),
          file: new File([''], 'test.xlsx'),
          disclaimerAccepted: true,
        },
      } as unknown as FormGroup;

      const testSubject = new Subject();
      const uploadSapMaterialsMock = jest.fn();
      uploadSapMaterialsMock.mockReturnValue(testSubject.asObservable());
      component['dataService'].uploadSapMaterials = uploadSapMaterialsMock;

      const closeMock = jest.fn();
      component.close = closeMock;

      expect(component.isLoading).toBe(false);

      component.upload();

      expect(component.isLoading).toBe(true);
      testSubject.next({});
      expect(component.isLoading).toBe(false);
      expect(closeMock).toHaveBeenCalledTimes(1);
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
});
