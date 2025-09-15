import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { PositionAttachment } from '@gq/shared/services/rest/attachments/models/position-attachment.interface';

import { QUOTATION_MOCK } from '../../../../testing/mocks/models/quotation';
import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state';
import { activeCaseFeature } from '../active-case/active-case.reducer';
import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';
import {
  rfqSqvCheckAttachmentsFeature,
  RfqSqvCheckAttachmentsState,
} from './rfq-sqv-check-attachments.reducer';

describe('RfqSqvCheckAttachmentsReducer', () => {
  const rfqSqvCheckAttachmentsMock: RfqSqvCheckAttachmentsState = {
    attachmentsUploading: false,
    gqPositionId: undefined,
    attachments: [],
    attachmentsLoading: false,
  };
  const gqPositionId = '1245';
  describe('uploadAttachments', () => {
    test('should set attachmentsUploading to true', () => {
      const action = RfqSqvCheckAttachmentsActions.uploadAttachments({
        files: [],
      });
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        rfqSqvCheckAttachmentsMock,
        action
      );

      expect(state.attachmentsUploading).toEqual(true);
    });
    test('should set attachmentsUploading to false', () => {
      const fakeState: RfqSqvCheckAttachmentsState = {
        ...rfqSqvCheckAttachmentsMock,
        attachmentsUploading: true,
      };

      const action = RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess({
        gqPositionId,
        newApprovalStatus: SqvApprovalStatus.APPROVED,
      });
      const state = rfqSqvCheckAttachmentsFeature.reducer(fakeState, action);

      expect(state.attachmentsUploading).toEqual(false);
    });

    test('should set attachmentsUploading to false and set errorMessage', () => {
      const action = RfqSqvCheckAttachmentsActions.uploadAttachmentsFailure({
        errorMessage: 'an Error',
      });
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        rfqSqvCheckAttachmentsMock,
        action
      );

      expect(state.attachmentsUploading).toEqual(false);
    });
  });

  describe('setGqPositionId', () => {
    test('should set the gqPositionId', () => {
      const action = RfqSqvCheckAttachmentsActions.setGqPositionId({
        gqPositionId,
      });
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        rfqSqvCheckAttachmentsMock,
        action
      );

      expect(state.gqPositionId).toEqual(gqPositionId);
    });
  });
  describe('resetGqPositionId', () => {
    test('should reset the gqPositionId', () => {
      const action = RfqSqvCheckAttachmentsActions.resetGqPositionId();
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        { ...rfqSqvCheckAttachmentsMock, gqPositionId },
        action
      );

      expect(state.gqPositionId).toBeUndefined();
    });
  });

  describe('getAllAttachments', () => {
    test('should set attachmentsLoading to true and reset attachments', () => {
      const action = RfqSqvCheckAttachmentsActions.getAllAttachments({
        gqPositionId,
      });
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        {
          ...rfqSqvCheckAttachmentsMock,
          attachments: [
            {
              gqPositionId: '1',
              fileName: 'a',
            } as unknown as PositionAttachment,
          ],
        },
        action
      );
      expect(state.attachmentsLoading).toEqual(true);
      expect(state.attachments).toEqual([]);
    });

    test('should set attachmentsLoading to false and set attachments', () => {
      const attachments: PositionAttachment[] = [
        {
          gqPositionId: '1',
          fileName: 'a',
        } as unknown as PositionAttachment,
        {
          gqPositionId: '1',
          fileName: 'b',
        } as unknown as PositionAttachment,
      ];
      const action = RfqSqvCheckAttachmentsActions.getAllAttachmentsSuccess({
        attachments,
      });
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        { ...rfqSqvCheckAttachmentsMock, attachmentsLoading: true },
        action
      );
      expect(state.attachmentsLoading).toEqual(false);
      expect(state.attachments).toEqual(attachments);
    });

    test('should set attachmentsLoading to false on failure', () => {
      const action = RfqSqvCheckAttachmentsActions.getAllAttachmentsFailure({
        errorMessage: 'an Error',
      });
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        { ...rfqSqvCheckAttachmentsMock, attachmentsLoading: true },
        action
      );

      expect(state.attachmentsLoading).toEqual(false);
    });

    test('should reset attachments on resetAttachments', () => {
      const action = RfqSqvCheckAttachmentsActions.resetAttachments();
      const state = rfqSqvCheckAttachmentsFeature.reducer(
        {
          ...rfqSqvCheckAttachmentsMock,
          attachments: [
            {
              gqPositionId: '1',
              fileName: 'a',
            } as unknown as PositionAttachment,
          ],
        },
        action
      );

      expect(state.attachments).toEqual([]);
    });
  });
});

describe('RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess', () => {
  test('should update the sqvApprovalState by the action.newApprovalState value', () => {
    const action = RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess({
      gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      newApprovalStatus: SqvApprovalStatus.APPROVED,
    });
    const state = activeCaseFeature.reducer(
      {
        ...ACTIVE_CASE_STATE_MOCK,
        quotation: {
          ...QUOTATION_MOCK,
          quotationDetails: [
            {
              ...QUOTATION_DETAIL_MOCK,
              rfq4: {
                ...QUOTATION_DETAIL_MOCK.rfq4,
                sqvApprovalStatus: SqvApprovalStatus.APPROVAL_NEEDED,
              },
            },
          ],
        },
      },
      action
    );
    expect(state.quotation.quotationDetails[0].rfq4.sqvApprovalStatus).toEqual(
      'APPROVED'
    );
  });
});
