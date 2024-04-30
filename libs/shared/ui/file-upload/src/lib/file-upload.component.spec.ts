import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import deutsch from '../../assets/i18n/de.json';
import english from '../../assets/i18n/en.json';
import { FileUploadComponent } from './file-upload.component';
import { Message, SelectedFile } from './models';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: (key: string) => key,
}));

const mockSelectedFileFactory = (
  file: File,
  data?: ArrayBuffer,
  error = false
): SelectedFile => ({
  error,
  file,
  data,
  removeFile: jest.fn(),
  setManualProgress: jest.fn(),
  setMessage: jest.fn(),
});

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let spectator: Spectator<FileUploadComponent>;

  const createComponent = createComponentFactory({
    component: FileUploadComponent,
    imports: [MockModule(MatIconModule)],
    providers: [
      provideTransloco({
        config: {
          missingHandler: {
            logMissingKey: false,
          },
        },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    shallow: true,
    errorOnUnknownProperties: false,
  });

  beforeEach(() => {
    jest.spyOn(TranslocoService.prototype, 'setTranslation');

    spectator = createComponent();

    component = spectator.debugElement.componentInstance;
  });

  describe('constructor', () => {
    it('should create', () => {
      expect(component).toBeTruthy();

      expect(component['translocoService'].setTranslation).toHaveBeenCalledWith(
        deutsch,
        'de'
      );
      expect(component['translocoService'].setTranslation).toHaveBeenCalledWith(
        english,
        'en'
      );
    });
  });

  describe('onRemoveMessage', () => {
    it('should remove message', () => {
      const mockMessage: Message = {
        type: 'error',
        title: 'test',
        description: 'test',
      };
      component.messages = [mockMessage];

      component.onRemoveMessage(mockMessage);

      expect(component.internalMessages).toEqual([]);
    });
  });

  describe('onRemoveInternalMessage', () => {
    it('should remove internal message', () => {
      const mockMessage: Message = {
        type: 'error',
        title: 'test',
        description: 'test',
      };
      component.internalMessages = [mockMessage];

      component.onRemoveInternalMessage(mockMessage);

      expect(component.internalMessages).toEqual([]);
    });
  });

  describe('onRemoveFile', () => {
    it('should remove file', () => {
      const mockFile = new File([''], 'filename.txt');
      component.files = [mockFile];
      component['selectedFiles'].push(mockSelectedFileFactory(mockFile));

      component.onRemoveFile(mockFile);

      expect(component.files).toEqual([]);
      expect(component['selectedFiles']).toEqual([]);
    });
  });

  describe('onFilesSelected', () => {
    it('should add files', () => {
      const mockFile = new File([''], 'filename.txt');
      const mockTarget = {
        files: [mockFile],
        value: 'test',
      } as unknown as HTMLInputElement;
      const mockEvent = {
        target: mockTarget,
      } as unknown as Event;

      component['checkFileCount'] = jest.fn(() => true);

      component.onFilesSelected(mockEvent);

      expect(component.files).toEqual([mockFile]);
      expect(mockTarget.value).toEqual('');
    });

    it('should not add files if the file count is exceeded', () => {
      const mockFile = new File([''], 'filename.txt');
      const mockTarget = {
        files: [mockFile],
        value: 'test',
      } as unknown as HTMLInputElement;
      const mockEvent = {
        target: mockTarget,
      } as unknown as Event;

      component['checkFileCount'] = jest.fn(() => false);

      component.onFilesSelected(mockEvent);

      expect(component.files).toEqual([]);
      expect(mockTarget.value).toEqual('');
    });
  });

  describe('onFilesDropped', () => {
    it('should add files', () => {
      const mockFile = new File([''], 'filename.txt');

      component['checkFileCount'] = jest.fn(() => true);

      component.onFilesDropped([mockFile] as unknown as FileList);

      expect(component.files).toEqual([mockFile]);
    });

    it('should not add files if the file count is exceeded', () => {
      const mockFile = new File([''], 'filename.txt');

      component['checkFileCount'] = jest.fn(() => false);

      component.onFilesDropped([mockFile] as unknown as FileList);

      expect(component.files).toEqual([]);
    });
  });

  describe('onFileLoaded', () => {
    it('should add selected file and emit the change event', () => {
      const mockFile = new File([''], 'filename.txt');
      const mockFileComponent = {
        onRemoveFile: jest.fn(),
        setManualProgess: jest.fn(),
        setMessage: jest.fn(),
      } as unknown as any;

      component.filesChanged.emit = jest.fn();

      component.onFileLoaded({
        file: mockFile,
        fileComponent: mockFileComponent,
      });

      expect(JSON.stringify(component['selectedFiles'])).toEqual(
        JSON.stringify([mockSelectedFileFactory(mockFile)])
      );
      expect(component.filesChanged.emit).toHaveBeenCalledWith(
        component['selectedFiles']
      );
    });
  });

  describe('onFileError', () => {
    it('should add selected file and emit the change event', () => {
      const mockFile = new File([''], 'filename.txt');
      const mockFileComponent = {
        onRemoveFile: jest.fn(),
        setManualProgess: jest.fn(),
        setMessage: jest.fn(),
      } as unknown as any;

      component.filesChanged.emit = jest.fn();

      component.onFileError({
        file: mockFile,
        fileComponent: mockFileComponent,
      });

      expect(JSON.stringify(component['selectedFiles'])).toEqual(
        JSON.stringify([mockSelectedFileFactory(mockFile, undefined, true)])
      );
      expect(component.filesChanged.emit).toHaveBeenCalledWith(
        component['selectedFiles']
      );
    });
  });

  describe('checkFileCount', () => {
    beforeEach(() => {
      component['addMaxFileCountErrorMessage'] = jest.fn();
    });

    it('should return true if the file count is not exceeded', () => {
      component.maxFileCount = 1;

      expect(
        component['checkFileCount']([new File([''], 'filename.txt')])
      ).toBe(true);
      expect(component['addMaxFileCountErrorMessage']).not.toHaveBeenCalled();
    });

    it('should return false if the file count is exceeded', () => {
      component.maxFileCount = 1;

      expect(
        component['checkFileCount']([
          new File([''], 'filename.txt'),
          new File([''], 'filename.txt'),
        ])
      ).toBe(false);
      expect(component['addMaxFileCountErrorMessage']).toHaveBeenCalled();
    });

    it('should return true and slice the files if the file count is not exceeded but the total file count is exceeded and autoOverwriteOldestFile is true', () => {
      component.maxFileCount = 1;
      component.autoOverwriteOldestFile = true;
      component.files = [new File([''], 'filename.txt')];

      expect(
        component['checkFileCount']([new File([''], 'filename.txt')])
      ).toBe(true);
      expect(component.files).toEqual([]);
      expect(component['addMaxFileCountErrorMessage']).not.toHaveBeenCalled();
    });

    it('should return false if the file count is not exceeded but the total file count is exceeded and autoOverwriteOldestFile is false', () => {
      component.maxFileCount = 1;
      component.autoOverwriteOldestFile = false;
      component.files = [new File([''], 'filename.txt')];

      expect(
        component['checkFileCount']([new File([''], 'filename.txt')])
      ).toBe(false);
      expect(component.files).toEqual([new File([''], 'filename.txt')]);
      expect(component['addMaxFileCountErrorMessage']).toHaveBeenCalled();
    });
  });

  describe('addMaxFileCountErrorMessage', () => {
    it('should add max file count error message and emit tooManyFilesSelected', () => {
      component.tooManyFilesSelected.emit = jest.fn();

      component['addMaxFileCountErrorMessage']();

      expect(component.internalMessages).toEqual([
        {
          type: 'error',
          title: 'tooManyFilesSelected',
          description: 'maximumFiles',
        },
      ]);
      expect(component.tooManyFilesSelected.emit).toHaveBeenCalledWith({
        type: 'error',
        title: 'tooManyFilesSelected',
        description: 'maximumFiles',
      });
    });

    it('should not add max file count error message if displayMaxFileCountError is false and emit tooManyFilesSelected', () => {
      component.displayMaxFileCountError = false;
      component.tooManyFilesSelected.emit = jest.fn();

      component['addMaxFileCountErrorMessage']();

      expect(component.internalMessages).toEqual([]);
      expect(component.tooManyFilesSelected.emit).toHaveBeenCalledWith({
        type: 'error',
        title: 'tooManyFilesSelected',
        description: 'maximumFiles',
      });
    });
  });
});
