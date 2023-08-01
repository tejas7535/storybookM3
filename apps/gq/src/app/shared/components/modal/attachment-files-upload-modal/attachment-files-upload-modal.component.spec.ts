import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { when } from 'jest-when';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AttachmentFilesUploadModalComponent } from './attachment-files-upload-modal.component';

describe('AttachmentFilesUploadModalComponent', () => {
  let component: AttachmentFilesUploadModalComponent;
  let spectator: Spectator<AttachmentFilesUploadModalComponent>;

  const createComponent = createComponentFactory({
    component: AttachmentFilesUploadModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [{ provide: MatDialogRef, useValue: {} }],
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
    test('should set selectedFilesList is empty when input is empty', () => {
      component['spinningAnimation'] = jest.fn();
      const inputEvent: Event = { target: { files: [] } } as unknown as Event;

      component.handleFileInput(inputEvent);
      expect(component['spinningAnimation']).not.toHaveBeenCalled();
      expect(component.selectedFilesList).toStrictEqual([]);
    });

    test('should set selectedFilesList  empty when input is undefined', () => {
      component['spinningAnimation'] = jest.fn();
      const inputEvent: Event = {
        target: {} as HTMLInputElement,
      } as unknown as Event;
      component.handleFileInput(inputEvent);
      expect(component['spinningAnimation']).not.toHaveBeenCalled();
      expect(component.selectedFilesList).toStrictEqual([]);
    });

    test('should set selectedFilesList is with input list', () => {
      component['spinningAnimation'] = jest.fn();
      const itemMock = jest.fn();
      when(itemMock)
        .calledWith(0)
        .mockReturnValue({ name: 'file-1' } as File);
      when(itemMock)
        .calledWith(1)
        .mockReturnValue({ name: 'file-2' } as File);
      const fileList: FileList = {
        length: 2,
        0: { name: 'file-1' } as File,
        1: { name: 'file-2' } as File,
      } as unknown as FileList;
      fileList.item = itemMock;

      const inputEvent: Event = {
        target: { files: fileList },
      } as unknown as Event;

      component.handleFileInput(inputEvent);

      expect(component['spinningAnimation']).toHaveBeenCalledTimes(2);
      expect(component.selectedFilesList).toStrictEqual(['file-1', 'file-2']);
    });
  });

  describe('close and upload dialog', () => {
    test('should call close method', () => {
      const closeMock = jest.fn();
      component['dialogRef'].close = closeMock;
      component.closeDialog();

      expect(closeMock).toBeCalledTimes(1);
    });

    test('should call upload method', () => {
      const closeMock = jest.fn();
      const selectedFilesList = ['file1.txt', 'file2.png'];

      component.selectedFilesList = selectedFilesList;

      component['dialogRef'].close = closeMock;
      component.uploadToOther();

      expect(closeMock).toBeCalledTimes(1);
      expect(closeMock).toBeCalledWith(selectedFilesList);
    });

    test('should call upload method when the selectedFilesList is empty', () => {
      const closeMock = jest.fn();
      const selectedFilesList: string[] = [];

      component.selectedFilesList = selectedFilesList;

      component['dialogRef'].close = closeMock;
      component.uploadToOther();

      expect(closeMock).toBeCalledTimes(1);
      expect(closeMock).toBeCalledWith(selectedFilesList);
      expect(component.selectedFilesList).toStrictEqual([]);
    });
  });
});
