import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { provideTransloco } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { Message } from '../models';
import { FileUploadFileComponent } from './file-upload-file.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: (key: string) => key,
}));

describe('FileUploadFileComponent', () => {
  let component: FileUploadFileComponent;
  let spectator: Spectator<FileUploadFileComponent>;

  const createComponent = createComponentFactory({
    component: FileUploadFileComponent,
    imports: [],
    providers: [provideTransloco({ config: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();

    spectator.setInput('file', new File([''], 'filename.txt'));
    spectator.setInput('unknownFileTypeText', 'unknownType');

    spectator.detectChanges();

    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fileType', () => {
    it('should return the file type', () => {
      expect(component.fileType).toBe('txt');
    });

    it('should return the unknown type text if the file name does not contain a dot', () => {
      spectator.setInput('file', new File([''], 'filename'));

      expect(component.fileType).toBe('unknownType');
    });

    it('should return the default unknown type text if the file name does not contain a dot and the unknownTypeText is undefined', () => {
      component.unknownFileTypeText = undefined;

      spectator.setInput('file', new File([''], 'filename'));

      expect(component.fileType).toBe('unknownType');
    });
  });

  describe('fileSize', () => {
    it('should return the file size', () => {
      expect(component.fileSize).toBe('0 B');
    });

    it.each([
      [1024, '1 KB'],
      [1024 * 1024, '1 MB'],
      [1024 * 1024 * 1024, '1 GB'],
      [1024 * 1024 * 1024 * 1024, '1 TB'],
    ])(
      'should return the file size in the correct format for %p -> %p',
      (size, expected) => {
        const file = { size } as File;
        component.file = file;

        expect(component.fileSize).toBe(expected);
      }
    );
  });

  describe('fileMessage', () => {
    it('should return the message with the file name', () => {
      component.message = {
        type: 'error',
        title: 'title',
        description: 'description',
      };

      expect(component.fileMessage).toEqual({
        title: 'title (filename.txt)',
        type: 'error',
        description: 'description',
      });
    });
  });

  describe('statusText', () => {
    it('should return undefined by default', () => {
      component.statusTextFn = undefined as any;
      expect(component.statusText).toBeUndefined();
    });

    it('should return a custom status text', () => {
      const statusTextFn = jest.fn().mockReturnValue('custom status text');
      spectator.setInput('statusTextFn', statusTextFn);

      spectator.detectChanges();

      expect(component.statusText).toBe('custom status text');
    });
  });

  describe('statusTextFn', () => {
    it('should return undefined by default', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(component.statusTextFn!()).toBeUndefined();
    });

    it('should return a custom status text', () => {
      const statusTextFn = jest.fn().mockReturnValue('custom status text');
      spectator.setInput('statusTextFn', statusTextFn);

      spectator.detectChanges();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(component.statusTextFn!()).toBe('custom status text');
    });
  });

  describe('ngOnInit', () => {
    it('should read the file and handle the progress events if autoReadFileData is true', () => {
      const file = new File([''], 'filename.txt');
      const reader = {
        readAsArrayBuffer: jest.fn(),
        onloadstart: undefined,
        onload: undefined,
        onprogress: undefined,
        onabort: undefined,
        onerror: undefined,
        onloadend: undefined,
        // eslint-disable-next-line object-shorthand
        addEventListener: function (event: string, callback: any) {
          this[`on${event}`] = callback;
        },
      } as { [key: string]: any };

      global.FileReader = jest.fn(() => reader as unknown as FileReader) as any;

      component.autoReadFileData = true;

      const mockHandle = jest.fn();
      component['handleProgressEventFactory'] = jest
        .fn()
        .mockReturnValue(mockHandle);
      component.fileLoaded.emit = jest.fn();
      component['changeDetectorRef'].markForCheck = jest.fn();

      component.ngOnInit();

      expect(reader.readAsArrayBuffer).toHaveBeenCalledWith(file);
      expect(reader.onloadstart).toBe(mockHandle);
      expect(reader.onload).toBe(mockHandle);
      expect(reader.onprogress).toBe(mockHandle);
      expect(reader.onabort).toBe(mockHandle);
      expect(reader.onerror).toEqual(expect.any(Function));
      expect(reader.onloadend).toEqual(expect.any(Function));

      reader.onloadend({ target: { result: 'result' } });

      expect(component.loaded).toBe(true);

      expect(component.fileLoaded.emit).toHaveBeenCalled();
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
    });

    it('should read the file and handle the progress events if autoReadFileData is true and emit fileError on error', () => {
      const file = new File([''], 'filename.txt');
      const reader = {
        readAsArrayBuffer: jest.fn(),
        onloadstart: undefined,
        onload: undefined,
        onprogress: undefined,
        onabort: undefined,
        onerror: undefined,
        onloadend: undefined,
        // eslint-disable-next-line object-shorthand
        addEventListener: function (event: string, callback: any) {
          this[`on${event}`] = callback;
        },
      } as { [key: string]: any };

      global.FileReader = jest.fn(() => reader as unknown as FileReader) as any;

      component.autoReadFileData = true;

      const mockHandle = jest.fn();
      component['handleProgressEventFactory'] = jest
        .fn()
        .mockReturnValue(mockHandle);
      component.fileError.emit = jest.fn();

      component.ngOnInit();

      expect(reader.readAsArrayBuffer).toHaveBeenCalledWith(file);
      expect(reader.onloadstart).toBe(mockHandle);
      expect(reader.onload).toBe(mockHandle);
      expect(reader.onprogress).toBe(mockHandle);
      expect(reader.onabort).toBe(mockHandle);
      expect(reader.onerror).toEqual(expect.any(Function));
      expect(reader.onloadend).toEqual(expect.any(Function));

      reader.onerror({});

      expect(component.error).toBe(true);

      expect(component.fileError.emit).toHaveBeenCalled();
    });

    it('should set the progress to 100 and emit the file if autoReadFileData is false', () => {
      const file = new File([''], 'filename.txt');

      component.fileLoaded.emit = jest.fn();

      component.autoReadFileData = false;

      component.ngOnInit();

      expect(component.progress).toBe(100);
      expect(component.loaded).toBe(true);
      expect(component.fileLoaded.emit).toHaveBeenCalledWith({
        file,
        fileComponent: component,
      });
    });
  });

  describe('onRemoveFile', () => {
    it('should emit the removeFile event', () => {
      component.removeFile.emit = jest.fn();

      component.onRemoveFile();

      expect(component.removeFile.emit).toHaveBeenCalled();
    });
  });

  describe('setManualProgess', () => {
    it('should set the manual progress', () => {
      component['changeDetectorRef'].markForCheck = jest.fn();

      component.setManualProgess(50);

      expect(component.manualProgress).toBe(50);
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
    });
  });

  describe('setMessage', () => {
    it('should set the message', () => {
      const message: Message = {
        type: 'error',
        title: 'title',
        description: 'description',
      };

      component['changeDetectorRef'].markForCheck = jest.fn();

      component.setMessage(message);

      expect(component.message).toEqual(message);
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
    });
  });

  describe('handleProgressEventFactory', () => {
    it('should return a function that sets the progress', () => {
      const event = { loaded: 50, total: 100 };

      const handleProgress = component['handleProgressEventFactory'](component);

      handleProgress(event as ProgressEvent);

      expect(component.progress).toBe(0.5);
    });
  });
});
