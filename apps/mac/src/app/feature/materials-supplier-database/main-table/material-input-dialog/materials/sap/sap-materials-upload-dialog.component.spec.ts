import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { of, Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import moment from 'moment';
import { MockProvider } from 'ng-mocks';

import { SapMaterialsUpload } from '@mac/feature/materials-supplier-database/models';
import { MsdDataService } from '@mac/feature/materials-supplier-database/services';

import { SapMaterialsUploadDialogComponent } from './sap-materials-upload-dialog.component';

describe('SapMaterialsUploadDialogComponent', () => {
  let component: SapMaterialsUploadDialogComponent;
  let spectator: Spectator<SapMaterialsUploadDialogComponent>;

  const createComponent = createComponentFactory({
    component: SapMaterialsUploadDialogComponent,
    declarations: [SapMaterialsUploadDialogComponent],
    providers: [
      { provide: MatDialogRef, useValue: { close: jest.fn() } },
      FormBuilder,
      MockProvider(MsdDataService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should init formGroup', () => {
      component.ngOnInit();

      expect(component.formGroup).toBeDefined();
    });

    test('owner should not be valid', () => {
      component.ngOnInit();

      const upload: SapMaterialsUpload = {
        owner: 'Tester',
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.xlsx'),
      };

      component.formGroup.setValue(upload);

      expect(component.formGroup.get('owner').valid).toBe(false);
    });

    test('owner should be valid', () => {
      component.ngOnInit();

      const upload: SapMaterialsUpload = {
        owner: 'Mustermann, Max XX/YAZ-FF2B',
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.xlsx'),
      };

      component.formGroup.setValue(upload);

      expect(component.formGroup.get('owner').valid).toBe(true);
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
    test('should set the chosen file', () => {
      const testFile = new File([''], 'test.xlsx');

      component.ngOnInit();

      component.fileChooserRef = {
        nativeElement: {
          files: [testFile],
        },
      } as ElementRef;

      component.setFile();

      expect(component.formGroup.value.file).toBe(testFile);
    });
  });

  describe('upload', () => {
    test('should upload SAP materials', () => {
      const upload: SapMaterialsUpload = {
        owner: 'Tester',
        maturity: 8,
        date: moment(),
        file: new File([''], 'test.xlsx'),
      };
      const uploadSapMaterialsMock = jest.fn();
      uploadSapMaterialsMock.mockReturnValue(of());

      component['dataService'].uploadSapMaterials = uploadSapMaterialsMock;
      component.ngOnInit();
      component.formGroup.setValue(upload);

      component.upload();

      expect(uploadSapMaterialsMock).toHaveBeenCalledWith(upload);
    });

    test('should reset loading and close dialog', () => {
      component.formGroup = {
        value: {},
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

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
});
