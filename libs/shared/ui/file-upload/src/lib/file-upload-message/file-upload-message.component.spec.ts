import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { FileUploadMessageComponent } from './file-upload-message.component';

describe('FileUploadMessageComponent', () => {
  let component: FileUploadMessageComponent;
  let spectator: Spectator<FileUploadMessageComponent>;

  const createComponent = createComponentFactory({
    component: FileUploadMessageComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();

    spectator.setInput('message', {
      type: 'error',
      text: 'test',
      title: 'test',
    });

    spectator.detectChanges();

    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should emit closeMessage', () => {
      const closeMessageSpy = jest.spyOn(component.closeMessage, 'emit');

      component.close();

      expect(closeMessageSpy).toHaveBeenCalled();
    });
  });
});
