import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationAttachment } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AttachmentFilesUploadModalComponent } from '../modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentFilesComponent } from './attachment-files.component';

describe('AttachmentFilesComponent', () => {
  let component: AttachmentFilesComponent;
  let spectator: Spectator<AttachmentFilesComponent>;

  const createComponent = createComponentFactory({
    component: AttachmentFilesComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      { provide: MatDialog, useValue: {} },
      mockProvider(ActiveCaseFacade),
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

  test('should open upload dialog', () => {
    component.attachments = [{ fileName: 'test' } as QuotationAttachment];
    const openMock = jest.fn(
      () =>
        ({
          afterClosed: () => {},
        } as any)
    );
    component['dialog'].open = openMock;

    component.openAddFileDialog();

    expect(openMock).toBeCalledTimes(1);
    expect(openMock).toHaveBeenCalledWith(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
      data: { attachments: component.attachments },
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('download attachment', () => {
    test('should be called downloadFile', () => {
      const attachment: QuotationAttachment = {
        gqId: 123,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };

      component.activeCaseFacade.downloadAttachment = jest.fn();

      component.downloadFile(attachment);

      expect(
        component.activeCaseFacade.downloadAttachment
      ).toHaveBeenCalledWith(attachment);
    });
  });
});
