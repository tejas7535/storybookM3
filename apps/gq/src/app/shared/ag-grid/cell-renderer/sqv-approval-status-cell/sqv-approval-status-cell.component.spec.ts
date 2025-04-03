import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { RfqSqvCheckAttachmentFacade } from '@gq/core/store/rfq-sqv-check-attachments/rfq-sqv-check-attachments.facade';
import { RfqSqvCheckAttachmentModule } from '@gq/core/store/rfq-sqv-check-attachments/rfq-sqv-check-attachments.module';
import { AttachmentFilesUploadModalComponent } from '@gq/shared/components/modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { MockComponent, MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SqvApprovalStatusCellComponent } from './sqv-approval-status-cell.component';

describe('SqvApprovalStatusCellComponent', () => {
  let component: SqvApprovalStatusCellComponent;
  let spectator: Spectator<SqvApprovalStatusCellComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: SqvApprovalStatusCellComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(RfqSqvCheckAttachmentModule),
      MockComponent(AttachmentFilesUploadModalComponent),
    ],
    providers: [
      provideMockStore(),
      mockProvider(RfqSqvCheckAttachmentFacade, {
        downloadAttachments: jest.fn(),
        setGqPositionId: jest.fn(),
        resetGqPositionId: jest.fn(),
      }),
    ],
    mocks: [MatDialog],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
  });

  test('should create', () => {
    expect(component).toBeTruthy();
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

    test('should call downloadAttachments when status is APPROVED', () => {
      const downloadAttachmentsSpy = jest.spyOn(
        component['attachmentFacade'],
        'downloadAttachments'
      );
      const cellParams = {
        value: 'APPROVED',
        data: { gqPositionId: '1245' },
        context: {},
      } as ICellRendererParams;

      component.agInit(cellParams);

      component.onTagClick();
      expect(downloadAttachmentsSpy).toHaveBeenCalled();
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
  });
  test('should open the AttachmentFilesUploadModalComponent', () => {
    component['openUploadDialog']();
    expect(matDialogSpyObject.open).toHaveBeenCalledWith(
      AttachmentFilesUploadModalComponent,
      expect.anything()
    );
  });
});
