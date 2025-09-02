import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { of } from 'rxjs';

import { AccessibleByEnum } from '@gq/calculator/rfq-4-detail-view/models/accessibly-by.enum';
import { RecalculateSqvStatus } from '@gq/calculator/rfq-4-detail-view/models/recalculate-sqv-status.enum';
import { RfqCalculatorAttachment } from '@gq/calculator/rfq-4-detail-view/models/rfq-calculator-attachments.interface';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { AttachmentFilesUploadModalComponent } from '@gq/shared/components/modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentDialogData } from '@gq/shared/components/modal/attachment-files-upload-modal/models/attachment-dialog-data.interface';
import { DeletingAttachmentModalComponent } from '@gq/shared/components/modal/delete-attachment-modal/delete-attachment-modal.component';
import { DeleteAttachmentDialogData } from '@gq/shared/components/modal/delete-attachment-modal/models/delete-attachment-dialog-data.interface';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockBuilder } from 'ng-mocks';

import { RFQ_CALCULATOR_ATTACHMENTS_MOCK } from '../../../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { RecalculationAttachmentsComponent } from './recalculation-attachments.component';

describe('RecalculationAttachmentsComponent', () => {
  let component: RecalculationAttachmentsComponent;
  let spectator: Spectator<RecalculationAttachmentsComponent>;

  const rfq4recalculationStatus = signal(RecalculateSqvStatus.OPEN);
  const loggedUserAssignedToRfq = signal(true);
  const attachmentUploadSuccess = signal(false);
  const deleteAttachmentSuccess = signal(false);

  const dependencies = MockBuilder(RecalculationAttachmentsComponent)
    .mock(Rfq4DetailViewStore, {
      getRecalculationStatus: rfq4recalculationStatus,
      isLoggedUserAssignedToRfq: loggedUserAssignedToRfq,
      isAttachmentUploadSuccess: attachmentUploadSuccess,
      isAttachmentDeleteSuccess: deleteAttachmentSuccess,
      attachments: signal([]),
      uploadCalculatorAttachments: jest.fn(),
      deleteCalculatorAttachment: jest.fn(),
      downloadCalculatorAttachment: jest.fn(),
      switchAttachmentAccess: jest.fn(),
    })
    .build();

  const createComponent = createComponentFactory({
    component: RecalculationAttachmentsComponent,
    ...dependencies,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should emit uploadSuccessfulSubject when isAttachmentUploadSuccess is true', () => {
      let testResult = false;
      component['uploadSuccessfulSubject'].subscribe(() => {
        testResult = true;
      });
      component.ngOnInit();
      attachmentUploadSuccess.set(true);
      spectator.detectChanges();
      expect(testResult).toBeTruthy();
    });

    test('should emit deleteSuccessfulSubject when isAttachmentDeleteSuccess is true', () => {
      let testResult = false;
      component['deleteSuccessfulSubject'].subscribe(() => {
        testResult = true;
      });
      component.ngOnInit();
      deleteAttachmentSuccess.set(true);
      spectator.detectChanges();
      expect(testResult).toBeTruthy();
    });
  });
  describe('onAccessChange', () => {
    test('should update accessibleByOptions when access changes', () => {
      const attachment: RfqCalculatorAttachment = {
        fileName: 'test.txt',
        accessibleBy: AccessibleByEnum.CALCULATOR,
      } as RfqCalculatorAttachment;
      component['onAccessChange'](
        attachment,
        AccessibleByEnum.CALCULATOR_SALES
      );
      const fileToUpdate = {
        fileName: attachment.fileName,
        accessibleBy: AccessibleByEnum.CALCULATOR_SALES,
      };
      expect(component['store'].switchAttachmentAccess).toHaveBeenCalledWith(
        fileToUpdate
      );
    });
  });

  describe('openAddFileDialog', () => {
    test('should open upload dialog', () => {
      const openMock = jest.fn(
        () =>
          ({
            afterClosed: () => {},
          }) as any
      );
      component['dialog'].open = openMock;

      const expected = [
        AttachmentFilesUploadModalComponent,
        {
          width: '634px',
          disableClose: true,
          data: {
            fileNames: ['test'],
            upload: jest.fn().bind(component['store']),
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
  });

  describe('openConfirmDeleteAttachmentDialog', () => {
    test('should open delete attachment dialog', () => {
      const attachment: RfqCalculatorAttachment = {
        fileName: 'test.txt',
        gqId: 123,
        rfqId: 456,
      } as RfqCalculatorAttachment;

      const openMock = jest.fn(
        () =>
          ({
            afterClosed: () => {},
          }) as any
      );
      component['dialog'].open = openMock;
      const expected = [
        DeletingAttachmentModalComponent,
        {
          width: '634px',
          disableClose: true,
          data: {
            attachment,
            delete: jest.fn().bind(component['store']),
            deleteSuccess$: of(),
            deleting$: of(false),
          } as DeleteAttachmentDialogData<RfqCalculatorAttachment>,
        },
      ];

      component.openConfirmDeleteAttachmentDialog(attachment);

      expect(openMock).toHaveBeenCalledTimes(1);
      // workAround because strictEquality
      // get arguments of first mockCall and compare
      const actualArgs = openMock.mock.calls[0];
      expect(actualArgs.toString()).toStrictEqual(expected.toString());
    });
  });
  describe('downloadAttachment', () => {
    test('should call store', () => {
      component.downloadAttachment(RFQ_CALCULATOR_ATTACHMENTS_MOCK[0]);

      expect(
        component['store'].downloadCalculatorAttachment
      ).toHaveBeenCalledWith(RFQ_CALCULATOR_ATTACHMENTS_MOCK[0]);
    });
  });
});
