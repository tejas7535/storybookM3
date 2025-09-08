import { RfqCalculatorAttachment } from '@gq/calculator/rfq-4-detail-view/models/rfq-calculator-attachments.interface';
import { QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

import { RFQ_CALCULATOR_ATTACHMENTS_MOCK } from '../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { RFQ_4_PROCESS_HISTORY_MOCK } from '../../../../testing/mocks/models/calculator/rfq-4-overview/rfq-4-overview-data-mock';
import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { activeCaseFeature } from '../active-case/active-case.reducer';
import { Rfq4ProcessActions } from './rfq-4-process.actions';
import {
  ProcessLoading,
  rfq4ProcessFeature,
  Rfq4ProcessState,
} from './rfq-4-process.reducer';

describe('rfq4ProcessFeature.reducer', () => {
  const rfq4ProcessesMock: Rfq4ProcessState = {
    gqId: undefined,
    gqPositionId: undefined,
    processLoading: ProcessLoading.NONE,
    foundCalculators: [],
    sapMaintainers: [],
    sapMaintainersLoading: false,
    processHistory: null,
    processAttachments: [],
    processAttachmentsLoading: false,
  };

  const gqPositionId = '1245';
  const foundCalculators = ['calculator1', 'calculator2'];
  describe('findCalculators', () => {
    test('should set processLoading to FIND_CALCULATORS', () => {
      const action = Rfq4ProcessActions.findCalculators({
        gqPositionId,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.FIND_CALCULATORS);
    });
    test('should set findCalculatorsLoading to false', () => {
      const fakeState: Rfq4ProcessState = {
        ...rfq4ProcessesMock,
        processLoading: ProcessLoading.FIND_CALCULATORS,
      };

      const action = Rfq4ProcessActions.findCalculatorsSuccess({
        gqPositionId,
        foundCalculators,
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
    test('should set process loading to none when error', () => {
      const action = Rfq4ProcessActions.findCalculatorsError({
        error: 'an Error',
        gqPositionId,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });

    test('should clear the foundCalculators', () => {
      const action = Rfq4ProcessActions.clearCalculators();
      const state = rfq4ProcessFeature.reducer(
        { ...rfq4ProcessesMock, foundCalculators: ['name1', 'name2'] },
        action
      );
      expect(state.foundCalculators).toEqual([]);
    });
  });

  describe('sendRecalculateSqvRequest', () => {
    test('should set process loading to SEND_RECALCULATE_SQV', () => {
      const action = Rfq4ProcessActions.sendRecalculateSqvRequest({
        gqPositionId,
        message: 'message',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.SEND_RECALCULATE_SQV);
    });
    test('should set sendRecalculateSqvRequestLoading to false', () => {
      const fakeState: Rfq4ProcessState = {
        ...rfq4ProcessesMock,
        processLoading: ProcessLoading.SEND_RECALCULATE_SQV,
      };

      const action = Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
        gqPositionId,
        rfqProcessResponse: {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          processVariables: {
            rfq4Status: Rfq4Status.IN_PROGRESS,
            rfqId: 456,
            gqId: 123,
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          },
          allowedToReopen: true,
        },
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
    test('should set sendRecalculateSqvRequestLoading to false when error', () => {
      const action = Rfq4ProcessActions.sendRecalculateSqvRequestError({
        error: 'an Error',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
  });

  describe('sendReopenRecalculationRequest', () => {
    test('should set process loading to SEND_REOPEN', () => {
      const action = Rfq4ProcessActions.sendReopenRecalculationRequest({
        gqPositionId,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.REOPEN_RECALCULATION);
    });
    test('should set processLoading to NONE', () => {
      const fakeState: Rfq4ProcessState = {
        ...rfq4ProcessesMock,
        processLoading: ProcessLoading.REOPEN_RECALCULATION,
      };

      const action = Rfq4ProcessActions.sendReopenRecalculationRequestSuccess({
        gqPositionId,
        rfqProcessResponse: {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          processVariables: {
            rfq4Status: Rfq4Status.IN_PROGRESS,
            rfqId: 456,
            gqId: 123,
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          },
          allowedToReopen: true,
        },
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
    test('should set processLoading to none when error', () => {
      const action = Rfq4ProcessActions.sendRecalculateSqvRequestError({
        error: 'an Error',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
  });
  describe('getSapMaintainerUserIds', () => {
    test('should set sapMaintainersLoading to true', () => {
      const action = Rfq4ProcessActions.getSapMaintainerUserIds();
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(true);
    });
    test('should set sapMaintainersLoading to false when error', () => {
      const action = Rfq4ProcessActions.getSapMaintainerUserIdsError({
        error: 'an Error',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(false);
    });
  });
  describe('getActiveDirectoryUserOfSapMaintainerUserIds', () => {
    test('should set sapMaintainersLoading to false', () => {
      const action =
        Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsSuccess({
          maintainers: [
            {
              userId: 'userId',
              firstName: 'firstName',
              lastName: 'lastName',
              mail: 'mail',
            },
          ],
        });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(false);
    });
    test('should set sapMaintainersLoading to false and set sapMaintainers', () => {
      const action =
        Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsSuccess({
          maintainers: [
            {
              userId: 'userId',
              firstName: 'firstName',
              lastName: 'lastName',
              mail: 'mail',
            },
          ],
        });
      const state = rfq4ProcessFeature.reducer(
        {
          ...rfq4ProcessesMock,
          sapMaintainers: [
            {
              userId: 'userId',
              firstName: null as string,
              lastName: null as string,
              mail: null as string,
            },
          ],
        },
        action
      );

      expect(state.sapMaintainers).toEqual([
        {
          userId: 'userId',
          firstName: 'firstName',
          lastName: 'lastName',
          mail: 'mail',
        },
      ]);
    });
    test('should set sapMaintainersLoading to false when error', () => {
      const action =
        Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsError({
          error: 'an Error',
        });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(false);
    });
  });

  describe('sendRecalculateSqvRequestSuccessReducer', () => {
    test('should update the rfq4Status, after sending recalculationRequest', () => {
      const fakeState = {
        activeCase: {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: {
            ...ACTIVE_CASE_STATE_MOCK.quotation,
            quotationDetails: [
              {
                ...QUOTATION_DETAIL_MOCK,
                rfq4Status: Rfq4Status.OPEN,
              } as QuotationDetail,
            ],
          },
        },
      };
      const action = Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        rfqProcessResponse: {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          processVariables: {
            rfq4Status: Rfq4Status.IN_PROGRESS,
            rfqId: 456,
            gqId: 123,
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          },
          allowedToReopen: true,
        },
      });
      const state = activeCaseFeature.reducer(fakeState.activeCase, action);

      expect(state.quotation.quotationDetails[0].rfq4.rfq4Status).toEqual(
        Rfq4Status.IN_PROGRESS
      );
      expect(state.quotation.quotationDetails[0].rfq4.rfq4Id).toEqual(456);
      expect(state.quotation.quotationDetails[0].rfq4.allowedToReopen).toEqual(
        true
      );
    });
  });

  describe('ReopenRecalculationSucessReducer', () => {
    test('should update the rfq4Status, after sending reopenrecalculationRequest', () => {
      const fakeState = {
        activeCase: {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: {
            ...ACTIVE_CASE_STATE_MOCK.quotation,
            quotationDetails: [
              {
                ...QUOTATION_DETAIL_MOCK,
                rfq4: {
                  rfq4Status: Rfq4Status.OPEN,
                },
              } as QuotationDetail,
            ],
          },
        },
      };
      const action = Rfq4ProcessActions.sendReopenRecalculationRequestSuccess({
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        rfqProcessResponse: {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,

          processVariables: {
            rfq4Status: Rfq4Status.IN_PROGRESS,
            rfqId: 456,
            gqId: 123,
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          },
          allowedToReopen: false,
        },
      });
      const state = activeCaseFeature.reducer(fakeState.activeCase, action);

      expect(state.quotation.quotationDetails[0].rfq4.rfq4Status).toEqual(
        Rfq4Status.IN_PROGRESS
      );
      expect(state.quotation.quotationDetails[0].rfq4.rfq4Id).toEqual(456);
      expect(state.quotation.quotationDetails[0].rfq4.allowedToReopen).toEqual(
        false
      );
    });
  });
  describe('sendCancelProcess', () => {
    test('should set processLoading to CANCEL_RECALCULATION', () => {
      const action = Rfq4ProcessActions.sendCancelProcess({
        gqPositionId,
        reasonForCancellation: 'CUSTOMER',
        comment: 'Comment',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.CANCEL_RECALCULATION);
    });
    test('should set processLoading to NONE on cancel process success', () => {
      const fakeState = {
        ...rfq4ProcessesMock,
        gqPositionId: '123456',
        processLoading: ProcessLoading.CANCEL_RECALCULATION,
      };

      const action = Rfq4ProcessActions.sendCancelProcessSuccess({
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        rfqProcessResponse: {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          processVariables: {
            rfq4Status: Rfq4Status.CANCELLED,
            rfqId: 456,
            gqId: 123,
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          },
          allowedToReopen: true,
        },
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);
      expect(state.processLoading).toEqual(ProcessLoading.NONE);
      expect(state.gqPositionId).toBeUndefined();
      expect(state.foundCalculators).toEqual([]);
    });
    test('should set processLoading to NONE on cancel process error', () => {
      const fakeState = {
        ...rfq4ProcessesMock,
        gqPositionId: '123456',
        processLoading: ProcessLoading.CANCEL_RECALCULATION,
      };

      const action = Rfq4ProcessActions.sendCancelProcessError({
        error: 'Error',
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);
      expect(state.processLoading).toEqual(ProcessLoading.NONE);
      expect(state.gqPositionId).toBeUndefined();
    });
  });

  describe('getProcessHistory', () => {
    test('should set processLoading to PROCESS_HISTORY', () => {
      const action = Rfq4ProcessActions.getProcessHistory({
        gqPositionId: '123456',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);
      expect(state.processLoading).toEqual(ProcessLoading.PROCESS_HISTORY);
    });
    test('should set processLoading to NONE on getProcessHistorySuccess', () => {
      const fakeState = {
        ...rfq4ProcessesMock,
        gqPositionId: '123456',
        processLoading: ProcessLoading.PROCESS_HISTORY,
      };
      const action = Rfq4ProcessActions.getProcessHistorySuccess({
        processHistory: RFQ_4_PROCESS_HISTORY_MOCK,
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);
      expect(state.processLoading).toEqual(ProcessLoading.NONE);
      expect(state.gqPositionId).toBeUndefined();
      expect(state.processHistory).toEqual(RFQ_4_PROCESS_HISTORY_MOCK);
    });
    test('should set processLoading to NONE on getProcessHistoryError', () => {
      const fakeState = {
        ...rfq4ProcessesMock,
        gqPositionId: '123456',
        processLoading: ProcessLoading.PROCESS_HISTORY,
      };
      const action = Rfq4ProcessActions.getProcessHistoryError({
        error: 'Error',
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);
      expect(state.processLoading).toEqual(ProcessLoading.NONE);
      expect(state.gqPositionId).toBeUndefined();
      expect(state.processHistory).toBeNull();
    });
  });

  describe('getProcessAttachments', () => {
    test('should set processLoading to PROCESS_ATTACHMENTS', () => {
      const action = Rfq4ProcessActions.getProcessAttachments({
        rfqId: 1234,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);
      expect(state.processAttachmentsLoading).toBeTruthy();
    });
    test('should set processLoading to NONE on getProcessAttachmentsSuccess', () => {
      const fakeState = {
        ...rfq4ProcessesMock,
        processAttachments: [] as RfqCalculatorAttachment[],
        processAttachmentsLoading: true,
      };
      const action = Rfq4ProcessActions.getProcessAttachmentsSuccess({
        attachments: RFQ_CALCULATOR_ATTACHMENTS_MOCK,
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);
      expect(state.processAttachmentsLoading).toBeFalsy();
      expect(state.processAttachments).toEqual(RFQ_CALCULATOR_ATTACHMENTS_MOCK);
    });
    test('should set processLoading to NONE on getProcessAttachmentsError', () => {
      const fakeState = {
        ...rfq4ProcessesMock,
        processAttachments: [] as RfqCalculatorAttachment[],
        processAttachmentsLoading: true,
      };
      const action = Rfq4ProcessActions.getProcessAttachmentsError({
        error: 'Error',
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);
      expect(state.processAttachmentsLoading).toBeFalsy();
      expect(state.processAttachments.length).toBe(0);
    });
  });

  describe('extraSelectors', () => {
    test('getValidMaintainers should return maintainers with firstName and lastName', () => {
      const result = rfq4ProcessFeature.getValidMaintainers.projector([
        { userId: 'any', firstName: null, lastName: null },
        { userId: 'valid', firstName: 'John', lastName: 'Doe' },
      ]);

      expect(result).toEqual([
        { userId: 'valid', firstName: 'John', lastName: 'Doe' },
      ]);
    });
  });
});
