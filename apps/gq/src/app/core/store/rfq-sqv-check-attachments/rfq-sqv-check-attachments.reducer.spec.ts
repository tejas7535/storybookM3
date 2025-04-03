import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';

import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';
import {
  rfqSqvCheckAttachmentsFeature,
  RfqSqvCheckAttachmentsState,
} from './rfq-sqv-check-attachments.reducer';

describe('RfqSqvCheckAttachmentsReducer', () => {
  const rfqSqvCheckAttachmentsMock: RfqSqvCheckAttachmentsState = {
    attachmentsUploading: false,
    gqPositionId: undefined,
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
});
