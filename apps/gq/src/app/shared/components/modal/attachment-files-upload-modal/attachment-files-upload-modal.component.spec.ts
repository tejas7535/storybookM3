import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationAttachment } from '@gq/shared/models/quotation/quotation-attachment.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AttachmentFilesUploadModalComponent } from './attachment-files-upload-modal.component';
import { FilesToUploadDisplay } from './models/files-to-upload-display.model';

describe('AttachmentFilesUploadModalComponent', () => {
  let component: AttachmentFilesUploadModalComponent;
  let spectator: Spectator<AttachmentFilesUploadModalComponent>;

  const createComponent = createComponentFactory({
    component: AttachmentFilesUploadModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { attachments: [] },
      },
      MockProvider(ActiveCaseFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
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
            item: () => mockFile,
          },
        },
        preventDefault: jest.fn(),
      } as any;

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual([expected]);
    });

    test('should not add files to filesToUpload if no files are selected', () => {
      const mockEvent = {
        target: {
          files: undefined,
        },
        preventDefault: jest.fn(),
      } as any;

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
            item: (index: number) => mockFile[index],
          },
        },
        preventDefault: jest.fn(),
      } as any;

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
            item: (index: number) => mockFile[index],
          },
        },
        preventDefault: jest.fn(),
      } as any;
      component.modalData.attachments = [
        { fileName: 'file2.pdf' } as unknown as QuotationAttachment,
      ];

      component.handleFileInput(mockEvent);

      expect(component.filesToUpload).toEqual(expected);
    });

    test('should add files and set unsupportedFileType to true if file type is not supported', () => {
      const mockFile: File[] = [
        { name: 'file1.jpeg', size: 2_000_000 } as File,
        { name: 'file2.xyz', size: 2_000_000 } as File,
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
            item: (index: number) => mockFile[index],
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
      component.activeCaseFacade.uploadAttachments = jest.fn();
      component.activeCaseFacade.uploadAttachmentsSuccess$ = of();

      component.upload();

      expect(component.activeCaseFacade.uploadAttachments).toBeCalledTimes(1);
      expect(component.activeCaseFacade.uploadAttachments).toBeCalledWith([
        mockFiles[2].file,
      ]);
    });

    test('should close dialog when uploadAttachmentsSuccess$ emits', () => {
      jest.resetAllMocks();
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      const facadeMock: ActiveCaseFacade = {
        uploadAttachmentsSuccess$: of(true),
        uploadAttachments: jest.fn(),
      } as unknown as ActiveCaseFacade;

      Object.defineProperty(component, 'activeCaseFacade', {
        value: facadeMock,
      });

      component.upload();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
    test('should call handleFileSelection when handleDroppedFiles is called', () => {
      const handleFileSelectionMock = jest.fn();

      component['handleFileSelection'] = handleFileSelectionMock;

      const mockFile = new File([''], 'mockFile.txt', { type: 'text/plain' });
      const mockFileList = {
        length: 1,
        item: () => mockFile,
      };

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
        { name: 'filename1 ' } as unknown as FilesToUploadDisplay,
        { name: 'filename' } as unknown as FilesToUploadDisplay,
      ];
      component.filesToUpload = mockFiles;

      component.removeFile(mockFiles[0]);

      expect(component.filesToUpload).toEqual([{ name: 'filename' }]);
      expect(component.disableUploadButton).toEqual(false);
    });
  });
});
