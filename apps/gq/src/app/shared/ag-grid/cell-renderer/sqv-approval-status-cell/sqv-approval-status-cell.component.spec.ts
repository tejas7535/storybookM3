import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { RfqSqvCheckAttachmentFacade } from '@gq/core/store/rfq-sqv-check-attachments/rfq-sqv-check-attachments.facade';
import { AttachmentFilesUploadModalComponent } from '@gq/shared/components/modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { PositionAttachment } from '@gq/shared/services/rest/attachments/models/position-attachment.interface';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { MockBuilder } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { SqvApprovalStatusCellComponent } from './sqv-approval-status-cell.component';

describe('SqvApprovalStatusCellComponent', () => {
  let component: SqvApprovalStatusCellComponent;
  let spectator: Spectator<SqvApprovalStatusCellComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const dependencies = MockBuilder(SqvApprovalStatusCellComponent)
    .mock(RfqSqvCheckAttachmentFacade, {
      downloadAttachments: jest.fn(),
      setGqPositionId: jest.fn(),
      resetGqPositionId: jest.fn(),
      getAllAttachments: jest.fn(),
      updateAttachments: jest.fn(),
      uploadAttachments: jest.fn(),
      resetAttachments: jest.fn(),
      attachments$: of([
        { fileName: 'file1.pdf' },
        { fileName: 'file2.pdf' },
        { fileName: 'file3.pdf' },
      ] as unknown as PositionAttachment[]),
      attachmentsUploading$: of(false),
    })

    .build();

  const createComponent = createComponentFactory({
    component: SqvApprovalStatusCellComponent,
    providers: [],
    mocks: [MatDialog],
    ...dependencies,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
    spectator.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('existingAttachmentsToDisplay$', () => {
    test(
      'should only display attachments which are not marked for deletion',
      marbles((m) => {
        const expected = [
          { fileName: 'file1.pdf' },
          { fileName: 'file3.pdf' },
        ] as unknown as PositionAttachment[];

        component['attachmentsToDelete$$'].next(['file2.pdf']);

        m.expect(component['existingAttachmentsToDisplay$']).toBeObservable(
          m.cold('(a)', { a: expected })
        );
      })
    );
  });
  describe('agInit', () => {
    const cellParams = {
      value: 'APPROVED',
      data: { gqPositionId: '1245' },
      context: {},
    } as ICellRendererParams;
    test('should set value from Params', () => {
      component.agInit(cellParams);
      expect(component['sqvApprovalStatus']).toBe('APPROVED');
      expect(component['gqPositionId']).toBe('1245');
    });

    test('should set the tagType based on the status', () => {
      component.agInit(cellParams);
      expect(component['tagType']).toBe('neutral');
    });
    test('should set default Value when params value is not present', () => {
      component.agInit({ ...cellParams, value: undefined });
      expect(component['sqvApprovalStatus']).toBe(undefined);
    });
  });

  describe('onTagClick', () => {
    test('should call openUploadDialog when status is APPROVAL_NEEDED', () => {
      component['openUploadDialog'] = jest.fn();
      const cellParams = {
        value: 'APPROVAL_NEEDED',
        data: { gqPositionId: '1245' },
        context: {},
      } as ICellRendererParams;

      component.agInit(cellParams);

      component.onTagClick();
      expect(component['openUploadDialog']).toHaveBeenCalled();
    });

    test('should call downloadAttachments when status is APPROVED and Rfq4Status is locked', () => {
      const downloadAttachmentsSpy = jest.spyOn(
        component['attachmentFacade'],
        'downloadAttachments'
      );

      const cellParams = {
        value: 'APPROVED',
        data: {
          gqPositionId: '1245',
        },
        context: {},
      } as ICellRendererParams;

      component.agInit(cellParams);
      component['showLockedIcon'] = true;
      component.onTagClick();
      expect(downloadAttachmentsSpy).toHaveBeenCalled();
    });

    test('should call openUploadDialog when status is APPROVED and Rfq4Status is not locked', () => {
      component['openUploadDialog'] = jest.fn();

      const cellParams = {
        value: 'APPROVED',
        data: {
          gqPositionId: '1245',
        },
        context: {},
      } as ICellRendererParams;

      component.agInit(cellParams);
      component['showLockedIcon'] = false;

      component.onTagClick();
      expect(component['openUploadDialog']).toHaveBeenCalled();
    });
  });

  describe('openUploadDialog', () => {
    test('should set the gqPositionId and Open the dialog, and reset gqPositionId when dialog is closed', () => {
      component['attachmentFacade'].setGqPositionId = jest.fn();
      component['attachmentFacade'].resetGqPositionId = jest.fn();
      component['openUploadDialog']();

      expect(component['attachmentFacade'].setGqPositionId).toHaveBeenCalled();

      expect(
        component['attachmentFacade'].resetGqPositionId
      ).toHaveBeenCalled();
    });

    test('should open the AttachmentFilesUploadModalComponent', () => {
      component['openUploadDialog']();
      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        AttachmentFilesUploadModalComponent,
        expect.anything()
      );
    });
  });

  describe('setFileToBeDeleted', () => {
    test('should add the fileName to fileNamesToDelete and update attachmentsToDelete$$', () => {
      const attachment = {
        fileName: 'test.pdf',
      } as unknown as Attachment;

      component['attachmentsToDelete$$'].next = jest.fn();
      component['fileNamesToDelete'] = [];

      component.setFileToBeDeleted(attachment);
      expect(component['fileNamesToDelete']).toContain('test.pdf');
      expect(component['attachmentsToDelete$$'].next).toHaveBeenCalledWith([
        'test.pdf',
      ]);
    });
  });
  describe('downloadAttachment', () => {
    test('should call downloadAttachments with gqPositionId and attachment', () => {
      const downloadAttachmentsSpy = jest.spyOn(
        component['attachmentFacade'],
        'downloadAttachments'
      );
      const attachment = {
        fileName: 'test.pdf',
      } as unknown as Attachment;
      component['gqPositionId'] = '1234';

      component.downloadAttachment(attachment);
      expect(downloadAttachmentsSpy).toHaveBeenCalledWith('1234', attachment);
    });
  });

  describe('getShowLockedIcon', () => {
    test('should return true when rfq4Status is LOCKED', () => {
      expect(component['getShowLockedIcon'](Rfq4Status.IN_PROGRESS)).toBe(true);
    });
    test('should return false when rfq4Status is OPEN', () => {
      expect(component['getShowLockedIcon'](Rfq4Status.OPEN)).toBe(false);
    });
  });
});
