import {
  PriceSource,
  Quotation,
  QuotationAttachment,
  QuotationDetail,
  QuotationStatus,
} from '@gq/shared/models';
import { SapCallInProgress } from '@gq/shared/models/quotation';
import { Action } from '@ngrx/store';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { ActiveCaseActions } from './active-case.action';
import {
  activeCaseFeature,
  ActiveCaseState,
  initialState,
} from './active-case.reducer';
import { QuotationIdentifier } from './models';

describe('Active Case Reducer', () => {
  const errorMessage = 'An error occured';

  describe('customer', () => {
    describe('customerDetails', () => {
      test('should set customerDetails loading', () => {
        const action = ActiveCaseActions.getCustomerDetails();
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...ACTIVE_CASE_STATE_MOCK,
          customer: initialState.customer,
          customerLoading: true,
        });
      });
    });

    describe('customerDetailsSuccess', () => {
      test('should set customer details', () => {
        const item = CUSTOMER_MOCK;

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          customer: CUSTOMER_MOCK,
        };
        const action = ActiveCaseActions.getCustomerDetailsSuccess({ item });
        const state = activeCaseFeature.reducer(fakeState, action);

        const stateItem = state.customer;
        expect(stateItem).toEqual(item);
      });
    });

    describe('customerDetailsFailure', () => {
      test('should not manipulate state', () => {
        const action = ActiveCaseActions.getCustomerDetailsFailure({
          errorMessage,
        });

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
        };
        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.customerLoading).toBeFalsy();
        expect(state.customerLoadingErrorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('quotation', () => {
    describe('selectQuotation', () => {
      test('should set selectQuotation', () => {
        const quotationIdentifier = new QuotationIdentifier(123, '0267', '456');

        const action = ActiveCaseActions.selectQuotation({
          quotationIdentifier,
        });
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...ACTIVE_CASE_STATE_MOCK,
          quotationIdentifier,
        });
      });
    });

    describe('getQuotationInInterval', () => {
      test('should set quotationLoading', () => {
        const action = ActiveCaseActions.getQuotationInInterval();
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...ACTIVE_CASE_STATE_MOCK,
          quotationLoading: true,
          quotation: initialState.quotation,
        });
      });
    });

    describe('clearActiveQuotation', () => {
      test('should clear/reset quotation and its identifier', () => {
        const quotationIdentifier = new QuotationIdentifier(123, '0267', '456');
        const action = ActiveCaseActions.clearActiveQuotation();
        const state = activeCaseFeature.reducer(
          {
            ...ACTIVE_CASE_STATE_MOCK,
            quotationIdentifier,
          },
          action
        );

        expect(state).toEqual({
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: initialState.quotation,
          quotationIdentifier: initialState.quotationIdentifier,
        });
      });
    });

    describe('getQuotationSuccess', () => {
      test('should set quotation', () => {
        const item = QUOTATION_MOCK;

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: QUOTATION_MOCK,
        };
        const action = ActiveCaseActions.getQuotationSuccess({ item });
        const state = activeCaseFeature.reducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem).toEqual(item);
      });
    });

    describe('getQuotationFailure', () => {
      test('should not manipulate state', () => {
        const action = ActiveCaseActions.getQuotationFailure({ errorMessage });

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: {
            ...ACTIVE_CASE_STATE_MOCK.quotation,
          },
        };

        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.quotationLoading).toBeFalsy();
        expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('updateQuotationDetails', () => {
    describe('updateQuotationDetailsPrice', () => {
      test('should update a quotation details price', () => {
        const updateQuotationDetailList = [
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            price: 20,
            priceSource: PriceSource.MANUAL,
          },
        ];

        const action = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });

        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state.updateLoading).toBeTruthy();
      });
    });

    describe('updateQuotationDetailsSuccess', () => {
      test('should update quotationDetails', () => {
        const newDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 210,
        };
        const updatedQuotation = {
          ...QUOTATION_MOCK,
          quotationDetails: [newDetail],
        };

        const action = ActiveCaseActions.updateQuotationDetailsSuccess({
          updatedQuotation,
        });

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: QUOTATION_MOCK,
        };

        const state = activeCaseFeature.reducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.quotationDetails[0]).toEqual(newDetail);
      });
    });

    describe('updateQuotationDetailsFailure', () => {
      test('should not manipulate state', () => {
        const action = ActiveCaseActions.updateQuotationDetailsFailure({
          errorMessage,
        });

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
        };

        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('Adding Materials to Quotation', () => {
    describe('addMaterialsToQuotation', () => {
      test('should set dialog Shown to true', () => {
        const action = ActiveCaseActions.addMaterialsToQuotation();

        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...ACTIVE_CASE_STATE_MOCK,
          updateLoading: true,
        });
      });
    });

    describe('addMaterialsToQuotationSuccess', () => {
      test('should set dialog Shown to true', () => {
        const newItem = { ...QUOTATION_DETAIL_MOCK, quotationItemId: 20 };
        const updatedQuotation = {
          ...QUOTATION_MOCK,
          quotationDetails: [...QUOTATION_MOCK.quotationDetails, newItem],
        };

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: QUOTATION_MOCK,
        };
        const action = ActiveCaseActions.addMaterialsToQuotationSuccess({
          updatedQuotation,
        });
        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.quotation).toEqual({
          ...updatedQuotation,
          quotationDetails: [newItem, ...QUOTATION_MOCK.quotationDetails],
        });
      });
    });

    describe('addMaterialsToQuotationFailure', () => {
      test('should not manipulate state', () => {
        const action = ActiveCaseActions.addMaterialsToQuotationFailure({
          errorMessage,
        });

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
        };

        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.quotationLoading).toBeFalsy();
        expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
      });
    });

    describe('removePositionsFromQuotation', () => {
      test('should set quotationLoading to true', () => {
        const gqPositionIds = ['12456'];

        const action = ActiveCaseActions.removePositionsFromQuotation({
          gqPositionIds,
        });

        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...ACTIVE_CASE_STATE_MOCK,
          removeQuotationDetailsIds: gqPositionIds,
          updateLoading: true,
        });
      });
    });

    describe('removePositionsFromQuotationSuccess', () => {
      test('should remove material', () => {
        const updatedQuotation = QUOTATION_MOCK;

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: QUOTATION_MOCK,
        };
        const action = ActiveCaseActions.removePositionsFromQuotationSuccess({
          updatedQuotation,
        });

        const state = activeCaseFeature.reducer(fakeState, action);

        const stateItem = state.quotation;
        expect(state.quotationLoading).toBeFalsy();
        expect(stateItem.quotationDetails).toEqual(
          QUOTATION_MOCK.quotationDetails
        );
      });
    });

    describe('removePositionsFromQuotationFailure', () => {
      test('should remove material', () => {
        const updatedQuotation = QUOTATION_MOCK;
        const action = ActiveCaseActions.removePositionsFromQuotationFailure({
          errorMessage,
          updatedQuotation,
        });

        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: {
            ...ACTIVE_CASE_STATE_MOCK.quotation,
          },
        };

        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.quotationLoading).toBeFalsy();
        expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('setSelectedQuotationDetail', () => {
    test('should set selectedQuotationDetail', () => {
      const gqPositionId = '1234';
      const action = ActiveCaseActions.setSelectedQuotationDetail({
        gqPositionId,
      });
      const fakeState = {
        ...ACTIVE_CASE_STATE_MOCK,
      };
      const state = activeCaseFeature.reducer(fakeState, action);

      expect(state.selectedQuotationDetail).toEqual(gqPositionId);
    });
  });
  describe('sapUpload', () => {
    describe('uploadSelectionToSap', () => {
      test('should set loading true', () => {
        const action = ActiveCaseActions.uploadSelectionToSap({
          gqPositionIds: ['1'],
        });
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);
        expect(state.updateLoading).toBeTruthy();
      });
    });
    describe('uploadSelectionToSapSuccess', () => {
      test('should set loading false', () => {
        const action = ActiveCaseActions.uploadSelectionToSapSuccess({
          updatedQuotation: QUOTATION_MOCK,
        });
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);
        expect(state.updateLoading).toBeFalsy();
      });

      test('should update only updatedQuoationDetails', () => {
        const mockState = {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: {
            ...ACTIVE_CASE_STATE_MOCK.quotation,
            quotationDetails: [
              {
                ...QUOTATION_DETAIL_MOCK,
                gqPositionId: '123',
                syncInSap: false,
              },
              {
                ...QUOTATION_DETAIL_MOCK,
                gqPositionId: '456',
                syncInSap: false,
              },
              {
                ...QUOTATION_DETAIL_MOCK,
                gqPositionId: '789',
                syncInSap: false,
              },
            ],
          },
        };

        const action = ActiveCaseActions.uploadSelectionToSapSuccess({
          updatedQuotation: {
            ...QUOTATION_MOCK,
            sapCallInProgress: SapCallInProgress.MAINTAIN_QUOTATION_IN_PROGRESS,
            quotationDetails: [
              {
                ...QUOTATION_DETAIL_MOCK,
                gqPositionId: '456',
                syncInSap: true,
              },
            ],
          },
        });

        const state = activeCaseFeature.reducer(mockState, action);

        expect(state.quotation.sapCallInProgress).toEqual(
          SapCallInProgress.MAINTAIN_QUOTATION_IN_PROGRESS
        );

        expect(state.quotation.quotationDetails).toEqual([
          {
            ...QUOTATION_DETAIL_MOCK,
            gqPositionId: '123',
            syncInSap: false,
          },
          {
            ...QUOTATION_DETAIL_MOCK,
            gqPositionId: '456',
            syncInSap: true,
          },
          {
            ...QUOTATION_DETAIL_MOCK,
            gqPositionId: '789',
            syncInSap: false,
          },
        ]);
      });
    });
    describe('uploadSelectionToSapFailure', () => {
      test('should set loading false', () => {
        const action = ActiveCaseActions.uploadSelectionToSapFailure({
          errorMessage,
        });
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);
        expect(state.updateLoading).toBeFalsy();
        expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('refreshSapPricing', () => {
    describe('refreshSapPricing', () => {
      test('should set loading true', () => {
        const action = ActiveCaseActions.refreshSapPricing();

        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state.updateLoading).toEqual(true);
      });
    });
    describe('refreshSapPricingSuccess', () => {
      test('should set quotation to response and loading to false', () => {
        const quotation = QUOTATION_MOCK;
        const action = ActiveCaseActions.refreshSapPricingSuccess({
          quotation,
        });
        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          updateLoading: true,
          quotation: undefined as any,
        };
        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.updateLoading).toEqual(false);
        expect(state.quotation).toEqual(QUOTATION_MOCK);
      });
    });
    describe('refreshSapPricingFailure', () => {
      test('should set error message and set loading to false', () => {
        const action = ActiveCaseActions.refreshSapPricingFailure({
          errorMessage,
        });
        const fakeState = {
          ...ACTIVE_CASE_STATE_MOCK,
          updateLoading: true,
        };
        const state = activeCaseFeature.reducer(fakeState, action);

        expect(state.updateLoading).toEqual(false);
        expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('updateQuotation Reducers', () => {
    describe('updateQuotation', () => {
      test('should set updateLoading true', () => {
        const action = ActiveCaseActions.updateQuotation({
          caseName: 'caseName',
          currency: 'EUR',
        });
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state.quotationLoading).toBeTruthy();
      });
    });
    describe('updateQuotationSuccess', () => {
      test('should set updateLoading false and set quotation', () => {
        const quotation: Quotation = QUOTATION_MOCK;
        const action = ActiveCaseActions.updateQuotationSuccess({ quotation });
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state.quotation).toEqual(quotation);
        expect(state.quotationLoading).toBeFalsy();
      });
    });
    describe('updateQuotationFailure', () => {
      test('should set updateLoading', () => {
        const action = ActiveCaseActions.updateQuotationFailure({
          errorMessage,
        });
        const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

        expect(state.quotationLoading).toBeFalsy();
        expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('SimulatedQuotation', () => {
    test('should add new simulated quotation', () => {
      const action: Action = ActiveCaseActions.addSimulatedQuotation({
        gqId: 1234,
        quotationDetails: [QUOTATION_DETAIL_MOCK],
      });
      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          simulatedItem: {
            ...SIMULATED_QUOTATION_MOCK,
            quotationDetails: [],
            previousStatusBar: undefined,
            simulatedStatusBar: undefined,
          },
        },
        action
      );

      expect(state.simulatedItem).toEqual(SIMULATED_QUOTATION_MOCK);
    });

    test('should reset the simulated quotation', () => {
      const action: Action = ActiveCaseActions.resetSimulatedQuotation();
      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          simulatedItem: SIMULATED_QUOTATION_MOCK,
        },
        action
      );

      expect(state.simulatedItem).toEqual(undefined);
    });

    test('should not remove a non-existing quotation detail from a simulated quotation', () => {
      const simulatedQuotationDetails = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '111' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '222' },
      ];

      const action: Action = ActiveCaseActions.removeSimulatedQuotationDetail({
        gqPositionId: '666',
      });

      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          simulatedItem: {
            ...SIMULATED_QUOTATION_MOCK,
            quotationDetails: simulatedQuotationDetails,
          },
        },
        action
      );

      expect(state.simulatedItem.quotationDetails.length).toEqual(2);
      expect(state.simulatedItem.quotationDetails[0].gqPositionId).toEqual(
        '111'
      );
      expect(state.simulatedItem.quotationDetails[1].gqPositionId).toEqual(
        '222'
      );
    });

    test('should not remove a quotation detail from a simulated quotation', () => {
      const simulatedQuotationDetails = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '111' },
      ];

      const action: Action = ActiveCaseActions.removeSimulatedQuotationDetail({
        gqPositionId: '111',
      });

      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          simulatedItem: {
            ...SIMULATED_QUOTATION_MOCK,
            quotationDetails: simulatedQuotationDetails,
          },
        },
        action
      );

      expect(state.simulatedItem.quotationDetails).toEqual([]);
    });

    test('should remove a quotationDetail from a simulated quotation with multiple entries', () => {
      const simulatedQuotationDetails = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '111' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '222' },
      ];

      const action: Action = ActiveCaseActions.removeSimulatedQuotationDetail({
        gqPositionId: '222',
      });

      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          simulatedItem: {
            ...SIMULATED_QUOTATION_MOCK,
            quotationDetails: simulatedQuotationDetails,
            simulatedStatusBar: {
              gpi: 1,
              gpm: 2,
              netValue: 2,
              priceDiff: 3,
              rows: 4,
            },
          },
        },
        action
      );

      expect(state.simulatedItem.quotationDetails.length).toEqual(1);
      expect(state.simulatedItem.quotationDetails[0].gqPositionId).toEqual(
        '111'
      );
      expect(state.simulatedItem.previousStatusBar).toEqual(
        SIMULATED_QUOTATION_MOCK.previousStatusBar
      );
    });
  });

  describe('case selection', () => {
    test('should select a quotation detail', () => {
      const action = ActiveCaseActions.selectQuotationDetail({
        gqPositionId: '1234',
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...ACTIVE_CASE_STATE_MOCK,
        selectedQuotationDetails: ['1234'],
      });
    });

    test('should deselect a quotation detail', () => {
      const action = ActiveCaseActions.deselectQuotationDetail({
        gqPositionId: '1234',
      });
      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          selectedQuotationDetails: ['1234', '5678'],
        },
        action
      );
      expect(state).toEqual({
        ...ACTIVE_CASE_STATE_MOCK,
        selectedQuotationDetails: ['5678'],
      });
    });
  });

  describe('CreateSapQuote', () => {
    test('handle CreateSapQuote and set quotationLoading true', () => {
      const action = ActiveCaseActions.createSapQuote({
        gqPositionIds: ['12-12-12'],
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);
      expect(state.quotationLoading).toBe(true);
    });
    test('Handle CreateSapQuoteSuccess and update the quotation received by service', () => {
      const action = ActiveCaseActions.createSapQuoteSuccess({
        quotation: {
          ...QUOTATION_MOCK,
          sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
        },
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);
      expect(state.quotationLoading).toBe(false);
      expect(state.quotation).toEqual({
        ...QUOTATION_MOCK,
        sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
      });
    });
    test('Handle CreateSapQuoteFailure and set errorMessage', () => {
      const action = ActiveCaseActions.createSapQuoteFailure({ errorMessage });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);
      expect(state.quotationLoading).toBe(false);
      expect(state.quotation).toEqual({
        ...QUOTATION_MOCK,
      });
      expect(state.quotationLoadingErrorMessage).toBe(errorMessage);
    });
  });

  describe('UpdateQuotationStatusByApprovalEvent', () => {
    test('should update the status of the Quotation', () => {
      const action = ActiveCaseActions.updateQuotationStatusByApprovalEvent({
        quotationStatus: QuotationStatus.REJECTED,
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);
      expect(state.quotation.status).toBe(QuotationStatus.REJECTED);
    });
  });

  describe('updateCostData', () => {
    test('should set updateCostsLoading to true', () => {
      const action = ActiveCaseActions.updateCosts({ gqPosId: '1234' });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.updateCostsLoading).toEqual(true);
    });
    test('should set updateCostsLoading to false', () => {
      const action = ActiveCaseActions.updateCostsSuccess({
        updatedQuotation: QUOTATION_MOCK,
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.updateCostsLoading).toEqual(false);
    });

    test('should set updateCostsLoading to false and set errorMessage', () => {
      const action = ActiveCaseActions.updateCostsFailure({ errorMessage });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.updateCostsLoading).toEqual(false);
      expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
    });
  });

  describe('updateRfqInformation', () => {
    test('should set updateRfqInformationLoading to true', () => {
      const action = ActiveCaseActions.updateRFQInformation({
        gqPosId: '1234',
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.updateRfqInformationLoading).toEqual(true);
    });
    test('should set updateRfqInformationLoading to false', () => {
      const action = ActiveCaseActions.updateRFQInformationSuccess({
        updatedQuotation: QUOTATION_MOCK,
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.updateRfqInformationLoading).toEqual(false);
    });
    test('should set updateRfqInformationLoading and set errorMessage', () => {
      const action = ActiveCaseActions.updateRFQInformationFailure({
        errorMessage,
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.updateRfqInformationLoading).toEqual(false);
      expect(state.quotationLoadingErrorMessage).toEqual(errorMessage);
    });
  });

  describe('uploadAttachments', () => {
    test('should set attachmentsUploading to true', () => {
      const action = ActiveCaseActions.uploadAttachments({ files: [] });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.attachmentsUploading).toEqual(true);
    });
    test('should set attachmentsUploading to false and overwrite attachments', () => {
      const fakeState: ActiveCaseState = {
        ...ACTIVE_CASE_STATE_MOCK,
        attachments: [{ filename: '4' } as unknown as QuotationAttachment],
      } as ActiveCaseState;
      const attachmentsOfResponse: QuotationAttachment[] = [
        { filename: '1' } as unknown as QuotationAttachment,
        { filename: '2' } as unknown as QuotationAttachment,
      ];
      const action = ActiveCaseActions.uploadAttachmentsSuccess({
        attachments: attachmentsOfResponse,
      });
      const state = activeCaseFeature.reducer(fakeState, action);

      expect(state.attachmentsUploading).toEqual(false);
      expect(state.attachments).toEqual(attachmentsOfResponse);
    });

    test('should set attachmentsUploading to false and set errorMessage', () => {
      const action = ActiveCaseActions.uploadAttachmentsFailure({
        errorMessage: 'an Error',
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.attachmentsUploading).toEqual(false);
    });
  });

  describe('get all attachments', () => {
    test('should set attachmentsGetting to true', () => {
      const action = ActiveCaseActions.getAllAttachments();
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.attachmentsGetting).toEqual(true);
    });
    test('should set attachmentsGetting to false and overwrite attachments', () => {
      const fakeState: ActiveCaseState = {
        ...ACTIVE_CASE_STATE_MOCK,
        attachments: [{ filename: '4' } as unknown as QuotationAttachment],
      } as ActiveCaseState;
      const attachmentsOfResponse: QuotationAttachment[] = [
        { filename: '1' } as unknown as QuotationAttachment,
        { filename: '2' } as unknown as QuotationAttachment,
      ];
      const action = ActiveCaseActions.getAllAttachmentsSuccess({
        attachments: attachmentsOfResponse,
      });
      const state = activeCaseFeature.reducer(fakeState, action);

      expect(state.attachmentsGetting).toEqual(false);
      expect(state.attachments).toEqual(attachmentsOfResponse);
    });

    test('should set attachmentsGetting to false and set errorMessage', () => {
      const action = ActiveCaseActions.getAllAttachmentsFailure({
        errorMessage: 'an Error',
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.attachmentsGetting).toEqual(false);
    });
  });

  describe('download attachment', () => {
    test('should set attachmentErrorMessage on downloadAttachmentFailure', () => {
      const action = ActiveCaseActions.downloadAttachmentFailure({
        errorMessage,
      });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.attachmentErrorMessage).toEqual(errorMessage);
    });
  });
  describe('delete attachment', () => {
    test('should set deleteAttachmentSuccess to true', () => {
      const attachments: QuotationAttachment[] = [
        {
          gqId: 4001,
          sapId: '456',
          folderName: 'folder',
          uploadedAt: '2020-01-01',
          uploadedBy: 'user1',
          fileName: 'open.jpg',
        },
        {
          gqId: 4002,
          sapId: '457',
          folderName: 'folder',
          uploadedAt: '2020-06-01',
          uploadedBy: 'user2',
          fileName: 'close.jpg',
        },
      ];
      const action = ActiveCaseActions.deleteAttachmentSuccess({ attachments });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.attachments).toEqual(attachments);
    });
    test('should set attachmentDeletionInProgress to true', () => {
      const attachment: QuotationAttachment = {
        filename: '1',
      } as unknown as QuotationAttachment;
      const action = ActiveCaseActions.deleteAttachment({ attachment });
      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state.attachmentDeletionInProgress).toEqual(true);
    });
  });
});
// eslint-disable-next-line max-lines
