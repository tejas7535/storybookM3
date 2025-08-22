import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationAttachment } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AttachmentFilesUploadModalComponent } from '../modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentDialogData } from '../modal/attachment-files-upload-modal/models/attachment-dialog-data.interface';
import { DeletingAttachmentModalComponent } from '../modal/delete-attachment-modal/delete-attachment-modal.component';
import { DeleteAttachmentDialogData } from '../modal/delete-attachment-modal/models/delete-attachment-dialog-data.interface';
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
      provideMockStore({ initialState: {} }),
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
        }) as any
    );
    component['dialog'].open = openMock;
    component.activeCaseFacade.uploadAttachmentsSuccess$ = of();
    component.activeCaseFacade.attachmentsUploading$ = of(false);
    component.activeCaseFacade.uploadAttachments = jest.fn();

    const expected = [
      AttachmentFilesUploadModalComponent,
      {
        width: '634px',
        disableClose: true,
        data: {
          fileNames: ['test'],
          upload: jest.fn().bind(component.activeCaseFacade),
          uploading$: of(false),
          uploadSuccess$: of(),
        } as AttachmentDialogData,
      },
    ];

    component.openAddFileDialog();

    expect(openMock).toHaveBeenCalledTimes(1);
    // workAround because strictEquality
    // get arguments of first mockCall and compare
    const actualArgs = openMock.mock.calls[0];
    expect(actualArgs.toString()).toStrictEqual(expected.toString());
  });

  test('should open delete dialog', () => {
    const attachment: QuotationAttachment = {
      gqId: 123,
      sapId: '456',
      folderName: 'folder',
      uploadedAt: '2020-01-01',
      uploadedBy: 'user',
      fileName: 'test.jpg',
    };

    const openMock = jest.fn(
      () =>
        ({
          afterClosed: () => {},
        }) as any
    );
    component['dialog'].open = openMock;
    component.activeCaseFacade.deleteAttachmentSuccess$ = of();
    component.activeCaseFacade.deletionAttachmentInProgress$ = of(false);
    component.activeCaseFacade.deleteAttachment = jest.fn();
    const expected = [
      DeletingAttachmentModalComponent,
      {
        width: '634px',
        disableClose: true,
        data: {
          delete: jest.fn().bind(component.activeCaseFacade),
          deleting$: of(false),
          deleteSuccess$: of(),
          attachment,
        } as DeleteAttachmentDialogData<QuotationAttachment>,
      },
    ];

    component.openConfirmDeleteAttachmentDialog(attachment);

    expect(openMock).toHaveBeenCalledTimes(1);
    // workAround because strictEquality
    // get arguments of first mockCall and compare
    const actualArgs = openMock.mock.calls[0];
    expect(actualArgs.toString()).toStrictEqual(expected.toString());
  });

  describe('download attachment', () => {
    test('should be called downloadAttachment', () => {
      const attachment: QuotationAttachment = {
        gqId: 123,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };

      component.activeCaseFacade.downloadAttachment = jest.fn();

      component.downloadAttachment(attachment);

      expect(
        component.activeCaseFacade.downloadAttachment
      ).toHaveBeenCalledWith(attachment);
    });
  });
});
