import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockModule, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { AttachmentFilesUploadModalComponent } from './attachment-files-upload-modal.component';
import { FilesToUploadDisplay } from './models/files-to-upload-display.model';

describe('AttachmentFilesUploadModalComponent', () => {
  let component: AttachmentFilesUploadModalComponent;
  let spectator: Spectator<AttachmentFilesUploadModalComponent>;

  const createComponent = createComponentFactory({
    component: AttachmentFilesUploadModalComponent,

    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
      MockModule(DialogHeaderModule),
    ],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
      MockProvider(ActiveCaseFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleFileInput', () => {
    test('should add files to filesToUpload', () => {
      const mockFile = new File([''], 'filename.eml');
      const expected: FilesToUploadDisplay = {
        file: mockFile,
        exists: false,
        sizeExceeded: false,
        unsupportedFileType: false,
      };
      const mockEvent = {
        target: {
          files: {
            length: 1,
            0: mockFile,
          },
        },
        preventDefault: jest.fn(),
      } as any;
      component.modalData.fileNames = [];

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual([expected]);
    });

    test('should not add files to filesToUpload if no files are selected', () => {
      const mockEvent = {
        target: {
          files: { length: 0 },
        },
        preventDefault: jest.fn(),
      } as any;
      component.modalData.fileNames = [];

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual([]);
    });

    test('should add files and set fileSize exceeded to true if file size is exceeded', () => {
      const mockFile: File[] = [
        { name: 'file1.png', size: 26_000_000 } as File,
        { name: 'file2.tiff', size: 2_000_000 } as File,
      ];
      const expected: FilesToUploadDisplay[] = [
        {
          file: mockFile[0],
          exists: false,
          sizeExceeded: true,
          unsupportedFileType: false,
        },
        {
          file: mockFile[1],
          exists: false,
          sizeExceeded: false,
          unsupportedFileType: false,
        },
      ];
      const mockEvent = {
        target: {
          files: {
            length: 2,
            0: mockFile[0],
            1: mockFile[1],
          },
        },
        preventDefault: jest.fn(),
      } as any;
      component.modalData.fileNames = [];

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual(expected);
    });

    test('should add files and set exists to true if file already exists', () => {
      const mockFile: File[] = [
        { name: 'file1.xls', size: 2_000_000 } as File,
        { name: 'file2.pdf', size: 2_000_000 } as File,
      ];
      const expected: FilesToUploadDisplay[] = [
        {
          file: mockFile[0],
          exists: false,
          sizeExceeded: false,
          unsupportedFileType: false,
        },
        {
          file: mockFile[1],
          exists: true,
          sizeExceeded: false,
          unsupportedFileType: false,
        },
      ];
      const mockEvent = {
        target: {
          files: {
            length: 2,
            0: mockFile[0],
            1: mockFile[1],
          },
        },
        preventDefault: jest.fn(),
      } as any;
      component.modalData.fileNames = ['file2.pdf'];

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual(expected);
    });

    test('should add files and set unsupportedFileType to true if file type is not supported', () => {
      const mockFile: File[] = [
        { name: 'file1.jpeg', size: 2_000_000 } as File,
        { name: 'file2.exe', size: 2_000_000 } as File,
      ];
      const expected: FilesToUploadDisplay[] = [
        {
          file: mockFile[0],
          exists: false,
          sizeExceeded: false,
          unsupportedFileType: false,
        },
        {
          file: mockFile[1],
          exists: false,
          sizeExceeded: false,
          unsupportedFileType: true,
        },
      ];
      const mockEvent = {
        target: {
          files: {
            length: 2,
            0: mockFile[0],
            1: mockFile[1],
          },
        },
        preventDefault: jest.fn(),
      } as any;

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual(expected);
    });

    test('should add file and set unsupportedFileType to false if file type is uppercase', () => {
      const mockFile: File[] = [{ name: 'file1.PDF', size: 2_000_000 } as File];
      const expected: FilesToUploadDisplay[] = [
        {
          file: mockFile[0],
          exists: false,
          sizeExceeded: false,
          unsupportedFileType: false,
        },
      ];
      const mockEvent = {
        target: {
          files: {
            length: 1,
            0: mockFile[0],
          },
        },
        preventDefault: jest.fn(),
      } as any;

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual(expected);
    });
  });

  describe('upload', () => {
    test('should call uploadAttachments', () => {
      const mockFiles: FilesToUploadDisplay[] = [
        { file: { name: '1' } as File, exists: true } as FilesToUploadDisplay,
        {
          file: { name: '2' } as File,
          sizeExceeded: true,
        } as FilesToUploadDisplay,
        { file: { name: '3' } as File } as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;
      component.modalData.upload = jest.fn();
      component.modalData.uploadSuccess$ = of();

      component.upload();

      expect(component.modalData.upload).toHaveBeenCalledTimes(1);
      expect(component.modalData.upload).toHaveBeenCalledWith([
        mockFiles[2].file,
      ]);
    });

    test('should close dialog when uploadAttachmentsSuccess$ emits', () => {
      jest.resetAllMocks();
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      component.modalData.upload = jest.fn();
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.modalData.uploadSuccess$ = of(undefined);

      component.upload();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
    test('should call handleFileSelection when handleDroppedFiles is called', () => {
      const handleFileSelectionMock = jest.fn();

      component['handleFileSelection'] = handleFileSelectionMock;

      const mockFile = new File([''], 'mockFile.txt', { type: 'text/plain' });
      const mockFileList = {
        length: 1,
        0: mockFile,
      } as any;

      component.handleDroppedFiles(mockFileList);

      expect(handleFileSelectionMock).toHaveBeenCalledTimes(1);
      expect(handleFileSelectionMock).toHaveBeenCalledWith(mockFileList);
    });
  });
  describe('closeDialog', () => {
    test('should call dialogRef.close() when closeDialog is called', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeFile', () => {
    test('should remove file from filesToUpload', () => {
      component.disableUploadButton = true;
      const mockFiles: FilesToUploadDisplay[] = [
        {
          file: {
            name: 'filename1 ',
          },
        } as unknown as FilesToUploadDisplay,
        { file: { name: 'filename' } } as unknown as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;

      component.removeFile(mockFiles[0]);

      expect(component.filesToUpload).toEqual([{ file: { name: 'filename' } }]);
      expect(component.disableUploadButton).toEqual(false);
    });
  });

  describe('handleFileSelection', () => {
    test('should mark file as exists when existing in modalData.filenames', () => {
      const mockFile = new File([''], 'filename.eml');
      const mockEvent = {
        target: {
          files: {
            length: 1,
            0: mockFile,
          },
        },
        preventDefault: jest.fn(),
      } as any;
      component.modalData.fileNames = [mockFile.name];

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload[0].exists).toBeTruthy();
    });
    test('should mark one file as exists when the same file shall be added (via drag and drop) twice', () => {
      const mockFile = new File([''], 'filename.eml');
      const mockEvent = {
        target: {
          files: {
            length: 1,
            0: mockFile,
          },
        },
        preventDefault: jest.fn(),
      } as any;
      component.modalData.fileNames = [];

      component.handleFileInput(mockEvent);
      expect(component.filesToUpload[0].exists).toBeFalsy();
      component.handleFileInput(mockEvent);
      expect(component.filesToUpload[0].exists).toBeFalsy();
      expect(component.filesToUpload[1].exists).toBeTruthy();
    });
  });

  describe('checkForDisabledUploadButton', () => {
    test('should disable upload button if any file exists', () => {
      const mockFiles: FilesToUploadDisplay[] = [
        { file: { name: '1' } as File, exists: true } as FilesToUploadDisplay,
        { file: { name: '2' } as File } as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;

      component['checkForDisabledUploadButton']();

      expect(component.disableUploadButton).toBeTruthy();
    });

    test('should disable upload button if any file size is exceeded', () => {
      const mockFiles: FilesToUploadDisplay[] = [
        {
          file: { name: '1' } as File,
          exists: false,
          sizeExceeded: true,
        } as FilesToUploadDisplay,
        { file: { name: '2' } as File } as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;

      component['checkForDisabledUploadButton']();

      expect(component.disableUploadButton).toBeTruthy();
    });

    test('should disable upload button if any file type is unsupported', () => {
      const mockFiles: FilesToUploadDisplay[] = [
        {
          file: { name: '1' } as File,
          exists: false,
          sizeExceeded: false,
          unsupportedFileType: true,
        } as FilesToUploadDisplay,
        { file: { name: '2' } as File } as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;

      component['checkForDisabledUploadButton']();

      expect(component.disableUploadButton).toBeTruthy();
    });

    test('should not disable upload button if all files are valid', () => {
      const mockFiles: FilesToUploadDisplay[] = [
        { file: { name: '1' } as File } as FilesToUploadDisplay,
        { file: { name: '2' } as File } as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;

      component['checkForDisabledUploadButton']();

      expect(component.disableUploadButton).toBeFalsy();
    });
  });

  describe('getFileExtension', () => {
    test('should return file extension', () => {
      const fileName = 'file.txt';
      expect(component['getFileExtension'](fileName)).toEqual('txt');
    });
  });

  describe('checkFileNamesExists', () => {
    test('should return true if file name exists', () => {
      const fileNames = ['file1.txt', 'file2.pdf'];
      const fileName = 'file1.txt';
      expect(
        component['checkFileNamesExists'](fileNames, fileName)
      ).toBeTruthy();
    });

    test('should return false if file name does not exist', () => {
      const fileNames = ['file1.txt', 'file2.pdf'];
      const fileName = 'file3.txt';
      expect(
        component['checkFileNamesExists'](fileNames, fileName)
      ).toBeFalsy();
    });
  });

  describe('updateFileExistsStatus', () => {
    test('should update exists status for all files', () => {
      const mockFiles: FilesToUploadDisplay[] = [
        { file: { name: '1' } as File } as FilesToUploadDisplay,
        { file: { name: '2' } as File } as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;
      component['checkFileNamesExists'] = jest.fn();
      component['updateFileExistsStatus']();

      expect(component['checkFileNamesExists']).toHaveBeenCalledTimes(2);
    });
  });
});
